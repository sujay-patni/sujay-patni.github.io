"use client";

import { createContext, useContext } from "react";
import notionData from "../../public/notion-data.json";
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
const portfolioData = notionData as PortfolioData;

export function PortfolioDataProvider({ children }: { children: React.ReactNode }) {
  return (
    <PortfolioDataContext.Provider value={portfolioData}>
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData(): PortfolioData {
  return useContext(PortfolioDataContext);
}
