import { useSeoMeta } from "@unhead/react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

/**
 * The 404, set as a missing plate.
 *
 * The printer's convention when a plate was lost from a series was to leave the
 * frame and its number in place with the caption struck through — so the reader
 * knew the book was complete and the plate was not. That reads far better here
 * than an apology on a grey field.
 */
const NotFound = () => {
  const location = useLocation();

  useSeoMeta({
    title: "Plate not found — SAHMstr",
    description:
      "This page is not part of the series. Return to the title page to continue browsing the curriculum, recipes and household units.",
  });

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center justify-center paper-grain relative overflow-hidden bg-[hsl(var(--poster-cream))] py-20 dark:bg-background">
        {/* Ruled ground, as on a title page */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.1]"
          style={{
            backgroundImage:
              "none",
          }}
        />

        <div className="container relative max-w-lg text-center">
          {/* The empty frame where the plate should have been */}
          <div className="mx-auto mb-8 flex aspect-[3/4] w-40 items-center justify-center rounded-sm border-2 border-dashed border-[hsl(var(--poster-ink))]/25 bg-[hsl(var(--poster-cream))]/40">
            <span className="font-slab text-5xl font-bold text-[hsl(var(--poster-ink))]/20">
              404
            </span>
          </div>

          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[hsl(var(--poster-terracotta))]" />
            <span className="font-slab text-[11px] font-bold uppercase tracking-[0.22em] text-[hsl(var(--poster-terracotta))]">
              Plate missing
            </span>
            <span className="h-px w-8 bg-[hsl(var(--poster-terracotta))]" />
          </div>

          <h1 className="poster-title mb-4 text-4xl md:text-5xl">
            This plate was never printed
          </h1>

          <p className="mx-auto mb-8 max-w-md text-lg leading-relaxed text-muted-foreground">
            The page you asked for is not part of the series. The rest of the volume
            is intact — start again from the title page, or open the curriculum.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/">
              <Button size="lg" className="gap-2 rounded-sm px-7">
                Back to the title page
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/tips">
              <Button size="lg" variant="outline" className="rounded-sm border-2 px-7">
                Open the curriculum
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
