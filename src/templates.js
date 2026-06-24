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

export const INITIAL_DRINKS_MENU_DATA = {
  restaurantName: "Family Kitchen",
  subtitle: "Nápojový Lístek • Drinks Menu",
  footer: "Ceny jsou uvedeny v CZK. / Prices are in CZK.",
  categories: [
    {
      id: 'cat-d1',
      name: 'Nealko',
      enName: 'Soft Drinks',
      description: '',
      enDescription: '',
      pageIndex: 0,
      items: [
        { id: 'item-d1-1', name: 'Coca cola | Cola zero | Fanta | Sprite 330 ml (Plech)', enName: 'Coca cola | Cola zero | Fanta | Sprite 330 ml (Can)', description: '', enDescription: '', price: '55', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d1-2', name: 'Karafa Perlivá | Neperlivá 0,7l', enName: 'Carafe Sparkling | Still 0.7l', description: '', enDescription: '', price: '65', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d1-3', name: 'Jablečný džus | Jahodový džus', enName: 'Apple Juice | Strawberry Juice', description: '', enDescription: '', price: '65', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d1-4', name: 'Fever Tree Tonic', enName: 'Fever Tree Tonic', description: '', enDescription: '', price: '85', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d1-5', name: 'Fever Tree Ginger Beer', enName: 'Fever Tree Ginger Beer', description: '', enDescription: '', price: '85', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d1-6', name: 'Redbull', enName: 'Redbull', description: '', enDescription: '', price: '85', badge: '', allergens: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-d2',
      name: 'Limonády',
      enName: 'Lemonade',
      description: '',
      enDescription: '',
      pageIndex: 0,
      items: [
        { id: 'item-d2-1', name: 'Mango Passion', enName: 'Mango Passion', description: 'Mango, Passion Fruit, Soda', enDescription: 'Mango, Passion Fruit, Soda', price: '105', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d2-2', name: 'Berry Yuzu', enName: 'Berry Yuzu', description: 'Yuzu, Raspberry Fruit, Soda', enDescription: 'Yuzu, Raspberry Fruit, Soda', price: '105', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d2-3', name: 'Candy Rosé', enName: 'Candy Rosé', description: 'Rose Syrup, Passion Fruit, Lime, Soda', enDescription: 'Rose Syrup, Passion Fruit, Lime, Soda', price: '110', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d2-4', name: 'Apple Peach', enName: 'Apple Peach', description: 'Peach, Apple, Lime, Soda', enDescription: 'Peach, Apple, Lime, Soda', price: '105', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d2-5', name: 'Pink Lychee', enName: 'Pink Lychee', description: 'Lychee Syrup, Lime, Soda', enDescription: 'Lychee Syrup, Lime, Soda', price: '105', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d2-6', name: 'Ruby Cranberry', enName: 'Ruby Cranberry', description: 'Rose Syrup, Cranberry, Lime, Soda', enDescription: 'Rose Syrup, Cranberry, Lime, Soda', price: '105', badge: '', allergens: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-d3',
      name: 'Koktejly',
      enName: 'Cocktails',
      description: '',
      enDescription: '',
      pageIndex: 0,
      items: [
        { id: 'item-d3-1', name: 'Espresso Martini', enName: 'Espresso Martini', description: 'Absolut Vodka, Espresso, Kahlua', enDescription: 'Absolut Vodka, Espresso, Kahlua', price: '185', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d3-2', name: 'Aperol Spritz', enName: 'Aperol Spritz', description: 'Aperol, Prosecco, Soda', enDescription: 'Aperol, Prosecco, Soda', price: '145', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d3-3', name: 'White Lady', enName: 'White Lady', description: 'Bombay Gin, Cointreau, Lemon', enDescription: 'Bombay Gin, Cointreau, Lemon', price: '175', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d3-4', name: 'Strawberry clover club', enName: 'Strawberry clover club', description: 'Bombay Gin, Strawberry Syrup, Lemon Juice', enDescription: 'Bombay Gin, Strawberry Syrup, Lemon Juice', price: '175', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d3-5', name: 'Moscow Mule', enName: 'Moscow Mule', description: 'Absolut Vodka, Ginger Beer, Lime Juice', enDescription: 'Absolut Vodka, Ginger Beer, Lime Juice', price: '160', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d3-6', name: 'Scarlet Velvet', enName: 'Scarlet Velvet', description: 'Bombay Gin, Prosecco, Raspberry Syrup', enDescription: 'Bombay Gin, Prosecco, Raspberry Syrup', price: '155', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d3-7', name: 'Cuba Libre', enName: 'Cuba Libre', description: 'Havana Club, Coca Cola, Lime', enDescription: 'Havana Club, Coca Cola, Lime', price: '155', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d3-8', name: 'Mojito', enName: 'Mojito', description: 'Havana Club, Lime, Mint', enDescription: 'Havana Club, Lime, Mint', price: '145', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d3-9', name: 'Gin tonic', enName: 'Gin tonic', description: 'Bombay Gin, Fever Tree Tonic', enDescription: 'Bombay Gin, Fever Tree Tonic', price: '160', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d3-10', name: 'Negroni', enName: 'Negroni', description: 'Bombay Gin, Martini Rosso, Campari', enDescription: 'Bombay Gin, Martini Rosso, Campari', price: '175', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d3-11', name: 'Vodka RedBull', enName: 'Vodka RedBull', description: 'Absolut Vodka, Redbull', enDescription: 'Absolut Vodka, Redbull', price: '155', badge: '', allergens: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-d4',
      name: 'Family Signature',
      enName: 'Craft Selection',
      description: '',
      enDescription: '',
      pageIndex: 0,
      items: [
        { id: 'item-d4-1', name: 'Sakura Bloom Gin Tonic', enName: 'Sakura Bloom Gin Tonic', description: 'Roku Sakura Gin, Tonic', enDescription: 'Roku Sakura Gin, Tonic', price: '220', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d4-2', name: 'Kimono club', enName: 'Kimono club', description: 'Roku Gin, Raspberry, Lime, Egg White', enDescription: 'Roku Gin, Raspberry, Lime, Egg White', price: '220', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d4-3', name: 'Royal Blue', enName: 'Royal Blue', description: 'Haku Vodka, Blue Curacao, Lime', enDescription: 'Haku Vodka, Blue Curacao, Lime', price: '220', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d4-4', name: 'Bumbu Ritual', enName: 'Bumbu Ritual', description: 'Bumbu Rum, Ginger Beer', enDescription: 'Bumbu Rum, Ginger Beer', price: '230', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d4-5', name: 'Blonde Moment', enName: 'Blonde Moment', description: 'Vanilla Vodka, Passoa, Passion Fruit, Prosecco', enDescription: 'Vanilla Vodka, Passoa, Passion Fruit, Prosecco', price: '220', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d4-6', name: 'Golden Hour', enName: 'Golden Hour', description: 'Roku Gin, Aperol, Orange', enDescription: 'Roku Gin, Aperol, Orange', price: '220', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d4-7', name: 'Rosa Blanca', enName: 'Rosa Blanca', description: 'Tequilla, Lavender, Honey, Lime', enDescription: 'Tequilla, Lavender, Honey, Lime', price: '205', badge: '', allergens: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-d5',
      name: 'Prosecco',
      enName: 'Prosecco',
      description: '',
      enDescription: '',
      pageIndex: 1,
      items: [
        { id: 'item-d5-1', name: 'Mionetto prosecco Extra Dry 0,1l | 0,75l', enName: 'Mionetto prosecco Extra Dry 0.1l | 0.75l', description: 'Prosecco sklenice nebo láhev', enDescription: 'Prosecco glass or bottle', price: '95 | 475', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d5-2', name: 'Corner Valdobbiadene Prosecco Superiore DOCG 0,75l', enName: 'Corner Valdobbiadene Prosecco Superiore DOCG 0.75l', description: 'Prémiová láhev Prosecco', enDescription: 'Premium Prosecco bottle', price: '690', badge: '', allergens: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-d6',
      name: 'Víno',
      enName: 'Wine',
      description: 'Červené a bílé víno',
      enDescription: 'Red and white wine',
      pageIndex: 1,
      items: [
        { id: 'item-d6-1', name: 'Ramón Bilbao Edición Limitada 0,15l | 0,75l', enName: 'Ramón Bilbao Edición Limitada 0.15l | 0.75l', description: 'Červené víno', enDescription: 'Red Wine', price: '165 | 790', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d6-2', name: 'Terre di Faiano Primitivo Organic 0,15l | 0,75l', enName: 'Terre di Faiano Primitivo Organic 0.15l | 0.75l', description: 'Červené víno', enDescription: 'Red Wine', price: '145 | 690', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d6-3', name: 'Nicola Bergaglio Gavi del Comune di Gavi DOCG 0,15l | 0,75l', enName: 'Nicola Bergaglio Gavi del Comune di Gavi DOCG 0.15l | 0.75l', description: 'Bílé víno', enDescription: 'White Wine', price: '195 | 950', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d6-4', name: 'Zenato Lugana San Benedetto DOC 0,15l | 0,75l', enName: 'Zenato Lugana San Benedetto DOC 0.15l | 0.75l', description: 'Bílé víno', enDescription: 'White Wine', price: '175 | 850', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d6-5', name: 'Mount Riley Sauvignon Blanc 0,15l | 0,75l', enName: 'Mount Riley Sauvignon Blanc 0.15l | 0.75l', description: 'Bílé víno', enDescription: 'White Wine', price: '165 | 790', badge: '', allergens: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-d7',
      name: 'Pivo',
      enName: 'Beer',
      description: '',
      enDescription: '',
      pageIndex: 1,
      items: [
        { id: 'item-d7-1', name: 'Pilsner Urquell 0,33l', enName: 'Pilsner Urquell 0.33l', description: 'Čepované pivo', enDescription: 'Draught beer', price: '55', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d7-2', name: 'Pilsner Urquell 0,5l', enName: 'Pilsner Urquell 0.5l', description: 'Čepované pivo', enDescription: 'Draught beer', price: '69', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d7-3', name: 'Birell (láhev) 0,33l', enName: 'Birell (bottle) 0.33l', description: 'Nealkoholické lahvové pivo', enDescription: 'Non-alcoholic bottled beer', price: '50', badge: '', allergens: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-d8',
      name: 'Káva',
      enName: 'Coffee',
      description: '',
      enDescription: '',
      pageIndex: 1,
      items: [
        { id: 'item-d8-1', name: 'Espresso', enName: 'Espresso', description: 'Klasické Espresso', enDescription: 'Classic Espresso', price: '55', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d8-2', name: 'Cappuccino', enName: 'Cappuccino', description: 'Espresso s našlehanou mléčnou pěnou', enDescription: 'Espresso with steamed milk foam', price: '75', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d8-3', name: 'Caffè Latte', enName: 'Caffè Latte', description: 'Espresso s teplým mlékem a pěnou', enDescription: 'Espresso with steamed milk', price: '85', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d8-4', name: 'Creamy Matcha Latte', enName: 'Creamy Matcha Latte', description: 'Matcha zelený čaj s napěněným mlékem', enDescription: 'Whisked matcha green tea with steamed milk', price: '105', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d8-5', name: 'Lungo', enName: 'Lungo', description: 'Espresso prodloužené horkou vodou', enDescription: 'Espresso stretched with hot water', price: '55', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d8-6', name: 'Espresso Macchiato', enName: 'Espresso Macchiato', description: 'Espresso s kapkou mléčné pěny', enDescription: 'Espresso with a dollop of foam', price: '65', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d8-7', name: 'Americano', enName: 'Americano', description: 'Espresso s horkou vodou', enDescription: 'Espresso with hot water', price: '55', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d8-8', name: 'Doppio', enName: 'Doppio', description: 'Dvojité espresso', enDescription: 'Double shot espresso', price: '75', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d8-9', name: 'Flat White', enName: 'Flat White', description: 'Dvojité espresso s mléčnou mikropěnou', enDescription: 'Double shot espresso with microfoam', price: '95', badge: '', allergens: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-d9',
      name: 'SHOTS (0,04l)',
      enName: 'SHOTS (0.04l)',
      description: '',
      enDescription: '',
      pageIndex: 1,
      items: [
        { id: 'item-d9-1', name: 'Grey Goose vodka', enName: 'Grey Goose vodka', description: '', enDescription: '', price: '155', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d9-2', name: 'Absolut vodka', enName: 'Absolut vodka', description: '', enDescription: '', price: '95', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d9-3', name: 'Haku vodka', enName: 'Haku vodka', description: '', enDescription: '', price: '155', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d9-4', name: 'Bombay Sapphire', enName: 'Bombay Sapphire', description: '', enDescription: '', price: '105', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d9-5', name: 'Roku Gin / Sakura', enName: 'Roku Gin / Sakura edition', description: '', enDescription: '', price: '155', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d9-6', name: 'Havana Club 3Y', enName: 'Havana Club 3Y', description: '', enDescription: '', price: '95', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d9-7', name: 'Havana Club 7Y', enName: 'Havana Club 7Y', description: '', enDescription: '', price: '135', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d9-8', name: 'Legendario Elixir', enName: 'Legendario Elixir', description: '', enDescription: '', price: '115', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d9-9', name: 'Diplomatico Reserva', enName: 'Diplomatico Reserva Extra', description: '', enDescription: '', price: '175', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d9-10', name: 'Bumbu Rum', enName: 'Bumbu Rum', description: '', enDescription: '', price: '175', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d9-11', name: 'Don Papa', enName: 'Don Papa', description: '', enDescription: '', price: '165', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d9-12', name: 'Martell V.S. 0,04l', enName: 'Martell V.S. 0.04l', description: '', enDescription: '', price: '125', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d9-13', name: 'Hennessy V.S. 0,04l', enName: 'Hennessy V.S. 0.04l', description: '', enDescription: '', price: '145', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d9-14', name: 'Jack Daniel\'s / Honey', enName: 'Jack Daniel\'s / Honey', description: '', enDescription: '', price: '105', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d9-15', name: 'Jameson', enName: 'Jameson', description: '', enDescription: '', price: '85', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d9-16', name: 'Tullamore D.E.W.', enName: 'Tullamore D.E.W.', description: '', enDescription: '', price: '85', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d9-17', name: 'Ron Cariba Salted Caramel', enName: 'Ron Cariba Salted Caramel', description: '', enDescription: '', price: '75', badge: '', allergens: '', isAvailable: true },
        { id: 'item-d9-18', name: 'Captain Gold Spiced', enName: 'Captain Gold Spiced', description: '', enDescription: '', price: '75', badge: '', allergens: '', isAvailable: true }
      ]
    }
  ]
};

export const INITIAL_FOOD_MENU_DATA = {
  restaurantName: "Family Kitchen",
  subtitle: "Jídelní Lístek • Food Menu",
  footer: "Prosím informujte obsluhu o případných alergiích. / Please inform your server of allergies.",
  categories: [
    {
      id: 'cat-f1',
      name: 'Něco pro začátek',
      enName: 'Starters',
      description: '',
      enDescription: '',
      pageIndex: 0,
      items: [
        { id: 'item-f1-1', name: 'Svěží mango salát s trhaným kuřetem', enName: 'Fresh Mango Salad with Shredded Chicken', description: '', enDescription: '', price: '95', badge: '', allergens: '4,5', isAvailable: true },
        { id: 'item-f1-2', name: 'Křupavé vepřové závitky s tradiční náplní (3 ks)', enName: 'Crispy Pork Spring Rolls with Traditional Filling (3 pcs)', description: '', enDescription: '', price: '133', badge: '', allergens: '1,3', isAvailable: true },
        { id: 'item-f1-3', name: 'Domácí rýžová kaše s houbami Shiitake a řasou Nori', enName: 'Homemade rice porridge with Shiitake mushrooms and Nori seaweed', description: '', enDescription: '', price: '106', badge: '', allergens: '6,11', isAvailable: true },
        { id: 'item-f1-4', name: 'Sladká kukuřice v jemném křupavém těstíčku', enName: 'Sweet Crispy Corn in Light Batter', description: '', enDescription: '', price: '93', badge: '', allergens: '1', isAvailable: true }
      ]
    },
    {
      id: 'cat-f2',
      name: 'Domácí výběr',
      enName: 'Homemade Selection',
      description: '',
      enDescription: '',
      pageIndex: 0,
      items: [
        { id: 'item-f2-1', name: 'Bun Bo Nam Bo s bylinkami a křupavou cibulkou', enName: 'Bun Bo Nam Bo with Fresh Herbs and Crispy Shallots', description: '', enDescription: '', price: '234', badge: '', allergens: '5,6', isAvailable: true },
        { id: 'item-f2-2', name: 'Pravý hovězí/kuřecí vývar Phở z Hanoje', enName: 'Authentic Hanoi Beef/Chicken Phở Noodle Soup', description: '', enDescription: '', price: '230/220', badge: '', allergens: '4,6', isAvailable: true },
        { id: 'item-f2-3', name: 'Grilovaný Bun Cha na dřevěném uhlí', enName: 'Charcoal-Grilled Pork Belly', description: '', enDescription: '', price: '243', badge: '', allergens: '6', isAvailable: true },
        { id: 'item-f2-4', name: 'Phở xào s krevetami, tofu a arašídy', enName: 'Fried Noodles with Shrimp, Tofu and Peanuts', description: '', enDescription: '', price: '247', badge: '', allergens: '1, 2, 5, 6', isAvailable: true },
        { id: 'item-f2-5', name: 'Hovězí roštěná na rozpálené litinové pánvi s pepřovou omáčkou 170 g', enName: 'Sizzling Beef Sirloin on a Cast Iron Skillet with Peppery Sauce 170 g', description: '', enDescription: '', price: '310', badge: 'Specialty', allergens: '1,7', isAvailable: true },
        { id: 'item-f2-6', name: 'Kuřecí v houbové omáčce s jasmínovou rýží', enName: 'Tender Chicken in Mushroom Sauce with Jasmine Rice', description: '', enDescription: '', price: '216', badge: '', allergens: '6,14,1', isAvailable: true }
      ]
    },
    {
      id: 'cat-f3',
      name: 'Degustační sety',
      enName: 'Tasting Sets',
      description: '(Od 11h - 17h)',
      enDescription: '(From 11h - 17h)',
      pageIndex: 0,
      items: [
        { id: 'item-f3-1', name: 'Vůně Hanoje', enName: 'Scents of Hanoi', description: 'Karamelizovaný sladký bůček, Restované kuřecí se žampiony, Pekingské zelí na česneku, Slané arašídy, Rýže, Polévka dne, Dezert', enDescription: 'Caramelized sweet pork belly, Stir-Fried Napa Cabbage, Jasmine Rice, Soup, Dessert', price: '283', badge: 'Set Menu', allergens: '', isAvailable: true },
        { id: 'item-f3-2', name: 'Tradiční zážitek', enName: 'A Traditional Experience', description: 'Mleté vepřové v betelovém listu, Restovaná zeleninová směs s hovězím, Slané arašídy, Rýže, Polévka dne, Dezert', enDescription: 'Grilled Pork in Betel Leaves, Stir-Fried Beef with Mixed Vegetables, Jasmine Rice, Soup, Dessert', price: '283', badge: 'Set Menu', allergens: '', isAvailable: true },
        { id: 'item-f3-3', name: 'Zelené srdce Hanoje', enName: 'Green Hanoi Set', description: 'Tofu v rajčatové omáčce, Omeleta na černém pepři, Zelí restované s rajčaty, Slané arašídy, Rýže, Polévka dne, Dezert', enDescription: 'Tofu in Tomato Sauce, Black Pepper Omelette, Stir-Fried Cabbage, Jasmine Rice, Soup, Dessert', price: '263', badge: 'Vegetarian Set', allergens: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-f4',
      name: 'Otsumami a saláty',
      enName: 'Small Plates & Salads',
      description: '',
      enDescription: '',
      pageIndex: 1,
      items: [
        { id: 'item-f4-1', name: 'Křupavé knedlíčky Gyoza (3ks)', enName: 'Crispy Gyoza Dumplings (3pcs)', description: '', enDescription: '', price: '113', badge: '', allergens: '1,6', isAvailable: true },
        { id: 'item-f4-2', name: 'Zeleninový salát s mořskými řasami a Tobiko', enName: 'Vegetable Salad with Seaweed and Tobiko', description: '', enDescription: '', price: '163', badge: '', allergens: '2,11', isAvailable: true },
        { id: 'item-f4-3', name: 'Zelené sójové lusky Edamame s mořskou solí', enName: 'Sea Salted Green Soybeans Edamame', description: '', enDescription: '', price: '110', badge: '', allergens: '6', isAvailable: true },
        { id: 'item-f4-4', name: 'Domácí rýžová kaše s Tobiko', enName: 'Homemade rice porridge with Tobiko', description: '', enDescription: '', price: '106', badge: '', allergens: '1,4,6', isAvailable: true }
      ]
    },
    {
      id: 'cat-f5',
      name: 'Japonské speciality',
      enName: 'Japanese specialities',
      description: '',
      enDescription: '',
      pageIndex: 1,
      items: [
        { id: 'item-f5-1', name: 'Japonské Donburi s Tonkatsu, omeletou a silnou omáčkou', enName: 'Japanese Donburi with Tonkatsu, Omelette and Rich Sauce', description: '', enDescription: '', price: '283', badge: '', allergens: '1, 3, 4, 6', isAvailable: true },
        { id: 'item-f5-2', name: 'Tygří krevety Tempura v těstíčku s Tentsuyu omáčkou (3 ks)', enName: 'Tiger Shrimp Tempura in light batter with Tentsuyu sauce (3pcs)', description: '', enDescription: '', price: '198', badge: '', allergens: '1, 4, 6', isAvailable: true }
      ]
    },
    {
      id: 'cat-f6',
      name: 'Degustační sety Teishoku',
      enName: 'Teishoku Tasting Sets',
      description: '',
      enDescription: '',
      pageIndex: 1,
      items: [
        { id: 'item-f6-1', name: 'Svěží a lehký zážitek', enName: 'Light and Refreshing', description: 'Salát z mořských řas s vejcem a krevetami, miso polévka, maki avokádo (6 ks), nigiri losos (2 ks), dezert', enDescription: 'Seaweed Salad, Miso Soup, Avocado Maki, Salmon Nigiri, Dessert', price: '220', badge: 'Teishoku', allergens: '', isAvailable: true },
        { id: 'item-f6-2', name: 'Tonkatsu & Tempura', enName: 'Tonkatsu & Tempura', description: 'Sezónní zelenina se sezamovým dresinkem, tempura krevety (3ks), Tonkatsu, jasmínová rýže, miso polévka, dezert', enDescription: 'Seasonal Vegetables, Tempura Shrimp, Pork Tonkatsu, Jasmine Rice, Miso Soup, Dessert', price: '220', badge: 'Teishoku', allergens: '', isAvailable: true },
        { id: 'item-f6-3', name: 'Gyudon & Gyoza', enName: 'Gyudon & Gyoza', description: 'Vepřové Gyoza 3ks, Donburi gyudon (hovězí), japonská slaná palačinka, miso polévka, dezert', enDescription: 'Pork Gyoza, Gyudon beef donburi, Japanese savory pancake, Miso Soup, Dessert', price: '220', badge: 'Teishoku', allergens: '', isAvailable: true },
        { id: 'item-f6-4', name: 'Sushi mix', enName: 'Sushi mix', description: 'Philadelphia rolky (6 ks), Hosomaki (6ks), Nigiri se sladkou krevetou (2 ks), Nigiri losos (2ks), miso polévka, dezert', enDescription: 'Philadelphia Roll, Hosomaki, Sweet Shrimp Nigiri, Salmon Nigiri, Miso Soup, Dessert', price: '220', badge: 'Teishoku', allergens: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-f7',
      name: 'Sushi Menu',
      enName: 'Sushi Menu',
      description: 'Nigiri, Hoso Maki, Uramaki',
      enDescription: 'Nigiri, Hoso Maki, Uramaki',
      pageIndex: 1,
      items: [
        { id: 'item-f7-1', name: 'Sake Nigiri / Ebi Nigiri', enName: 'Sake Nigiri / Ebi Nigiri', description: 'Lososové nebo krevetové Nigiri (2ks)', enDescription: 'Salmon or shrimp Nigiri sushi (2pcs)', price: '220', badge: '', allergens: '', isAvailable: true },
        { id: 'item-f7-2', name: 'Sake / Avocado / Ebi Ten / Kappa Hosomaki', enName: 'Sake / Avocado / Ebi Ten / Kappa Hosomaki', description: 'Výběr Hosomaki (6ks)', enDescription: 'Hosomaki selection (6pcs)', price: '220', badge: '', allergens: '', isAvailable: true },
        { id: 'item-f7-3', name: 'Tobiko Green', enName: 'Tobiko Green', description: 'Losos, Zelený kaviár, Avokádo, Okurka', enDescription: 'Salmon | Green Tobiko | Avocado | Cucumber', price: '220', badge: '', allergens: '', isAvailable: true },
        { id: 'item-f7-4', name: 'California Creamy', enName: 'California Creamy', description: 'Krab, Kaviár, Avokádo, Japonská majonéza', enDescription: 'Crab | Tobiko | Avocado | Japanese Mayo', price: '220', badge: '', allergens: '', isAvailable: true },
        { id: 'item-f7-5', name: 'Sesame Roll', enName: 'Sesame Roll', description: 'Krab, Avokádo, Pražený sezam, Okurka', enDescription: 'Crab | Avocado | Toasted Sesame | Cucumber', price: '220', badge: '', allergens: '', isAvailable: true },
        { id: 'item-f7-6', name: 'Sunrise Roll', enName: 'Sunrise Roll', description: 'Losos, Krab, Japonská majonéza, Avokádo', enDescription: 'Salmon | Crab | Japanese Mayo | Avocado', price: '220', badge: '', allergens: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-f8',
      name: 'Výběr vegetariánkých pokrmů',
      enName: 'Veggie Selection',
      description: '',
      enDescription: '',
      pageIndex: 2,
      items: [
        { id: 'item-f8-1', name: 'Smažené široké rýžové nudle Phở se sezónní zeleninou', enName: 'Wok-Tossed Phở Noodles with Seasonal Vegetables', description: '', enDescription: '', price: '220', badge: '', allergens: '', isAvailable: true },
        { id: 'item-f8-2', name: 'Vegetariánská smažená rýže se zeleninou', enName: 'Vegetarian Vegetable Fried Rice', description: '', enDescription: '', price: '220', badge: '', allergens: '', isAvailable: true },
        { id: 'item-f8-3', name: 'Zeleninová směs „Buddha“ s tofu a rýží', enName: 'Buddha’s Delight Mixed Vegetables with Tofu and Rice', description: '', enDescription: '', price: '220', badge: '', allergens: '', isAvailable: true },
        { id: 'item-f8-4', name: 'Restované brambory s hlívou máčkovou, koprem a jarní cibulkou', enName: 'Sautéed Potatoes with King Oyster Mushrooms, Dill, and Spring Onion', description: '', enDescription: '', price: '220', badge: '', allergens: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-f9',
      name: 'Přílohy',
      enName: 'Side Dishes',
      description: '',
      enDescription: '',
      pageIndex: 2,
      items: [
        { id: 'item-f9-1', name: 'Jasmínová rýže', enName: 'Jasmine Rice', description: '', enDescription: '', price: '50', badge: '', allergens: '', isAvailable: true },
        { id: 'item-f9-2', name: 'Smažené tofu', enName: 'Golden Fried Tofu (portion)', description: '', enDescription: '', price: '80', badge: '', allergens: '', isAvailable: true },
        { id: 'item-f9-3', name: 'Restovaná / Vařená zelenina', enName: 'Stir-fried or steamed fresh seasonal vegetables', description: '', enDescription: '', price: '120', badge: '', allergens: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-f10',
      name: 'Menu pro nejmenší',
      enName: 'For Our Little Guests',
      description: '',
      enDescription: '',
      pageIndex: 2,
      items: [
        { id: 'item-f10-1', name: 'Dětská polévka Phở', enName: 'Kids\' Phở Noodle Soup (smaller portion)', description: '', enDescription: '', price: '120', badge: '', allergens: '', isAvailable: true },
        { id: 'item-f10-2', name: 'Kuřecí nugetky', enName: 'Chicken Nuggets with small side', description: '', enDescription: '', price: '140', badge: '', allergens: '', isAvailable: true },
        { id: 'item-f10-3', name: 'Pařený knedlíček Prasátko Peppa', enName: 'Peppa Pig Steamed Bun', description: '', enDescription: '', price: '90', badge: '', allergens: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-f11',
      name: 'Dezerty',
      enName: 'Desserts',
      description: '',
      enDescription: '',
      pageIndex: 2,
      items: [
        { id: 'item-f11-1', name: 'Mangový cheesecake', enName: 'Creamy Cheesecake with Fresh Mango', description: '', enDescription: '', price: '110', badge: '', allergens: '', isAvailable: true },
        { id: 'item-f11-2', name: 'Zmrzlina', enName: 'Ice Cream Selection (3 scoops)', description: '', enDescription: '', price: '90', badge: '', allergens: '', isAvailable: true },
        { id: 'item-f11-3', name: 'Čokoládový dort', enName: 'Rich Chocolate Fudge Cake', description: '', enDescription: '', price: '110', badge: '', allergens: '', isAvailable: true },
        { id: 'item-f11-4', name: 'Dezert dle denní nabídky', enName: 'Dessert of the Day (ask server)', description: '', enDescription: '', price: '110', badge: '', allergens: '', isAvailable: true }
      ]
    }
  ]
};

export const INITIAL_MENU_DATA = INITIAL_FOOD_MENU_DATA;
