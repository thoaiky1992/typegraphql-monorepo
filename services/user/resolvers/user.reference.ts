import { SAMPLE_USER_DATA } from '../constants';

export function resolveUserReference(reference: any, context: any) {
  return SAMPLE_USER_DATA.find((u) => u.id === Number(reference?.id));
}
