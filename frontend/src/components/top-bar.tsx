import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { Link } from "@tanstack/react-router"

export function TopBar() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Button asChild variant='ghost' className="cursor-pointer">
              <Link to="/converter">
                Notes Converter
              </Link>
            </Button>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Button asChild variant='ghost' className="cursor-pointer">
              <Link to="/tracker">
                Combat Tracker
              </Link>
            </Button>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem asChild>
          <ModeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
