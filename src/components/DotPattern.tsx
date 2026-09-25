import React from "react";
import { cn } from "@/lib/utils";

interface DotPatternProps {
  className?: string;
  width?: number;
  height?: number;
  dotColor?: string;
  rows?: number;
  cols?: number;
}

export default function DotPattern({
  className,
  width = 160,
  height = 120,
  dotColor = "rgba(255, 255, 255, 0.45)",
  rows = 6,
  cols = 8,
}: DotPatternProps) {
  const dots: { x: number; y: number }[] = [];
  const spacingX = width / cols;
  const spacingY = height / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push({
        x: c * spacingX + spacingX / 2,
        y: r * spacingY + spacingY / 2,
      });
    }
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("pointer-events-none select-none", className)}
      aria-hidden="true"
    >
      {dots.map((dot, i) => (
        <circle key={i} cx={dot.x} cy={dot.y} r="2" fill={dotColor} />
      ))}
    </svg>
  );
}
