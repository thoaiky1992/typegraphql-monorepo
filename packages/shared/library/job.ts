import { Queue, QueueEvents, ConnectionOptions, JobsOptions, Worker } from 'bullmq';
import { SagaConfig, sagaConfig } from '../config/saga.config';
import { Logger } from './logger';

export class JobManager {
  private readonly queues: { [key: string]: Queue } = {};
  private readonly events: { [key: string]: QueueEvents } = {};
  private readonly workers: { [key: string]: Worker } = {};

  private readonly connectionConfig: ConnectionOptions;
  static _instance: JobManager;

  constructor(private readonly config?: SagaConfig) {
    this.config = config || sagaConfig;
    this.connectionConfig = this.config.connection;
    Logger.info('Job Connected ...');
  }

  static get instance() {
    return this._instance || (this._instance = new JobManager());
  }

  /**
   * Create Queue for Job's
   * @param name
   * @param connection
   * @returns
   */
  public createQueue(name: string, connection: ConnectionOptions = this.connectionConfig) {
    return this.queues[name] || (this.queues[name] = new Queue(name, { connection: connection }));
  }

  /**
   * Static create Queue
   * @param name
   * @param connection
   * @returns
   */
  public static createQueue(name: string, connection?: ConnectionOptions) {
    return this.instance.createQueue(name, connection);
  }

  /**
   * Get Metadata of a Queue
   *
   * @param queueName
   * @param connection
   */
  public async getMetadata(queueName: string, connection?: ConnectionOptions) {
    const queue = this.createQueue(queueName, connection);

    const client = await queue.client;
    return client.hgetall(queue.toKey('meta'));
  }

  /**
   * Get Metadata of a Queue
   *
   * @param queueName
   * @param connection
   */
  public static async getMetadata(queueName: string, connection?: ConnectionOptions) {
    return this.instance.getMetadata(queueName, connection);
  }

  /**
   * Set Metadata to a Queue
   *
   * @param queueName
   * @param connection
   */
  public async setMetadata(queueName: string, key: string, value: any, connection?: ConnectionOptions) {
    const queue = this.createQueue(queueName, connection);

    const client = await queue.client;
    return client.hset(queue.toKey('meta'), key, value);
  }

  /**
   * Set Metadata to a Queue
   *
   * @param queueName
   * @param connection
   */
  public static async setMetadata(queueName: string, key: string, value: any, connection?: ConnectionOptions) {
    return this.instance.setMetadata(queueName, key, value, connection);
  }

  /**
   * Raise a Job to Redis
   * @param name
   * @param queueName
   * @param data
   * @param options
   * @returns
   */
  public createJob(name: string, queueName: string, data: any, options?: JobsOptions) {
    const queue = this.createQueue(queueName);
    return queue.add(name, data, options);
  }

  /**
   * Make a RedisStream
   * @param queueName
   * @param connection
   * @returns
   */
  public createQueueEvent(queueName: string, connection: ConnectionOptions = this.connectionConfig) {
    return this.events[queueName] || (this.events[queueName] = new QueueEvents(queueName, { connection: connection }));
  }

  /**
   *  Raise a Job then waiting to take response
   */
  public async waitJobUntilFinished(
    jobName: string,
    queueName: string,
    data: any,
    ttl = 1000,
    options?: JobsOptions,
    connection?: ConnectionOptions
  ) {
    const event = this.createQueueEvent(queueName, connection);
    const job = await this.createJob(jobName, queueName, data, options);
    return job.waitUntilFinished(event, ttl);
  }

  /**
   * Create a Job then waiting a response
   * @param name
   * @param queueName
   * @param data
   * @param ttl
   * @param options
   * @param connection
   */
  public static async waitJobUntilFinished(
    name: string,
    queueName: string,
    data: any,
    ttl = 1000,
    options?: JobsOptions,
    connection?: ConnectionOptions
  ) {
    return this.instance.waitJobUntilFinished(name, queueName, data, ttl, options, connection);
  }

  /**
   * Create a unique Worker
   * @param name
   * @param queueName
   * @returns
   */
  public createWorker(
    name: string,
    queueName: string,
    handler: (...args: any[]) => any,
    connection: ConnectionOptions = this.connectionConfig,
    concurrency = 5
  ) {
    return this.workers[name] || (this.workers[name] = new Worker(queueName, handler, { connection, concurrency }));
  }

  /**
   * Create a unique Worker
   * @param name
   * @param queueName
   * @returns
   */
  public static createWorker(
    name: string,
    queueName: string,
    handler: (...args: any[]) => any,
    concurrency?: number,
    connection?: ConnectionOptions
  ) {
    return this.instance.createWorker(name, queueName, handler, connection, concurrency);
  }
}
