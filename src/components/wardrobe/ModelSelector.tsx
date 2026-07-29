import { useAIModels } from '@/hooks/useAIModels';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Zap } from 'lucide-react';

export function ModelSelector() {
  const { models, selectedModel, selectModel, isLoading, error } = useAIModels();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>AI Model</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <Label>AI Model</Label>
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (models.length === 0) return null;

  return (
    <div className="space-y-2">
      <Label>AI Model</Label>
      <Select value={selectedModel?.id ?? ''} onValueChange={selectModel}>
        <SelectTrigger>
          <SelectValue placeholder="Choose a model" />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <span className="flex items-center gap-2">
                <span className="truncate max-w-[180px]">{model.name}</span>
                {model.isFree ? (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-0.5">
                    <Zap className="h-2.5 w-2.5" />
                    Free
                  </Badge>
                ) : (
                  <span className="text-[10px] text-muted-foreground">
                    ${(model.totalCost * 1000).toFixed(4)}/1k
                  </span>
                )}
                {model.supportsVision && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-0.5">
                    <Eye className="h-2.5 w-2.5" />
                    Vision
                  </Badge>
                )}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedModel && (
        <p className="text-xs text-muted-foreground">
          {selectedModel.isFree
            ? 'This model is free to use — no credits needed.'
            : 'Uses AI credits from your Shakespeare balance.'}
        </p>
      )}
    </div>
  );
}
