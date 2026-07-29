import { useState, useMemo } from 'react';
import { useWardrobe } from '@/hooks/useWardrobe';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Sparkles, RefreshCw, Shirt, ArrowRight } from 'lucide-react';
import { SEASONS, OCCASIONS } from '@/lib/wardrobeTypes';
import type { Season, Occasion, OutfitSuggestion, WardrobeItem } from '@/lib/wardrobeTypes';
import { Link } from 'react-router-dom';

function getCurrentSeason(): Season {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

export function OutfitSuggestions() {
  const { items, generateOutfits } = useWardrobe();
  const [season, setSeason] = useState<Season>(getCurrentSeason());
  const [occasion, setOccasion] = useState<Occasion>('everyday');
  const [refreshKey, setRefreshKey] = useState(0);

  const suggestions = useMemo(
    () => generateOutfits(season, occasion, 6),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [season, occasion, items.length, refreshKey, generateOutfits],
  );

  if (items.length < 2) {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="mx-auto h-20 w-20 rounded-full bg-muted flex items-center justify-center">
          <Sparkles className="h-10 w-10 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-xl mb-2">Add more items to get outfit ideas</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            You need at least a top and a bottom (or a dress) in your closet before we can start creating outfits for you.
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
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label>Season</Label>
              <Select value={season} onValueChange={(v) => setSeason(v as Season)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEASONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.icon} {s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex-1">
              <Label>Occasion</Label>
              <Select value={occasion} onValueChange={(v) => setOccasion(v as Occasion)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OCCASIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => setRefreshKey((k) => k + 1)}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {suggestions.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <p className="text-muted-foreground">
            No outfits could be generated for this combination. Try adding more items to your closet or changing the season / occasion.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suggestions.map((outfit) => (
            <OutfitCard key={outfit.id} outfit={outfit} />
          ))}
        </div>
      )}
    </div>
  );
}

function OutfitCard({ outfit }: { outfit: OutfitSuggestion }) {
  const isDress = outfit.top.id === outfit.bottom.id;
  const pieces = [
    { label: isDress ? 'Dress' : 'Top', item: outfit.top },
    ...(!isDress ? [{ label: 'Bottom', item: outfit.bottom }] : []),
    ...(outfit.layer ? [{ label: 'Layer', item: outfit.layer }] : []),
    ...(outfit.shoes ? [{ label: 'Shoes', item: outfit.shoes }] : []),
    ...(outfit.accessories ? [{ label: 'Accessory', item: outfit.accessories }] : []),
  ];

  return (
    <Card className="overflow-hidden border-2 hover:border-primary/40 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Outfit Idea
          </CardTitle>
          <Badge variant="secondary" className="capitalize">
            {outfit.occasion.replace('-', ' ')}
          </Badge>
        </div>
        <CardDescription className="capitalize">{outfit.reasoning}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {pieces.map(({ label, item }) => (
            <OutfitPiece key={`${label}-${item.id}`} label={label} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function OutfitPiece({ label, item }: { label: string; item: WardrobeItem }) {
  return (
    <div className="text-center space-y-1">
      <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
      <p className="text-[10px] truncate">{item.name}</p>
    </div>
  );
}
