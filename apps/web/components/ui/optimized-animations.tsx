import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

// Lightweight animation components to replace Framer Motion for simple cases

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  className, 
  delay = 0,
  duration = 300 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        'transition-all ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        className
      )}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  className?: string;
  delay?: number;
  duration?: number;
}

export const SlideIn: React.FC<SlideInProps> = ({ 
  children, 
  direction = 'up',
  className, 
  delay = 0,
  duration = 300 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const getTransform = () => {
    if (isVisible) return 'translate-x-0 translate-y-0';
    
    switch (direction) {
      case 'left': return '-translate-x-4 translate-y-0';
      case 'right': return 'translate-x-4 translate-y-0';
      case 'up': return 'translate-x-0 -translate-y-4';
      case 'down': return 'translate-x-0 translate-y-4';
      default: return 'translate-x-0 translate-y-4';
    }
  };

  return (
    <div
      className={cn(
        'transition-all ease-out',
        isVisible ? 'opacity-100' : 'opacity-0',
        getTransform(),
        className
      )}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

interface ScaleInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export const ScaleIn: React.FC<ScaleInProps> = ({ 
  children, 
  className, 
  delay = 0,
  duration = 200 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        'transition-all ease-out',
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
        className
      )}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

interface StaggeredListProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  itemDuration?: number;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({ 
  children, 
  className,
  staggerDelay = 100,
  itemDuration = 300
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <FadeIn 
          key={index} 
          delay={index * staggerDelay}
          duration={itemDuration}
        >
          {child}
        </FadeIn>
      ))}
    </div>
  );
};

interface InViewAnimationProps {
  children: React.ReactNode;
  className?: string;
  animationType?: 'fade' | 'slide' | 'scale';
  threshold?: number;
  rootMargin?: string;
}

export const InViewAnimation: React.FC<InViewAnimationProps> = ({
  children,
  className,
  animationType = 'fade',
  threshold = 0.1,
  rootMargin = '0px'
}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const getAnimationClasses = () => {
    const base = 'transition-all duration-500 ease-out';
    
    switch (animationType) {
      case 'fade':
        return cn(
          base,
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        );
      case 'slide':
        return cn(
          base,
          isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
        );
      case 'scale':
        return cn(
          base,
          isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        );
      default:
        return base;
    }
  };

  return (
    <div ref={ref} className={cn(getAnimationClasses(), className)}>
      {children}
    </div>
  );
};

// Optimized loading spinner using CSS animations
export const OptimizedSpinner: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ 
  className, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div 
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
        sizeClasses[size],
        className
      )}
      style={{
        animation: 'spin 1s linear infinite'
      }}
    />
  );
};

// Optimized pulse animation for loading states
export const OptimizedPulse: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  isLoading?: boolean;
}> = ({ children, className, isLoading = false }) => {
  return (
    <div 
      className={cn(
        isLoading && 'animate-pulse',
        className
      )}
    >
      {children}
    </div>
  );
};