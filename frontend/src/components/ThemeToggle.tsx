import { useEffect, useRef } from 'react';
import { useThemeStore } from '../store/themeStore';
import gsap from 'gsap';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const centerCircleRef = useRef<SVGCircleElement>(null);
  const maskCircleRef = useRef<SVGCircleElement>(null);
  const raysRef = useRef<SVGGElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const isDark = theme === 'dark';
    
    // Animate mask circle to cut out crescent shape
    gsap.to(maskCircleRef.current, {
      cx: isDark ? 18 : 30,
      cy: isDark ? 6 : 0,
      duration: 0.5,
      ease: 'power3.inOut'
    });

    // Animate sun center size to fit moon crescent representation
    gsap.to(centerCircleRef.current, {
      r: isDark ? 9 : 5.5,
      duration: 0.5,
      ease: 'power3.inOut'
    });

    // Animate sun rays fade and scale
    gsap.to(raysRef.current, {
      opacity: isDark ? 0 : 1,
      scale: isDark ? 0.5 : 1,
      transformOrigin: '50% 50%',
      duration: 0.4,
      ease: 'power3.out'
    });

    // Rotate SVG slightly during transition
    gsap.to(svgRef.current, {
      rotate: isDark ? 40 : 0,
      duration: 0.5,
      ease: 'power3.inOut'
    });
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 text-text-primary hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer relative overflow-hidden group shadow-lg"
    >
      <svg
        ref={svgRef}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5 text-primary group-hover:text-secondary transition-colors"
      >
        <mask id="theme-toggle-mask">
          <rect width="24" height="24" fill="white" />
          <circle ref={maskCircleRef} cx="30" cy="0" r="8" fill="black" />
        </mask>
        
        {/* Main Sun/Moon body */}
        <circle
          ref={centerCircleRef}
          cx="12"
          cy="12"
          r="5.5"
          fill="currentColor"
          mask="url(#theme-toggle-mask)"
        />

        {/* Sun rays */}
        <g ref={raysRef} stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="1.5" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="22.5" />
          <line x1="4.5" y1="4.5" x2="5.5" y2="5.5" />
          <line x1="18.5" y1="18.5" x2="19.5" y2="19.5" />
          <line x1="1.5" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="22.5" y2="12" />
          <line x1="4.5" y1="19.5" x2="5.5" y2="18.5" />
          <line x1="18.5" y1="5.5" x2="19.5" y2="4.5" />
        </g>
      </svg>
    </button>
  );
}
