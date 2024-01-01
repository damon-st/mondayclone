import { db } from "@/lib/db/prisma_db";
import { ResponseModel } from "@/models/response_model";
import { TypesUpdateBoard } from "@/models/types";
import { auth } from "@clerk/nextjs";
import { PermitionsBoard } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: {
      idBoard: string;
    };
  }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }
    const { title, type, favorite } = await req.json();
    if (type == TypesUpdateBoard.title && !title) {
      return new NextResponse("Params not found", { status: 400 });
    }
    if (type == TypesUpdateBoard.favorite && favorite == undefined) {
      return new NextResponse("Parms not found", { status: 400 });
    }

    const board = await db.board.findUnique({
      where: {
        id: params.idBoard,
      },
      include: {
        boardUser: true,
      },
    });

    if (!board) {
      return new NextResponse("Board not found", { status: 404 });
    }

    const existUser = board.boardUser.find((v) => v.userId == userId);

    if (!existUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (existUser.permitions != PermitionsBoard.readAndWrite) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.board.update({
      where: {
        id: params.idBoard,
      },
      data: {
        title,
        favorite,
      },
    });

    return NextResponse.json(
      <ResponseModel<any>>{
        status: "success",
        message: "Update data succesfully",
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ERROR_UPDATE_DATA_BOARD]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
