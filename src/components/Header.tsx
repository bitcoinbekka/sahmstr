import { Link } from 'react-router-dom';
/*
 * Note: lucide's `Lock` export is avoided throughout this project. It shadows the
 * browser's Web Locks API `Lock` global, and under the ESM CDN build the named
 * import can resolve to the native class instead of the icon — which React then
 * tries to call, throwing "Illegal constructor". `ShieldCheck` carries the same
 * meaning and resolves reliably.
 */
import { Home, ChefHat, Video, Lightbulb, Radio, Shirt, Menu, PenLine, Settings, ShieldCheck, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginArea } from '@/components/auth/LoginArea';
import { useTheme } from '@/hooks/useTheme';
import { useTypeSetting } from '@/hooks/useTypeSetting';
import { TYPE_SETTING_LIST } from '@/lib/typeSettings';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sun, Moon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { settingId, setSetting } = useTypeSetting();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/circle', icon: ShieldCheck, label: 'Circle' },
    { to: '/recipes', icon: ChefHat, label: 'Recipes' },
    { to: '/tips', icon: Lightbulb, label: 'Home Ec' },
    { to: '/wardrobe', icon: Shirt, label: 'Style' },
    { to: '/vlogs', icon: Video, label: 'Vlogs' },
    { to: '/live', icon: Radio, label: 'Live' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      {/* Ink rule across the head of the page — four inks, hard stops */}
      <div aria-hidden className="ink-rule h-[3px]" />
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="group flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
              SAHM<span className="text-[hsl(var(--poster-terracotta))]">str</span>
            </span>
            <span className="hidden font-slab text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground lg:inline">
              est. household
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 rounded-sm font-slab text-[11px] font-bold uppercase tracking-[0.1em]"
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/settings" className="hidden md:block">
            <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Settings">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>

          {/*
            Type specimen switcher. Kept in the header rather than buried in
            settings so a setting can be judged against real pages.
          */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                aria-label="Change typeface"
              >
                <Type className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="font-slab text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Type specimen
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {TYPE_SETTING_LIST.map((setting) => (
                <DropdownMenuItem
                  key={setting.id}
                  onSelect={() => setSetting(setting.id)}
                  className="flex cursor-pointer items-baseline justify-between gap-3 py-2"
                >
                  <span
                    className="text-xl leading-none"
                    style={{
                      fontFamily: setting.display,
                      fontWeight: setting.displayWeight,
                    }}
                  >
                    {setting.name}
                  </span>
                  {setting.id === settingId && (
                    <span className="font-slab text-[9px] font-bold uppercase tracking-[0.14em] text-[hsl(var(--poster-terracotta))]">
                      Set
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  to="/settings"
                  className="font-slab text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
                >
                  See full specimens
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="h-9 w-9"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          <div className="hidden md:block">
            <LoginArea className="max-w-60" />
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left font-serif text-2xl font-bold tracking-tight">
                  SAHM<span className="text-[hsl(var(--poster-terracotta))]">str</span>
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Site navigation menu.
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map(({ to, icon: Icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start gap-3 text-base">
                      <Icon className="h-5 w-5" />
                      <span>{label}</span>
                    </Button>
                  </Link>
                ))}
                <Link to="/contribute" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-3 text-base">
                    <PenLine className="h-5 w-5" />
                    <span>Contribute</span>
                  </Button>
                </Link>
                <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-3 text-base">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Button>
                </Link>
              </nav>
              <div className="mt-8 pt-8 border-t">
                <LoginArea className="w-full" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
