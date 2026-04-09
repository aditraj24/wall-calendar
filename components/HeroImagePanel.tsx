"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type HeroImagePanelProps = {
  imageSrc: string;
  monthLabel: string;
  yearLabel: string;
  primary: string;
};

export default function HeroImagePanel({
  imageSrc,
  monthLabel,
  yearLabel,
  primary,
}: HeroImagePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative h-full w-full"
    >
      <div className="relative h-[280px] w-full md:h-[520px]">
        <Image
          src={imageSrc}
          alt={monthLabel}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-slate-950/20" />

        <div className="absolute inset-x-6 bottom-6 z-10 rounded-[1.75rem] border border-white/15 bg-slate-950/30 p-5 backdrop-blur-xl text-white shadow-xl shadow-slate-950/15">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-200">
            {yearLabel}
          </p>
          <h2 className="text-3xl font-semibold uppercase tracking-[0.18em] md:text-5xl">
            {monthLabel}
          </h2>
        </div>
      </div>
    </motion.div>
  );
}