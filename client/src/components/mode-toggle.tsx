import { useEffect } from "react"
import { Moon, Sun, Laptop } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  // Global Keyboard Shortcut: Ctrl + Shift + L or Cmd + Shift + L to toggle theme
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "l") {
        e.preventDefault()
        setTheme(theme === "dark" ? "light" : "dark")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [theme, setTheme])

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger>
            <DropdownMenuTrigger>
              <Button variant="outline" size="icon" className="rounded-full">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>

          <TooltipContent side="bottom">
            <p className="flex items-center gap-1.5 font-medium">
              <span>Toggle theme</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-background/20 bg-background/20 px-1.5 font-mono text-[10px] font-medium text-background">
                Ctrl+Shift+L
              </kbd>
            </p>
          </TooltipContent>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className="flex items-center justify-between gap-4 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sun className="h-4 w-4" /> Light
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className="flex items-center justify-between gap-4 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Moon className="h-4 w-4" /> Dark
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className="flex items-center justify-between gap-4 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Laptop className="h-4 w-4" /> System
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>
    </TooltipProvider>
  )
}