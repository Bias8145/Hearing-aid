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

  const waveVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45,
      perspective: 1000
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      perspective: 1000
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45,
      perspective: 1000
    }),
  };

  return (
    <div className="relative aspect-square overflow-hidden bg-[#f1f5f9] group perspective-1000">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.img
          key={index}
          src={slideImages[index]}
          custom={direction}
          variants={waveVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 200, damping: 25 },
            opacity: { duration: 0.3 },
            rotateY: { duration: 0.5, ease: "circOut" }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={(_, info) => {
            if (info.offset.x > 50) prevStep();
            else if (info.offset.x < -50) nextStep();
          }}
          className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
        />
      </AnimatePresence>

      {slideImages.length > 1 && (
        <>
          <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <button 
              onClick={(e) => { e.stopPropagation(); prevStep(); }}
              className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg hover:bg-white transition-all"
            >
              <ChevronLeft size={18} className="text-slate-900" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <button 
              onClick={(e) => { e.stopPropagation(); nextStep(); }}
              className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg hover:bg-white transition-all"
            >
              <ChevronRight size={18} className="text-slate-900" />
            </button>
          </div>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {slideImages.map((_, i) => (
              <button 
                key={i} 
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-300'}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute top-4 right-4 z-20">
        <div className="bg-slate-900/10 backdrop-blur-sm px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-500">
          {index + 1} / {slideImages.length}
        </div>
      </div>
    </div>
  );
};
