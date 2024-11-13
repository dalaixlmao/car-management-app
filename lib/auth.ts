import CredentialsProvider from "next-auth/providers/credentials";
import signup from "@/services/signup";
import signin from "@/services/signin";

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
    async session({ token, session }: any) {
      session.user.id = token.sub;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    signUp: "/signup",
  },
};
