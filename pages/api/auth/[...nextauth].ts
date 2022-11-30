import jwt_decode from 'jwt-decode';
import { login, refreshAccessToken } from 'lib/client/api-helper';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from 'state/auth/types';
// https://github.com/nextauthjs/next-auth-typescript-example/blob/main/pages/api/auth/%5B...nextauth%5D.ts

// @todo Hardcoding the expiry for now
const TOKEN_REFRESH_THRESHOLD_MS = 30 * 60 * 1000;

export default NextAuth({
  pages: {
    signIn: '/login',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
  },
  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  // secret: process.env.JWT_SECRET,
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `strategy` should be set to 'jwt' if no database is used.
    strategy: 'jwt',

    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },
  // JSON Web tokens are only used for sessions if the `strategy: 'jwt'` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    secret: process.env.JWT_SECRET,
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Wave Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'Username',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password',
        },
      },
      async authorize(credentials) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)

        if (!credentials?.username || !credentials.password) return null;

        try {
          // console.log("credentials", credentials);
          const token = await login(credentials);

          if (token) {
            // return { id: 5, access: token.access, refresh: token.refresh };
            // var decodedUser = jwt_decode<IUser>(token.access);
            // const user = { ...decodedUser, ...token };
            return token;
          } else {
            console.log('returning null');
            return null;
          }
        } catch (error) {
          // @todo
          return null;
        }
      },
    }),
    // ...add more providers here
  ],
  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) { return true },
    // async redirect({ url, baseUrl }) { return baseUrl },
    // async session({ session, token, user }) { return session },
    // async jwt({ token, user, account, profile, isNewUser }) { return token }
    async jwt({ token, user }) {
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        // console.log("user", user);
        const decodedUser = jwt_decode(user.access) as User;
        token.accessToken = user.access;
        token.refreshToken = user.refresh;
        token.user = decodedUser;
        token.accessTokenExpiresAt = decodedUser.exp;
        return token;
      }

      if (
        Date.now() <
        token.accessTokenExpiresAt * 1000 - TOKEN_REFRESH_THRESHOLD_MS
      ) {
        console.log('returning existing token');
        return token;
      }

      console.log('refreshing token');
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      // console.log("session :>> ", session);
      // console.log("token :>> ", token);
      // console.log("user :>> ", user);

      session.accessToken = token.accessToken;
      session.user = jwt_decode(token.accessToken);
      session.error = token.error;
      return session;
    },
  },
});
