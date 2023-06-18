export interface IReqAuthRegister {
  first_name?:string;
  last_name?:string;
  username: string;
  email?: string;
  provider?: string;
  password?: string;
  resetPasswordToken?: string;
  confirmed?: boolean;
  blocked?: boolean;
  role?: string;
  created_by?: string;
  updated_by?: string;
}
