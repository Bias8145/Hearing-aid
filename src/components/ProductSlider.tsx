import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Hand, Maximize2 } from 'lucide-react';

interface ProductSliderProps {
  images: string[];
}

export const ProductSlider = ({ images }: ProductSliderProps) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

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

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-950 group">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.img
          key={index}
          src={slideImages[index]}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 }
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

      {/* Swipe Hint - More Professional Editorial Style */}
      <AnimatePresence>
        {showHint && slideImages.length > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none bg-slate-900/20 backdrop-blur-[2px]"
          >
            <div className="bg-white/95 dark:bg-slate-900/95 p-6 rounded-[2rem] shadow-2xl flex flex-col items-center gap-4 border border-slate-200 dark:border-slate-700">
              <motion.div
                animate={{ x: [-15, 15, -15] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <Hand className="text-blue-600 w-7 h-7" />
              </motion.div>
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Geser Foto</p>
                <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Swipe to Preview</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {slideImages.length > 1 && (
        <>
          <div className="absolute inset-y-0 left-0 w-16 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
            <button 
              onClick={(e) => { e.stopPropagation(); prevStep(); }}
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl hover:bg-blue-600 hover:text-white transition-all -translate-x-4 group-hover:translate-x-4"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 w-16 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
            <button 
              onClick={(e) => { e.stopPropagation(); nextStep(); }}
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl hover:bg-blue-600 hover:text-white transition-all translate-x-4 group-hover:-translate-x-4"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
            {slideImages.map((_, i) => (
              <button 
                key={i} 
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-700 ${i === index ? 'w-8 bg-blue-600 shadow-lg shadow-blue-600/30' : 'w-2 bg-slate-300 dark:bg-slate-700'}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute top-6 right-6 z-20 flex gap-2">
        <div className="bg-slate-900/30 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white border border-white/20">
          {index + 1} / {slideImages.length}
        </div>
      </div>
    </div>
  );
};
