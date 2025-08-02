import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Monitor, Tablet } from "lucide-react";
import Image from "next/image";

export const AppShowcase = () => {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-success to-warning bg-clip-text text-transparent">
              Your Quest Awaits
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the power of gamified productivity across all your
            devices.
          </p>
        </div>

        {/* Main app preview */}
        <div className="relative max-w-6xl mx-auto mb-20">
          <div className="relative">
            <Image
              src={"/app-mockup.jpg"}
              width={1200}
              height={800}
              alt="Questly App Interface"
              className="w-full rounded-2xl shadow-2xl border border-border/50"
            />
            {/* Overlay with stats */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent rounded-2xl" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      2,847
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total XP Earned
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-background/80 backdrop-blur-sm border-success/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-success mb-2">
                      156
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Quests Completed
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-background/80 backdrop-blur-sm border-warning/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-warning mb-2">
                      42
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Day Streak
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Device compatibility */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center space-y-4">
            <div className="inline-flex p-6 bg-primary/10 rounded-2xl">
              <Smartphone className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Mobile First</h3>
            <p className="text-muted-foreground">
              Track quests on-the-go with our intuitive mobile app
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="inline-flex p-6 bg-success/10 rounded-2xl">
              <Monitor className="w-12 h-12 text-success" />
            </div>
            <h3 className="text-xl font-semibold">Desktop Power</h3>
            <p className="text-muted-foreground">
              Plan and analyze your progress with detailed desktop features
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="inline-flex p-6 bg-warning/10 rounded-2xl">
              <Tablet className="w-12 h-12 text-warning" />
            </div>
            <h3 className="text-xl font-semibold">Tablet Ready</h3>
            <p className="text-muted-foreground">
              Perfect for journaling and quest planning on larger screens
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            variant="quest"
            size="lg"
            className="text-lg px-8 py-6 h-auto"
          >
            Download Questly
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Available on iOS, Android, and Web
          </p>
        </div>
      </div>
    </section>
  );
};
