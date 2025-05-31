import React from "react";
import { cn } from "@/lib/utils";

interface MemberAvatarProps {
  name?: string;
  avatarUrl?: string;
  className?: string;
}

export const MemberAvatar: React.FC<MemberAvatarProps> = ({
  name,
  avatarUrl,
  className,
}) => {
  const firstLetter = name?.charAt(0).toUpperCase() || "?";

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-medium overflow-hidden",
        className
      )}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name || "User Avatar"}
          className="w-full h-full object-cover"
        />
      ) : (
        firstLetter
      )}
    </div>
  );
};
