import NextAuth, { Account, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";
import bcrypt from "bcryptjs";
import { userModel } from "@/models/user.model";
import connectMongo from "@/lib/dbConfig";
import { SignInSchema } from "@/zod-schemas/signin-schema";
import { walletModel } from "./models/wallet.model";
import { securityModel } from "./models/security.model";

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
        try {
          const { email, password } = await SignInSchema.parseAsync(
            credentials
          );

          if (!email || !password) {
            throw new Error("All fields are required");
          }

          let user = await userModel.findOne({ email });

          if (!user) {
            let security = await securityModel.findOne({
              recovery_email: email,
            });
            if (security) {
              user = await userModel.findOne({ _id: security.user_id });
            } else {
              throw new Error("Invalid email or password");
            }
          }

          if (!user.isVerified) {
            throw new Error("Verify your email first");
          }

          const isPasswordMatch = await bcrypt.compare(password, user.password);
          console.log(isPasswordMatch);

          if (!isPasswordMatch) {
            throw new Error("Invalid password");
          }
          console.log(user);
          return user;
        } catch (error: any) {
          console.error("Authorization error:", error.message);
          return null;
        }
      },
      type: "credentials",
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
      id: "facebook",
      name: "Facebook",
    }),
  ],
  callbacks: {
    signIn: async ({
      user,
      account,
      profile,
    }: {
      profile?: any;
      user: User;
      account?: any;
    }) => {
      if (account?.provider == "facebook") {
        await connectMongo();
        try {
          let userDB;
          userDB = await userModel.findOne({ facebookId: profile?.id });
          if (userDB && userDB.facebookId) {
            user._id = userDB._id;
            user.bio = userDB.bio;
            user.walletId = userDB.walletId;
            user.name = userDB.username;
            user.email = userDB.email;
            user.profileImage = userDB.profileImage;
            user.image = userDB.profileImage;
            user.phoneNo = userDB.phoneNo;
            user.facebookId = userDB.facebookId;
            user.githubId = userDB.githubId;
            user.twitterId = userDB.twitterId;
            user.googleId = userDB.googleId;
            user.isLoggedInWithCredentials = userDB.isLoggedInWithCredentials;

            return user as any;
          }
          userDB = new userModel({
            facebookId: profile?.id,
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
          await security.save();
          await wallet.save();
          await userDB.save();
          user._id = userDB._id;
          user.bio = userDB.bio;
          user.walletId = userDB.walletId;
          user.name = userDB.username;
          user.email = userDB.email;
          user.profileImage = userDB.profileImage;
          user.image = userDB.profileImage;
          user.phoneNo = userDB.phoneNo;
          user.facebookId = userDB.facebookId;
          user.githubId = userDB.githubId;
          user.twitterId = userDB.twitterId;
          user.googleId = userDB.googleId;
          user.isLoggedInWithCredentials = userDB.isLoggedInWithCredentials;
          return user as any;
        } catch (error) {
          return false;
        }
      }

      if (account?.provider == "twitter") {
        await connectMongo();
        try {
          let userDB;
          userDB = await userModel.findOne({ twitterId: profile?.data?.id });
          if (userDB && userDB.twitterId) {
            user._id = userDB._id;
            user.bio = userDB.bio;
            user.walletId = userDB.walletId;
            user.name = userDB.username;
            user.email = userDB.email;
            user.profileImage = userDB.profileImage;
            user.image = userDB.profileImage;
            user.phoneNo = userDB.phoneNo;
            user.facebookId = userDB.facebookId;
            user.githubId = userDB.githubId;
            user.twitterId = userDB.twitterId;
            user.googleId = userDB.googleId;
            user.isLoggedInWithCredentials = userDB.isLoggedInWithCredentials;
            return user as any;
          }
          userDB = new userModel({
            twitterId: profile?.data?.id,
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
          await security.save();
          await wallet.save();
          await userDB.save();

          user._id = userDB._id;
          user.bio = userDB.bio;
          user.walletId = userDB.walletId;
          user.name = userDB.username;
          user.email = userDB.email;
          user.profileImage = userDB.profileImage;
          user.image = userDB.profileImage;
          user.phoneNo = userDB.phoneNo;
          user.facebookId = userDB.facebookId;
          user.githubId = userDB.githubId;
          user.twitterId = userDB.twitterId;
          user.googleId = userDB.googleId;
          user.isLoggedInWithCredentials = userDB.isLoggedInWithCredentials;

          return user as any;
        } catch (error) {
          return false;
        }
      }
      if (account?.provider == "github") {
        await connectMongo();
        try {
          let userDB;
          userDB = await userModel.findOne({ githubId: profile?.id });
          if (userDB && userDB.githubId) {
            user._id = userDB._id;
            user.bio = userDB.bio;
            user.walletId = userDB.walletId;
            user.name = userDB.username;
            user.email = userDB.email;
            user.profileImage = userDB.profileImage;
            user.image = userDB.profileImage;
            user.phoneNo = userDB.phoneNo;
            user.facebookId = userDB.facebookId;
            user.githubId = userDB.githubId;
            user.twitterId = userDB.twitterId;
            user.googleId = userDB.googleId;
            user.isLoggedInWithCredentials = userDB.isLoggedInWithCredentials;

            return user as any;
          }
          userDB = new userModel({
            githubId: profile?.id,
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
          await security.save();
          await wallet.save();
          await userDB.save();
          user._id = userDB._id;
          user.bio = userDB.bio;
          user.walletId = userDB.walletId;
          user.name = userDB.username;
          user.email = userDB.email;
          user.profileImage = userDB.profileImage;
          user.image = userDB.profileImage;
          user.phoneNo = userDB.phoneNo;
          user.facebookId = userDB.facebookId;
          user.githubId = userDB.githubId;
          user.twitterId = userDB.twitterId;
          user.googleId = userDB.googleId;
          user.isLoggedInWithCredentials = userDB.isLoggedInWithCredentials;

          return user as any;
        } catch (error) {
          return false;
        }
      }

      if (user && (user.email || user.isLoggedInWithCredentials == false)) {
        return true; // Redirect to the homepage after sign-in
      }

      return false; // Proceed with sign-in
    },
    // async redirect({ url, baseUrl }) {
    //   console.log("Redirecting to:", url);
    //   return url.startsWith(baseUrl) ? url : baseUrl;
    // },
    session: async ({ session, token, user }): Promise<any> => {
      if (token && token) {
        session.data = {
          email: token.email,
          id: token.id,
          isVerified: token.isVerified,
          picture: token.picture,
          walletId: token.walletId,
          githubId: token.githubId,
          twitterId: token.twitterId,
          googleId: token.googleId,
          facebookId: token.facebookId,
          phoneNo: token.phoneNo,
          name: token.name,
          bio: token.bio,
          isLoggedInWithCredentials: token.isLoggedInWithCredentials,
        };
      }
      return session;
    },
    jwt: async ({ user, token }): Promise<any> => {
      console.log("user", user);
      if (user) {
        token.id = user._id;
        token.isVerified = user.isVerified;
        token.picture = user.profileImage || (user.image as string);
        token.walletId = user.walletId;
        token.githubId = user.githubId;
        token.twitterId = user.twitterId;
        token.googleId = user.googleId;
        token.facebookId = user.facebookId;
        token.phoneNo = user.phoneNo;
        token.name = user.username || (user.name as string);
        token.bio = user.bio;
        token.email = user.email || "";
        token.isLoggedInWithCredentials = user.isLoggedInWithCredentials;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/sign-in", // Custom sign-in page
  },
});
