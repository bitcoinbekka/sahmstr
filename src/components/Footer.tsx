import { Link } from 'react-router-dom';
import { Bitcoin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t bg-[hsl(var(--poster-cream))] dark:bg-card paper-grain">
      <div className="container relative py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold tracking-tight">
              SAHM<span className="text-[hsl(var(--poster-terracotta))]">str</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Home economics for households that hold their own money. Recipes, curriculum, and
              the plain wisdom of women doing the work.
            </p>
            <div className="flex items-center gap-2 font-slab text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              <Bitcoin className="h-3.5 w-3.5 text-[hsl(var(--poster-ochre))]" />
              <span>Built on Nostr</span>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-slab text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/circle" className="text-muted-foreground hover:text-foreground transition-colors">
                  The Circle
                </Link>
              </li>
              <li>
                <Link to="/recipes" className="text-muted-foreground hover:text-foreground transition-colors">
                  Recipes
                </Link>
              </li>
              <li>
                <Link to="/vlogs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Vlogs
                </Link>
              </li>
              <li>
                <Link to="/live" className="text-muted-foreground hover:text-foreground transition-colors">
                  Live Streams
                </Link>
              </li>
              <li>
                <Link to="/tips" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home Tips
                </Link>
              </li>
              <li>
                <Link to="/wardrobe" className="text-muted-foreground hover:text-foreground transition-colors">
                  Wardrobe & Style
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-slab text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Community
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-muted-foreground hover:text-foreground transition-colors">
                  Guidelines
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-slab text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Connect
            </h4>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Publish to Nostr and your writing stays yours — here and anywhere else you take it.
            </p>
            <Link
              to="/contribute"
              className="inline-flex items-center gap-1.5 font-slab text-[11px] font-bold uppercase tracking-[0.14em] text-primary hover:underline"
            >
              Contribute a unit
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 border-t pt-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SAHMstr · One satoshi at a time.
          </p>
          <a
            href="https://shakespeare.diy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-slab text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Vibed with Shakespeare
          </a>
        </div>
      </div>
    </footer>
  );
}
