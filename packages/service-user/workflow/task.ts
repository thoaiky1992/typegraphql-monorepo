import { IFlow, MailUnit, SagaUnit, saga } from '@repo/shared/library/saga';

@SagaUnit<saga.GetUserByIdInput, saga.GetUserByIdOutput>({
  name: MailUnit.GET_USER_BY_ID_TASK
})
export class GetUserByIdTask implements IFlow<saga.GetUserByIdInput, saga.GetUserByIdOutput> {
  async exec(input: saga.GetUserByIdInput): Promise<saga.GetUserByIdOutput> {
    const data: saga.GetUserByIdOutput = {
      GetUserByIdOutput: {
        id: 1,
        name: 'Test User',
        email: 'kysomaio@gmail.com'
      }
    };
    return data;
  }

  async compensation(): Promise<void> {}
}
