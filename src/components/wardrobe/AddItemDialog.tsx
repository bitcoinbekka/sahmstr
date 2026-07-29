import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, Loader2, X, Wand2, Check } from 'lucide-react';
import { useUploadFile } from '@/hooks/useUploadFile';
import { useWardrobe } from '@/hooks/useWardrobe';
import { useAIStylist } from '@/hooks/useAIStylist';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import type {
  ClothingCategory,
  ColorFamily,
  Pattern,
  ClothingStyle,
  Season,
  Occasion,
} from '@/lib/wardrobeTypes';
import {
  CLOTHING_CATEGORIES,
  SUBCATEGORIES,
  COLOR_FAMILIES,
  PATTERNS,
  CLOTHING_STYLES,
  SEASONS,
  OCCASIONS,
} from '@/lib/wardrobeTypes';

export function AddItemDialog() {
  const { addItem } = useWardrobe();
  const { user } = useCurrentUser();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();
  const { autoTagImage, isTagging, tagError } = useAIStylist();
  const [open, setOpen] = useState(false);
  const [autoTagged, setAutoTagged] = useState(false);

  const [imageUrl, setImageUrl] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClothingCategory>('tops');
  const [subcategory, setSubcategory] = useState('');
  const [color, setColor] = useState('');
  const [colorFamily, setColorFamily] = useState<ColorFamily>('neutral');
  const [pattern, setPattern] = useState<Pattern>('solid');
  const [styles, setStyles] = useState<ClothingStyle[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [occasions, setOccasions] = useState<Occasion[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const [[, url]] = await uploadFile(file);
      setImageUrl(url);
      setAutoTagged(false);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleAutoTag = async () => {
    if (!imageUrl) return;
    const tags = await autoTagImage(imageUrl);
    if (!tags) return;

    setName(tags.name);
    setCategory(tags.category);
    setSubcategory(tags.subcategory);
    setColor(tags.color);
    setColorFamily(tags.colorFamily);
    setPattern(tags.pattern);
    setStyles(tags.style);
    setSeasons(tags.season);
    setOccasions(tags.occasion);
    setAutoTagged(true);
  };

  const toggleArrayValue = <T extends string>(arr: T[], val: T, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const reset = () => {
    setImageUrl('');
    setName('');
    setCategory('tops');
    setSubcategory('');
    setColor('');
    setColorFamily('neutral');
    setPattern('solid');
    setStyles([]);
    setSeasons([]);
    setOccasions([]);
    setAutoTagged(false);
  };

  const handleSubmit = () => {
    if (!imageUrl || !name || !subcategory) return;

    addItem({
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      imageUrl,
      category,
      subcategory,
      color,
      colorFamily,
      pattern,
      style: styles.length > 0 ? styles : ['casual'],
      season: seasons.length > 0 ? seasons : ['spring', 'summer', 'fall', 'winter'],
      occasion: occasions.length > 0 ? occasions : ['everyday'],
      name,
      createdAt: Date.now(),
    });

    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add to Your Closet</DialogTitle>
          <DialogDescription>
            Upload a photo and describe your clothing item
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Photo</Label>
            {imageUrl ? (
              <div className="relative rounded-xl overflow-hidden border-2 border-border aspect-square max-h-48 mx-auto">
                <img src={imageUrl} alt="Clothing" className="w-full h-full object-cover" />
                <button
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-primary/50 transition-colors">
                {isUploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Tap to upload a photo</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
              </label>
            )}
          </div>

          {/* AI Auto-fill */}
          {imageUrl && user && (
            <div className="space-y-2">
              <Button
                type="button"
                variant={autoTagged ? 'secondary' : 'outline'}
                className="w-full gap-2"
                onClick={handleAutoTag}
                disabled={isTagging}
              >
                {isTagging ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing photo...
                  </>
                ) : autoTagged ? (
                  <>
                    <Check className="h-4 w-4 text-primary" />
                    Filled in by AI — edit anything below
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Fill in details with AI
                  </>
                )}
              </Button>
              {tagError && <p className="text-xs text-destructive">{tagError}</p>}
              {!autoTagged && !isTagging && !tagError && (
                <p className="text-xs text-muted-foreground text-center">
                  Let AI read the photo and fill in the fields for you
                </p>
              )}
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="item-name">Name</Label>
            <Input id="item-name" placeholder="e.g. Blue denim jacket" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* Category + Subcategory */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => { setCategory(v as ClothingCategory); setSubcategory(''); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CLOTHING_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={subcategory} onValueChange={setSubcategory}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {SUBCATEGORIES[category].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Color */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="item-color">Color</Label>
              <Input id="item-color" placeholder="e.g. Navy blue" value={color} onChange={(e) => setColor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Color Family</Label>
              <Select value={colorFamily} onValueChange={(v) => setColorFamily(v as ColorFamily)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COLOR_FAMILIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      <span className="flex items-center gap-2">
                        <span className="flex gap-0.5">
                          {c.swatches.slice(0, 3).map((s) => (
                            <span key={s} className="h-3 w-3 rounded-full border border-border" style={{ background: s }} />
                          ))}
                        </span>
                        {c.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pattern */}
          <div className="space-y-2">
            <Label>Pattern</Label>
            <Select value={pattern} onValueChange={(v) => setPattern(v as Pattern)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PATTERNS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Styles (multi-select chips) */}
          <div className="space-y-2">
            <Label>Style (select all that apply)</Label>
            <div className="flex flex-wrap gap-2">
              {CLOTHING_STYLES.map((s) => (
                <Badge
                  key={s.value}
                  variant={styles.includes(s.value) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleArrayValue(styles, s.value, setStyles)}
                >
                  {s.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Seasons */}
          <div className="space-y-2">
            <Label>Best Seasons</Label>
            <div className="flex flex-wrap gap-2">
              {SEASONS.map((s) => (
                <Badge
                  key={s.value}
                  variant={seasons.includes(s.value) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleArrayValue(seasons, s.value, setSeasons)}
                >
                  {s.icon} {s.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Occasions */}
          <div className="space-y-2">
            <Label>Occasions</Label>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((o) => (
                <Badge
                  key={o.value}
                  variant={occasions.includes(o.value) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleArrayValue(occasions, o.value, setOccasions)}
                >
                  {o.label}
                </Badge>
              ))}
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full gap-2" disabled={!imageUrl || !name || !subcategory}>
            <Plus className="h-4 w-4" />
            Add to Closet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
