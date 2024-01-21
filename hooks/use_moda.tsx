import { Files, GroupTasks, TasksTimesWorks, Users } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createTablero"
  | "sharedBoard"
  | "uploadFile"
  | "activityTasks"
  | "timesWorkTask"
  | "settingsGroupTasks";

interface DataModal {
  idSpaceWork?: string;
  idBoard?: string;
  idTask?: string;
  files?: Files[];
  titleTask?: string;
  timesWokrs?: TasksTimesWorks[];
  usersBoard?: Users[];
  groupTasks?: GroupTasks;
}

interface ModalStore {
  isOpen: boolean;
  onOpen: (type: ModalType, data?: DataModal) => void;
  onClose: () => void;
  typeM: ModalType | null;
  data: DataModal | null;
}

export const useModal = create<ModalStore>((set) => ({
  isOpen: false,
  onOpen: (typeM: ModalType, data?: DataModal) =>
    set({ isOpen: true, typeM, data }),
  onClose: () => set({ isOpen: false, typeM: null, data: null }),
  typeM: null,
  data: null,
}));
