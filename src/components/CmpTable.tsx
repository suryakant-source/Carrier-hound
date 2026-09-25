import React from "react";
import { cn } from "@/lib/utils";

interface CmpTableProps {
  headers: string[];
  rows: {
    feature: string;
    yourBrand: string;
    traditional: string;
    notes?: string;
  }[];
  className?: string;
}

export function CmpTable({ headers, rows, className }: CmpTableProps) {
  return (
    <div className={cn("w-full overflow-x-auto my-8 rounded-lg border border-[#E4E4E7]", className)}>
      <table className="w-full border-collapse text-left text-[0.95rem]">
        <thead>
          <tr className="bg-gray-100/80 border-b border-[#E4E4E7]">
            {headers.map((h, i) => (
              <th
                key={i}
                className={cn(
                  "py-3.5 px-4 font-semibold text-[#09090B]",
                  i === 1 ? "text-[#2563EB] bg-blue-50/50" : ""
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E4E4E7] bg-white">
          {rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
              <td className="py-3.5 px-4 font-medium text-[#09090B]">{row.feature}</td>
              <td className="py-3.5 px-4 text-[#2563EB] font-semibold bg-blue-50/20">{row.yourBrand}</td>
              <td className="py-3.5 px-4 text-[#4B5563]">{row.traditional}</td>
              {row.notes !== undefined && (
                <td className="py-3.5 px-4 text-gray-500 text-xs sm:text-sm">{row.notes}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
