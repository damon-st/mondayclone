import { db } from "@/lib/db/prisma_db";
import { ResponseModel } from "@/models/response_model";
import { auth } from "@clerk/nextjs";
import { Users } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
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
    const activitysTemp = await db.activityBoard.findMany({
      where: {
        taskId: params.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const activitys: Array<any> = [];

    const usersK = Array.from(new Set(activitysTemp.map((e) => e.userId)));
    const users: Array<Users> = [];
    for (const u of usersK) {
      const user = await db.users.findUnique({
        where: {
          userId: u,
        },
      });
      if (!user) {
        continue;
      }
      users.push(user);
    }
    for (const act of activitysTemp) {
      const user = users.find((v) => v.userId === act.userId);
      activitys.push({
        ...act,
        user,
      });
    }

    return NextResponse.json(
      <ResponseModel<any>>{
        message: "Get data success",
        status: "success",
        statusCode: 200,
        data: activitys,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ERROR_GET_ALL_ACTIVITYS_TASKS]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
