
import { useEffect, useRef } from "react";
import { Heart, Gift, Calendar } from "lucide-react";

const Index = () => {
  const fadeRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("appear");
          }
        });
      },
      { threshold: 0.1 }
    );

    fadeRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-4">
        <div 
          ref={(el) => (fadeRefs.current[0] = el)}
          className="text-center fade-in"
        >
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl mb-6">
            To My Dearest
          </h1>
          <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
            A tribute to the beautiful moments we shared and the love that will always remain
          </p>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-20 px-4">
        <div className="container max-w-7xl">
          <h2 
            ref={(el) => (fadeRefs.current[1] = el)}
            className="font-display text-3xl md:text-4xl text-center mb-16 fade-in"
          >
            Our Story in Pictures
          </h2>
          <div className="photo-grid">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                ref={(el) => (fadeRefs.current[index + 1] = el)}
                className="photo-card fade-in"
              >
                <div className="aspect-[4/5] bg-muted rounded-lg" />
                <p className="mt-4 text-sm text-muted-foreground text-center">
                  A beautiful memory we shared together
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Note Section */}
      <section className="py-20 px-4 bg-secondary/50">
        <div className="container max-w-3xl">
          <div
            ref={(el) => (fadeRefs.current[8] = el)}
            className="fade-in space-y-6 text-center"
          >
            <Heart className="w-12 h-12 text-primary mx-auto animate-float" />
            <h2 className="font-display text-3xl md:text-4xl mb-8">From My Heart to Yours</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              In the gentle whispers of memory, I find the echoes of our laughter, the warmth of your smile, and the beauty of the moments we shared. Though our paths may diverge, the love we shared has shaped me in ways words cannot express. Thank you for being a chapter in my story.
            </p>
          </div>
        </div>
      </section>

      {/* Virtual Gifts */}
      <section className="py-20 px-4">
        <div className="container max-w-7xl">
          <div
            ref={(el) => (fadeRefs.current[9] = el)}
            className="text-center fade-in mb-16"
          >
            <Gift className="w-12 h-12 mx-auto mb-6 text-primary animate-float" />
            <h2 className="font-display text-3xl md:text-4xl">Virtual Gifts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Flowers", "Plushies", "Chocolates"].map((gift, index) => (
              <div
                key={gift}
                ref={(el) => (fadeRefs.current[10 + index] = el)}
                className="fade-in p-6 rounded-lg bg-secondary/50 text-center"
              >
                <h3 className="font-display text-xl mb-4">{gift}</h3>
                <div className="aspect-square bg-muted rounded-lg mb-4" />
                <p className="text-sm text-muted-foreground">A token of my affection</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 bg-secondary/50">
        <div className="container max-w-5xl">
          <div
            ref={(el) => (fadeRefs.current[13] = el)}
            className="text-center fade-in mb-16"
          >
            <Calendar className="w-12 h-12 mx-auto mb-6 text-primary animate-float" />
            <h2 className="font-display text-3xl md:text-4xl">Our Journey</h2>
          </div>
          <div className="relative">
            <div className="timeline-line" />
            {[
              "The day we met",
              "Our first date",
              "Adventures together",
              "Beautiful moments"
            ].map((event, index) => (
              <div
                key={event}
                ref={(el) => (fadeRefs.current[14 + index] = el)}
                className={`fade-in relative flex items-center gap-8 mb-16 ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div className="w-1/2 p-6 bg-background rounded-lg shadow-sm">
                  <h3 className="font-display text-xl mb-3">{event}</h3>
                  <p className="text-sm text-muted-foreground">
                    A precious memory that will always stay with me
                  </p>
                </div>
                <div className="w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

