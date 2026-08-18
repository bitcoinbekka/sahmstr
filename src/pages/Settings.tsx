import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RelayListManager } from '@/components/RelayListManager';
import { AiSettings } from '@/components/AiSettings';
import { EditProfileForm } from '@/components/EditProfileForm';
import { LoginArea } from '@/components/auth/LoginArea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useTheme } from '@/hooks/useTheme';
import { Settings as SettingsIcon, Wifi, User, Sun, Moon } from 'lucide-react';

export default function Settings() {
  useSeoMeta({
    title: 'Settings — SAHMstr',
    description: 'Manage your relays, profile, and appearance.',
  });

  const { user } = useCurrentUser();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="paper-grain relative overflow-hidden border-b bg-[hsl(var(--poster-cream))] py-12 dark:bg-background">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.1]"
            style={{
              backgroundImage:
                'none',
            }}
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[3px] bg-[hsl(var(--poster-ochre))]/70"
          />
          <div className="container max-w-3xl relative space-y-4">
            <div className="inline-flex h-14 w-14 rounded-sm bg-gradient-to-br from-[hsl(158_40%_24%)] to-[hsl(162_46%_15%)] items-center justify-center shadow-sm">
              <SettingsIcon className="h-7 w-7 text-[hsl(41_56%_95%)]" />
            </div>
            <h1 className="poster-title text-3xl md:text-5xl">Settings</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Your relays determine where this app reads and writes. Choosing them yourself is
              the difference between using a service and running your own.
            </p>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container max-w-3xl space-y-8">
            {/* Relays */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2.5">
                  <Wifi className="h-5 w-5 text-primary" />
                  Relays
                </CardTitle>
                <CardDescription className="leading-relaxed">
                  Relays are the servers that carry your recipes, units, and messages. Read
                  relays are where content is fetched from; write relays are where yours is
                  published. When you are logged in, changes here are published as your NIP-65
                  relay list, so other clients follow them too.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RelayListManager />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Running your own relay is the most complete version of this — it means your
                  household keeps its own copy of everything it publishes. See Unit 16 for why
                  that matters.
                </p>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2.5">
                  {theme === 'light' ? (
                    <Sun className="h-5 w-5 text-primary" />
                  ) : (
                    <Moon className="h-5 w-5 text-primary" />
                  )}
                  Appearance
                </CardTitle>
                <CardDescription>Choose a light or dark interface.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                    className="gap-2 rounded-sm"
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className="gap-2 rounded-sm"
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Photo tagging AI (bring-your-own-key) */}
            <AiSettings />

            {/* Profile */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2.5">
                  <User className="h-5 w-5 text-primary" />
                  Your Profile
                </CardTitle>
                <CardDescription>
                  How you appear on contributed units, recipes, and comments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user ? (
                  <EditProfileForm />
                ) : (
                  <div className="text-center py-6 space-y-4">
                    <p className="text-muted-foreground text-sm">
                      Log in to edit your profile.
                    </p>
                    <div className="flex justify-center">
                      <LoginArea className="max-w-60" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Separator />

            <p className="text-xs text-center text-muted-foreground">
              Vibed with{' '}
              <a
                href="https://shakespeare.diy"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
              >
                Shakespeare
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
