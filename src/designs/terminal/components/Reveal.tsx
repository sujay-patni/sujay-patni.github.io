"use client";

import React from "react";
import { useInView } from "../lib/use-animations";

interface RevealProps {
  as?: React.ElementType;
  delay?: number;
  className?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

/**
 * Fades + slides its children up when they scroll into view. Stagger sibling
 * reveals by passing increasing `delay` values. Reduced motion is handled in CSS.
 */
export default function Reveal({
  as: Tag = "div",
  delay = 0,
  className = "",
  children,
  ...rest
}: RevealProps) {
  const [ref, seen] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal ${seen ? "in" : ""} ${className}`.trim()}
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}
