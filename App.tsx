import React, { useState, useCallback } from 'react';
import BlindBox from './components/BlindBox';
import ResultView from './components/ResultView';
import ColorPicker from './components/ColorPicker';
import ImageUploader from './components/ImageUploader';
import CustomCursor from './components/CustomCursor';
import { analyzeImageForPrompt } from './services/geminiService';
import { Collectible, ToyStyle, BoxPattern } from './types';

const EntranceOverlay: React.FC<{ onEnter: () => void; color: string }> = ({ onEnter, color }) => {
  const [fading, setFading] = useState(false);
  const handleClick = () => {
    setFading(true);
    setTimeout(onEnter, 800);
  };
  return (
    <div 
      className={"fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-all duration-1000 ease-in-out cursor-pointer " + 
        (fading ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100')}
      onClick={handleClick}
    >
      <div className="relative animate-[float_4s_ease-in-out_infinite] mb-6">
        <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-2xl bg-gradient-to-tr from-pink-100 to-white border-4 border-white">
            <span className="text-6xl font-calligraphy text-slate-800" style={{ color: color }}>福</span>
        </div>
      </div>
      <h1 className="text-4xl font-serif font-bold text-slate-800 tracking-tight">Fuku Blind Box</h1>
      <p className="mt-4 text-xs font-bold tracking-[0.3em] text-slate-400 uppercase">Click to Enter</p>
    </div>
  );
};

const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [gameState, setGameState] = useState<'idle' | 'shaking' | 'opening' | 'revealed'>('idle');
  const [revealedItem, setRevealedItem] = useState<Collectible | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'image'>('text');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('#ff4d88'); 
  const [selectedStyle, setSelectedStyle] = useState<ToyStyle>('ichiki'); 
  const [selectedPattern, setSelectedPattern] = useState<BoxPattern>('solid');

  const STYLE_OPTIONS: { id: ToyStyle; label: string; icon: string }[] = [
    { id: 'ichiki', label: 'Fuku', icon: '⛩️' }, 
    { id: 'vinyl', label: 'Vinyl', icon: '🎨' },
    { id: 'plush', label: 'Plush', icon: '🧸' },
    { id: 'clay', label: 'Clay', icon: '🗿' },
    { id: 'crystal', label: 'Gem', icon: '💎' },
    { id: 'gold', label: 'Gold', icon: '👑' },
    { id: 'cyber', label: 'Cyber', icon: '🤖' },
    { id: 'voxel', label: 'Voxel', icon: '🧊' },
  ];

  const handleOpenBox = useCallback(async () => {
    if (gameState !== 'idle' || isAnalyzing) return;
    setIsAnalyzing(true);
    setGameState('shaking'); 
    let effectivePrompt = "A cute collectible";
    if (inputMode === 'image' && uploadedImage) {
      try {
        effectivePrompt = await analyzeImageForPrompt(uploadedImage);
      } catch (e) {
        effectivePrompt = "A mysterious artifact";
      }
    } else {
      effectivePrompt = customPrompt.trim() || "A cute Japanese style blind box toy";
    }
    const customItem: Collectible = {
      id: "custom-" + Date.now(),
      name: 'Custom Creation', 
      theme: selectedColor,
      prompt: effectivePrompt,
      style: selectedStyle, 
      pattern: selectedPattern, 
      fallbackImage: 'https://picsum.photos/600/800', 
      brand: 'Custom',
      isCustom: true,
      originalImage: inputMode === 'image' ? uploadedImage : undefined
    };
    setRevealedItem(customItem);
    setTimeout(() => {
        setIsAnalyzing(false);
        setGameState('opening');
        setTimeout(() => {
          setGameState('revealed');
        }, 2000); 
    }, 2000); 
  }, [gameState, isAnalyzing, inputMode, uploadedImage, customPrompt, selectedColor, selectedStyle, selectedPattern]);

  const handleReset = () => {
    setGameState('idle');
    setRevealedItem(null);
    setCustomPrompt('');
    setUploadedImage('');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden font-sans transition-colors duration-500 bg-sakura-50">
      <CustomCursor color={selectedColor} />
      {!hasEntered && <EntranceOverlay onEnter={() => setHasEntered(true)} color={selectedColor} />}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-pink-200 rounded-full blur-[120px] opacity-40"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px] opacity-40"></div>
      </div>
      <main className={"relative z-10 flex-grow flex flex-col items-center justify-center transition-all duration-1000 " + (hasEntered ? 'opacity-100' : 'opacity-0')}>
        <header className="absolute top-8 left-0 w-full text-center z-20">
            <h1 className="text-3xl font-serif font-bold text-slate-800">Sakura Blind Box</h1>
            <p className="text-[10px] tracking-widest uppercase text-slate-400 mt-2">Design • Shake • Reveal</p>
        </header>
        {gameState === 'idle' && (
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8 h-full min-h-[600px]">
            <div className="space-y-6 animate-[fadeIn_0.8s_ease-out]">
                <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-sm">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 block">Select Style</label>
                    <div className="grid grid-cols-4 gap-3">
                        {STYLE_OPTIONS.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => setSelectedStyle(style.id)}
                            className={"flex flex-col items-center justify-center p-3 rounded-xl transition-all " + (selectedStyle === style.id ? 'bg-white shadow-md scale-105' : 'hover:bg-white/50')}
                            style={{ color: selectedStyle === style.id ? selectedColor : '#64748b' }}
                          >
                            <span className="text-2xl mb-1">{style.icon}</span>
                            <span className="text-[9px] font-bold uppercase">{style.label}</span>
                          </button>
                        ))}
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-sm">
                   <div className="flex gap-4 mb-4">
                      <button onClick={() => setInputMode('text')} className={"text-xs font-bold uppercase pb-1 border-b-2 transition-colors " + (inputMode === 'text' ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-400')}>Text</button>
                      <button onClick={() => setInputMode('image')} className={"text-xs font-bold uppercase pb-1 border-b-2 transition-colors " + (inputMode === 'image' ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-400')}>Image</button>
                   </div>
                   {inputMode === 'text' ? (
                      <textarea 
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="Describe your dream toy..."
                        className="w-full h-20 bg-transparent border-b border-slate-200 resize-none focus:outline-none focus:border-pink-400 text-sm p-2"
                      />
                   ) : (
                      <ImageUploader onImageSelected={setUploadedImage} selectedColor={selectedColor} />
                   )}
                </div>
                <div className="flex items-center gap-4">
                    <ColorPicker selectedColor={selectedColor} onSelect={setSelectedColor} />
                    <button 
                      onClick={handleOpenBox}
                      className="flex-grow h-14 rounded-2xl text-white font-bold uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                      style={{ backgroundColor: selectedColor }}
                    >
                      Open Box
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-center h-[500px]">
                <BlindBox 
                  onOpen={handleOpenBox} 
                  isOpen={false} 
                  isShaking={false} 
                  color={selectedColor}
                  pattern={selectedPattern}
                  style={selectedStyle} 
                />
            </div>
          </div>
        )}
        {(gameState === 'shaking' || gameState === 'opening') && (
           <div className="flex flex-col items-center justify-center h-screen w-full fixed inset-0 z-30 pointer-events-none">
              <div className="scale-125">
                <BlindBox 
                  onOpen={() => {}} 
                  isOpen={gameState === 'opening'} 
                  isShaking={gameState === 'shaking'} 
                  color={selectedColor}
                  pattern={selectedPattern}
                  style={selectedStyle}
                />
              </div>
              {gameState === 'shaking' && (
                 <div className="mt-40 text-sm font-bold tracking-widest uppercase text-slate-500 animate-pulse">
                    Generating Magic...
                 </div>
              )}
           </div>
        )}
        {gameState === 'revealed' && revealedItem && (
          <div className="fixed inset-0 z-40 bg-sakura-50/90 backdrop-blur-sm overflow-y-auto">
             <div className="min-h-screen flex items-center justify-center p-4">
                <ResultView collectible={revealedItem} onReset={handleReset} />
             </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default App;
