import React, { useEffect, useRef, useState } from 'react';

interface CustomCursorProps {
  color: string;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ color }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const cursorPos = useRef({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const FUKU_PINK = '#ff4d88'; 
  const CYBER_CYAN = '#00f3ff';

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
      const target = e.target as HTMLElement;
      const isClickable = target.tagName === 'BUTTON' || target.tagName === 'A' || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.closest('button') || target.closest('.cursor-pointer'); 
      setIsHovering(!!isClickable);
    };
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);
    let animationFrameId: number;
    const render = () => {
      const lerpFactor = 0.15;
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * lerpFactor;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * lerpFactor;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0)`;
      }
      if (ringRef.current) {
         const rotationSpeed = isHovering ? 5 : 2;
         const rotation = (mousePos.current.x - cursorPos.current.x) * rotationSpeed;
         ringRef.current.style.transform = `rotate(${rotation}deg)`;
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, isHovering]);

  return (
    <div 
      ref={cursorRef}
      className={"fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference transition-opacity duration-300 " + (isVisible ? 'opacity-100' : 'opacity-0')}
      style={{ marginLeft: '-24px', marginTop: '-24px' }}
    >
      <div className={"relative flex items-center justify-center w-12 h-12 transition-all duration-300 ease-out " + (isHovering ? 'scale-125' : 'scale-100')}>
        <div className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]"></div>
        <svg 
           width="48" height="48" viewBox="0 0 48 48" className="absolute inset-0 w-full h-full animate-cursor-flicker"
           style={{ filter: isHovering ? `drop-shadow(0 0 8px ${FUKU_PINK}) drop-shadow(0 0 15px ${CYBER_CYAN})` : `drop-shadow(0 0 5px ${color})` }}
        >
           <circle cx="24" cy="24" r="20" fill="none" stroke={CYBER_CYAN} strokeWidth="2" strokeDasharray="4 6" className={"origin-center transition-opacity duration-300 " + (isHovering ? 'opacity-100 animate-spin' : 'opacity-0')} style={{ animationDuration: '3s' }} />
           <circle ref={ringRef} cx="24" cy="24" r="20" fill="none" stroke={isHovering ? FUKU_PINK : color} strokeWidth={isHovering ? "3" : "2"} strokeDasharray={isHovering ? "10 2 10 2" : "1 4"} strokeLinecap="round" className="origin-center transition-all duration-300" />
        </svg>
      </div>
    </div>
  );
};
export default CustomCursor;
