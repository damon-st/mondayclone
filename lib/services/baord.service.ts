import { db } from "@/lib/db/prisma_db";

export const getBoardsBySpaceWorkId = (spaceWorkId: string, userId: string) =>
  db.board.findMany({
    where: {
      AND: [
        {
          spaceWorkId,
        },
        {
          boardUser: {
            some: {
              userId: userId,
            },
          },
        },
      ],
    },
  });

export const getBoardByIdAndUsers = (idBoard: string) => {
  return db.board.findUnique({
    where: {
      id: idBoard,
    },
    include: {
      boardUser: true,
      space: true,
    },
  });
};

export const addUserInBoard = async (
  userId: string,
  boardId: string,
  permitions: any
): Promise<{
  message: string;
  status: "success" | "error";
}> => {
  try {
    const existBoard = await db.board.findUnique({
      where: {
        id: boardId,
      },
      include: {
        boardUser: true,
      },
    });
    if (!existBoard) {
      throw new Error("Board not found");
    }

    const userExist = existBoard.boardUser.find((v) => v.userId === userId);
    if (userExist) {
      return {
        message: "Add user succefully",
        status: "success",
      };
    }

    await db.board.update({
      where: {
        id: boardId,
      },
      data: {
        boardUser: {
          create: {
            userId,
            permitions,
          },
        },
      },
    });
    await db.spaceWork.update({
      where: {
        id: existBoard.spaceWorkId,
      },
      data: {
        usersIds: {
          push: userId,
        },
      },
    });
    return {
      message: "Add user succefully",
      status: "success",
    };
  } catch (error) {
    return {
      message: `Error: ${error}`,
      status: "error",
    };
  }
};
