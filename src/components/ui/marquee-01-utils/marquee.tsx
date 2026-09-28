import React from "react";
import { cn } from "@/lib/utils";

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  const animationClass = reverse
    ? "animate-marquee-right"
    : "animate-marquee-left";

  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:28s] [--gap:1.25rem] [gap:var(--gap)] select-none",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex shrink-0 justify-around [gap:var(--gap)]",
              animationClass,
              {
                "group-hover:[animation-play-state:paused]": pauseOnHover,
              }
            )}
            style={{
              willChange: "transform",
            }}
          >
            {children}
          </div>
        ))}
    </div>
  );
}

export default Marquee;
