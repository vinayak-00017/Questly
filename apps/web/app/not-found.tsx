"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 text-6xl opacity-10"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ⚔️
          </motion.div>
          <motion.div
            className="absolute top-40 right-20 text-4xl opacity-10"
            animate={{
              y: [0, -15, 0],
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            🛡️
          </motion.div>
          <motion.div
            className="absolute bottom-40 left-20 text-5xl opacity-10"
            animate={{
              y: [0, -25, 0],
              rotate: [0, 15, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            🏰
          </motion.div>
          <motion.div
            className="absolute bottom-20 right-10 text-3xl opacity-10"
            animate={{
              y: [0, -10, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            💎
          </motion.div>
        </div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          {/* 404 with RPG styling */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 bg-clip-text text-transparent mb-4">
              404
            </h1>
            <div className="flex items-center justify-center gap-2 text-2xl md:text-3xl text-red-500 dark:text-red-400 font-semibold">
              <span>⚠️</span>
              <span>PAGE NOT FOUND</span>
              <span>⚠️</span>
            </div>
          </motion.div>

          {/* RPG-style message box */}
          <motion.div
            className="bg-white/95 dark:bg-slate-800/95 border-2 border-orange-400/30 dark:border-orange-500/50 rounded-lg p-8 mb-8 backdrop-blur-sm shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl">🧙‍♂️</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-4">
              Oops! You've wandered into uncharted territory!
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              It seems you are lost in the void. The page you're looking for has
              either been moved to another realm, completed by another
              adventurer, or never existed in the first place.
            </p>

            {/* RPG-style stats */}
            <div className="mb-6 bg-gray-100 dark:bg-slate-700/50 rounded p-4">
              <div className="text-red-600 dark:text-red-400 font-semibold">Error Code</div>
              <div className="text-gray-800 dark:text-white">404</div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <motion.button
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-lg shadow-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>🏠</span>
                  Return to Home Base
                </motion.button>
              </Link>

              <Link href="/main-quests">
                <motion.button
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>⚔️</span>
                  View Main Quests
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Fun RPG flavor text */}
          <motion.div
            className="text-gray-500 dark:text-gray-400 text-sm italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="mb-2">
              💡 <strong>Pro Tip:</strong> Check your quest log for active missions!
            </p>
            <p>
              🎮 Remember: Every great adventurer gets lost sometimes. It's all part of the journey!
            </p>
          </motion.div>
        </motion.div>

        {/* Animated particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-orange-400/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}