import { Logo } from "@/components/logo";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomeHeader() {
  return (
    <header className="home-header">
      <Logo />
      <div className="header-btns">
        <Link href={"/sign-in"}>
          <button className="btn-login">Log in</button>
        </Link>
        <Link href={`/board/`}>
          <button className="btn-start">
            Empezar
            <span className="arrow">
              <ArrowRight className="h-5 w-5" />
            </span>
          </button>
        </Link>
      </div>
    </header>
  );
}
