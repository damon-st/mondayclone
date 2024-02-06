import { db } from "@/lib/db/prisma_db";
import { updateDataSpaceWork } from "@/lib/services/work_pasce.service";
import { ResponseModel } from "@/models/response_model";
import { auth } from "@clerk/nextjs";
import { SpaceWork } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { userId: idUser } = auth();
    if (!idUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { nameWork, descriptionWork, id, userId } = await req.json();
    if (!nameWork || !id || !userId) {
      return new NextResponse("Params not found", { status: 400 });
    }

    const updatedData = await updateDataSpaceWork({
      descriptionWork,
      id,
      nameWork,
      userId,
    });

    return NextResponse.json(
      JSON.stringify(<ResponseModel<any>>{
        message: "Updated data successfuly",
        status: "success",
        statusCode: 200,
        data: updatedData,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("[ERROR_API_SPACE_WORK_PUT]", error);

    return new NextResponse("Internal server error", {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { nameWork, descriptionWork, idUser } = await req.json();
    if (!nameWork || !idUser) {
      return new NextResponse("Params not found", { status: 404 });
    }
    const result = await db.spaceWork.create({
      data: {
        descriptionWork,
        nameWork,
        userIdCreated: idUser,
        usersIds: {
          set: [idUser],
        },
      },
    });

    return NextResponse.json(
      <ResponseModel<SpaceWork>>{
        data: result,
        message: "Success",
        status: "success",
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ERROR_API_SPACE_WORK_POST]", error);

    return new NextResponse("Internal server error", {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { idSpaceWork } = await req.json();
    const spaceWork = await db.spaceWork.findUnique({
      where: {
        id: idSpaceWork,
      },
    });
    if (!spaceWork) {
      return new NextResponse("Not found Space Work", { status: 404 });
    }
    if (spaceWork.userIdCreated !== userId) {
      return new NextResponse(
        "Sorry only can delete this Space Work this person why creating this.",
        {
          status: 401,
        }
      );
    }
    const response = await db.spaceWork.delete({
      where: {
        id: idSpaceWork,
      },
    });

    return NextResponse.json(
      <ResponseModel<any>>{
        message: "Success",
        status: "success",
        statusCode: 200,
        data: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ERROR_API_SPACE_WORK_DELETE]", error);

    return new NextResponse("Internal server error", {
      status: 500,
    });
  }
}
