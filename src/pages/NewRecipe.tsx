import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useUploadFile } from '@/hooks/useUploadFile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Upload, X, Loader2 } from 'lucide-react';
import { nip19 } from 'nostr-tools';
import type { NostrEvent } from '@nostrify/nostrify';

export default function NewRecipe() {
  useSeoMeta({
    title: 'Share a Recipe - SAHMstr',
    description: 'Share your favorite recipe with the SAHMstr community.',
  });

  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const { mutate: createEvent, isPending: isPublishing } = useNostrPublish();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['recipe']);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const [[_, url]] = await uploadFile(file);
      setImage(url);
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const identifier = `recipe-${Date.now()}`;
    const eventTags: string[][] = [
      ['d', identifier],
      ['title', title],
      ['published_at', Math.floor(Date.now() / 1000).toString()],
    ];

    if (summary) {
      eventTags.push(['summary', summary]);
    }

    if (image) {
      eventTags.push(['image', image]);
    }

    // Add all tags
    tags.forEach(tag => {
      eventTags.push(['t', tag]);
    });

    createEvent(
      {
        kind: 30023, // Long-form content
        content,
        tags: eventTags,
      },
      {
        onSuccess: (event: NostrEvent) => {
          const naddr = nip19.naddrEncode({
            kind: event.kind,
            pubkey: event.pubkey,
            identifier,
          });
          navigate(`/${naddr}`);
        },
      }
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Login Required</CardTitle>
              <CardDescription>
                You need to be logged in to share recipes.
              </CardDescription>
            </CardHeader>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 bg-background">
        <div className="container max-w-3xl">
          <div className="mb-8 text-center space-y-2">
            <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 items-center justify-center mx-auto mb-4">
              <ChefHat className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold">
              Share Your Recipe
            </h1>
            <p className="text-muted-foreground">
              Share your culinary creation with the community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recipe Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Recipe Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Grandma's Sourdough Bread"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Short Description</Label>
                  <Textarea
                    id="summary"
                    placeholder="A brief description of your recipe..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Recipe Photo</Label>
                  <div className="flex gap-4 items-center">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                    {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                  {image && (
                    <div className="relative mt-4">
                      <img 
                        src={image} 
                        alt="Recipe preview" 
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Recipe Instructions *</Label>
                  <Textarea
                    id="content"
                    placeholder="Ingredients:&#10;- 2 cups flour&#10;- 1 cup water&#10;&#10;Instructions:&#10;1. Mix ingredients...&#10;2. Bake at 350°F..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={15}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Include ingredients and step-by-step instructions. You can use Markdown formatting.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      placeholder="Add a tag (e.g., breakfast, vegan, quick)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-2">
                        {tag}
                        {tag !== 'recipe' && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/recipes')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPublishing || !title || !content}
                className="gap-2"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Publish Recipe
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
