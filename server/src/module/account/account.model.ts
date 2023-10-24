export interface ILoginRequest {
  username: string;
  password: string;
}

export const LoginFields = {
  username: "username",
  password: "password"
}

export const LoginRequest = [
  LoginFields.username,
  LoginFields.password
]