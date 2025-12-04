import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  selectedColor: string;
  isDark?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, selectedColor, isDark }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onImageSelected(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelected('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div 
      className={"w-full h-32 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group " + 
        (isDark ? 'border-slate-700 bg-slate-900/50 hover:bg-slate-800' : 'border-slate-300 bg-white/50 hover:bg-white/80')}
      style={{ borderColor: preview ? selectedColor : undefined }}
      onClick={triggerSelect}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      {preview ? (
        <>
          <img src={preview} alt="Upload preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          <button 
            onClick={clearImage}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <div className="absolute bottom-0 w-full bg-black/60 text-white text-[10px] py-1 text-center font-bold uppercase tracking-widest">
            Image Loaded
          </div>
        </>
      ) : (
        <div className="text-center p-4">
          <div className={"mb-2 mx-auto w-8 h-8 rounded-full flex items-center justify-center " + (isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-500')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          </div>
          <p className={"text-xs font-bold uppercase tracking-wider " + (isDark ? 'text-slate-400' : 'text-slate-600')}>
            Upload Character Ref
          </p>
          <p className={"text-[10px] mt-1 " + (isDark ? 'text-slate-600' : 'text-slate-400')}>
            Drag & drop or click
          </p>
        </div>
      )}
    </div>
  );
};
export default ImageUploader;
