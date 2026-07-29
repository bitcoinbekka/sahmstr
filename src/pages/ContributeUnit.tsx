import { useSeoMeta } from '@unhead/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nip19 } from 'nostr-tools';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LoginArea } from '@/components/auth/LoginArea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useUploadFile } from '@/hooks/useUploadFile';
import { useToast } from '@/hooks/useToast';
import { SUBJECT_AREAS, HOMEEC_TAG } from '@/hooks/useCommunityUnits';
import { Loader2, Upload, X, PenLine, Lightbulb } from 'lucide-react';

/**
 * The suggested shape of a contributed unit, matching the structure used
 * throughout the canonical curriculum. Prefilled into the editor so the
 * convention is obvious rather than documented elsewhere.
 */
const TEMPLATE = `## The principle

What the enduring idea is, and why it worked.

## Today

How it holds up now, and where the world has changed enough to need a
different answer.

## Practice

- The first specific thing to do
- The second
- The third

## Suggested activities

1. Something to actually try this week
2. Something to observe or measure
3. Something to teach a child
`;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export default function ContributeUnit() {
  useSeoMeta({
    title: 'Contribute a Unit — SAHMstr',
    description:
      'Share what actually works in your home. Contributed home economics units are published to Nostr, so they belong to you.',
  });

  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const { mutate: createEvent, isPending: isPublishing } = useNostrPublish();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();
  const { toast } = useToast();

  const [question, setQuestion] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState(TEMPLATE);
  const [image, setImage] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);

  const toggleSubject = (value: string) => {
    setSubjects((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value],
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const [[, url]] = await uploadFile(file);
      setImage(url);
    } catch {
      toast({
        title: 'Upload failed',
        description: 'The image could not be uploaded. You can publish without one.',
        variant: 'destructive',
      });
    }
  };

  const canPublish =
    Boolean(title.trim()) && Boolean(content.trim()) && subjects.length > 0 && !isPublishing;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPublish) return;

    const identifier = slugify(title) || `unit-${Date.now()}`;
    const now = Math.floor(Date.now() / 1000);

    // The question, when given, becomes the document's leading heading so the
    // article reads correctly in general-purpose Nostr clients too.
    const body = question.trim() ? `# ${question.trim()}\n\n${content}` : content;

    const tags: string[][] = [
      ['d', identifier],
      ['title', title.trim()],
      ['published_at', String(now)],
      ['t', HOMEEC_TAG],
      ['t', 'sahmstr'],
      ...subjects.map((s) => ['t', s]),
    ];

    if (summary.trim()) tags.push(['summary', summary.trim()]);
    if (image) tags.push(['image', image]);

    createEvent(
      { kind: 30023, content: body, tags },
      {
        onSuccess: (event) => {
          toast({
            title: 'Unit published',
            description: 'Your contribution is live and belongs to you.',
          });
          const naddr = nip19.naddrEncode({
            kind: 30023,
            pubkey: event.pubkey,
            identifier,
          });
          navigate(`/${naddr}`);
        },
        onError: () => {
          toast({
            title: 'Could not publish',
            description: 'Check your relay connections and try again.',
            variant: 'destructive',
          });
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-primary/10 py-14">
          <div className="container max-w-3xl relative space-y-5">
            <div className="inline-flex h-14 w-14 rounded-sm bg-gradient-to-br from-[hsl(150_34%_28%)] to-[hsl(155_38%_18%)] items-center justify-center shadow-sm">
              <PenLine className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
              Contribute a Unit
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              The old curriculum was written by two women at a college. This one gets written
              by the mothers using it. Share a method, a system, or a hard-won lesson from your
              own household.
            </p>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container max-w-3xl">
            {!user ? (
              <Card className="border-2 border-dashed">
                <CardContent className="py-14 text-center space-y-5">
                  <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Log in to contribute. Your unit is signed with your own key and published
                    to Nostr, which means it stays yours — readable anywhere, and not
                    dependent on this site continuing to exist.
                  </p>
                  <div className="flex justify-center">
                    <LoginArea className="max-w-60" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Guidance */}
                <Card className="border-2 bg-muted/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      How units are written here
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
                    <p>
                      Every unit in this curriculum starts as a plain question a household has
                      to answer, then gives the principle, how it applies now, what to
                      practice, and what to try. The editor is prefilled with that shape.
                    </p>
                    <p>
                      Write from what you have actually done. Specific beats comprehensive.
                    </p>
                  </CardContent>
                </Card>

                {/* The question */}
                <div className="space-y-2">
                  <Label htmlFor="question">The question this unit answers</Label>
                  <Input
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="How shall a family eat well on a single income?"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional, but it is the convention here — and it makes people read.
                  </p>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Feeding Six on One Income"
                  />
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    rows={2}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="One or two sentences describing what a reader will get."
                  />
                </div>

                <Separator />

                {/* Subjects */}
                <div className="space-y-3">
                  <div>
                    <Label>
                      Subject areas <span className="text-destructive">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Choose at least one. This is how your unit is found.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECT_AREAS.map((s) => {
                      const active = subjects.includes(s.value);
                      return (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => toggleSubject(s.value)}
                          aria-pressed={active}
                          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full"
                        >
                          <Badge
                            variant={active ? 'default' : 'outline'}
                            className="cursor-pointer px-3 py-1 text-sm transition-colors"
                          >
                            {s.label}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">
                    The unit <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    required
                    rows={20}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="font-mono text-sm leading-relaxed"
                  />
                  <p className="text-xs text-muted-foreground">
                    Markdown. Headings, lists, and emphasis all work.
                  </p>
                </div>

                {/* Image */}
                <div className="space-y-2">
                  <Label>Header image</Label>
                  {image ? (
                    <div className="relative w-full max-w-sm">
                      <img
                        src={image}
                        alt=""
                        className="rounded-lg border w-full aspect-[16/9] object-cover"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        onClick={() => setImage('')}
                        className="absolute top-2 right-2 h-8 w-8"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        id="unit-image"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Label
                        htmlFor="unit-image"
                        className="inline-flex items-center gap-2 rounded-md border-2 border-dashed px-4 py-3 text-sm cursor-pointer hover:border-primary/50 transition-colors"
                      >
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        {isUploading ? 'Uploading…' : 'Upload an image'}
                      </Label>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Button type="submit" disabled={!canPublish} className="gap-2 rounded-full">
                    {isPublishing && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isPublishing ? 'Publishing…' : 'Publish Unit'}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Published as a long-form Nostr article. You can edit it later by
                    publishing again with the same title.
                  </p>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
