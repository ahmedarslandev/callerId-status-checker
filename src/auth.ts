import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";
import bcrypt from "bcryptjs";
import { userModel } from "@/models/user.model";
import connectMongo from "@/lib/dbConfig";
import { SignInSchema } from "@/zod-schemas/signin-schema";
import { walletModel } from "@/models/wallet.model";
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
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_ID_SECRET,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_ID_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_ID_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (["facebook", "twitter", "github"].includes(account?.provider)) {
        await connectMongo();

        const providerIdField = `${account.provider}Id`;
        let userDB = await userModel.findOne({
          [providerIdField]: profile?.id || profile?.data?.id,
        });

        if (!userDB) {
          userDB = new userModel({
            [providerIdField]: profile?.id || profile?.data?.id,
            profileImage: user.image,
            username: user.name,
            email: user.email || "",
            isVerified: true,
          });

          const wallet = new walletModel({
            user_id: userDB._id,
            balance: 0,
            currency: "USD",
          });

          const security = new securityModel({
            user_id: userDB._id,
            recovery_email: "",
            recovery_phone: "",
            two_factor_enabled: false,
          });

          userDB.walletId = wallet._id;
          await Promise.all([security.save(), wallet.save(), userDB.save()]);
        }

        Object.assign(user, {
          _id: userDB._id,
          bio: userDB.bio,
          walletId: userDB.walletId,
          name: userDB.username,
          email: userDB.email,
          profileImage: userDB.profileImage,
          image: userDB.profileImage,
          phoneNo: userDB.phoneNo,
          githubId: userDB.githubId,
          twitterId: userDB.twitterId,
          googleId: userDB.googleId,
          facebookId: userDB.facebookId,
          isLoggedInWithCredentials: userDB.isLoggedInWithCredentials,
          role: userDB.role,
        });

        return user;
      }

      return !!(
        user &&
        (user.email || user.isLoggedInWithCredentials === false)
      );
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
