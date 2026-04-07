import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";

import { useAuth } from "@/contexts/AuthContext";

interface UserMenuProps {
  onHistoryClick: () => void;
}

export function UserMenu({ onHistoryClick }: UserMenuProps) {
  const { user, signOut } = useAuth();
  const displayName = user?.email?.split("@")[0] ?? "";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "gap-1"
        )}
      >
        {displayName}
        <ChevronDown className="h-3 w-3" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={onHistoryClick}>
          歷史分數
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault(); // ✅ 避免 Radix 預設關閉 timing 問題
            signOut();
          }}
        >
          登出
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}