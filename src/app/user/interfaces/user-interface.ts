export interface User {
  id?: string;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  cv?: string[];
  jobs?: string[];
}
