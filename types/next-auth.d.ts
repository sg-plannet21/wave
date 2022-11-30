import 'next-auth';
import { User as IUser } from 'state/auth/types';

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module 'next-auth' {
  interface Session {
    user: IUser;
    accessToken: string;
    error?: string;
  }

  interface User {
    access: string;
    refresh: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    accessTokenExpiresAt: number;
    refreshToken: string;
    user: IUser;
    error?: string;
  }
}
