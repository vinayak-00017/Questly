import { Card, CardContent } from "@/components/ui/card";
import {
  Target,
  Zap,
  TrendingUp,
  Award,
  Users,
  Calendar,
  Sparkles,
  Star,
  Crown,
  Shield,
  Gamepad2,
  Trophy,
  Flame,
  SwordsIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import ScrollFloat from "@/components/bits/TextAnimations/ScrollFloat/ScrollFloat";

const features = [
  {
    icon: Flame,
    title: "Daily Quests",
    description:
      "Transform your daily tasks into exciting missions with clear objectives and rewards.",
    color: "text-orange-400",
    bgColor: "from-orange-500/15 to-orange-600/5",
    borderColor: "border-orange-400/20",
    hoverBorder: "hover:border-orange-400/40",
  },
  {
    icon: Zap,
    title: "XP & Buffs",
    description: "Earn experience points that enhance your aura in real-world.",
    color: "text-yellow-400",
    bgColor: "from-yellow-500/15 to-yellow-600/5",
    borderColor: "border-yellow-400/20",
    hoverBorder: "hover:border-yellow-400/40",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracker",
    description:
      "Visualize your journey with detailed analytics and self reflection.",
    color: "text-green-400",
    bgColor: "from-green-500/15 to-green-600/5",
    borderColor: "border-green-400/20",
    hoverBorder: "hover:border-green-400/40",
  },
  {
    icon: Award,
    title: "Achievements",
    description: "Achieve milestones and unlock rewards.",
    color: "text-blue-400",
    bgColor: "from-blue-500/15 to-blue-600/5",
    borderColor: "border-blue-400/20",
    hoverBorder: "hover:border-blue-400/40",
  },
  {
    icon: SwordsIcon,
    title: "Main Quests",
    description:
      "Embark on epic journeys with long-term real-life goals set by you.",
    color: "text-purple-400",
    bgColor: "from-purple-500/15 to-purple-600/5",
    borderColor: "border-purple-400/20",
    hoverBorder: "hover:border-purple-400/40",
  },
  {
    icon: Calendar,
    title: "Streak Rewards",
    description:
      "Maintain consistency with streak tracking and milestone celebrations.",
    color: "text-pink-400",
    bgColor: "from-pink-500/15 to-pink-600/5",
    borderColor: "border-pink-400/20",
    hoverBorder: "hover:border-pink-400/40",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Strategic Sparkles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute"
            style={{
              left: `${10 + (i % 4) * 25}%`,
              top: `${15 + Math.floor(i / 4) * 70}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-4 h-4 text-muted-foreground/40 drop-shadow-lg" />
          </motion.div>
        ))}

        {/* Floating Gaming Icons */}
        <motion.div
          className="absolute top-20 left-16"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="bg-muted/10 backdrop-blur-sm p-3 rounded-xl border border-border/20 shadow-lg">
            <Gamepad2 className="w-6 h-6 text-muted-foreground/50" />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-32 right-20"
          animate={{
            y: [0, -12, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <div className="bg-muted/10 backdrop-blur-sm p-3 rounded-xl border border-border/20 shadow-lg">
            <Trophy className="w-6 h-6 text-muted-foreground/50" />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-20"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="bg-muted/10 backdrop-blur-sm p-3 rounded-xl border border-border/20 shadow-lg">
            <Star className="w-6 h-6 text-muted-foreground/50" />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-16"
          animate={{
            y: [0, -8, 0],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <div className="bg-muted/10 backdrop-blur-sm p-3 rounded-xl border border-border/20 shadow-lg">
            <Crown className="w-6 h-6 text-muted-foreground/50" />
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-20 space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-6xl md:text-7xl lg:text-8xl font-bold"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-[length:200%_200%]">
              Quest Features
            </span>
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Everything you need to gamify your life and achieve your goals with
            <span className="text-primary font-semibold">
              {" "}
              RPG-style progression
            </span>
            .
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <Card
                  className={`h-full bg-gradient-to-br ${feature.bgColor} backdrop-blur-sm ${feature.borderColor} ${feature.hoverBorder} transition-all duration-500 hover:shadow-2xl relative overflow-hidden`}
                >
                  {/* Animated background glow */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{
                      background: [
                        "radial-gradient(circle at 0% 0%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
                        "radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
                        "radial-gradient(circle at 0% 0%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <CardContent className="p-8 text-center space-y-6 relative z-10">
                    <motion.div
                      className={`inline-flex p-4 rounded-2xl bg-black/20 backdrop-blur-sm ${feature.color} group-hover:scale-110 transition-all duration-300 shadow-lg`}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-8 h-8" />
                    </motion.div>

                    <motion.h3
                      className="text-2xl font-bold text-foreground group-hover:text-white transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                    >
                      {feature.title}
                    </motion.h3>

                    <p className="text-muted-foreground leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Enhanced Feature Highlight Cards */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-gray-500/20 to-gray-600/10 border-gray-400/30 hover:border-gray-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-500/20 relative overflow-hidden group">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <CardContent className="p-8 relative z-10">
                <div className="flex items-start space-x-6">
                  <motion.div
                    className="flex-shrink-0 p-4 bg-gray-500/20 rounded-2xl border border-gray-400/30 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Target className="w-10 h-10 text-gray-400" />
                  </motion.div>
                  <div>
                    <h3 className="text-3xl font-bold mb-3 text-foreground group-hover:text-gray-300 transition-colors duration-300">
                      Smart Goal Setting
                    </h3>
                    {/* <p className="text-muted-foreground mb-6 text-lg leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                      Our AI-powered quest designer helps you break down
                      ambitious goals into achievable daily missions with
                      personalized difficulty scaling.
                    </p> */}
                    <motion.div
                      className="flex items-center gap-3 text-gray-400 font-semibold"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-lg">
                        75% higher completion rate
                      </span>
                      <TrendingUp className="w-5 h-5" />
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-gray-500/20 to-gray-600/10 border-gray-400/30 hover:border-gray-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-500/20 relative overflow-hidden group">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
              />
              <CardContent className="p-8 relative z-10">
                <div className="flex items-start space-x-6">
                  <motion.div
                    className="flex-shrink-0 p-4 bg-gray-500/20 rounded-2xl border border-gray-400/30 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: -360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Award className="w-10 h-10 text-gray-400" />
                  </motion.div>
                  <div>
                    <h3 className="text-3xl font-bold mb-3 text-foreground group-hover:text-gray-300 transition-colors duration-300">
                      Rewards That Matter
                    </h3>
                    {/* <p className="text-muted-foreground mb-6 text-lg leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                      Unlock real-world rewards and digital achievements that
                      celebrate your progress and motivate continued growth with
                      meaningful incentives.
                    </p> */}
                    <motion.div
                      className="flex items-center gap-3 text-gray-400 font-semibold"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-lg">
                        Dopamine-driven motivation
                      </span>
                      <Zap className="w-5 h-5" />
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
