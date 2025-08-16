import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import CyberpunkScene from './CyberpunkScene';
import GlitchText from './GlitchText';
import TerminalInterface from './TerminalInterface';
import CountdownTimer from './CountdownTimer';
import SocialLinks from './SocialLinks';
import DigitalRain from './DigitalRain';
import { playSound } from '../utils/audio';
import { Monitor, Zap, Users, Calendar, Info, Phone } from 'lucide-react';

import { useNavigate, Link } from 'react-router-dom';
const MotionLink = motion(Link);

const SponsorsWheel = lazy(() => import('./SponsorsWheel'));

interface CyberpunkLandingProps {
  // Callbacks removed in favor of router navigation; keep optional for backwards compatibility
  onSpeakersClick?: () => void;
  onAboutClick?: () => void; 
  onEventsClick?: () => void;
  onSponsorsClick?: () => void;
}

const CyberpunkLanding: React.FC<CyberpunkLandingProps> = ({ onSpeakersClick, onAboutClick, onEventsClick, onSponsorsClick }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [skipIntro, setSkipIntro] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [wheelY, setWheelY] = useState<number>(4.4);
  const [wheelBrightness, setWheelBrightness] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    // If user already saw the intro, skip animations and mark initialized immediately
    try {
      const seen = localStorage.getItem('elicit_seen_intro');
      if (seen) {
        setIsInitialized(true);
        setSkipIntro(true);
        return;
      }
    } catch (e) {
      // localStorage may be unavailable in some environments — fall back to normal behavior
    }

    const timer = setTimeout(() => {
      setIsInitialized(true);
      try { localStorage.setItem('elicit_seen_intro', '1'); } catch (e) {}
    }, 1000);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ // Directly use clientX and clientY for accurate cursor position
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleInfiltrate = () => {
    setShowTerminal(true);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Responsive styles for mobile/tablet */}
      <style>{`
        @media (max-width: 1024px) {
          .nav-buttons-desktop {
            display: none !important;
          }
          .hamburger-menu {
            display: block !important;
          }
        }
        @media (min-width: 1025px) {
          .hamburger-menu {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .main-corruption-heading-responsive {
            font-size: 1.2rem !important;
            margin-bottom: 2rem !important;
          }
          .countdown-timer-responsive {
            transform: scale(0.8);
            margin-top: 0.5rem;
          }
        }
        @media (max-width: 600px) {
          .main-corruption-heading-responsive {
            font-size: 1rem !important;
            margin-bottom: 1.2rem !important;
          }
          .countdown-timer-responsive {
            transform: scale(0.7);
            margin-top: 0.2rem;
          }
        }
      `}</style>
      {/* Custom Cursor
      <div 
        className="fixed w-2 h-2 bg-blue-500 rounded-full pointer-events-none transition-transform duration-[50ms] ease-linear will-change-transform"
        style={{
          left: mousePosition.x + 'px',
          top: mousePosition.y + 'px',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 20px #3b82f6, 0 0 40px #3b82f6, 0 0 60px #3b82f6, 0 0 80px #3b82f6',
          zIndex: 9999,
        }}
      /> */}

      {/* Digital Rain Background */}
      <DigitalRain />

  {/* Removed global framer-motion scanning line per request */}

      {/* 3D Scene */}
      <Canvas className="absolute inset-0">
        <PerspectiveCamera makeDefault position={[0, 10, 20]} fov={60} />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
        <CyberpunkScene mousePosition={mousePosition} />
  <Suspense fallback={null}>
          {/* Sponsors wheel: lazy-loaded 3D ring of sponsor logos */}
          <SponsorsWheel logos={[
            '/sponsors/cisco.png',
            '/sponsors/coding_blocks.jpg',
            '/sponsors/zebronics.jpg',
            '/sponsors/InterviewCake.png',
            '/sponsors/GeeksforGeeks.svg.png',
            '/sponsors/Lenovo.png',
            '/sponsors/ONGC_Logo.svg.png',
            '/sponsors/snapchat.webp',
            '/logos/3.png',
            '/logos/4.png',
          ]} radius={8.7} speed={0.1} y={3.9} brightness={0.1} />
        </Suspense>
      </Canvas>

      {/* Static Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-transparent via-white to-transparent animate-pulse mix-blend-overlay" />
      </div>

  {/* Sponsors wheel controls removed (was debug UI) */}

      {/* Main UI Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-8">
        {/* Top Bar */}
        <div className="flex justify-between items-start">
          {skipIntro ? (
            <div className="flex flex-col">
              <div className="flex items-center space-x-2 mb-2">
                <Monitor className="w-8 h-8 text-cyan-400" />
                <span className="text-cyan-400 font-mono text-lg tracking-wider">ELICIT FEST</span>
              </div>
              <div className="text-red-400 font-mono text-xs tracking-widest">
                NETWORK_STATUS: CORRUPTED
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Monitor className="w-8 h-8 text-cyan-400" />
                <span className="text-cyan-400 font-mono text-lg tracking-wider">ELICIT FEST</span>
              </div>
              <div className="text-red-400 font-mono text-xs tracking-widest">
                NETWORK_STATUS: CORRUPTED
              </div>
            </motion.div>
          )}

          <div className="countdown-timer-responsive">
            <CountdownTimer />
          </div>
        </div>

        <div className="min-h-screen flex flex-col items-center pt-12">
  {/* Hero Section */}
  <div className="text-center">
    {skipIntro ? (
      <>
        <GlitchText
          text="SYSTEM CORRUPTION DETECTED"
          className="main-corruption-heading-responsive text-2xl md:text-4xl lg:text-5xl font-mono font-bold text-[#00ff41] mb-16"
          style={{
            textShadow: `
              -1px -1px 0 #000,
              1px -1px 0 #000,
              -1px 1px 0 #000,
              1px 1px 0 #000,
              0 0 5px #00ff41,
              0 0 10px #00ff41,
              2px 0 5px #ff1a1a
            `,
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))',
          }}
        />

        <div className="mb-16">
          <img
            src="/logo.png"
            alt="ELICIT FEST Logo"
            className="mx-auto w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain"
            style={{
              filter: 'drop-shadow(0 0 20px #00ff41) drop-shadow(0 0 40px #ff0040)',
            }}
          />
        </div>

        <button
  className="relative w-[500px] mx-auto group"
  onClick={() => (window.location.href = "/CyberpunkEvents.tsx")}
>
  <img
    src="/Register/register.png"
    alt="Register Box"
    className="w-full h-auto"
    style={{
      filter:
        "drop-shadow(0px 0px 10px rgba(100, 236, 76, 0.82)) drop-shadow(0px 0px 20px rgba(165, 220, 141, 0.93)) drop-shadow(0px 0px 40px rgba(191, 234, 73, 0.88))",
      transition: "transform 0.3s ease",
    }}
  />
  <div className="absolute inset-0 flex items-center justify-center">
    <span className="md:text-4xl lg:text-5xl font-silkscreen-regular text-yellow-500 transition-transform duration-300 group-hover:scale-105">
      REGISTER
    </span>
  </div>
</button>


      </>
    ) : (
      <AnimatePresence>
        {isInitialized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <GlitchText
              text="SYSTEM CORRUPTION DETECTED"
              className="main-corruption-heading-responsive text-2xl md:text-4xl lg:text-5xl font-mono font-bold text-[#00ff41] mb-16"
              style={{
                textShadow: `
                  -1px -1px 0 #000,
                  1px -1px 0 #000,
                  -1px 1px 0 #000,
                  1px 1px 0 #000,
                  0 0 5px #00ff41,
                  0 0 10px #00ff41,
                  2px 0 5px #ff1a1a
                `,
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))',
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mb-16"
            >
              <img
                src="/logo.png"
                alt="ELICIT FEST Logo"
                className="mx-auto w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain"
                style={{
                  filter: 'drop-shadow(0 0 20px #00ff41) drop-shadow(0 0 40px #ff0040)',
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <GlitchText
                text="ELICIT FEST INITIATED..."
                className="text-4xl md:text-4xl lg:text-5xl font-mono font-bold text-green-400 mb-12"
                style={{
                  textShadow: `
                    -2px -2px 0 #000,
                    2px -2px 0 #000,
                    -2px 2px 0 #000,
                    2px 2px 0 #000,
                    0 0 10px #00ff41,
                    0 0 20px #00ff41,
                    0 0 30px #00ff41,
                    4px 4px 8px rgba(0,0,0,0.8)
                  `,
                  filter:
                    'drop-shadow(4px 4px 8px rgba(0,0,0,0.9)) drop-shadow(0 0 15px #00ff41)',
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )}
  </div>

  {/* Nav Icons Section */}
  <AnimatePresence>
    {isInitialized && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="nav-buttons-desktop flex gap-12 mt-0"
      >
        {[
          { icon: Calendar, label: 'EVENTS', color: 'border-cyan-400 text-cyan-400', glowColor: '#00ffff', to: '/events' },
          { icon: Users, label: 'SPEAKERS', color: 'border-lime-400 text-lime-400', glowColor: '#00ff41', to: '/speakers' },
          { icon: Info, label: 'ABOUT', color: 'border-purple-400 text-purple-400', glowColor: '#8b5cf6', to: '/about' },
          { icon: Phone, label: 'CONTACT', color: 'border-yellow-400 text-yellow-400', glowColor: '#fbbf24', to: '/contact' },
          { icon: Zap, label: 'SPONSORS', color: 'border-pink-400 text-pink-400', glowColor: '#f472b6', to: '/sponsors' },
          { icon: Monitor, label: 'REGISTER', color: 'border-red-400 text-red-400', glowColor: '#ff0040', to: '/register' },
        ].map((item, idx) => (
          <MotionLink
            key={item.label}
            to={item.to}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8 + idx * 0.1 }}
            onClick={() => {
              playSound('/audio/click.mp3');
              if (item.label === 'SPEAKERS' && onSpeakersClick) onSpeakersClick();
              if (item.label === 'ABOUT' && onAboutClick) onAboutClick();
              if (item.label === 'EVENTS' && onEventsClick) onEventsClick();
              if (item.label === 'SPONSORS' && onSponsorsClick) onSponsorsClick();
            }}
            className={`group relative w-32 h-32 ${item.color} bg-opacity-80 hover:bg-opacity-90 transition-all duration-300 font-mono text-xs tracking-wider overflow-hidden flex items-center justify-center`}
            style={{
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              boxShadow: `0 0 10px ${item.glowColor}40`,
              textDecoration: 'none',
            }}
          >
            <div className="absolute inset-0 opacity-30">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-full h-px bg-current"
                  style={{ top: `${20 + i * 20}%` }}
                  animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: idx * 0.3 + i * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-4 pointer-events-none">
              <div className="relative transform transition-transform duration-150 group-hover:scale-125">
                <item.icon className="w-11 h-11" />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    boxShadow: `0 0 15px ${item.glowColor}`,
                  }}
                />
              </div>
              <div className="pointer-events-none mt-10 text-[15px] leading-tight text-center duration-150 group-hover:scale-125">{item.label}</div>
            </div>
            <motion.div
              className="absolute inset-0 bg-current opacity-0 group-hover:opacity-10"
              animate={{ opacity: [0, 0.1, 0], scaleY: [1, 1.1, 1] }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
            />
          </MotionLink>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
</div>


        {/* Hamburger Icon for Mobile */}
        <div className="hamburger-menu" style={{position: 'absolute', top: 24, right: 24, display: 'none', zIndex: 100}}>
          <button
            aria-label="Open navigation menu"
            className="flex flex-col justify-center items-center w-12 h-12 bg-black bg-opacity-80 border-2 border-cyan-400 rounded-lg shadow-lg hover:bg-opacity-100 transition-all"
            onClick={() => setShowMobileMenu(v => !v)}
          >
            <span className="block w-7 h-1 bg-cyan-400 mb-1 rounded"></span>
            <span className="block w-7 h-1 bg-cyan-400 mb-1 rounded"></span>
            <span className="block w-7 h-1 bg-cyan-400 rounded"></span>
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        {showMobileMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-[200] flex flex-col items-end p-6 animate-fade-in">
            <button
              aria-label="Close navigation menu"
              className="mb-8 w-12 h-12 flex items-center justify-center bg-black border-2 border-cyan-400 rounded-lg relative"
              onClick={() => setShowMobileMenu(false)}
            >
              <span className="block w-7 h-1 bg-cyan-400 rotate-45 absolute"></span>
              <span className="block w-7 h-1 bg-cyan-400 -rotate-45 absolute"></span>
            </button>
            <div className="flex flex-col gap-6 w-full items-end">
              {[
                { icon: Calendar, label: 'EVENTS', color: 'text-cyan-400', to: '/events' },
                { icon: Users, label: 'SPEAKERS', color: 'text-lime-400', to: '/speakers' },
                { icon: Info, label: 'ABOUT', color: 'text-purple-400', to: '/about' },
                { icon: Phone, label: 'CONTACT', color: 'text-yellow-400', to: '/contact' },
                { icon: Zap, label: 'SPONSORS', color: 'text-pink-400', to: '/sponsors' },
                { icon: Monitor, label: 'REGISTER', color: 'text-red-400', to: '/register' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => {
                    playSound('/audio/click.mp3');
                    setShowMobileMenu(false);
                    if (item.label === 'SPEAKERS' && onSpeakersClick) onSpeakersClick();
                    if (item.label === 'ABOUT' && onAboutClick) onAboutClick();
                    if (item.label === 'EVENTS' && onEventsClick) onEventsClick();
                  }}
                  className={`flex items-center gap-3 px-6 py-3 rounded-lg bg-black bg-opacity-70 border-2 border-cyan-400 font-mono text-lg font-bold shadow-md hover:bg-opacity-100 transition-all ${item.color}`}
                  style={{ minWidth: 180, textDecoration: 'none' }}
                >
                  <div className="flex items-center gap-3 transform transition-transform duration-150 group-hover:scale-103 pointer-events-none">
                    <item.icon className="w-6 h-6" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}


        {/* Bottom Bar */}
        <div className="flex justify-between fixed bottom-0 w-full py-4 pr-10">
          <SocialLinks />
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8 }}
          >
            <button
              onClick={handleInfiltrate}
              className="group relative px-8 py-3 bg-red-500 text-black font-mono font-bold tracking-wider hover:bg-red-400 transition-all duration-300 hover:scale-105"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                boxShadow: '0 0 20px #ff0040',
              }}
            >
              <span className="relative z-10">&gt; INFILTRATE SYSTEM</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              
              {/* Pulsing border effect */}
              <motion.div
                className="absolute inset-0 border-2 border-red-400"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </button>
          </motion.div>
        </div>
      </div>

      {/* System Warnings */}

      {/* Terminal Interface */}
      <AnimatePresence>
        {showTerminal && (
          <TerminalInterface onClose={() => setShowTerminal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CyberpunkLanding;