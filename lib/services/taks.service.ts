import { db } from "../db/prisma_db";

export const getGroupTaskByBoardId = (boardId: string) => {
  return db.groupTasks.findMany({
    where: {
      boardId,
    },
    include: {
      tasks: {
        include: {
          files: true,
        },
      },
    },
  });
};
