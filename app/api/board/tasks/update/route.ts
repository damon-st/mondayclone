import { db } from "@/lib/db/prisma_db";
import { ResponseModel } from "@/models/response_model";
import { TypeActivityBoard } from "@/models/types";
import { auth } from "@clerk/nextjs";
import { ActivityBoardPrevius, StatusTaks, Tasks } from "@prisma/client";
import { differenceInHours, differenceInMinutes } from "date-fns";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    let {
      idTask,
      title,
      userIdNew,
      dateInit,
      status,
      priority,
      notes,
      budget,
      schedule,
    } = await req.json();

    if (!idTask) {
      return new NextResponse("Params not found", { status: 404 });
    }

    const task = await db.tasks.findUnique({
      where: {
        id: idTask,
      },
      include: {
        groupTask: {
          include: {
            board: {
              include: {
                boardUser: true,
              },
            },
          },
        },
      },
    });
    if (!task) {
      return new NextResponse("Not exist task", { status: 404 });
    }
    const userBoard = task.groupTask.board.boardUser.find(
      (v) => v.userId === userId
    );
    if (!userBoard) {
      return new NextResponse("User not found", { status: 404 });
    }
    if (userBoard.permitions !== "readAndWrite") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let dateEnd: Date | null = null;
    let typeActivity: TypeActivityBoard = TypeActivityBoard.update;
    let previusValueM: ActivityBoardPrevius = {
      actualValue: {
        budget: null,
        userId: null,
        dateInit: null,
        notes: null,
        priority: null,
        schedule: null,
        status: null,
        title: null,
      },
      previusValue: {
        budget: null,
        userId: null,
        dateInit: null,
        notes: null,
        priority: null,
        schedule: null,
        status: null,
        title: null,
      },
    };
    if (title) {
      typeActivity = TypeActivityBoard.title;
      previusValueM = {
        previusValue: {
          ...previusValueM.previusValue!,
          title: task.title,
        },
        actualValue: {
          ...previusValueM.actualValue!,
          title: title,
        },
      };
    }
    if (userIdNew) {
      typeActivity = TypeActivityBoard.userRes;
      previusValueM = {
        previusValue: {
          ...previusValueM.previusValue!,
          userId: task.userId,
        },
        actualValue: {
          ...previusValueM.actualValue!,
          userId: userIdNew,
        },
      };
    }
    if (dateInit) {
      typeActivity = TypeActivityBoard.dateInit;
      previusValueM = {
        previusValue: {
          ...previusValueM.previusValue!,
          dateInit: task.dateInit,
        },
        actualValue: {
          ...previusValueM.actualValue!,
          dateInit: dateInit,
        },
      };
    }
    if (status) {
      if (status === StatusTaks.completed) {
        dateEnd = new Date();

        budget = calcularPrecio(5, differenceInMinutes(dateEnd, task.dateInit));
      }
      typeActivity = TypeActivityBoard.status;
      previusValueM = {
        previusValue: {
          ...previusValueM.previusValue!,
          status: task.status,
        },
        actualValue: {
          ...previusValueM.actualValue!,
          status,
        },
      };
    }
    if (priority) {
      typeActivity = TypeActivityBoard.priority;
      previusValueM = {
        previusValue: {
          ...previusValueM.previusValue!,
          priority: task.priority,
        },
        actualValue: {
          ...previusValueM.actualValue!,
          priority,
        },
      };
    }
    if (notes) {
      typeActivity = TypeActivityBoard.notes;
      previusValueM = {
        previusValue: {
          ...previusValueM.previusValue!,
          notes: task.notes,
        },
        actualValue: {
          ...previusValueM.actualValue!,
          notes: notes,
        },
      };
    }
    if (budget) {
      typeActivity = TypeActivityBoard.budget;
      previusValueM = {
        previusValue: {
          ...previusValueM.previusValue!,
          budget: task.budget,
        },
        actualValue: {
          ...previusValueM.actualValue!,
          budget: budget,
        },
      };
    }
    if (schedule) {
      typeActivity = TypeActivityBoard.schedule;
      previusValueM = {
        previusValue: {
          ...previusValueM.previusValue!,
          schedule: task.schedule,
        },
        actualValue: {
          ...previusValueM.actualValue!,
          schedule,
        },
      };
    }

    await db.activityBoard.create({
      data: {
        userId,
        taskId: idTask,
        typeActivity: typeActivity,
        previusValue: previusValueM,
      },
    });

    const taskUpdated = await db.tasks.update({
      where: {
        id: idTask,
      },
      data: {
        title,
        userId: userIdNew,
        dateInit,
        status,
        priority,
        notes,
        budget,
        schedule,
        dateEnd,
      },
    });

    return NextResponse.json(
      <ResponseModel<Tasks>>{
        data: taskUpdated,
        status: "success",
        message: "Updated data succesfully",
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ERROR_UPDATE_TASKS]", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}
function calcularPrecio(valorPorHora: number, tiempoTrabajado: number) {
  if (typeof valorPorHora !== "number" || valorPorHora < 0) {
    throw new Error("El valor por hora debe ser un número positivo.");
  }

  if (typeof tiempoTrabajado !== "number" || tiempoTrabajado < 0) {
    throw new Error("El tiempo trabajado debe ser un número positivo.");
  }

  const horas = Math.floor(tiempoTrabajado / 60); // Obtener las horas completas
  const minutos = tiempoTrabajado % 60; // Obtener los minutos restantes

  let precioTotal = valorPorHora * horas + (valorPorHora / 60) * minutos;
  precioTotal = precioTotal < 1 ? 1 : precioTotal;
  return parseFloat(precioTotal.toFixed(2));
}
