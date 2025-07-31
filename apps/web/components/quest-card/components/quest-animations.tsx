import React from "react";

const QuestAnimations = () => (
  <style jsx>{`
    .completed-quest {
      transform: scale(0.98);
    }
    .success-pulse {
      animation: pulse-success 2s ease-in-out;
    }
    .completion-indicator {
      position: relative;
      overflow: hidden;
    }
    .progress-animation {
      animation: slide-in 1.5s ease-out;
    }
    .shadow-glow {
      box-shadow: 0 0 8px rgba(74, 222, 128, 0.3);
    }
    @keyframes pulse-success {
      0% {
        opacity: 0;
      }
      10% {
        opacity: 0.7;
      }
      100% {
        opacity: 0;
      }
    }
    @keyframes slide-in {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(0);
      }
    }
  `}</style>
);

export default QuestAnimations;