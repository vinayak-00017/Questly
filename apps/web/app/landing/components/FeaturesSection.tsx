import { Card, CardContent } from "@/components/ui/card";
import { Target, Zap, TrendingUp, Award, Users, Calendar } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Daily Quests",
    description:
      "Transform your daily tasks into exciting missions with clear objectives and rewards.",
    color: "text-primary",
  },
  {
    icon: Zap,
    title: "Subquests",
    description:
      "Break down complex goals into manageable mini-challenges that build momentum.",
    color: "text-warning",
  },
  {
    icon: TrendingUp,
    title: "XP & Buffs",
    description:
      "Earn experience points and unlock power-ups that boost your real-world performance.",
    color: "text-success",
  },
  {
    icon: Award,
    title: "Progress Tracker",
    description:
      "Visualize your journey with detailed analytics and achievement badges.",
    color: "text-primary",
  },
  {
    icon: Users,
    title: "Guild System",
    description:
      "Join communities of like-minded questers for motivation and accountability.",
    color: "text-success",
  },
  {
    icon: Calendar,
    title: "Streak Rewards",
    description:
      "Maintain consistency with streak tracking and milestone celebrations.",
    color: "text-warning",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              Quest Features
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to gamify your life and achieve your goals with
            RPG-style progression.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group hover:bg-card/50 transition-all duration-300 hover:shadow-glow border-border/50 hover:border-primary/30 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-background/50 ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature highlight cards */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:border-primary/40 transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-primary/20 rounded-xl">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    Smart Goal Setting
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Our AI-powered quest designer helps you break down ambitious
                    goals into achievable daily missions.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <span>75% higher completion rate</span>
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:border-success/40 transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-success/20 rounded-xl">
                  <Award className="w-8 h-8 text-success" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    Rewards That Matter
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Unlock real-world rewards and digital achievements that
                    celebrate your progress and motivate continued growth.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-success">
                    <span>Dopamine-driven motivation</span>
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
