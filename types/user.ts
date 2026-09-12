export type Address = {
  id: number;
  street: string;
  ward: string;
  city: string;
  isDefault: boolean;
};

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  role: string;
  createdAt: string;
  updatedAt: string;

  addresses: Address[];
};
