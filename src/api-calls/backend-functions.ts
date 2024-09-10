import { auth } from "@/auth";
import connectMongo from "@/lib/dbConfig";
import { userModel } from "@/models/user.model";
import { NextRequest } from "next/server";

type AuthData = {
  id: string;
  email: string;
} | null;
export async function getAuthorizedUser(req: NextRequest): Promise<AuthData> {
  await connectMongo();
  try {
    const { data }: any = await auth();

    if (!data) {
      throw new Error("Unauthorized");
    }

    const dbUser = await userModel.findById(data.id);
    if (!dbUser) {
      throw new Error("Unauthorized");
    }

    return { id: dbUser._id.toString(), email: dbUser.email };
  } catch (error) {
    console.log(error);
    return null;
  }
}
