import { Star } from "lucide-react";
import HomeHeader from "./_components/home-header";
import StartedButton from "./_components/started-button";
import Image from "next/image";
import HomeTeaser from "./_components/home-teaser";
import "@/public/styles/main.scss";

export default function Home() {
  return (
    <>
      <HomeHeader />
      <section className="home-page ">
        <div className="home-content layout">
          <div className="headers-container flex column space-between">
            <h1 className="main-title">
              <span>A Platform Built For A</span>
              <span>New Way Of Working</span>
            </h1>
            <h2 className="secondary-title">
              Start managing with MyDay Work OS
            </h2>
          </div>
          <div className="get-started">
            <StartedButton boardId="" />
            <p className="home-paragraph">
              No credit card needed <Star className="w-5 h-5" /> Unlimited time
              on Free Plan
            </p>
          </div>
        </div>
        <Image
          width={1024}
          height={1024}
          className="hero"
          src="/home.webp"
          alt="hero-img"
        />
      </section>
      <HomeTeaser />
    </>
  );
}
