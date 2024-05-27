export const APOLO_SERVICE_USER_PORT = Number(process.env.APOLO_SERVICE_USER_PORT || 4000);
export const APOLO_SERVICE_USER_URL = String(process.env.APOLO_SERVICE_USER_URL || '');
export const SAMPLE_USER_DATA = [
  {
    id: 1,
    email: 'thoaiky1992@gmail.com',
    userName: 'thoaiky1992',
    password: '123456',
    profile: {
      id: 1,
      address: 'TP.HCM'
    }
  },
  {
    id: 2,
    email: 'Xuan@gmail.com',
    userName: 'Xuan',
    password: '123456',
    profile: {
      id: 2,
      address: 'HN'
    }
  }
];
