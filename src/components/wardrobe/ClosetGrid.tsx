import { useWardrobe } from '@/hooks/useWardrobe';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Shirt } from 'lucide-react';
import { CLOTHING_CATEGORIES } from '@/lib/wardrobeTypes';
import type { ClothingCategory, WardrobeItem } from '@/lib/wardrobeTypes';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddItemDialog } from './AddItemDialog';

export function ClosetGrid() {
  const { itemsByCategory, removeItem, items } = useWardrobe();

  if (items.length === 0) {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="mx-auto h-20 w-20 rounded-full bg-muted flex items-center justify-center">
          <Shirt className="h-10 w-10 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-xl mb-2">Your closet is empty</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Start by adding your clothing items. Upload photos, tag the style, season, and color - and we'll help you put together amazing outfits!
          </p>
          <AddItemDialog />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {items.length} item{items.length !== 1 ? 's' : ''} in your closet
        </p>
        <AddItemDialog />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all">
            All ({items.length})
          </TabsTrigger>
          {CLOTHING_CATEGORIES.map((cat) => {
            const count = itemsByCategory[cat.value].length;
            if (count === 0) return null;
            return (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.label} ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <ItemGrid items={items} onRemove={removeItem} />
        </TabsContent>
        {CLOTHING_CATEGORIES.map((cat) => (
          <TabsContent key={cat.value} value={cat.value} className="mt-6">
            <ItemGrid items={itemsByCategory[cat.value as ClothingCategory]} onRemove={removeItem} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function ItemGrid({ items, onRemove }: { items: WardrobeItem[]; onRemove: (id: string) => void }) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12">
        No items in this category yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="group overflow-hidden border-2 hover:border-primary/40 transition-all">
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            {/* Delete button */}
            {confirmId === item.id ? (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 p-3">
                <p className="text-white text-xs text-center">Remove this item?</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="destructive" onClick={() => { onRemove(item.id); setConfirmId(null); }}>
                    Yes
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setConfirmId(null)}>
                    No
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmId(item.id)}
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <CardContent className="p-3 space-y-1.5">
            <p className="font-medium text-sm truncate">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.subcategory}</p>
            <div className="flex flex-wrap gap-1">
              {item.season.map((s) => (
                <Badge key={s} variant="outline" className="text-[10px] px-1.5 py-0 capitalize">
                  {s}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
