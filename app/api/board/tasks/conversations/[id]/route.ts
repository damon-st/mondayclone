import { db } from "@/lib/db/prisma_db";
import { ResponseModel } from "@/models/response_model";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  params: {
    params: {
      id: string;
    };
  }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    let conversations: Array<any> = await db.conversationsTasks.findMany({
      where: {
        taskId: params.params.id,
      },
    });

    for (const con of conversations) {
      const useR = await db.users.findUnique({
        where: {
          userId: con.userId,
        },
      });
      con.user = useR;
    }

    conversations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json(
      <ResponseModel<any>>{
        data: conversations,
        message: "success",
        status: "success",
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ERROR_TASKS_CONVERSATION_ID]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
