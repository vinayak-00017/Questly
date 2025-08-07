import { Button } from "@/components/ui/button";
import {
  Play,
  ArrowRight,
  Trophy,
  Target,
  Zap,
  Star,
  Crown,
  Gamepad2,
  TrendingUp,
  Flame,
  Shield,
  SwordsIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import TextPressure from "@/components/bits/TextAnimations/TextPressure/TextPressure";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const HeroSection = () => {
  const router = useRouter();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/questly.png)",
        }}
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Logo Section - Top Left */}
      <motion.div
        className="absolute top-8 left-8 z-20 flex items-center gap-4"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="rounded-2xl p-1"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(255, 215, 0, 0.4)",
              "0 0 0 15px rgba(255, 215, 0, 0)",
              "0 0 0 0 rgba(255, 215, 0, 0)",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.05 }}
        >
          <Image src={"/q_tp.png"} width={30} height={30} alt="questly_logo" />
        </motion.div>
        <motion.span
          className="text-2xl font-bold text-white"
          animate={{
            textShadow: [
              "0 0 10px rgba(255, 255, 255, 0.5)",
              "0 0 25px rgba(255, 255, 255, 0.8)",
              "0 0 10px rgba(255, 255, 255, 0.5)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          Questly
        </motion.span>
      </motion.div>

      {/* Organized Floating Background Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left Side Icons */}
        <motion.div
          className="absolute top-1/4 left-8"
          animate={{
            y: [0, -12, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="bg-purple-600/20 backdrop-blur-sm p-4 rounded-2xl border border-purple-400/30 shadow-lg">
            <Gamepad2 className="w-8 h-8 text-purple-300" />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-1/2 left-12"
          animate={{
            y: [0, -8, 0],
            x: [0, 3, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <div className="bg-orange-500/20 backdrop-blur-sm p-3 rounded-xl border border-orange-400/30 shadow-lg">
            <Trophy className="w-6 h-6 text-orange-300" />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 left-16"
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <div className="bg-red-500/20 backdrop-blur-sm p-3 rounded-xl border border-red-400/30 shadow-lg">
            <Flame className="w-6 h-6 text-red-300" />
          </div>
        </motion.div>

        {/* Right Side Icons */}
        <motion.div
          className="absolute top-1/4 right-8"
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <div className="bg-green-500/20 backdrop-blur-sm p-4 rounded-2xl border border-green-400/30 shadow-lg">
            <Target className="w-8 h-8 text-green-300" />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-1/2 right-12"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="bg-yellow-500/20 backdrop-blur-sm p-3 rounded-xl border border-yellow-400/30 shadow-lg">
            <Star className="w-6 h-6 text-yellow-300" />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 right-16"
          animate={{
            y: [0, -8, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <div className="bg-indigo-500/20 backdrop-blur-sm p-3 rounded-xl border border-indigo-400/30 shadow-lg">
            <Crown className="w-6 h-6 text-indigo-300" />
          </div>
        </motion.div>

        {/* Top Center Accent Icons */}
        <motion.div
          className="absolute top-16 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, -6, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <div className="bg-blue-500/20 backdrop-blur-sm p-2 rounded-lg border border-blue-400/30">
            <Shield className="w-4 h-4 text-blue-300" />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
        >
          <div className="bg-pink-500/20 backdrop-blur-sm p-2 rounded-lg border border-pink-400/30">
            <Zap className="w-4 h-4 text-pink-300" />
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Headline  */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 className="text-7xl md:text-9xl font-bold leading-tight mb-4">
              <motion.div
                className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent bg-[length:200%_200%]"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <TextPressure
                  text="GAMIFY"
                  flex={true}
                  alpha={false}
                  stroke={false}
                  width={true}
                  weight={false}
                  textColor="#ffffff"
                  minFontSize={48}
                />
              </motion.div>
            </motion.h1>
            <motion.h2 className="text-6xl md:text-8xl font-bold text-white">
              Your Life
            </motion.h2>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-2xl md:text-3xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.span
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              Transform your goals into epic quests. Build powerful habits.
              <br />
              <span className="text-yellow-300 font-semibold">
                Level up every single day.
              </span>
            </motion.span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                scale: { duration: 0.2 },
                y: { duration: 0.2 },
              }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 relative overflow-hidden group border border-purple-400/30"
                onClick={() => {
                  router.push("/register");
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="relative z-10 flex items-center">
                  Start Your Quest
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </motion.div>
                </span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/60 bg-black/30 backdrop-blur-md hover:bg-black/50 text-white font-bold text-xl px-12 py-6 rounded-2xl transition-all duration-300 group hover:border-white/80"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex items-center"
                >
                  <Play className="w-6 h-6 mr-3" />
                  Watch Demo
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {[
              { icon: Flame, label: "Daily Quests", color: "orange" },
              { icon: SwordsIcon, label: "Main Quests", color: "purple" },
              { icon: Zap, label: "XP & Buffs", color: "yellow" },
              { icon: TrendingUp, label: "Progress Tracker", color: "green" },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                className="group cursor-pointer"
                whileHover={{ scale: 1.05, y: -5 }}
                animate={{ y: [0, -3, 0] }}
                transition={{
                  y: {
                    duration: 2 + index * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2,
                  },
                  scale: { duration: 0.2 },
                }}
              >
                <div className="bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/20 group-hover:border-white/40 transition-all duration-300 group-hover:bg-black/60">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`p-3 rounded-xl bg-${feature.color}-500/20 border border-${feature.color}-400/30`}
                    >
                      <feature.icon
                        className={`w-5 h-5 text-${feature.color}-400`}
                      />
                    </div>
                    <div className="text-sm font-bold text-white group-hover:text-white/90 transition-colors whitespace-nowrap">
                      {feature.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};