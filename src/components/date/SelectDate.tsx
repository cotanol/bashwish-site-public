"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SelectDateProps {
  value?: Date | undefined;
  onChange?: (date: Date | undefined) => void;
}

export function SelectDate({ value, onChange }: SelectDateProps) {
  const [open, setOpen] = React.useState(false);
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    undefined
  );

  // Use controlled value if provided, otherwise use internal state
  const date = value !== undefined ? value : internalDate;
  const setDate = onChange || setInternalDate;

  return (
    <>
      <Label htmlFor="date" className="px-1 text-lg font-normal text-white">
        When are you planning to celebrate?
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            type="button"
            className="w-full justify-between font-normal hover:cursor-pointer text-base !text-[#1C3658] bg-white border-2 border-[#000000] shadow-[2px_2px_0_#000000]"
          >
            {date ? date.toLocaleDateString() : "Select date to celebrate"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(newDate) => {
              setDate(newDate);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
