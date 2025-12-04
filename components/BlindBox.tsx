import React, { useState, useRef, useEffect } from 'react';
import { BoxPattern, ToyStyle } from '../types';

interface BlindBoxProps {
  onOpen: () => void;
  isOpen: boolean;
  isShaking: boolean;
  color: string;
  pattern?: BoxPattern;
  style?: ToyStyle;
}

const BlindBox: React.FC<BlindBoxProps> = ({ onOpen, isOpen, isShaking, color }) => {
  const [rotation, setRotation] = useState({ x: -15, y: 25 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const startRotation = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isOpen) return;
    setIsDragging(true);
    hasMoved.current = false;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    startRotation.current = { ...rotation };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isOpen) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved.current = true;
    setRotation({
      x: Math.max(-60, Math.min(60, startRotation.current.x - dy * 0.5)),
      y: startRotation.current.y + dx * 0.5,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    if (!hasMoved.current && !isOpen) onOpen();
  };

  const boxSize = 240;
  const halfSize = boxSize / 2;

  const faceStyle: React.CSSProperties = {
    position: 'absolute',
    width: boxSize,
    height: boxSize,
    background: "linear-gradient(135deg, " + color + " 0%, white 120%)",
    border: "2px solid rgba(255,255,255,0.8)",
    backfaceVisibility: 'visible',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: "inset 0 0 40px " + color + "88",
  };

  const innerFaceStyle: React.CSSProperties = {
    ...faceStyle,
    background: '#1a1a1a',
    border: 'none',
    boxShadow: 'inset 0 0 60px black',
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-2000">
      <div 
        className={"relative preserve-3d cursor-grab transition-transform duration-700 ease-out " + 
          (isOpen ? 'cursor-default ' : 'active:cursor-grabbing ') + 
          (isShaking ? 'animate-shake-3d ' : '') + 
          ((!isOpen && !isDragging && !isShaking) ? 'animate-float ' : '')}
        style={{
          width: boxSize,
          height: boxSize,
          transform: isOpen ? 'rotateX(10deg) rotateY(0deg) translateY(50px) scale(0.8)' : ("rotateX(" + rotation.x + "deg) rotateY(" + rotation.y + "deg)"),
          touchAction: 'none'
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div 
          className="absolute inset-0 preserve-3d transition-transform duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top"
          style={{ transform: isOpen ? 'translateY(-100px) rotateX(120deg)' : 'translateY(0) rotateX(0)' }}
        >
             <div style={{ ...faceStyle, transform: "rotateX(90deg) translateZ(" + halfSize + "px)" }}>
               <div className="bg-white/20 p-2 rounded-full border border-white/50">
                  <span className="text-3xl">🌸</span>
               </div>
             </div>
             <div style={{ ...innerFaceStyle, transform: "rotateX(90deg) translateZ(" + (halfSize - 2) + "px)" }}></div>
        </div>

        <div style={{ ...faceStyle, transform: "translateZ(" + halfSize + "px)" }}>
          <div className="flex flex-col items-center">
            <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-xl shadow-lg border-2 border-white">
               <h2 className="text-2xl font-bold font-serif tracking-widest text-slate-800">FUKU</h2>
               <div className="text-[10px] text-center uppercase tracking-[0.3em] mt-1 text-slate-500">Blind Box</div>
            </div>
            <div className="mt-4 text-white font-bold text-sm tracking-widest opacity-80 animate-pulse">
               {isOpen ? 'OPENED' : 'TAP TO OPEN'}
            </div>
          </div>
        </div>
        <div style={{ ...innerFaceStyle, transform: "translateZ(" + (halfSize - 1) + "px) rotateY(180deg)" }}></div>
        <div style={{ ...faceStyle, transform: "rotateY(180deg) translateZ(" + halfSize + "px)" }}>
           <div className="text-4xl opacity-50 font-calligraphy text-white">福</div>
        </div>
        <div style={{ ...innerFaceStyle, transform: "rotateY(180deg) translateZ(" + (halfSize - 1) + "px) rotateY(180deg)" }}></div>
        <div style={{ ...faceStyle, transform: "rotateY(-90deg) translateZ(" + halfSize + "px)" }}>
           <div className="absolute inset-x-0 h-4 bg-white/30 top-1/3"></div>
           <div className="absolute inset-x-0 h-4 bg-white/30 bottom-1/3"></div>
        </div>
        <div style={{ ...innerFaceStyle, transform: "rotateY(-90deg) translateZ(" + (halfSize - 1) + "px) rotateY(180deg)" }}></div>
        <div style={{ ...faceStyle, transform: "rotateY(90deg) translateZ(" + halfSize + "px)" }}>
          <div className="absolute inset-x-0 h-4 bg-white/30 top-1/3"></div>
          <div className="absolute inset-x-0 h-4 bg-white/30 bottom-1/3"></div>
        </div>
        <div style={{ ...innerFaceStyle, transform: "rotateY(90deg) translateZ(" + (halfSize - 1) + "px) rotateY(180deg)" }}></div>
        <div style={{ ...faceStyle, transform: "rotateX(-90deg) translateZ(" + halfSize + "px)", background: color }}></div>
        <div 
           className={"absolute top-1/2 left-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-1000 " + (isOpen ? 'opacity-100' : 'opacity-0')}
           style={{ background: color, transform: 'translateZ(0px)' }}
        ></div>
      </div>
      <div 
        className={"absolute bottom-[-80px] w-60 h-20 rounded-[100%] blur-xl bg-black/20 transition-all duration-500 " + 
          (isOpen ? 'scale-75 opacity-20 ' : 'scale-100 opacity-40 ') + 
          ((!isOpen && !isDragging) ? 'animate-pulse' : '')}
        style={{ transform: 'rotateX(90deg)' }}
      ></div>
    </div>
  );
};
export default BlindBox;
