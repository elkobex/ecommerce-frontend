// Interfaces para los formularios
export interface LoginForm {
  email: string;
  password: string;
}

export interface ForgetPswForm {
  email: string;
}

export interface RegisterForm {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
}