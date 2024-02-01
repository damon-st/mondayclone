import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
interface StartedButtonProps {
  boardId: string;
}

export default function StartedButton({ boardId }: StartedButtonProps) {
  return (
    <Link href={`/board`} className="get-started-btn">
      Get Started
      <ArrowRight className="arrow" />
    </Link>
  );
}
