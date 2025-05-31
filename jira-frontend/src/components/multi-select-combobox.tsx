"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { MemberAvatar } from "@/components/member-avatar";

interface Option {
  label: string;
  value: string;
  avatarUrl?: string;
}

interface MultiSelectComboboxProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: Option[];
  placeholder?: string;
}

export const MultiSelectCombobox: React.FC<MultiSelectComboboxProps> = ({
  value,
  onChange,
  options,
  placeholder,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selected: string) => {
    if (value.includes(selected)) {
      onChange(value.filter((v) => v !== selected));
    } else {
      onChange([...value, selected]);
    }
  };

  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full justify-between items-center rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          )}
        >
          <div className="flex flex-wrap gap-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-muted-foreground text-xs"
                >
                  <MemberAvatar
                    name={option.label}
                    avatarUrl={option.avatarUrl}
                    className="size-4"
                  />
                  <span>{option.label}</span>
                </div>
              ))
            ) : (
              <span className="text-muted-foreground">
                {placeholder || "Select..."}
              </span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="flex items-center gap-x-2 cursor-pointer"
                >
                  <MemberAvatar
                    name={option.label}
                    avatarUrl={option.avatarUrl}
                    className="size-6"
                  />
                  <span className="flex-1">{option.label}</span>
                  {value.includes(option.value) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
