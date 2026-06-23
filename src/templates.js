export const PAGE_SIZES = [
  { id: 'a4', name: 'A4 Portrait', width: '210mm', height: '297mm', ratio: 0.707 },
  { id: 'a5', name: 'A5 Portrait', width: '148mm', height: '210mm', ratio: 0.705 },
  { id: 'square', name: 'Square', width: '200mm', height: '200mm', ratio: 1.0 },
  { id: 'split-a4', name: 'Split A4 (Slim)', width: '105mm', height: '297mm', ratio: 0.353 }
];

export const PRESET_THEMES = [
  {
    id: 'elegant',
    name: 'Elegant Bistro',
    headerFont: "'Playfair Display', serif",
    bodyFont: "'Cormorant Garamond', serif",
    accentColor: '#c5a880', // Soft Gold
    textColor: '#1a1a1a',
    backgroundColor: '#ffffff',
    borderColor: '#e5e5e5',
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
      '--menu-divider-height': '1px'
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
      '--menu-divider-height': '2px'
    }
  },
  {
    id: 'rustic',
    name: 'Rustic Tavern',
    headerFont: "'Alex Brush', cursive",
    bodyFont: "'Cormorant Garamond', serif",
    accentColor: '#8c6239', // Dark wood
    textColor: '#2b261f',
    backgroundColor: '#f6f2eb', // Warm parchment
    borderColor: '#d9cdbc',
    dividerStyle: 'dots',
    description: 'Vintaged parchment-like aesthetic, script accents, and warm earthy tones. Ideal for pubs, pizzerias, and bakeries.',
    styles: {
      '--menu-header-font': "'Montserrat', sans-serif",
      '--menu-subheader-font': "'Alex Brush', cursive",
      '--menu-body-font': "'Cormorant Garamond', serif",
      '--menu-accent': '#8c6239',
      '--menu-text': '#2b261f',
      '--menu-bg': '#f7f3eb',
      '--menu-border': '#d3c5b3',
      '--menu-category-transform': 'capitalize',
      '--menu-category-weight': '600',
      '--menu-item-name-weight': '700',
      '--menu-divider-height': '1px'
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
      '--menu-divider-height': '1px'
    }
  }
];

export const INITIAL_MENU_DATA = {
  restaurantName: "L'Aura Bistro",
  subtitle: "Fresh • Organic • Seasonal",
  footer: "Please inform your server of any allergies. An optional 10% service charge will be added to your bill.",
  categories: [
    {
      id: 'cat-1',
      name: 'Starters',
      description: 'Light bites to begin your culinary journey',
      items: [
        {
          id: 'item-1-1',
          name: 'Truffle Burrata',
          description: 'Creamy burrata cheese, heirloom cherry tomatoes, wild arugula, truffle glaze, grilled sourdough.',
          price: '14.50',
          badge: 'Vegetarian',
          isAvailable: true
        },
        {
          id: 'item-1-2',
          name: 'Crispy Calamari',
          description: 'Flash-fried calamari rings, spiced sea salt, smoked garlic aioli, fresh lemon wedges.',
          price: '16.00',
          badge: 'Popular',
          isAvailable: true
        },
        {
          id: 'item-1-3',
          name: 'Roasted Tomato Soup',
          description: 'Slow-roasted vine tomatoes, fresh basil, extra virgin olive oil, herb croutons.',
          price: '9.00',
          badge: 'Vegan',
          isAvailable: true
        }
      ]
    },
    {
      id: 'cat-2',
      name: 'Main Courses',
      description: 'Hearty mains crafted with local ingredients',
      items: [
        {
          id: 'item-2-1',
          name: 'Pan-Seared Seabass',
          description: 'Wild caught seabass, saffron risotto, baby asparagus, citrus butter emulsion.',
          price: '29.00',
          badge: '',
          isAvailable: true
        },
        {
          id: 'item-2-2',
          name: 'Dry Aged Ribeye (300g)',
          description: '28-day dry aged grass-fed beef, rosemary roasted fingerling potatoes, charred broccolini, red wine jus.',
          price: '38.00',
          badge: 'Chef Special',
          isAvailable: true
        },
        {
          id: 'item-2-3',
          name: 'Wild Mushroom Gnocchi',
          description: 'Handmade potato gnocchi, chanterelle mushrooms, baby spinach, parmesan cream sauce.',
          price: '22.50',
          badge: 'Vegetarian',
          isAvailable: true
        }
      ]
    },
    {
      id: 'cat-3',
      name: 'Desserts & Drinks',
      description: 'A sweet finish or refreshing companion',
      items: [
        {
          id: 'item-3-1',
          name: 'Madagascar Vanilla Crème Brûlée',
          description: 'Classic caramelized sugar crust, mixed wild berries.',
          price: '9.50',
          badge: '',
          isAvailable: true
        },
        {
          id: 'item-3-2',
          name: 'Signature Espresso Martini',
          description: 'Single-origin espresso, premium vodka, coffee liqueur, home-made vanilla syrup.',
          price: '12.00',
          badge: 'Classic',
          isAvailable: true
        }
      ]
    }
  ]
};
