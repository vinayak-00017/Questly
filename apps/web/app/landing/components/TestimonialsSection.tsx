import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Solo Founder",
    content:
      "Questly transformed how I approach my business goals. The RPG progression keeps me motivated even during tough weeks.",
    rating: 5,
    avatar: "SC",
  },
  {
    name: "Marcus Rodriguez",
    role: "Software Engineer",
    content:
      "Finally, a productivity app that doesn't feel like work. The quest system makes daily tasks actually enjoyable.",
    rating: 5,
    avatar: "MR",
  },
  {
    name: "Emily Johnson",
    role: "Graduate Student",
    content:
      "The streak system helped me build consistent study habits. I've completed more research in 3 months than ever before.",
    rating: 5,
    avatar: "EJ",
  },
  {
    name: "Alex Kim",
    role: "Freelance Designer",
    content:
      "The visual progress tracking is incredible. Seeing my XP grow daily keeps me focused on what really matters.",
    rating: 5,
    avatar: "AK",
  },
  {
    name: "Jordan Taylor",
    role: "Fitness Coach",
    content:
      "I use Questly for both personal goals and client programs. The gamification approach works for everyone.",
    rating: 5,
    avatar: "JT",
  },
  {
    name: "Priya Patel",
    role: "Marketing Manager",
    content:
      "The subquest feature is genius. Breaking down big projects into mini-missions makes everything feel achievable.",
    rating: 5,
    avatar: "PP",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-foreground">Loved by </span>
            <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              Self-Improvers
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of questers who have leveled up their lives with our
            platform.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-muted-foreground">Active Questers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-success mb-2">500K+</div>
            <div className="text-muted-foreground">Quests Completed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-warning mb-2">4.9</div>
            <div className="text-muted-foreground">App Store Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">94%</div>
            <div className="text-muted-foreground">Goal Achievement</div>
          </div>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.name}
              className="group hover:shadow-glow transition-all duration-300 border-border/50 hover:border-primary/30 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-quest flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-warning text-warning"
                    />
                  ))}
                </div>

                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                  <p className="text-muted-foreground italic pl-6">
                    "{testimonial.content}"
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA section */}
        <div className="mt-20 text-center p-12 bg-gradient-to-r from-primary/10 via-success/10 to-warning/10 rounded-3xl border border-primary/20">
          <h3 className="text-3xl font-bold mb-4">Ready to Join the Quest?</h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your journey today and discover what you can achieve when life
            feels like a game.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground"
            />
            <button className="px-8 py-3 bg-gradient-quest text-white rounded-md font-semibold hover:scale-105 transition-transform duration-300 shadow-glow">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
