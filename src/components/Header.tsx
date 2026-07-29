import { Link } from 'react-router-dom';
import { Home, ChefHat, Video, Lightbulb, Radio, Shirt, Menu, PenLine, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginArea } from '@/components/auth/LoginArea';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/recipes', icon: ChefHat, label: 'Recipes' },
    { to: '/vlogs', icon: Video, label: 'Vlogs' },
    { to: '/live', icon: Radio, label: 'Live' },
    { to: '/tips', icon: Lightbulb, label: 'Home Tips' },
    { to: '/wardrobe', icon: Shirt, label: 'Style' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-bold bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
                SAHMstr
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Icon className="h-4 w-4" />
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
                <SheetTitle className="text-left font-serif text-2xl bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
                  SAHMstr
                </SheetTitle>
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
