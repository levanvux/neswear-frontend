export type CreateAddressDto = {
  street: string;
  ward: string;
  city: string;
  isDefault: boolean;
};

export type RegisterDto = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  addresses?: CreateAddressDto[];
};

export type LoginDto = {
  email: string;
  password: string;
};
