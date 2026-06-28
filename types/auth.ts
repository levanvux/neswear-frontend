export type Address = {
  street: string;
  ward: string;
  district: string;
  city: string;
};

export type RegisterDto = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  addresses?: Address[];
};

export type LoginDto = {
  email: string;
  password: string;
};

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  role: string;
  addresses: Address[];
};
