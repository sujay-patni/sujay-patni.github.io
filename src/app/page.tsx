"use client";

import { PortfolioDataProvider, usePortfolioData } from "@/lib/portfolio-data";
import HiddenA11yContent from "@/components/HiddenA11yContent";
import TerminalDesign from "@/designs/terminal/index";

const DESIGNS: Record<string, React.ComponentType> = {
  terminal: TerminalDesign,
};

function ActiveDesign() {
  const { config } = usePortfolioData();
  const Design = DESIGNS[config.active_design] ?? TerminalDesign;
  return <Design />;
}

export default function Home() {
  return (
    <PortfolioDataProvider>
      <HiddenA11yContent />
      <ActiveDesign />
    </PortfolioDataProvider>
  );
}
