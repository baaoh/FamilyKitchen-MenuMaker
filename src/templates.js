export const PAGE_SIZES = [
  { id: 'a4', name: 'A4 Portrait', width: '210mm', height: '297mm', ratio: 0.707 },
  { id: 'a5', name: 'A5 Portrait', width: '148mm', height: '210mm', ratio: 0.705 },
  { id: 'square', name: 'Square', width: '200mm', height: '200mm', ratio: 1.0 },
  { id: 'split-a4', name: 'Split A4 (Slim)', width: '105mm', height: '297mm', ratio: 0.353 }
];

export const PRESET_THEMES = [
  {
    id: 'centered-zen',
    name: 'Zen Centered (Food)',
    headerFont: "'Open Sans', sans-serif",
    bodyFont: "'Open Sans', sans-serif",
    accentColor: '#10b981', // Emerald Green
    textColor: '#111111', // Black/Charcoal
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db', // Grey
    dividerStyle: 'none',
    description: 'Clean centered typography utilizing Open Sans. High-contrast centered titles in black, grey subtitles, and emerald accents.',
    styles: {
      '--menu-header-font': "'Open Sans', sans-serif",
      '--menu-body-font': "'Open Sans', sans-serif",
      '--menu-accent': '#10b981', // Emerald Green
      '--menu-text': '#111111',
      '--menu-bg': '#ffffff',
      '--menu-border': '#d1d5db',
      '--menu-category-transform': 'none',
      '--menu-category-weight': '700',
      '--menu-item-name-weight': '700',
      '--menu-divider-height': '0px',
      '--menu-align': 'center'
    }
  },
  {
    id: 'modern-drinks',
    name: 'Canva Drinks Layout',
    headerFont: "'Open Sans', sans-serif",
    bodyFont: "'Open Sans', sans-serif",
    accentColor: '#10b981', // Emerald Green
    textColor: '#111111',
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
    dividerStyle: 'none',
    description: 'Modern left/right alignment utilizing Open Sans. Sleek, clean drinks layout in black, grey, and emerald green.',
    styles: {
      '--menu-header-font': "'Open Sans', sans-serif",
      '--menu-body-font': "'Open Sans', sans-serif",
      '--menu-accent': '#10b981',
      '--menu-text': '#111111',
      '--menu-bg': '#ffffff',
      '--menu-border': '#e5e7eb',
      '--menu-category-transform': 'none',
      '--menu-category-weight': '800',
      '--menu-item-name-weight': '700',
      '--menu-divider-height': '0px',
      '--menu-align': 'left'
    }
  },
  {
    id: 'emerald-elegant',
    name: 'Emerald Bistro',
    headerFont: "'Open Sans', sans-serif",
    bodyFont: "'Open Sans', sans-serif",
    accentColor: '#059669', // Deep Emerald
    textColor: '#1a1a1a',
    backgroundColor: '#f9fafb', // Soft Light Grey
    borderColor: '#e5e7eb',
    dividerStyle: 'ornament',
    description: 'Elegant serif-free bistro preset using Open Sans, deep emerald highlights, and clean double borders.',
    styles: {
      '--menu-header-font': "'Open Sans', sans-serif",
      '--menu-body-font': "'Open Sans', sans-serif",
      '--menu-accent': '#059669',
      '--menu-text': '#111111',
      '--menu-bg': '#f9fafb',
      '--menu-border': '#d1d5db',
      '--menu-category-transform': 'uppercase',
      '--menu-category-weight': '700',
      '--menu-item-name-weight': '600',
      '--menu-divider-height': '1px',
      '--menu-align': 'left'
    }
  },
  {
    id: 'emerald-dark',
    name: 'Emerald Slate (Dark)',
    headerFont: "'Open Sans', sans-serif",
    bodyFont: "'Open Sans', sans-serif",
    accentColor: '#10b981', // Glowing Emerald
    textColor: '#f4f4f5',
    backgroundColor: '#18181b', // Slate black
    borderColor: '#3f3f46',
    dividerStyle: 'dashed',
    description: 'High-contrast dark menu utilizing Open Sans with glowing emerald green details.',
    styles: {
      '--menu-header-font': "'Open Sans', sans-serif",
      '--menu-body-font': "'Open Sans', sans-serif",
      '--menu-accent': '#10b981',
      '--menu-text': '#f4f4f5',
      '--menu-bg': '#18181b',
      '--menu-border': '#3f3f46',
      '--menu-category-transform': 'uppercase',
      '--menu-category-weight': '700',
      '--menu-item-name-weight': '600',
      '--menu-divider-height': '1px',
      '--menu-align': 'left'
    }
  }
];

export const INITIAL_MENU_DATA = {
  restaurantName: "Family Kitchen",
  subtitle: "Nápojový Lístek • Drinks Menu",
  footer: "Ceny jsou uvedeny v CZK. / Prices are in CZK.",
  categories: [
    {
      id: 'cat-1',
      name: 'Nealko / Soft Drinks',
      description: '',
      items: [
        {
          id: 'item-1-1',
          name: 'Coca cola | Cola zero | Fanta | Sprite 330 ml (Plech)',
          description: 'Coca cola | Cola zero | Fanta | Sprite 330 ml (Can)',
          price: '55',
          badge: '',
          isAvailable: true
        },
        {
          id: 'item-1-2',
          name: 'Karafa Perlivá | Neperlivá 0,7l',
          description: 'Carafe Sparkling | Still 0.7l',
          price: '65',
          badge: '',
          isAvailable: true
        },
        {
          id: 'item-1-3',
          name: 'Jablečný džus | Jahodový džus',
          description: 'Apple Juice | Strawberry Juice',
          price: '65',
          badge: '',
          isAvailable: true
        },
        {
          id: 'item-1-4',
          name: 'Fever Tree Tonic / Ginger Beer',
          description: 'Premium tonics and ginger beer selection',
          price: '85',
          badge: '',
          isAvailable: true
        }
      ]
    },
    {
      id: 'cat-2',
      name: 'Limonády / Lemonades',
      description: '',
      items: [
        {
          id: 'item-2-1',
          name: 'Mango Passion',
          description: 'Mango, Passion Fruit, Soda',
          price: '105',
          badge: 'House',
          isAvailable: true
        },
        {
          id: 'item-2-2',
          name: 'Berry Yuzu',
          description: 'Yuzu, Raspberry Fruit, Soda',
          price: '105',
          badge: 'Popular',
          isAvailable: true
        },
        {
          id: 'item-2-3',
          name: 'Candy Rosé',
          description: 'Rose Syrup, Passion Fruit, Lime, Soda',
          price: '110',
          badge: '',
          isAvailable: true
        }
      ]
    },
    {
      id: 'cat-3',
      name: 'Koktejly / Cocktails',
      description: '',
      items: [
        {
          id: 'item-3-1',
          name: 'Espresso Martini',
          description: 'Absolut Vodka, Espresso, Kahlua',
          price: '185',
          badge: 'Classic',
          isAvailable: true
        },
        {
          id: 'item-3-2',
          name: 'Aperol Spritz',
          description: 'Aperol, Prosecco, Soda',
          price: '145',
          badge: '',
          isAvailable: true
        },
        {
          id: 'item-3-3',
          name: 'Moscow Mule',
          description: 'Absolut Vodka, Ginger Beer, Lime Juice',
          price: '160',
          badge: '',
          isAvailable: true
        }
      ]
    }
  ]
};
