import { Link } from 'react-router-dom';
import { Bitcoin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
              SAHMstr
            </h3>
            <p className="text-sm text-muted-foreground">
              A community for stay-at-home moms who embrace bitcoin, sharing recipes, tips, and wisdom.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bitcoin className="h-4 w-4 text-primary" />
              <span>Built on Nostr</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
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
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Community</h4>
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
            <h4 className="font-semibold mb-4">Connect</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Join our community on Nostr and share your journey.
            </p>
            <a 
              href="https://shakespeare.diy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Vibed with Shakespeare
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SAHMstr. Empowering moms, one satoshi at a time.</p>
        </div>
      </div>
    </footer>
  );
}
