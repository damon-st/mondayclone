"use client";
import { LayoutDashboard } from "lucide-react";
import React, { useState } from "react";
const views = [
  {
    name: "Boards",
    icon: <LayoutDashboard />,
    description:
      "Everything starts with a visual board — the core of monday.com Work OS. Tailor it your way and manage anything from projects to departments.",
  },
  {
    name: "Kanbans",
    icon: <LayoutDashboard />,
    description:
      "Visualize and plan your work more efficiently with multiple views: Kanban board, calendar, timeline, Gantt chart, and more.",
  },
  {
    name: "Dashboards",
    icon: <LayoutDashboard />,
    description:
      "Get the insights you need to make decisions with confidence. Keep track of progress, timelines, and budgets with custom dashboards.",
  },
];
export default function HomeTeaser() {
  const [viewType, setViewType] = useState("Boards");

  const view = views.find((currView) => currView.name === viewType);

  return (
    <section className="teaser">
      <div className="layout">
        <div className="teaser-header">
          <span className="teaser-header-title">
            <b>Everything </b>you need for any <b>workflow</b>
          </span>
          <p className="teaser-header-paragraph">
            Easily build your ideal workflow with myday building blocks.
          </p>
        </div>
        <div className="views-container">
          {views.map((view) => (
            <div
              key={view.name}
              className={`view ${viewType === view.name && "active"}`}
              onClick={() => setViewType(view.name)}
            >
              {view.icon}
              <span>{view.name}</span>
              {viewType === view.name && (
                <span className="active-indicator"></span>
              )}
            </div>
          ))}
        </div>
        <div className="teaser-container ">
          <div className="teaser-content">
            {view?.icon}
            <span>{view?.name}</span>
          </div>
          <p className="teaser-description">{view?.description}</p>
        </div>
        <video
          className="home-gif"
          preload="auto"
          loop
          playsInline
          webkit-playsinline=""
          x5-playsinline=""
          muted={true}
          autoPlay={true}
        >
          <source src="/home-gif.mp4" />
        </video>
      </div>
    </section>
  );
}
