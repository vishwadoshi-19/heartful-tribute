import { useEffect, useRef, useState } from "react";
import { Heart, Gift, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const fadeRefs = useRef<(HTMLElement | null)[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [selectedGift, setSelectedGift] = useState<string>("");
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const { toast } = useToast();

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

    fetchBalance();

    return () => observer.disconnect();
  }, []);

  const fetchBalance = async () => {
    const { data, error } = await supabase
      .from("balance")
      .select("amount")
      .single();
    
    if (error) {
      console.error("Error fetching balance:", error);
      return;
    }
    
    setBalance(data?.amount || 0);
  };

  const handleRedeemGift = async (giftType: string) => {
    if (!address) {
      toast({
        title: "Missing Information",
        description: "Please provide a delivery address",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("gift_orders")
      .insert({
        gift_type: giftType,
        delivery_address: address,
        delivery_instructions: instructions,
        preferred_time: preferredTime,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Update balance (subtract 100 for each gift)
    const { error: balanceError } = await supabase
      .from("balance")
      .update({ amount: (balance || 0) - 100 })
      .eq("amount", balance);

    if (balanceError) {
      toast({
        title: "Error",
        description: "Failed to update balance. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Your ${giftType} will be delivered as requested!`,
    });

    // Reset form and refresh balance
    setAddress("");
    setInstructions("");
    setPreferredTime("");
    setSelectedGift("");
    fetchBalance();
  };

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

      {/* Redeem Gifts Section */}
      <section className="py-20 px-4">
        <div className="container max-w-7xl">
          <div
            ref={(el) => (fadeRefs.current[9] = el)}
            className="text-center fade-in mb-16"
          >
            <Gift className="w-12 h-12 mx-auto mb-6 text-primary animate-float" />
            <h2 className="font-display text-3xl md:text-4xl">Redeem Gifts</h2>
            <p className="mt-4 text-muted-foreground">
              Available Balance: ${balance || 0}
            </p>
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
                <p className="text-sm text-muted-foreground mb-4">Cost: $100</p>
                {selectedGift === gift ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Delivery Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-2 rounded border border-border bg-background"
                    />
                    <input
                      type="text"
                      placeholder="Delivery Instructions (Optional)"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className="w-full p-2 rounded border border-border bg-background"
                    />
                    <input
                      type="text"
                      placeholder="Preferred Time (Optional)"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full p-2 rounded border border-border bg-background"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRedeemGift(gift)}
                        className="flex-1 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
                        disabled={(balance || 0) < 100}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setSelectedGift("")}
                        className="flex-1 bg-muted text-foreground px-4 py-2 rounded hover:bg-muted/90 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedGift(gift)}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
                    disabled={(balance || 0) < 100}
                  >
                    Redeem
                  </button>
                )}
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
