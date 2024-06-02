import { Job } from 'bullmq';
import { fromJSON, toJSON } from 'flatted';
import {
  AnyValue,
  FlowManager,
  FlowOptions,
  FlowSpec,
  FlowedLogger,
  TaskResolverSpec,
  TaskResultsMap,
  ValueMap
} from 'flowed';
import { Logger } from '../logger';
import { JobManager } from '../job';
import { IApp } from '@shared/interface';
import { AppContainer } from '../container';
import 'dotenv/config';

export { FlowSpec, TaskResultsMap, ValueMap, AnyValue };

export interface IFlow<I, O> {
  exec(params: I, context: ValueMap): Promise<O>;

  compensation(param: I, result: any, error: Error): Promise<void>;
}

export interface AppTaskSpec {
  requires?: string[];
  provides?: string[];
  resolver?: TaskResolverSpec;
  results?: Record<string, string>;
}

export interface AppFlowSpec {
  [code: string]: AppTaskSpec;
}

/** Constraint */
const execName = 'exec';
const compensationName = 'compensation';

const INVOKE_CMD = 'invoke';
const COMPENSATION_CMD = 'compensation';

const APP_NAME = process.env.APP_NAME;

/** JOB LifeTime */
const JOB_LIFETIME = {
  removeOnComplete: {
    age: 300,
    count: 1000
  },
  removeOnFail: {
    age: 24 * 3600
  }
};

interface Flowed {
  getResolvers(): { [key: string]: () => any };
  flow: any;
}

interface BuilderInputData<I, O> {
  params: ValueMap;
  error?: Error;
  result: any;
  context: Context<I, O>;
}

type CompensationFunc<I> = (params: I, result: any, error: Error) => Promise<any>;
type Compensation<I, O> = { params: I; func: CompensationFunc<I>; name: string; result: O };
type Context<I, O> = { propagation: any; compensation: Compensation<I, O>[]; $flowed: Flowed; [key: string]: any };

type UnitExecHandler<I, O> = (param: I, context: ValueMap) => Promise<O>;

const _unitWaitingSetup: (() => Promise<any>)[] = [];

const _unitMappings: {
  [code: string]: AnyValue;
} = {};

/**
 * SAGA Manager
 */
export class SagaManager {
  async start(): Promise<any> {
    while (_unitWaitingSetup.length > 0) {
      const setupFunction = _unitWaitingSetup.pop();
      if (setupFunction && typeof setupFunction === 'function') {
        try {
          await setupFunction();
        } catch (error) {
          Logger.error('Error: _unitWaitingSetup executing setup function');
        }
      }
    }
  }
}

/**
 * Invoke Local Unit
 * @param name
 * @param execDescriptor
 * @returns
 */
export function InvokeExecLocal<I, O>(
  name: string,
  execDescriptor: (params: I, context: Context<I, O>) => Promise<O>,
  compensation: CompensationFunc<I>
) {
  return async function (params: I, context: Context<I, O>) {
    const comPayload: Compensation<I, O> = { params, func: compensation, result: null as any, name };
    context.compensation.push(comPayload);

    try {
      comPayload.result = await execDescriptor(params, context);
      return comPayload.result;
    } catch (err: any) {
      let index = context.compensation.length - 1;
      for (index; index >= 0; index--) {
        const { name, params, func, result } = context.compensation[index];

        Logger.log(`FlowUnit Compensation [${name}] Exececuted`);
        await new Promise((res) => {
          func(params, result, err)
            .catch((e) => {
              Logger.error(`FlowUnit Compensation ${name} error`);
              res(null);
            })
            .then(res);
        });
      }
      throw err;
    }
  };
}

/**
 * Invoke a remote unit via Queue
 *
 * @param name
 * @returns
 */
export function InvokeSagaExecUnit<I, O>(name: string, ttl?: number) {
  return async function (params: I, context: Context<I, O>) {
    try {
      const data = toJSON({ params, context });
      /** We need await to Catch this issue inside this scope */
      const result = await JobManager.waitJobUntilFinished(INVOKE_CMD, name, data, ttl, JOB_LIFETIME);
      Logger.log(`Saga '${name}' finished ...`);
      return result;
    } catch (err) {
      Logger.error(err, `Saga '${name}' error ...`);
      throw err;
    }
  };
}

/**
 * Invoke a remote compensation via Queue
 */
export function InvokeSagaCompensation<I>(name: string, ttl?: number) {
  return async function (params: I, result: any, error: Error) {
    try {
      const data = toJSON({ params, result, error });
      const output = await JobManager.waitJobUntilFinished(COMPENSATION_CMD, name, data, ttl, JOB_LIFETIME);
      Logger.log(`Saga Compensation: '${name}' finished ...`);
      return output;
    } catch (err) {
      Logger.log(`Saga Compensation: '${name}' error ...`);
      throw err;
    }
  };
}

/**
 * Workers for a SagaUnit
 * @param unitHandler
 */
