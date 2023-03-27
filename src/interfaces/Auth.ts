export interface Auth {
  token: string;
  isAuthenticated: boolean;
  loading: boolean;
  user: any;
  error: any;
}