// Local User type for saga workflows
export type User = {
  id: number;
  name: string;
  email?: string;
  [key: string]: any;
};

export type GetUserByIdInput = { userId: number };
export type GetUserByIdOutput = { GetUserByIdOutput: User };
