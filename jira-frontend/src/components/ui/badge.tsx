import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { TaskStatus } from "@/features/tasks/types";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        [TaskStatus.BACKLOG]:
          "border-transparent bg-gray-500 text-white shadow hover:bg-gray-600",
        [TaskStatus.TODO]:
          "border-transparent bg-blue-500 text-white shadow hover:bg-blue-600",
        [TaskStatus.IN_PROGRESS]:
          "border-transparent bg-yellow-600 text-white shadow hover:bg-yellow-400",
        [TaskStatus.DONE]:
          "border-transparent bg-green-600 text-white shadow hover:bg-green-800",
        [TaskStatus.IN_REVIEWED]:
          "border-transparent bg-orange-500 text-white shadow hover:bg-orange-600",
        [TaskStatus.ARCHIVED]:
          "border-transparent bg-gray-700 text-white shadow hover:bg-gray-800",
        [TaskStatus.OVERDUE]:
          "border-transparent bg-red-600 text-white shadow hover:bg-red-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
