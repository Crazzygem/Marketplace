export interface Environment {
  production: boolean;
  apiUrl: string;
  useBasicAuth: boolean;
}

declare const environment: Environment;
export { environment };