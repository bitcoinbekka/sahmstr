import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Wand2,
  Sparkles,
  CloudSun,
  Loader2,
  AlertCircle,
  Shirt,
  Lightbulb,
  Palette,
  Bitcoin,
} from 'lucide-react';
import { LoginArea } from '@/components/auth/LoginArea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useWardrobe } from '@/hooks/useWardrobe';
import { useAIStylist, type ResolvedAIOutfit } from '@/hooks/useAIStylist';
import { useWeather } from '@/hooks/useWeather';
import { ModelSelector } from './ModelSelector';
import { SEASONS, OCCASIONS } from '@/lib/wardrobeTypes';
import type { Season, Occasion, WardrobeItem } from '@/lib/wardrobeTypes';

function getCurrentSeason(): Season {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

export function AIStylistPanel() {
  const { user } = useCurrentUser();
  const { items } = useWardrobe();
  const {
    outfits,
    generateOutfits,
    isGenerating,
    generateError,
  } = useAIStylist();
  const { weather, fetchWeather, clearWeather, isLoading: weatherLoading, error: weatherError } = useWeather();

  const [season, setSeason] = useState<Season>(getCurrentSeason());
  const [occasion, setOccasion] = useState<Occasion>('everyday');
  const [notes, setNotes] = useState('');

  // --- Login gate ---
  if (!user) {
    return (
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5">
        <CardContent className="p-10 text-center space-y-6">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center">
            <Wand2 className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-3 max-w-lg mx-auto">
            <h3 className="text-2xl font-serif font-bold">Meet Your AI Stylist</h3>
            <p className="text-muted-foreground">
              Get personalized outfit ideas with real styling advice — how to layer it, how to tuck it,
              and why the colors work with your undertone.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left">
            <div className="p-3 rounded-xl bg-background/60 border space-y-1">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">Real advice</p>
              <p className="text-xs text-muted-foreground">Detailed tips, not just combos</p>
            </div>
            <div className="p-3 rounded-xl bg-background/60 border space-y-1">
              <CloudSun className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">Weather aware</p>
              <p className="text-xs text-muted-foreground">Dressed for today's forecast</p>
            </div>
            <div className="p-3 rounded-xl bg-background/60 border space-y-1">
              <Bitcoin className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">Pay with sats</p>
              <p className="text-xs text-muted-foreground">Or use a free model</p>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <p className="text-sm text-muted-foreground">
              Log in with Nostr to unlock the AI Stylist
            </p>
            <div className="flex justify-center">
              <LoginArea className="max-w-60" />
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Prefer not to log in?{' '}
              <Link to="/wardrobe?tab=outfits" className="text-primary hover:underline">
                Use the free outfit matcher
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // --- Not enough items ---
  if (items.length < 2) {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="mx-auto h-20 w-20 rounded-full bg-muted flex items-center justify-center">
          <Wand2 className="h-10 w-10 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-xl mb-2">Your stylist needs a closet to work with</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Add at least two items — ideally a top and a bottom, or a dress — and the AI can start
            building looks for you.
          </p>
          <Link to="/wardrobe?tab=closet">
            <Button className="gap-2">
              <Shirt className="h-4 w-4" />
              Go to My Closet
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            AI Stylist
          </CardTitle>
          <CardDescription>
            Styling {items.length} item{items.length !== 1 ? 's' : ''} from your closet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Season</Label>
              <Select value={season} onValueChange={(v) => setSeason(v as Season)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SEASONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.icon} {s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Occasion</Label>
              <Select value={occasion} onValueChange={(v) => setOccasion(v as Occasion)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {OCCASIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <ModelSelector />

          {/* Weather */}
          <div className="space-y-2">
            <Label>Weather (optional)</Label>
            {weather ? (
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl border bg-muted/50">
                <div className="flex items-center gap-2 text-sm">
                  <CloudSun className="h-4 w-4 text-primary shrink-0" />
                  <span>
                    <strong>{Math.round(weather.temperatureF)}°F</strong>, {weather.condition}
                    {weather.locationName ? ` in ${weather.locationName}` : ''}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={clearWeather}>Remove</Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={fetchWeather}
                disabled={weatherLoading}
              >
                {weatherLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudSun className="h-4 w-4" />}
                Use my local weather
              </Button>
            )}
            {weatherError && (
              <p className="text-xs text-muted-foreground">{weatherError}</p>
            )}
          </div>

          {/* Special requests */}
          <div className="space-y-2">
            <Label htmlFor="stylist-notes">Anything specific? (optional)</Label>
            <Textarea
              id="stylist-notes"
              placeholder="e.g. I need something nursing-friendly, or I'm going to a church potluck and want to feel put together but comfortable"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            className="w-full gap-2"
            size="lg"
            onClick={() => generateOutfits({ season, occasion, weather, notes, count: 3 })}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Styling your looks...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Style Me
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error */}
      {generateError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{generateError}</AlertDescription>
        </Alert>
      )}

      {/* Loading skeletons */}
      {isGenerating && (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-24 w-24 rounded-lg" />
                  ))}
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results */}
      {!isGenerating && outfits.length > 0 && (
        <div className="space-y-5">
          <h3 className="text-xl font-serif font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Your Styled Looks
          </h3>
          {outfits.map((outfit, i) => (
            <AIOutfitCard key={`${outfit.title}-${i}`} outfit={outfit} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function AIOutfitCard({ outfit, index }: { outfit: ResolvedAIOutfit; index: number }) {
  return (
    <Card className="overflow-hidden border-2 hover:border-primary/40 transition-all">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-xl font-serif">{outfit.title}</CardTitle>
            <Badge variant="secondary" className="text-xs">Look {index + 1}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Item photos */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {outfit.items.map((item) => (
            <OutfitItemThumb key={item.id} item={item} />
          ))}
        </div>

        {/* Why it works */}
        {outfit.whyItWorks && (
          <div className="space-y-1.5">
            <p className="text-sm font-semibold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Why it works
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">{outfit.whyItWorks}</p>
          </div>
        )}

        {/* Styling tips */}
        {outfit.stylingTips && (
          <div className="space-y-1.5">
            <p className="text-sm font-semibold flex items-center gap-1.5">
              <Lightbulb className="h-3.5 w-3.5 text-primary" />
              Styling tips
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">{outfit.stylingTips}</p>
          </div>
        )}

        {/* Color note */}
        {outfit.colorNote && (
          <div className="flex gap-2 p-3 rounded-xl bg-muted/60 border">
            <Palette className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">{outfit.colorNote}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function OutfitItemThumb({ item }: { item: WardrobeItem }) {
  return (
    <div className="space-y-1">
      <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <p className="text-[10px] text-muted-foreground truncate text-center">{item.name}</p>
    </div>
  );
}
