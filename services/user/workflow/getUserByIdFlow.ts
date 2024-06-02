import { AppFlowSpec, AppFlowV2, MailUnit, saga } from '@shared/library/saga';
import { TaskResultsMap, ValueMap } from 'flowed';
import { GetUserByIdTask } from './task';

const flowSpec: AppFlowSpec = {
  [MailUnit.GET_USER_BY_ID_TASK]: {
    requires: ['userId'],
    provides: ['GetUserByIdOutput'],
    resolver: { name: MailUnit.GET_USER_BY_ID_TASK }
  }
};
const mappings: TaskResultsMap = {
  [MailUnit.GET_USER_BY_ID_TASK]: GetUserByIdTask
};

export const getUserByIdFlow = async (userId: number, context?: ValueMap) => {
  const result: saga.GetUserByIdOutput = await AppFlowV2.start<saga.GetUserByIdInput, saga.GetUserByIdOutput>(
    flowSpec,
    { userId },
    ['GetUserByIdOutput'],
    mappings,
    context
  );
  return result.GetUserByIdOutput;
};
