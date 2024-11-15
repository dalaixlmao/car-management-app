import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import signup from "@/services/signup";
import signin from "@/services/signin";


interface CustomUser extends User {
  id: string;
  email: string;
  name?: string;
}

interface CustomSession extends Session {
  user: CustomUser;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmit@next.com", },
        password: { label: "Password", type: "password", placeholder: "abcdef@123", },
        name: { label: "Name", type: "text", placeholder: "John Smith" },
      },

      async authorize(credentials) {
        if (!credentials) return null;
        if (credentials.name) {
          return await signup(credentials);
        } else {
          return await signin(credentials);
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_URL || "",
callbacks: {
    async session({ 
      session, 
      token,  
    }: {
      session: Session;
      token: JWT;
    }): Promise<CustomSession> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub || '',
          email: session.user?.email || '',
          name: session.user?.name || undefined,
        },
      };
    },
  },
  pages: {
    signIn: "/signin",
    signUp: "/signup",
  },
};
