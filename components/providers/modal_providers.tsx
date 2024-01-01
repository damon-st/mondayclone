"use client";

import { CreateTableroModal } from "@/components/modals/create_tablero_moda";
import { useEffect, useState } from "react";
import { SharedBoardModal } from "../modals/shared_board_modal";
import { UploadFileModal } from "../modals/upload_file_modal";
import { ModalActivitysTasks } from "../modals/modal_activitys_tasks";

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
    </>
  );
};
