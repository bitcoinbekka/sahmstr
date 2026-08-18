import { useState } from 'react';
import { Plus, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePantryActions } from '@/hooks/usePantry';
import { useToast } from '@/hooks/useToast';
import { useUploadFile } from '@/hooks/useUploadFile';
import { useWallet } from '@/hooks/useWallet';
import { useVisionTagging } from '@/hooks/useVisionTagging';
import { AITagButton } from '@/components/AITagButton';
import {
  PANTRY_LOCATIONS,
  UNIT_SUGGESTIONS,
  buildPantryTagInstruction,
  parsePantryTagResponse,
  type PantryItem,
  type PantryLocation,
  type PantryItemKind,
} from '@/lib/pantryTypes';

/** Generate a short, collision-resistant id without a dependency. */
function makeId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

/** The form for putting something new on a shelf. */
export function AddPantryItem() {
  const { addItem } = usePantryActions();
  const { toast } = useToast();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();
  const { hasNWC } = useWallet();
  const {
    mode,
    tagImage,
    stage,
    error: tagError,
    paidSats,
    isConfigured,
    reset: resetTagging,
  } = useVisionTagging();

  const [imageUrl, setImageUrl] = useState('');
  const [autoTagged, setAutoTagged] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState<PantryLocation>('pantry');
  const [kind, setKind] = useState<PantryItemKind>('staple');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('');
  const [bestBy, setBestBy] = useState('');
  const [madeOn, setMadeOn] = useState('');
  const [note, setNote] = useState('');

  const reset = () => {
    setImageUrl('');
    setAutoTagged(false);
    resetTagging();
    setName('');
    setQuantity('1');
    setUnit('');
    setBestBy('');
    setMadeOn('');
    setNote('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const [[, url]] = await uploadFile(file);
      setImageUrl(url);
      setAutoTagged(false);
      resetTagging();
    } catch (err) {
      toast({
        title: 'Upload failed',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAutoTag = async () => {
    if (!imageUrl) return;
    const result = await tagImage(imageUrl, buildPantryTagInstruction());
    if (!result) return;
    const tags = parsePantryTagResponse(result.text);
    if (!tags) return;
    if (tags.name) setName(tags.name);
    setLocation(tags.location);
    setKind(tags.kind);
    setQuantity(String(tags.quantity));
    if (tags.unit) setUnit(tags.unit);
    setAutoTagged(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    const item: PantryItem = {
      id: makeId(),
      name: trimmed,
      location,
      kind,
      quantity: Number(quantity) || 0,
      unit: unit.trim(),
      bestBy: bestBy || undefined,
      madeOn: kind === 'preserve' && madeOn ? madeOn : undefined,
      note: note.trim() || undefined,
    };

    try {
      await addItem.mutateAsync(item);
      reset();
      toast({
        title: 'Added to your shelves',
        description: `${item.name} is now on your ${PANTRY_LOCATIONS.find((l) => l.value === location)?.label.toLowerCase()}.`,
      });
    } catch (err) {
      toast({
        title: 'Could not add that',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="rounded-sm border-2">
      <div aria-hidden className="ink-rule h-1.5" />
      <CardContent className="space-y-4 p-6">
        <div className="space-y-1">
          <h2 className="font-serif text-xl font-bold">Put something up</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Record what is on your shelves so nothing is forgotten or wasted. It
            is encrypted to you alone — private, and it follows you to any device.
          </p>
        </div>

        {/* Optional photo + AI tagging */}
        <div className="space-y-2">
          {imageUrl ? (
            <div className="relative mx-auto aspect-square max-h-40 overflow-hidden rounded-lg border-2">
              <img src={imageUrl} alt="Provision" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => { setImageUrl(''); setAutoTagged(false); resetTagging(); }}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                aria-label="Remove photo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:border-primary/50">
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Upload className="mb-1.5 h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Add a photo (optional) — let AI fill it in
                  </span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
            </label>
          )}

          {imageUrl && (
            <AITagButton
              onTag={handleAutoTag}
              stage={stage}
              isConfigured={isConfigured}
              hasWallet={hasNWC}
              mode={mode}
              error={tagError}
              paidSats={paidSats}
              applied={autoTagged}
            />
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="pantry-name" className="font-slab text-[11px] uppercase tracking-[0.12em]">
                What is it
              </Label>
              <Input
                id="pantry-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Strawberry jam, flour, chicken stock…"
                className="rounded-sm"
                autoComplete="off"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pantry-location" className="font-slab text-[11px] uppercase tracking-[0.12em]">
                Where it lives
              </Label>
              <Select value={location} onValueChange={(v) => setLocation(v as PantryLocation)}>
                <SelectTrigger id="pantry-location" className="rounded-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PANTRY_LOCATIONS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pantry-kind" className="font-slab text-[11px] uppercase tracking-[0.12em]">
                Kind
              </Label>
              <Select value={kind} onValueChange={(v) => setKind(v as PantryItemKind)}>
                <SelectTrigger id="pantry-kind" className="rounded-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staple">Bought staple</SelectItem>
                  <SelectItem value="preserve">Home preserve</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pantry-qty" className="font-slab text-[11px] uppercase tracking-[0.12em]">
                How much
              </Label>
              <Input
                id="pantry-qty"
                type="number"
                min="0"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="rounded-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pantry-unit" className="font-slab text-[11px] uppercase tracking-[0.12em]">
                Unit
              </Label>
              <Input
                id="pantry-unit"
                list="pantry-units"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="jars, lbs, cups…"
                className="rounded-sm"
                autoComplete="off"
              />
              <datalist id="pantry-units">
                {UNIT_SUGGESTIONS.map((u) => (
                  <option key={u} value={u} />
                ))}
              </datalist>
            </div>

            {kind === 'preserve' && (
              <div className="space-y-1.5">
                <Label htmlFor="pantry-madeon" className="font-slab text-[11px] uppercase tracking-[0.12em]">
                  Put up on <span className="normal-case tracking-normal opacity-60">(optional)</span>
                </Label>
                <Input
                  id="pantry-madeon"
                  type="date"
                  value={madeOn}
                  onChange={(e) => setMadeOn(e.target.value)}
                  className="rounded-sm"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="pantry-bestby" className="font-slab text-[11px] uppercase tracking-[0.12em]">
                Best by <span className="normal-case tracking-normal opacity-60">(optional)</span>
              </Label>
              <Input
                id="pantry-bestby"
                type="date"
                value={bestBy}
                onChange={(e) => setBestBy(e.target.value)}
                className="rounded-sm"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="pantry-note" className="font-slab text-[11px] uppercase tracking-[0.12em]">
                Note <span className="normal-case tracking-normal opacity-60">(optional)</span>
              </Label>
              <Input
                id="pantry-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Recipe used, batch size, who it's for…"
                className="rounded-sm"
                autoComplete="off"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gap-2 rounded-sm sm:w-auto"
            disabled={addItem.isPending || !name.trim()}
          >
            {addItem.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add to shelves
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
