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
    headerFont: "'Montserrat', sans-serif",
    bodyFont: "'Cormorant Garamond', serif",
    accentColor: '#71717a',
    textColor: '#000000',
    backgroundColor: '#ffffff',
    borderColor: '#e5e5e5',
    dividerStyle: 'none',
    description: 'Clean centered typography based on the Canva food menu. High-contrast bold headers with soft italic translation subtitles.',
    styles: {
      '--menu-header-font': "'Montserrat', sans-serif",
      '--menu-body-font': "'Cormorant Garamond', serif",
      '--menu-accent': '#555555',
      '--menu-text': '#111111',
      '--menu-bg': '#ffffff',
      '--menu-border': '#ffffff',
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
    headerFont: "'Montserrat', sans-serif",
    bodyFont: "'Montserrat', sans-serif",
    accentColor: '#71717a',
    textColor: '#000000',
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
    dividerStyle: 'none',
    description: 'Modern sans-serif typography with clean spacing and left/right alignment. Directly based on the Canva drinks menu.',
    styles: {
      '--menu-header-font': "'Montserrat', sans-serif",
      '--menu-body-font': "'Montserrat', sans-serif",
      '--menu-accent': '#6b7280',
      '--menu-text': '#111111',
      '--menu-bg': '#ffffff',
      '--menu-border': '#ffffff',
      '--menu-category-transform': 'none',
      '--menu-category-weight': '800',
      '--menu-item-name-weight': '700',
      '--menu-divider-height': '0px',
      '--menu-align': 'left'
    }
  },
  {
    id: 'elegant',
    name: 'Elegant Bistro',
    headerFont: "'Playfair Display', serif",
    bodyFont: "'Cormorant Garamond', serif",
    accentColor: '#c5a880', // Soft Gold
    textColor: '#1a1a1a',
    backgroundColor: '#fcfbfa',
    borderColor: '#e0d8cc',
    dividerStyle: 'ornament',
    description: 'Sophisticated typography, gold accents, and classic serif elegance. Perfect for upscale restaurants.',
    styles: {
      '--menu-header-font': "'Playfair Display', serif",
      '--menu-body-font': "'Cormorant Garamond', serif",
      '--menu-accent': '#c5a880',
      '--menu-text': '#1a1a1a',
      '--menu-bg': '#fcfbfa',
      '--menu-border': '#e0d8cc',
      '--menu-category-transform': 'uppercase',
      '--menu-category-weight': '700',
      '--menu-item-name-weight': '600',
      '--menu-divider-height': '1px',
      '--menu-align': 'left'
    }
  },
  {
    id: 'modern',
    name: 'Modern Cafe',
    headerFont: "'Montserrat', sans-serif",
    bodyFont: "'Inter', sans-serif",
    accentColor: '#e05a36', // Warm terracotta
    textColor: '#222222',
    backgroundColor: '#fafafa',
    borderColor: '#eaeaea',
    dividerStyle: 'line',
    description: 'Clean geometry, strong sans-serif headers, and generous white space. Great for modern brunch spots and cafes.',
    styles: {
      '--menu-header-font': "'Montserrat', sans-serif",
      '--menu-body-font': "'Inter', sans-serif",
      '--menu-accent': '#e05a36',
      '--menu-text': '#2c2c2c',
      '--menu-bg': '#ffffff',
      '--menu-border': '#eaeaea',
      '--menu-category-transform': 'uppercase',
      '--menu-category-weight': '800',
      '--menu-item-name-weight': '700',
      '--menu-divider-height': '2px',
      '--menu-align': 'left'
    }
  },
  {
    id: 'chalkboard',
    name: 'Dark Chalkboard',
    headerFont: "'Montserrat', sans-serif",
    bodyFont: "'Inter', sans-serif",
    accentColor: '#facc15', // Chalk Yellow
    textColor: '#ffffff',
    backgroundColor: '#18181b', // Slate black
    borderColor: '#3f3f46',
    dividerStyle: 'dashed',
    description: 'High-contrast dark theme reminiscent of bistro blackboards. Popular for burger bars, craft beer spots, and pizzerias.',
    styles: {
      '--menu-header-font': "'Montserrat', sans-serif",
      '--menu-body-font': "'Inter', sans-serif",
      '--menu-accent': '#facc15',
      '--menu-text': '#f4f4f5',
      '--menu-bg': '#1e1e24',
      '--menu-border': '#3e3e4a',
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
