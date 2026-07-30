import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { UserIcon } from "lucide-react";
import { AuthButtons } from "./AuthButtons";

export function AuthPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="sm:hidden"
          aria-label="Konto"
        >
          <UserIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2 sm:hidden">
        <AuthButtons stacked />
      </PopoverContent>
    </Popover>
  );
}
