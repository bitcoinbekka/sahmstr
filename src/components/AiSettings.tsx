/**
 * AiSettings — configure a bring-your-own-key vision provider (ADR-016).
 *
 * The owner picks a provider (xAI/Grok by default), pastes a key, and photo
 * tagging in the wardrobe and pantry starts using it directly — no wallet, no
 * sats. The key is saved in this browser's localStorage only; it is never sent
 * anywhere except to the chosen provider, and never committed or bundled.
 *
 * This is the pragmatic path for a personal/demo site. The sovereign, sats-paid
 * contextVM path (docs/CONTEXTVM.md) remains the answer for a public, multi-user
 * deployment, and takes over automatically when no key is set here.
 */

import { useEffect, useState } from 'react';
import { Wand2, Check, Trash2, ExternalLink, KeyRound, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/useToast';
import {
  VISION_PRESETS,
  getPreset,
  loadVisionConfig,
  saveVisionConfig,
  clearVisionConfig,
  type VisionConfig,
} from '@/lib/aiVision';

export function AiSettings() {
  const { toast } = useToast();

  const [providerId, setProviderId] = useState('xai');
  const [baseUrl, setBaseUrl] = useState('');
  const [model, setModel] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState<VisionConfig | null>(null);

  // Load any previously-saved config once.
  useEffect(() => {
    const cfg = loadVisionConfig();
    if (cfg) {
      setSaved(cfg);
      setProviderId(cfg.providerId);
      setBaseUrl(cfg.baseUrl);
      setModel(cfg.model);
      setApiKey(cfg.apiKey);
    } else {
      const preset = getPreset('xai');
      setBaseUrl(preset.baseUrl);
      setModel(preset.defaultModel);
    }
  }, []);

  const preset = getPreset(providerId);
  const isCustom = providerId === 'custom';

  // When the provider changes, fill base URL + model from the preset (unless
  // the user is on "custom", where they type their own).
  const handleProviderChange = (id: string) => {
    setProviderId(id);
    const p = getPreset(id);
    if (id !== 'custom') {
      setBaseUrl(p.baseUrl);
      setModel(p.defaultModel);
    } else {
      setBaseUrl('');
      setModel('');
    }
  };

  const handleSave = () => {
    if (!apiKey.trim() || !baseUrl.trim() || !model.trim()) {
      toast({
        title: 'Missing details',
        description: 'A key, a base URL, and a model name are all needed.',
        variant: 'destructive',
      });
      return;
    }
    const config: VisionConfig = {
      providerId,
      baseUrl: baseUrl.trim(),
      model: model.trim(),
      apiKey: apiKey.trim(),
    };
    saveVisionConfig(config);
    setSaved(config);
    toast({
      title: 'AI provider saved',
      description: 'Photo tagging in the wardrobe and pantry will use it now.',
    });
  };

  const handleClear = () => {
    clearVisionConfig();
    setSaved(null);
    setApiKey('');
    const p = getPreset('xai');
    setProviderId('xai');
    setBaseUrl(p.baseUrl);
    setModel(p.defaultModel);
    toast({
      title: 'AI provider removed',
      description: 'Photo tagging will fall back to the sats-paid path.',
    });
  };

  return (
    <Card className="rounded-sm border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Wand2 className="h-5 w-5 text-primary" />
          Photo tagging AI
        </CardTitle>
        <CardDescription className="leading-relaxed">
          Add a vision AI key and the wardrobe and pantry can read a photo and
          fill in the details for you. The key stays in this browser only — it is
          never uploaded, shared, or built into the site.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {saved && (
          <div className="flex items-center gap-2 rounded-lg border-2 border-primary/30 bg-primary/5 p-3 text-sm">
            <Check className="h-4 w-4 shrink-0 text-primary" />
            <span>
              Active: <strong>{getPreset(saved.providerId).label}</strong> ·{' '}
              <span className="text-muted-foreground">{saved.model}</span>
            </span>
          </div>
        )}

        <div className="space-y-2">
          <Label>Provider</Label>
          <Select value={providerId} onValueChange={handleProviderChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VISION_PRESETS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs leading-relaxed text-muted-foreground">{preset.note}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ai-key" className="flex items-center gap-1.5">
            <KeyRound className="h-3.5 w-3.5" />
            API key
          </Label>
          <Input
            id="ai-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Paste your key (e.g. xai-…)"
            autoComplete="off"
          />
          {preset.keyUrl && (
            <a
              href={preset.keyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Get a key from {preset.label}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        {isCustom && (
          <div className="space-y-2">
            <Label htmlFor="ai-baseurl">Base URL</Label>
            <Input
              id="ai-baseurl"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://your-endpoint/v1"
              autoComplete="off"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="ai-model">Model</Label>
          <Input
            id="ai-model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g. grok-2-vision-1212"
            autoComplete="off"
          />
          <p className="text-xs text-muted-foreground">
            Must be a model that can look at images.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSave} className="gap-2">
            <Check className="h-4 w-4" />
            Save
          </Button>
          {saved && (
            <Button variant="outline" onClick={handleClear} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Remove key
            </Button>
          )}
        </div>

        <div className="flex items-start gap-2 rounded-lg bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            This key lives in your browser and is sent only to the provider you
            chose. It is fine for your own use. For a public, shared setup where
            you don't want a key on the client at all, the sats-paid AI (see the
            server runbook) is the sovereign alternative.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