export function SagaHandlerBuilder<I, O>(
  name: string,
  unitHandler: UnitExecHandler<I, O>,
  compensationHandler: CompensationFunc<I>,
  ttl: number
) {
  return async (job: Job) => {
    return new Promise((resolve, reject) => {
      const data = fromJSON(job.data);
      const { params, result, error, context } = data;
      /** Promise timeout: UnHanlding or Timeout */
      new Promise((resolve) => {
        setTimeout(resolve, ttl - 100);
      }).then(() => reject(new Error('Saga-Worker unhandle exception or timeout')));

      switch (job.name) {
        case INVOKE_CMD:
          Logger.info(`Saga-Worker: '${name}' started`);
          unitHandler(params, context).then(resolve).catch(reject);
          break;
        case COMPENSATION_CMD:
          Logger.info(`Saga-Compensation: '${name}' started`);
          compensationHandler(params, result, error).then(resolve).catch(reject);
          break;
        default:
          Logger.log(`SAGA Handler unsupported: ${job.name}`);
          break;
      }
    });
  };
}

/**
 * App Flow Unit
 *
 * @param name
 * @returns
 */
export function FlowUnit<I, O>({ name }: { name: string }) {
  return function (target: new (...args: any[]) => IFlow<I, O>) {
    const originExecDescr = target.prototype[execName]();
    const newExecDescr = target.prototype[execName];
    const originCompensationDesc = target.prototype[compensationName]();
    newExecDescr.value = InvokeExecLocal(name, originExecDescr, originCompensationDesc);
    target.prototype[execName] = newExecDescr;
    _unitMappings[name] = target;
  };
}

/**
 * Make a unit for cross instances base on Redis Stream
 * Default: Enable Worker, too
 * @param name
 */
export function SagaUnit<I, O>({
  name,
  enableWorker = true,
  ttl = 10000,
  concurrency = 5
}: {
  name: string;
  enableWorker?: boolean;
  ttl?: number;
  concurrency?: number;
}) {
  return function (target: new (...args: any[]) => IFlow<I, O>) {
    /** Exec Descriptor */
    const originExecDescr = Object.getOwnPropertyDescriptor(target.prototype, execName)!.value;
    const newExecDescr = Object.getOwnPropertyDescriptor(target.prototype, execName);

    /** Compensation  */
    const originCompensationDesc = Object.getOwnPropertyDescriptor(target.prototype, compensationName)!.value;

    newExecDescr!.value = InvokeExecLocal(name, InvokeSagaExecUnit(name, ttl), InvokeSagaCompensation(name, ttl));

    Object.defineProperty(target.prototype, execName, newExecDescr!);

    _unitMappings[name] = target;

    /**
     * Lazy Loading via AppContainer
     */
    _unitWaitingSetup.push(async () => {
      /** Create queue pipeline */
      JobManager.createQueue(name);

      /** Do not enable worker for remote unit */
      if (enableWorker) {
        Logger.log(`Saga Unit ${name} loaded`);
        /** Verify Queue to prevent confliction */
        JobManager.getMetadata(name).then((data) => {
          const { appName = null } = data;
          if (appName && appName !== APP_NAME) {
            Logger.log(`[${name}] queue already existed on ${APP_NAME}. Please make sure that under control`);
          } else {
            JobManager.setMetadata(name, 'appName', APP_NAME);
          }
        });

        JobManager.createWorker(
          `worker-${name}`,
          name,
          SagaHandlerBuilder<I, O>(name, originExecDescr, originCompensationDesc, ttl),
          concurrency
        );
      } else {
        Logger.info(`Saga Unit Mapping ${name} loaded`);
      }
    });
  };
}

/**
 * Enable SAGA Mapping Only.
 *  -> Disable ExecWorker and CompensationWorker
 * */
export function SagaUnitMapping<I, O>({ name, ttl }: { name: string; ttl?: number }) {
  return SagaUnit<I, O>({ name, enableWorker: false, ttl });
}

/**
 * Return an empty output for a unit
 * @returns {}
 */
export function FakeEmptyUnitOutput<O>() {
  return {} as O;
}

/**
 * Overload logger for Flowed
 */
const FLowLogger: FlowedLogger = {
  log(entry) {
    Logger.log(entry.message);
  }
};
FlowManager.installLogger(FLowLogger);

export class AppFlow {
  static async start<I, O>(
    spec: FlowSpec,
    params: I,
    expectedResult: string[],
    resolvers: TaskResultsMap = {}
  ): Promise<O> {
    /** Start Saga first */
    await AppContainer.resolve(SagaManager).start();

    return FlowManager.run(
      spec,
      params as any,
      expectedResult,
      { ..._unitMappings, ...resolvers },
      { compensation: [] }
    ) as O;
  }
}

/**
 * Simplify a FlowSpec
 */
export class AppFlowV2 {
  static async start<I, O>(
    taskSpec: AppFlowSpec,
    params: I,
    expectedResult: string[],
    resolvers: TaskResultsMap = {},
    context: ValueMap = {},
    options: FlowOptions = { resolverAutomapParams: true, resolverAutomapResults: true }
  ): Promise<O> {
    /** Start Saga first */
    await AppContainer.resolve(SagaManager).start();

    const spec: FlowSpec = { tasks: taskSpec, options };

    return FlowManager.run(
      spec,
      params as any,
      expectedResult,
      { ..._unitMappings, ...resolvers },
      { ...context, compensation: [] }
    ) as O;
  }
}

/**
 * Enable SAGA for AppApp
 */
export function EnableSAGA() {
  return function <T extends new (...args: any[]) => IApp>(target: T) {
    return class extends target {
      constructor(...args: any[]) {
        super(...args);
      }

      async start(): Promise<void> {
        await super.start();
        await AppContainer.resolve(SagaManager).start();
        Logger.info('Saga Manager started ...');
      }
    };
  };
}
