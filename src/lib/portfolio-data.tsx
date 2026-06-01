"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { PortfolioData } from "@/types/portfolio";

const emptyData: PortfolioData = {
  config: {
    active_design: "terminal",
    currently_doing: "",
    open_to_work: false,
    resume_path: "",
    resume_download_name: "",
  },
  personal: {
    name: "",
    title: "",
    company: "",
    tagline: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
  },
  homeMetrics: [],
  homeCards: [],
  experience: [],
  projects: [],
  skills: [],
  education: [],
  publications: [],
};

const PortfolioDataContext = createContext<PortfolioData>(emptyData);

export function PortfolioDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioData>(emptyData);

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
