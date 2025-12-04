import React, { useEffect, useState } from 'react';
import { Collectible, GeneratedLore } from '../types';
import { generateCollectibleMetadata, generateCollectibleImage } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultViewProps {
  collectible: Collectible;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ collectible, onReset }) => {
  const [lore, setLore] = useState<GeneratedLore | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loadingLore, setLoadingLore] = useState(true);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchMetadata = async () => {
      setLoadingLore(true);
      const promptToUse = collectible.prompt || collectible.name;
      const data = await generateCollectibleMetadata(promptToUse);
      if (isMounted) {
        setLore(data);
        setLoadingLore(false);
      }
    };
    const fetchImage = async () => {
      setLoadingImage(true);
      const imageBase64 = await generateCollectibleImage(collectible.prompt, collectible.style);
      if (isMounted) {
        setGeneratedImage(imageBase64);
        setLoadingImage(false);
      }
    };
    fetchMetadata();
    fetchImage();
    return () => { isMounted = false; };
  }, [collectible]);

  const themeColor = collectible.theme.startsWith('#') ? collectible.theme : '#f472b6';
  const chartData = lore ? [
    { name: 'Innovation', value: lore.stats.innovation }, 
    { name: 'Security', value: lore.stats.security }, 
    { name: 'Community', value: lore.stats.community }, 
  ] : [];

  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto p-4 animate-card-reveal">
      <div className="bg-white/90 backdrop-blur-xl border border-white rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col md:flex-row min-h-[600px]">
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(to bottom, " + themeColor + "22, white)" }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, " + themeColor + "44, transparent)" }}></div>
          <div className="relative w-64 h-80 sm:w-72 sm:h-96 animate-float z-10 perspective-1000">
             <div className="w-full h-full relative preserve-3d transition-transform duration-500 hover:rotate-y-12 hover:rotate-x-6 cursor-pointer">
                <div className="absolute inset-0 rounded-2xl bg-white shadow-2xl overflow-hidden border-[6px] border-white">
                   {loadingImage ? (
                     <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center animate-pulse bg-slate-50">
                        <div className="w-12 h-12 border-4 rounded-full animate-spin mb-4" style={{ borderColor: themeColor, borderTopColor: 'transparent' }}></div>
                        <p className="font-bold text-sm tracking-widest uppercase text-slate-400">Minting {collectible.style}...</p>
                     </div>
                   ) : (
                     <img 
                        src={generatedImage || collectible.fallbackImage} 
                        alt={collectible.name} 
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => { (e.target as HTMLImageElement).src = collectible.fallbackImage; }}
                     />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"></div>
                </div>
             </div>
             <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-8 blur-xl rounded-full" style={{ backgroundColor: themeColor, opacity: 0.3 }}></div>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-white/50">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <span 
                 className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border"
                 style={{ backgroundColor: themeColor + "22", color: themeColor, borderColor: themeColor + "44" }}
               >
                 {loadingLore ? 'ANALYZING...' : lore?.rarity || 'RARE'}
               </span>
               <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">{collectible.style.toUpperCase()} SERIES</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-800 mb-4 leading-tight">
              {loadingLore ? (collectible.name === 'Custom Creation' ? 'Identifying...' : collectible.name) : (lore?.name || collectible.name)}
            </h1>
            <div className="min-h-[80px] relative">
               {loadingLore ? (
                  <div className="space-y-2 opacity-50">
                     <div className="h-2 bg-slate-200 rounded w-full animate-pulse"></div>
                     <div className="h-2 bg-slate-200 rounded w-5/6 animate-pulse"></div>
                     <div className="h-2 bg-slate-200 rounded w-4/6 animate-pulse"></div>
                  </div>
               ) : (
                 <p className="text-slate-600 text-sm leading-relaxed font-medium">
                   {lore?.description}
                 </p>
               )}
            </div>
          </div>
          <div className="mt-8 flex-grow">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Ability Stats</h3>
            <div className="h-40 w-full">
              {loadingLore ? (
                 <div className="w-full h-full bg-slate-50 rounded-lg animate-pulse"></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600, fontFamily: 'Quicksand' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', fontFamily: 'Quicksand' }} itemStyle={{ color: '#334155', fontSize: '12px', fontWeight: 600 }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12} background={{ fill: '#f1f5f9' }}>
                      <Cell fill={themeColor} />
                      <Cell fill={themeColor} fillOpacity={0.8} />
                      <Cell fill={themeColor} fillOpacity={0.6} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          <div className="mt-8 pt-6">
            <button 
              onClick={onReset}
              className="w-full py-4 text-white font-bold tracking-widest rounded-xl shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0"
              style={{ backgroundColor: themeColor }}
            >
              DESIGN ANOTHER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResultView;
