import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductSliderProps {
  images: string[];
}

export const ProductSlider = ({ images }: ProductSliderProps) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideImages = images && images.length > 0 
    ? images 
    : ['https://images.unsplash.com/photo-1590611380053-da6447021fbb?q=80&w=800'];

  const nextStep = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % slideImages.length);
  };

  const prevStep = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + slideImages.length) % slideImages.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 90 : -90,
      skewX: direction > 0 ? -20 : 20,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      skewX: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 90 : -90,
      skewX: direction < 0 ? -20 : 20,
    }),
  };

  return (
    <div className="relative aspect-square overflow-hidden bg-[#f8fafc] group perspective-1000">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={index}
          src={slideImages[index]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 200, damping: 25 },
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 },
            rotateY: { duration: 0.6, ease: "circOut" },
            skewX: { duration: 0.6 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.4}
          onDragEnd={(_, info) => {
            if (info.offset.x > 70) prevStep();
            else if (info.offset.x < -70) nextStep();
          }}
          className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
        />
      </AnimatePresence>

      {slideImages.length > 1 && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); prevStep(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-xl p-4 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90 border border-slate-100"
          >
            <ChevronLeft size={20} className="text-slate-900" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); nextStep(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-xl p-4 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90 border border-slate-100"
          >
            <ChevronRight size={20} className="text-slate-900" />
          </button>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slideImages.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-700 ${i === index ? 'w-8 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'w-2 bg-slate-300'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
