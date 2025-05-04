"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AuthBackgroundProps {
  variant?: "purple" | "amber";
}

export const AuthBackground: React.FC<AuthBackgroundProps> = ({
  variant = "purple",
}) => {
  // Create particles with useEffect to ensure they only run client-side
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoize the particles to prevent re-renders
  const particles = useMemo(() => {
    if (!isClient) return null;

    const particleColor =
      variant === "purple" ? "bg-purple-500/10" : "bg-amber-500/10";

    return (
      <>
        {/* Fantasy background overlay with subtle texture */}
        <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwMDAwMDUiPjwvcmVjdD4KPHBhdGggZD0iTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVoiIHN0cm9rZT0iIzg4ODg4ODA1IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-30 z-0"></div>
        <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-900/20 to-black/90 z-0"></div>

        {/* Decorative stars */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="fixed rounded-full bg-white z-0"
            initial={{
              opacity: 0.1 + Math.random() * 0.5,
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
            animate={{
              opacity: [
                0.1 + Math.random() * 0.5,
                0.1 + Math.random() * 0.7,
                0.1 + Math.random() * 0.5,
              ],
            }}
            transition={{
              duration: 1 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
            }}
          ></motion.div>
        ))}

        {/* Additional shooting elements for amber variant */}
        {variant === "amber" && (
          <>
            {/* Shooting elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`shooting-${i}`}
                  className="absolute h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                  initial={{
                    opacity: 0,
                    top: `${Math.random() * 70 + 5}%`,
                    left: `-5%`,
                    width: `${Math.random() * 50 + 30}px`,
                    rotate: `${Math.random() * 20 - 10}deg`,
                    scale: 0.5,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    left: [`-5%`, `110%`],
                    scale: [0.5, 1.5, 0.5],
                  }}
                  transition={{
                    duration: Math.random() * 2 + 3,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    delay: Math.random() * 5,
                    times: [0, 0.5, 1],
                  }}
                ></motion.div>
              ))}
            </div>
          </>
        )}

        {/* Purple magic particles */}
        {variant === "purple" && (
          <>
            {/* Shooting elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`shooting-purple-${i}`}
                  className="absolute h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                  initial={{
                    opacity: 0,
                    top: `${Math.random() * 70 + 5}%`,
                    left: `-5%`,
                    width: `${Math.random() * 50 + 30}px`,
                    rotate: `${Math.random() * 20 - 10}deg`,
                    scale: 0.5,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    left: [`-5%`, `110%`],
                    scale: [0.5, 1.5, 0.5],
                  }}
                  transition={{
                    duration: Math.random() * 2 + 3,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    delay: Math.random() * 5,
                    times: [0, 0.5, 1],
                  }}
                ></motion.div>
              ))}
            </div>
          </>
        )}
      </>
    );
  }, [isClient, variant]);

  return (
    <>
      {particles}
      {/* Custom animations for RPG theme */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes pulse-glow {
          0% {
            box-shadow: 0 0 5px
              rgba(
                ${variant === "purple" ? "147, 51, 234" : "251, 191, 36"},
                0.2
              );
          }
          50% {
            box-shadow: 0 0 20px
              rgba(
                ${variant === "purple" ? "147, 51, 234" : "251, 191, 36"},
                0.4
              );
          }
          100% {
            box-shadow: 0 0 5px
              rgba(
                ${variant === "purple" ? "147, 51, 234" : "251, 191, 36"},
                0.2
              );
          }
        }

        .pulse-glow {
          animation: pulse-glow 3s infinite ease-in-out;
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};
