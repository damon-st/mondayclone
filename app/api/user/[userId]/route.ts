import { getUserInfo } from "@/lib/services/users.service";
import { ResponseModel } from "@/models/response_model";
import { auth } from "@clerk/nextjs";
import { Users } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { userId: string };
  }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await getUserInfo(params.userId);

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(<ResponseModel<Users>>{
      message: "User found",
      status: "success",
      statusCode: 200,
      data: user,
    });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
