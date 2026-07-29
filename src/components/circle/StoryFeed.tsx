import { Lock, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { useCircleStories } from '@/hooks/useCircleStories';
import { formatConversationTime } from '@/lib/dmUtils';
import { isVideoStory, type CircleStory } from '@/lib/circleTypes';
import { EncryptedMedia } from '@/components/circle/EncryptedMedia';

function StoryCard({ story }: { story: CircleStory }) {
  const author = useAuthor(story.pubkey);
  const metadata = author.data?.metadata;
  const name =
    metadata?.display_name || metadata?.name || genUserName(story.pubkey);

  const video = isVideoStory(story);

  return (
    <Card className="overflow-hidden rounded-sm border-2">
      <div className="flex items-center gap-3 px-4 py-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={metadata?.picture} alt={name} />
          <AvatarFallback className="text-xs">
            {name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="font-slab text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {formatConversationTime(story.createdAt)}
          </p>
        </div>
        <Lock
          className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
          aria-label="Shared privately"
        />
      </div>

      {/* Media — decrypted on this device before display */}
      <ul
        className={
          story.media.length > 1
            ? 'grid grid-cols-2 gap-0.5 bg-muted'
            : 'bg-muted'
        }
      >
        {story.media.map((item, i) => (
          <li key={item.url} className="overflow-hidden">
            <EncryptedMedia
              media={item}
              alt={item.alt || `${name}'s story, image ${i + 1}`}
              /* Trust the attachment's own MIME type. Falling back to the story
                 kind would render a still image inside a <video> element when a
                 story mixes the two. */
              isVideo={
                item.mimeType ? item.mimeType.startsWith('video/') : video
              }
            />
          </li>
        ))}
      </ul>

      {story.content && (
        <CardContent className="p-4">
          <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
            {story.content}
          </p>
        </CardContent>
      )}
    </Card>
  );
}

/** The private feed: stories addressed to you, unwrapped on your device. */
export function StoryFeed() {
  const { data: stories, isLoading } = useCircleStories();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="overflow-hidden rounded-sm border-2">
            <div className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-2.5 w-16" />
              </div>
            </div>
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <CardContent className="space-y-2 p-4">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-3/5" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <Card className="rounded-sm border-2 border-dashed">
        <CardContent className="px-8 py-14 text-center">
          <div className="mx-auto max-w-sm space-y-4">
            <Users className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="leading-relaxed text-muted-foreground">
              No stories yet. When you or anyone in your circle shares a photo, it will appear
              here — and nowhere else.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  );
}
