"use client";

import { useAppSelector } from "@/stores/hooks";
import { useLogout } from "../api/use-logout";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { DottedSeparator } from "@/components/dotted-separator";
import { LogOut } from "lucide-react";

export const UserButton = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { mutate: logout } = useLogout();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="cursor-pointer">
          <AvatarImage
            src={user?.avatar || ""}
            alt={user?.name || "User Avatar"}
            className="size-10 hover:opacity-75 transition border border-neutral-300"
          />
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-[52px] border border-neutral-300">
            <AvatarImage
              src={user?.avatar || ""}
              alt={user?.name || "User Avatar"}
            />
          </Avatar>
        </div>

        <div className="flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-neutral-900">
            {user?.name || "User Name"}
          </p>
          <p className="text-xs text-neutral-500">
            {user?.email || "@gmail.com"}
          </p>
        </div>

        <DottedSeparator className="mb-1 mt-4" />

        <DropdownMenuItem
          onClick={() => {
            logout();
            window.location.href = "/sign-in";
          }}
          className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
        >
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
