export type ToyStyle = 'vinyl' | 'plush' | 'clay' | 'crystal' | 'gold' | 'cyber' | 'voxel' | 'ichiki';
export type BoxPattern = 'solid' | 'dots' | 'stripes' | 'grid';

export interface Collectible {
  id: string;
  name: string;
  theme: string; 
  pattern: BoxPattern;
  style: ToyStyle;
  prompt: string;
  fallbackImage: string;
  brand: string;
  isCustom?: boolean;
  originalImage?: string; 
}

export interface GeneratedLore {
  name?: string; 
  description: string;
  rarity: string;
  stats: {
    innovation: number;
    security: number;
    community: number;
  };
}
