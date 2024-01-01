import { db } from "../db/prisma_db";

export const getSharedBoardLink = (id: string) => {
  return db.sharedBoard.findUnique({
    where: {
      id,
    },
  });
};
