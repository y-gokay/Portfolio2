"use client";

import { motion } from "framer-motion";

interface SkeletonLoaderProps {
  className?: string;
  variant?: "card" | "text" | "image" | "circle";
}

export function SkeletonLoader({ className = "", variant = "card" }: SkeletonLoaderProps) {
  const baseClasses = "animate-pulse bg-secondary rounded";
  
  const variantClasses = {
    card: "h-[400px] w-full",
    text: "h-4 w-full mb-2",
    image: "h-full w-full",
    circle: "h-12 w-12 rounded-full",
  };

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
}
