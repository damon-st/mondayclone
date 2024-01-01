import { db } from "@/lib/db/prisma_db";
import { getUserInfo } from "@/lib/services/users.service";
import { ResponseModel } from "@/models/response_model";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unautorized", { status: 401 });
    }
    const { title, privacity, idSpaceWork } = await req.json();
    if (!title || !privacity || !idSpaceWork) {
      return new NextResponse("Params not found", { status: 400 });
    }
    const user = await getUserInfo(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }
    const board = await db.board.create({
      data: {
        title,
        boardUser: {
          create: {
            userId,
          },
        },
        userId,
        privacity,
        spaceWorkId: idSpaceWork,
      },
    });
    return NextResponse.json(
      <ResponseModel<any>>{
        data: board,
        message: "Create board succesfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ERROR_SERVER_CREATE_TABLERO] ", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}
