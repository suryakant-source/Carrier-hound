import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface TestimonialAuthor {
  name: string;
  handle: string;
  avatar: string;
}

export interface TestimonialCardProps {
  author: TestimonialAuthor;
  text: string;
  className?: string;
}

export function TestimonialCard({
  author,
  text,
  className,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "w-[320px] max-w-[320px] shrink-0 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300 flex flex-col justify-between select-none",
        className
      )}
    >
      <p className="text-sm text-muted-foreground leading-relaxed">
        &ldquo;{text}&rdquo;
      </p>

      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/50">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-foreground truncate">
            {author.name}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {author.handle}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;
