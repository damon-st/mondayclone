import { db } from "@/lib/db/prisma_db";

interface CreateWorkSpaceI {
  userId: string;
  descriptionWork: string;
  nameWork: string;
}
interface UpdateWorkSpaceI {
  userId: string;
  descriptionWork: string;
  nameWork: string;
  id: string;
}

export const getOneSpacesWorkUser = async (userId: string) => {
  return db.spaceWork.findFirst({
    where: {
      usersIds: {
        hasSome: [userId],
      },
    },
  });
};

export const createSpaceWork = async (data: CreateWorkSpaceI) => {
  return db.spaceWork.create({
    data: {
      nameWork: data.nameWork,
      descriptionWork: data.descriptionWork,
      usersIds: {
        set: [data.userId],
      },
    },
  });
};

export const updateDataSpaceWork = async (data: UpdateWorkSpaceI) => {
  return db.spaceWork.update({
    where: {
      id: data.id,
      AND: {
        usersIds: {
          hasSome: [data.userId],
        },
      },
    },
    data: {
      nameWork: data.nameWork,
      descriptionWork: data.descriptionWork,
    },
  });
};

export const getSingleSpaceWorkUser = async (userId: string, id: string) => {
  return db.spaceWork.findUnique({
    where: {
      id: id,
      usersIds: {
        hasSome: [userId],
      },
    },
    include: {
      board: true,
    },
  });
};

export const getSpacesWorksUser = async (userId: string) => {
  return db.spaceWork.findMany({
    where: {
      usersIds: {
        hasSome: [userId],
      },
    },
  });
};
