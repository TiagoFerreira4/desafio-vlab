export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type ProfileResponse = {
  user: User;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};
