import { Collectible } from './types';

export const COLLECTIBLES: Collectible[] = [
  {
    id: 'sakura-spirit',
    name: 'Sakura Spirit Fox',
    brand: 'Fuku Original',
    theme: '#ff80a6',
    style: 'ichiki',
    pattern: 'dots',
    fallbackImage: 'https://picsum.photos/id/102/600/800',
    prompt: 'A cute mystical kitsune (fox spirit) made of white porcelain with pink cherry blossom patterns painted on its fur. It wears a small red rope necklace with a golden bell. Soft lighting, high quality 3D render, minimalist japanese art toy style.'
  },
  {
    id: 'golden-koi',
    name: 'Golden Koi',
    brand: 'Fuku Original',
    theme: '#eab308',
    style: 'gold',
    pattern: 'grid',
    fallbackImage: 'https://picsum.photos/id/106/600/800',
    prompt: 'A stylized golden koi fish jumping out of a small water ripple. The fish is made of polished gold with intricate scales. It has tiny floating water droplets around it made of crystal. 3D blind box toy, luxury aesthetic.'
  },
  {
    id: 'matcha-daruma',
    name: 'Matcha Daruma',
    brand: 'Fuku Original',
    theme: '#16a34a',
    style: 'clay',
    pattern: 'solid',
    fallbackImage: 'https://picsum.photos/id/112/600/800',
    prompt: 'A cute round Daruma doll colored in matcha green tea colors. It has a determined expression but looks very chubby and soft. Texture looks like handmade clay or polymer. 3D miniature, soft focus.'
  },
  {
    id: 'fuji-san',
    name: 'Mt. Fuji & Sun',
    brand: 'Fuku Original',
    theme: '#3b82f6',
    style: 'vinyl',
    pattern: 'stripes',
    fallbackImage: 'https://picsum.photos/id/128/600/800',
    prompt: 'A cute anthropomorphic Mount Fuji character with a snowy cap, holding a small red sun. Smooth vinyl toy texture, pastel blue and white colors, simple face with a smile. Kidrobot style 3D render.'
  }
];

export const BOX_COLORS = {
  blue: 'bg-blue-600',
  yellow: 'bg-yellow-500',
  green: 'bg-emerald-500',
  purple: 'bg-purple-600',
};
