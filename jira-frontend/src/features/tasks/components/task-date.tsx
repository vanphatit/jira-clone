import { cn } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";

interface TaskDateProps {
  value: string | null;
  className?: string;
}

export const TaskDate = ({ value, className }: TaskDateProps) => {
    const today = new Date();
    const endDate = new Date(value || "");
    const diffInDays = differenceInDays(endDate, today);

    let textColor = "text-muted-foreground";

    if (diffInDays <= 3) {
        textColor = "text-red-500";
    } else if (diffInDays <= 7) {
        textColor = "text-orange-500";
    }
    else if (diffInDays <= 14) {
        textColor = "text-green-800";
    }

    const formattedDate = endDate.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return (
      <span
        className={`text-sm font-medium ${textColor}`}
        title={formattedDate}
      >
        {formattedDate}
      </span>
    );
}