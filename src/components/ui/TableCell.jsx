import React from "react";
import { cn } from "@/lib/utils";
import {Tooltip} from "react-tooltip";

function TableCell({ col, row }) {
  const content = col.render ? col.render(row) : row[col.key];
  const isTruncated = typeof content === 'string' && content.length > 30;
  const displayText = isTruncated ? `${content.slice(0, 30)}...` : content;
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 h-full min-h-[32px]",
        col.key === "name" ? "font-['Inter'] font-medium text-[14px] leading-[20px]" : "font-['Inter'] font-normal text-[14px] leading-[20px]",
        col.key === "actions" && "justify-end",
        "truncate max-w-[200px]"
      )}
      data-tooltip-id={`${col.key}-${row.id}`}
      data-tooltip-content={content}
    >
      {displayText}
      {typeof content === 'string' && content.length > 30 && (
        <Tooltip
          id={`${col.key}-${row.id}`}
          place="top"
          className="max-w-[300px] !bg-gray-800 !text-white !text-sm !p-2 !rounded-md !select-text"
          clickable={true}
          delayHide={0}
          afterHide={() => {
            const tooltip = document.querySelector(`#${col.key}-${row.id}`);
            if (tooltip) tooltip.style.display = 'none';
          }}
        />
      )}
    </div>
  );
}

export default TableCell;
