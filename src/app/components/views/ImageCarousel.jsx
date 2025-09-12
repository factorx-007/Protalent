import React, { useState, useEffect } from 'react';

export default function ImageCarousel({ images }) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prevCurrent) => (prevCurrent + 1) % images.length);

  useEffect(() => {
    const intervalId = setInterval(() => {
      next();
    }, 3000); // Cambia cada 3 segundos

    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar
  }, [images.length]); // Se ejecuta cuando la longitud de las imágenes cambia

  return (
    <div className="relative w-full h-160 rounded-xl overflow-hidden shadow-2xl bg-white transition-all duration-300 hover:shadow-3xl">
      <img 
        src={images[current].src} 
        alt={images[current].alt} 
        className="w-full h-full object-contain transition-transform duration-500 hover:scale-102"
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
        {images.map((_, idx) => (
          <span 
            key={idx} 
            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer hover:scale-125 ${
              idx === current ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
            }`}
            onClick={() => setCurrent(idx)}
          ></span>
        ))}
      </div>
    </div>
  );
} 