"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const RealHero = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [starData, setStarData] = useState<
    Array<{
      id: number;
      opacity: number;
      top: number;
      left: number;
      width: number;
      height: number;
      duration: number;
      delay: number;
    }>
  >([]);

  const [shootingData, setShootingData] = useState<
    Array<{
      id: number;
      top: number;
      width: number;
      rotate: number;
      duration: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    setIsClient(true);

    // Generate star data once on client
    const stars = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      opacity: 0.1 + Math.random() * 0.4,
      top: Math.random() * 100,
      left: Math.random() * 100,
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      duration: 1 + Math.random() * 3,
      delay: Math.random() * 2,
    }));
    setStarData(stars);

    // Generate shooting element data once on client
    const shooting = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      top: Math.random() * 70 + 5,
      width: Math.random() * 40 + 25,
      rotate: Math.random() * 15 - 7,
      duration: Math.random() * 2 + 2.5,
      delay: Math.random() * 4,
    }));
    setShootingData(shooting);
  }, []);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-0">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{
          backgroundImage: "url('/questly_hero.png')",
        }}
      />

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

      {/* Navigation Links - Top Right */}
      <motion.nav
        className="absolute top-8 right-8 z-20 flex items-center gap-6"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.a
          href="#daily"
          className="text-white/80 hover:text-white font-medium text-sm transition-colors duration-300 hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Daily
        </motion.a>
        <motion.a
          href="#gamification"
          className="text-white/80 hover:text-white font-medium text-sm transition-colors duration-300 hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Gamification
        </motion.a>
        <motion.a
          href="#tracking"
          className="text-white/80 hover:text-white font-medium text-sm transition-colors duration-300 hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Tracking
        </motion.a>
      </motion.nav>

      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Gradient overlay for extra depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      {/* Particle Animation (similar to login page) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Fantasy background overlay with subtle texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwMDAwMDUiPjwvcmVjdD4KPHBhdGggZD0iTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVoiIHN0cm9rZT0iIzg4ODg4ODA1IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc=')] opacity-20 z-0"></div>

        {/* Decorative stars */}
        {isClient &&
          starData.map((star) => (
            <motion.div
              key={star.id}
              className="absolute rounded-full bg-white z-0"
              initial={{
                opacity: star.opacity,
                top: `${star.top}%`,
                left: `${star.left}%`,
              }}
              animate={{
                opacity: [star.opacity, star.opacity + 0.2, star.opacity],
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: star.delay,
              }}
              style={{
                width: `${star.width}px`,
                height: `${star.height}px`,
              }}
            />
          ))}

        {/* Shooting elements with amber theme */}
        {isClient &&
          shootingData.map((shooting) => (
            <motion.div
              key={`shooting-${shooting.id}`}
              className="absolute h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent"
              initial={{
                opacity: 0,
                top: `${shooting.top}%`,
                left: `-5%`,
                width: `${shooting.width}px`,
                rotate: `${shooting.rotate}deg`,
                scale: 0.5,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                left: [`-5%`, `110%`],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: shooting.duration,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                delay: shooting.delay,
                times: [0, 0.5, 1],
              }}
            />
          ))}
      </div>

      {/* Hero Content */}
      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-3xl ml-auto mr-30 mb- mt-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      >
        {/* Main Headline */}
        <motion.h1
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-7xl font-bold mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-cinzel), "Times New Roman", serif' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
          <motion.span
            className="bg-gradient-to-r from-amber-600 via-orange-700 to-yellow-600 bg-clip-text text-transparent drop-shadow-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            Turn Your Life
          </motion.span>
          <br />
          <motion.span
            className="bg-gradient-to-r from-amber-600 via-orange-700 to-yellow-600 bg-clip-text text-transparent drop-shadow-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            Into a
          </motion.span>
          <br />
          <motion.span
            className="bg-gradient-to-r from-amber-600 via-orange-700 to-yellow-600 bg-clip-text text-transparent drop-shadow-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            Legendary Quest
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl sm:text-2xl lg:text-3xl text-gray-200 mb-8 font-light leading-relaxed max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3, ease: "easeOut" }}
        >
          Transform boring habits into exciting adventures. Earn XP, unlock
          achievements,
          <br />
          and level up your real life with gamified goal tracking.
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
        >
          {/* Primary CTA Button */}
          <motion.button
            onClick={() => router.push("/register")}
            className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-base rounded-lg shadow-xl hover:shadow-orange-500/25 transform hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.7, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Start Your Journey</span>
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg blur opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
          </motion.button>

          {/* Secondary Button */}
          <motion.button
            className="group relative px-8 py-4 bg-transparent hover:bg-white/10 text-white font-semibold text-base rounded-lg border-2 border-orange-500/50 hover:border-orange-400 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.9, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Video Story</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default RealHero;
