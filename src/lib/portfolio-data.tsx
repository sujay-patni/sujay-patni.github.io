"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { PortfolioData } from "@/types/portfolio";

import { personal } from "@/data/personal";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { education } from "@/data/education";
import { publications } from "@/data/publications";

const staticData: PortfolioData = {
  config: {
    active_design: "terminal",
    currently_doing: "",
    open_to_work: false,
  },
  personal,
  experience,
  projects,
  skills,
  education,
  publications,
};

const PortfolioDataContext = createContext<PortfolioData>(staticData);

export function PortfolioDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioData>(staticData);

  useEffect(() => {
    fetch("/notion-data.json")
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((json: PortfolioData | null) => {
        if (json) setData(json);
      });
  }, []);

  return (
    <PortfolioDataContext.Provider value={data}>
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData(): PortfolioData {
  return useContext(PortfolioDataContext);
}
