import { db } from "@/lib/db/prisma_db";

interface CreateUserInfoI {
  userId: string;
  name: string;
  email: string;
  photo?: string;
}

export const getUserInfo = (userId: string) => {
  return db.users.findUnique({
    where: {
      userId,
    },
  });
};
export const createUserInfo = (data: CreateUserInfoI) => {
  return db.users.create({
    data: data,
  });
};
