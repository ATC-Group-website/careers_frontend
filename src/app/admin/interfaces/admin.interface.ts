export interface AdminInterface {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
  };
}

export interface LoginData {
  name: string;
  password: string;
}

export interface Job {
  id?: number;
  updated_at?: any;
  title: string;
  years: string;
  location: string;
  description: string;
  archived: boolean;
  department: string;
}
