import { db } from "@/lib/db/prisma_db";
import { ResponseModel } from "@/models/response_model";
import { auth } from "@clerk/nextjs";
import { SharedBoard } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { permitions, idBoard } = await req.json();
    if (!permitions || !idBoard) {
      return new NextResponse("Params not found", { status: 404 });
    }
    const sharedBoard = await db.sharedBoard.create({
      data: {
        boardId: idBoard,
        userId,
        permitions,
      },
    });
    return NextResponse.json(<ResponseModel<SharedBoard>>{
      data: sharedBoard,
      message: "Created shared url succefully",
      status: "success",
      statusCode: 200,
    });
  } catch (error) {
    console.log("[ERROR_CREATE_SHARED_BOARD_URL]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
