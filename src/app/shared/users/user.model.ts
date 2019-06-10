export interface OgzData {
  name: string;
  logo: string;
  bg: string;
  description: string;
}

export interface Address {
  address: string;
  zipCode: string;
}

export interface UserData {
  name: string;
  idCard: string;
  license: string;
  address: Address;
  tel: string;
  fax: string;
}

export interface PaymentData {
  bank: string;
  branh: string;
  numAcc: string;
  accNumber: string;
}

export interface User {
  _id: string;
  username: string;
  password: string;
  email: string;
  status: boolean;
  ogz_data: OgzData;
  user_data: UserData;
  payment_data: PaymentData;
}

export interface Users {
  result: string;
  data: User[];
}
