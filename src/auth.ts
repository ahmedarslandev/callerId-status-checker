import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { userModel } from "@/models/user.model";
import connectMongo from "@/lib/dbConfig";
import { SignInSchema } from "@/zod-schemas/signin-schema";
import { securityModel } from "@/models/security.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectMongo();

        const { email, password } = await SignInSchema.parseAsync(credentials);

        let user =
          (await userModel.findOne({ email })) ||
          (await securityModel
            .findOne({ recovery_email: email })
            .then((security) =>
              security ? userModel.findById(security.user_id) : null
            ));

        if (!user || !(await bcrypt.compare(password, user.password))) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log(user);
      return true;
    },
    async session({ session, token }: any) {
      if (token) {
        session.data = { ...token };
      }
      return session;
    },
    async jwt({ user, token }) {
      if (user) {
        Object.assign(token, {
          id: user._id,
          isVerified: user.isVerified,
          picture: user.profileImage || user.image,
          walletId: user.walletId,
          githubId: user.githubId,
          twitterId: user.twitterId,
          googleId: user.googleId,
          facebookId: user.facebookId,
          phoneNo: user.phoneNo,
          name: user.username || user.name,
          bio: user.bio,
          email: user.email || "",
          isLoggedInWithCredentials: user.isLoggedInWithCredentials,
          role: user.role,
        });
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/sign-in",
  },
});
