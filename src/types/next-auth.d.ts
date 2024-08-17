import NextAuth from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  interface Session {
    data: {
      id: string;
      name: string;
      picture: any;
      email: string;
      isVerified: boolean;
      walletId: string;
      facebookId: string;
      githubId: string;
      twitterId: string;
      googleId: string;
      phoneNo: string;
      bio: string;
      isLoggedInWithCredentials: boolean;
    };
  }
  interface token extends JWT {
    id: string;
    name: string;
    picture: string;
    email: any;
    walletId: string;
    facebookId: string;
    githubId: string;
    twitterId: string;
    googleId: string;
    phoneNo: string;
    bio: string;
    isLoggedInWithCredentials: boolean;
  }
  interface User extends AdapterUser {
    _id: string;
    profileImage: string;
    email: string;
    isVerified: boolean;
    username: string;
    bio: string;
    walletId: string;
    phoneNo: string;
    facebookId: string;
    githubId: string;
    twitterId: string;
    googleId: string;
    image: string;
    id: string;
    isLoggedInWithCredentials: boolean;
    name: string;
  }
  interface User {
    _id: string;
    profileImage: string;
    email: string;
    isVerified: boolean;
    username: string;
    bio: string;
    walletId: string;
    phoneNo: string;
    facebookId: string;
    githubId: string;
    twitterId: string;
    googleId: string;
    image: string;
    id: string;
    name: string;
    isLoggedInWithCredentials: boolean;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    image: string;
    email: string;
    isVerified: boolean;
    walletId: string;
    facebookId: string;
    githubId: string;
    twitterId: string;
    googleId: string;
    phoneNo: string;
    bio: string;
    isLoggedInWithCredentials: boolean;
  }
  interface DefaultJWT {
    id: string;
    name: string;
    image: string;
    email: string;
    isVerified: boolean;
    walletId: string;
    facebookId: string;
    githubId: string;
    twitterId: string;
    googleId: string;
    phoneNo: string;
    bio: string;
    isLoggedInWithCredentials: boolean;
  }
}
