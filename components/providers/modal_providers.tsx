"use client";

import { CreateTableroModal } from "@/components/modals/create_tablero_moda";
import { useEffect, useState } from "react";
import { SharedBoardModal } from "../modals/shared_board_modal";
import { UploadFileModal } from "../modals/upload_file_modal";
import { ModalActivitysTasks } from "../modals/modal_activitys_tasks";
import { ModalTimesWorksTask } from "../modals/times-works-task-modal";
import { ModalSettingsGroupTasks } from "../modals/moda_settings_group_tasks";
import { ModalInfoBoard } from "../modals/modal_info_board";
import { ModalConversationTasks } from "../modals/modal-conversation_task/modal_conversation_task";
import { ModalPaidGroupTasks } from "../modals/modal_paid/modal_paid_group_tasks";
import { ModalCreateSpaceWork } from "../modals/modal-create-space-work";

export const ModalProvider = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <CreateTableroModal />
      <SharedBoardModal />
      <UploadFileModal />
      <ModalActivitysTasks />
      <ModalTimesWorksTask />
      <ModalSettingsGroupTasks />
      <ModalInfoBoard />
      <ModalConversationTasks />
      <ModalPaidGroupTasks />
      <ModalCreateSpaceWork />
    </>
  );
};
