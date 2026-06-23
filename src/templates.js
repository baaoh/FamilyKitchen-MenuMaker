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
      name: 'Nealko / Soft Drinks',
      description: '',
      items: [
        { id: 'item-d1-1', name: 'Coca cola | Cola zero | Fanta | Sprite 330 ml (Plech)', description: 'Coca cola | Cola zero | Fanta | Sprite 330 ml (Can)', price: '55', badge: '', isAvailable: true },
        { id: 'item-d1-2', name: 'Karafa Perlivá | Neperlivá 0,7l', description: 'Carafe Sparkling | Still 0.7l', price: '65', badge: '', isAvailable: true },
        { id: 'item-d1-3', name: 'Jablečný džus | Jahodový džus', description: 'Apple Juice | Strawberry Juice', price: '65', badge: '', isAvailable: true },
        { id: 'item-d1-4', name: 'Fever Tree Tonic', description: 'Fever Tree Tonic', price: '85', badge: '', isAvailable: true },
        { id: 'item-d1-5', name: 'Fever Tree Ginger Beer', description: 'Fever Tree Ginger Beer', price: '85', badge: '', isAvailable: true },
        { id: 'item-d1-6', name: 'Redbull', description: 'Redbull', price: '85', badge: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-d2',
      name: 'Limonády / Lemonade',
      description: '',
      items: [
        { id: 'item-d2-1', name: 'Mango Passion', description: 'Mango, Passion Fruit, Soda', price: '105', badge: '', isAvailable: true },
        { id: 'item-d2-2', name: 'Berry Yuzu', description: 'Yuzu, Raspberry Fruit, Soda', price: '105', badge: '', isAvailable: true },
        { id: 'item-d2-3', name: 'Candy Rosé', description: 'Rose Syrup, Passion Fruit, Lime, Soda', price: '110', badge: '', isAvailable: true },
        { id: 'item-d2-4', name: 'Apple Peach', description: 'Peach, Apple, Lime, Soda', price: '105', badge: '', isAvailable: true },
        { id: 'item-d2-5', name: 'Pink Lychee', description: 'Lychee Syrup, Lime, Soda', price: '105', badge: '', isAvailable: true },
        { id: 'item-d2-6', name: 'Ruby Cranberry', description: 'Rose Syrup, Cranberry, Lime, Soda', price: '105', badge: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-d3',
      name: 'Koktejly / Cocktails',
      description: '',
      items: [
        { id: 'item-d3-1', name: 'Espresso Martini', description: 'Absolut Vodka, Espresso, Kahlua', price: '185', badge: '', isAvailable: true },
        { id: 'item-d3-2', name: 'Aperol Spritz', description: 'Aperol, Prosecco, Soda', price: '145', badge: '', isAvailable: true },
        { id: 'item-d3-3', name: 'White Lady', description: 'Bombay Gin, Cointreau, Lemon', price: '175', badge: '', isAvailable: true },
        { id: 'item-d3-4', name: 'Strawberry clover club', description: 'Bombay Gin, Strawberry Syrup, Lemon Juice', price: '175', badge: '', isAvailable: true },
        { id: 'item-d3-5', name: 'Moscow Mule', description: 'Absolut Vodka, Ginger Beer, Lime Juice', price: '160', badge: '', isAvailable: true },
        { id: 'item-d3-6', name: 'Scarlet Velvet', description: 'Bombay Gin, Prosecco, Raspberry Syrup', price: '155', badge: '', isAvailable: true },
        { id: 'item-d3-7', name: 'Cuba Libre', description: 'Havana Club, Coca Cola, Lime', price: '155', badge: '', isAvailable: true },
        { id: 'item-d3-8', name: 'Mojito', description: 'Havana Club, Lime, Mint', price: '145', badge: '', isAvailable: true },
        { id: 'item-d3-9', name: 'Gin tonic', description: 'Bombay Gin, Fever Tree Tonic', price: '160', badge: '', isAvailable: true },
        { id: 'item-d3-10', name: 'Negroni', description: 'Bombay Gin, Martini Rosso, Campari', price: '175', badge: '', isAvailable: true },
        { id: 'item-d3-11', name: 'Vodka RedBull', description: 'Absolut Vodka, Redbull', price: '155', badge: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-d4',
      name: 'Family Signature / Craft Selection',
      description: '',
      items: [
        { id: 'item-d4-1', name: 'Sakura Bloom Gin Tonic', description: 'Roku Sakura Gin, Tonic', price: '220', badge: '', isAvailable: true },
        { id: 'item-d4-2', name: 'Kimono club', description: 'Roku Gin, Raspberry, Lime, Egg White', price: '220', badge: '', isAvailable: true },
        { id: 'item-d4-3', name: 'Royal Blue', description: 'Haku Vodka, Blue Curacao, Lime', price: '220', badge: '', isAvailable: true },
        { id: 'item-d4-4', name: 'Bumbu Ritual', description: 'Bumbu Rum, Ginger Beer', price: '230', badge: '', isAvailable: true },
        { id: 'item-d4-5', name: 'Blonde Moment', description: 'Vanilla Vodka, Passoa, Passion Fruit, Prosecco', price: '220', badge: '', isAvailable: true },
        { id: 'item-d4-6', name: 'Golden Hour', description: 'Roku Gin, Aperol, Orange', price: '220', badge: '', isAvailable: true },
        { id: 'item-d4-7', name: 'Rosa Blanca', description: 'Tequilla, Lavender, Honey, Lime', price: '205', badge: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-d5',
      name: 'Prosecco / Prosecco',
      description: '',
      items: [
        { id: 'item-d5-1', name: 'Mionetto prosecco Extra Dry 0,1l | 0,75l', description: 'Prosecco glass or bottle', price: '95 | 475', badge: '', isAvailable: true },
        { id: 'item-d5-2', name: 'Corner Valdobbiadene Prosecco Superiore DOCG 0,75l', description: 'Premium Prosecco bottle', price: '690', badge: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-d6',
      name: 'Víno / Wine',
      description: 'Červené a bílé víno / Red and white wine',
      items: [
        { id: 'item-d6-1', name: 'Ramón Bilbao Edición Limitada 0,15l | 0,75l', description: 'Červené víno / Red Wine', price: '165 | 790', badge: '', isAvailable: true },
        { id: 'item-d6-2', name: 'Terre di Faiano Primitivo Organic 0,15l | 0,75l', description: 'Červené víno / Red Wine', price: '145 | 690', badge: '', isAvailable: true },
        { id: 'item-d6-3', name: 'Nicola Bergaglio Gavi del Comune di Gavi DOCG 0,15l | 0,75l', description: 'Bílé víno / White Wine', price: '195 | 950', badge: '', isAvailable: true },
        { id: 'item-d6-4', name: 'Zenato Lugana San Benedetto DOC 0,15l | 0,75l', description: 'Bílé víno / White Wine', price: '175 | 850', badge: '', isAvailable: true },
        { id: 'item-d6-5', name: 'Mount Riley Sauvignon Blanc 0,15l | 0,75l', description: 'Bílé víno / White Wine', price: '165 | 790', badge: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-d7',
      name: 'Pivo / Beer',
      description: '',
      items: [
        { id: 'item-d7-1', name: 'Pilsner Urquell 0,33l', description: 'Draught beer', price: '55', badge: '', isAvailable: true },
        { id: 'item-d7-2', name: 'Pilsner Urquell 0,5l', description: 'Draught beer', price: '69', badge: '', isAvailable: true },
        { id: 'item-d7-3', name: 'Birell (láhev) 0,33l', description: 'Birell (bottle) 0,33l', price: '50', badge: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-d8',
      name: 'Káva / Coffee',
      description: '',
      items: [
        { id: 'item-d8-1', name: 'Espresso', description: 'Classic Espresso', price: '55', badge: '', isAvailable: true },
        { id: 'item-d8-2', name: 'Cappuccino', description: 'Espresso with steamed milk foam', price: '75', badge: '', isAvailable: true },
        { id: 'item-d8-3', name: 'Caffè Latte', description: 'Espresso with steamed milk', price: '85', badge: '', isAvailable: true },
        { id: 'item-d8-4', name: 'Creamy Matcha Latte', description: 'Whisked matcha green tea with steamed milk', price: '105', badge: '', isAvailable: true },
        { id: 'item-d8-5', name: 'Lungo', description: 'Espresso stretched with hot water', price: '55', badge: '', isAvailable: true },
        { id: 'item-d8-6', name: 'Espresso Macchiato', description: 'Espresso with a dollop of foam', price: '65', badge: '', isAvailable: true },
        { id: 'item-d8-7', name: 'Americano', description: 'Espresso with hot water', price: '55', badge: '', isAvailable: true },
        { id: 'item-d8-8', name: 'Doppio', description: 'Double shot espresso', price: '75', badge: '', isAvailable: true },
        { id: 'item-d8-9', name: 'Flat White', description: 'Double shot espresso with microfoam', price: '95', badge: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-d9',
      name: 'SHOTS (0,04l)',
      description: '',
      items: [
        { id: 'item-d9-1', name: 'Grey Goose vodka', description: 'Grey Goose vodka', price: '155', badge: '', isAvailable: true },
        { id: 'item-d9-2', name: 'Absolut vodka', description: 'Absolut vodka', price: '95', badge: '', isAvailable: true },
        { id: 'item-d9-3', name: 'Haku vodka', description: 'Haku vodka', price: '155', badge: '', isAvailable: true },
        { id: 'item-d9-4', name: 'Bombay Sapphire', description: 'Bombay Sapphire', price: '105', badge: '', isAvailable: true },
        { id: 'item-d9-5', name: 'Roku Gin / Sakura', description: 'Roku Gin / Sakura edition', price: '155', badge: '', isAvailable: true },
        { id: 'item-d9-6', name: 'Havana Club 3Y', description: 'Havana Club 3Y', price: '95', badge: '', isAvailable: true },
        { id: 'item-d9-7', name: 'Bumbu Rum', description: 'Bumbu Rum', price: '155', badge: '', isAvailable: true },
        { id: 'item-d9-8', name: 'Don Papa Masskara', description: 'Don Papa Masskara', price: '165', badge: '', isAvailable: true },
        { id: 'item-d9-9', name: 'Chivas Regal 12Y', description: 'Chivas Regal 12Y', price: '135', badge: '', isAvailable: true },
        { id: 'item-d9-10', name: 'Nikka From the Barrel', description: 'Nikka From the Barrel', price: '225', badge: '', isAvailable: true },
        { id: 'item-d9-11', name: 'Olmeca Blanco', description: 'Olmeca Blanco', price: '115', badge: '', isAvailable: true },
        { id: 'item-d9-12', name: 'Jägermeister', description: 'Jägermeister', price: '95', badge: '', isAvailable: true },
        { id: 'item-d9-13', name: 'Becherovka', description: 'Becherovka', price: '85', badge: '', isAvailable: true },
        { id: 'item-d9-14', name: 'Cognac du Buisson XO', description: 'Cognac du Buisson XO', price: '225', badge: '', isAvailable: true },
        { id: 'item-d9-15', name: 'Carlos I. Imperial XO', description: 'Carlos I. Imperial XO', price: '185', badge: '', isAvailable: true },
        { id: 'item-d9-16', name: 'Tullamore D.E.W.', description: 'Tullamore D.E.W.', price: '85', badge: '', isAvailable: true },
        { id: 'item-d9-17', name: 'Ron Cariba Salted Caramel', description: 'Ron Cariba Salted Caramel', price: '75', badge: '', isAvailable: true },
        { id: 'item-d9-18', name: 'Captain Gold Spiced', description: 'Captain Gold Spiced', price: '75', badge: '', isAvailable: true }
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
      name: 'Něco pro začátek / Starters',
      description: '',
      items: [
        { id: 'item-f1-1', name: 'Svěží mango salát s trhaným kuřetem (4,5)', description: 'Fresh Mango Salad with Shredded Chicken', price: '95', badge: '', isAvailable: true },
        { id: 'item-f1-2', name: 'Křupavé vepřové závitky s tradiční náplní (3 ks) (1,3)', description: 'Crispy Pork Spring Rolls with Traditional Filling (3 pcs)', price: '133', badge: '', isAvailable: true },
        { id: 'item-f1-3', name: 'Domácí rýžová kaše s houbami Shiitake a řasou Nori (6,11)', description: 'Homemade rice porridge with Shiitake mushrooms and Nori seaweed', price: '106', badge: '', isAvailable: true },
        { id: 'item-f1-4', name: 'Sladká kukuřice v jemném křupavém těstíčku (1)', description: 'Sweet Crispy Corn in Light Batter', price: '93', badge: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-f2',
      name: 'Domácí výběr / Homemade Selection',
      description: '',
      items: [
        { id: 'item-f2-1', name: 'Bun Bo Nam Bo s bylinkami a křupavou cibulkou (5,6)', description: 'Bun Bo Nam Bo with Fresh Herbs and Crispy Shallots', price: '234', badge: '', isAvailable: true },
        { id: 'item-f2-2', name: 'Pravý hovězí/kuřecí vývar Phở z Hanoje (4,6)', description: 'Authentic Hanoi Beef/Chicken Phở Noodle Soup', price: '230/220', badge: '', isAvailable: true },
        { id: 'item-f2-3', name: 'Grilovaný Bun Cha na dřevěném uhlí (6)', description: 'Charcoal-Grilled Pork Belly', price: '243', badge: '', isAvailable: true },
        { id: 'item-f2-4', name: 'Phở xào s krevetami, tofu a arašídy (1, 2, 5, 6)', description: 'Fried Noodles with Shrimp, Tofu and Peanuts', price: '247', badge: '', isAvailable: true },
        { id: 'item-f2-5', name: 'Hovězí roštěná na rozpálené litinové pánvi s pepřovou omáčkou 170 g (1,7)', description: 'Sizzling Beef Sirloin on a Cast Iron Skillet with Peppery Sauce 170 g', price: '310', badge: 'Specialty', isAvailable: true },
        { id: 'item-f2-6', name: 'Kuřecí v houbové omáčce s jasmínovou rýží (6,14,1)', description: 'Tender Chicken in Mushroom Sauce with Jasmine Rice', price: '216', badge: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-f3',
      name: 'Degustační sety / Tasting Sets',
      description: '(Od / From 11h - 17h)',
      items: [
        { id: 'item-f3-1', name: 'Vůně Hanoje / Scents of Hanoi', description: 'Karamelizovaný sladký bůček, Restované kuřecí se žampiony, Pekingské zelí na česneku, Slané arašídy, Rýže, Polévka dne, Dezert / Caramelized sweet pork belly, Stir-Fried Napa Cabbage, Jasmine Rice, Soup, Dessert', price: '283', badge: 'Set Menu', isAvailable: true },
        { id: 'item-f3-2', name: 'Tradiční zážitek / A Traditional Experience', description: 'Mleté vepřové v betelovém listu, Restovaná zeleninová směs s hovězím, Slané arašídy, Rýže, Polévka dne, Dezert / Grilled Pork in Betel Leaves, Stir-Fried Beef with Mixed Vegetables, Jasmine Rice, Soup, Dessert', price: '283', badge: 'Set Menu', isAvailable: true },
        { id: 'item-f3-3', name: 'Zelené srdce Hanoje / Green Hanoi Set', description: 'Tofu v rajčatové omáčce, Omeleta na černém pepři, Zelí restované s rajčaty, Slané arašídy, Rýže, Polévka dne, Dezert / Tofu in Tomato Sauce, Black Pepper Omelette, Stir-Fried Cabbage, Jasmine Rice, Soup, Dessert', price: '263', badge: 'Vegetarian Set', isAvailable: true }
      ]
    },
    {
      id: 'cat-f4',
      name: 'Otsumami a saláty / Small Plates & Salads',
      description: '',
      items: [
        { id: 'item-f4-1', name: 'Křupavé knedlíčky Gyoza (3ks) (1,6)', description: 'Crispy Gyoza Dumplings (3pcs)', price: '113', badge: '', isAvailable: true },
        { id: 'item-f4-2', name: 'Zeleninový salát s mořskými řasami a Tobiko (2,11)', description: 'Vegetable Salad with Seaweed and Tobiko', price: '163', badge: '', isAvailable: true },
        { id: 'item-f4-3', name: 'Zelené sójové lusky Edamame s mořskou solí (6)', description: 'Sea Salted Green Soybeans Edamame', price: '110', badge: '', isAvailable: true },
        { id: 'item-f4-4', name: 'Domácí rýžová kaše s Tobiko (1,4,6)', description: 'Homemade rice porridge with Tobiko', price: '106', badge: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-f5',
      name: 'Japonské speciality / Japanese specialities',
      description: '',
      items: [
        { id: 'item-f5-1', name: 'Japonské Donburi s Tonkatsu, omeletou a silnou omáčkou (1, 3, 4, 6)', description: 'Japanese Donburi with Tonkatsu, Omelette and Rich Sauce', price: '283', badge: '', isAvailable: true },
        { id: 'item-f5-2', name: 'Tygří krevety Tempura v těstíčku s Tentsuyu omáčkou (3 ks) (1, 4, 6)', description: 'Tiger Shrimp Tempura in light batter with Tentsuyu sauce (3pcs)', price: '198', badge: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-f6',
      name: 'Degustační sety Teishoku / Teishoku Tasting Sets',
      description: '',
      items: [
        { id: 'item-f6-1', name: 'Svěží a lehký zážitek / Light and Refreshing', description: 'Salát z mořských řas s vejcem a krevetami, miso polévka, maki avokádo (6 ks), nigiri losos (2 ks), dezert / Seaweed Salad, Miso Soup, Avocado Maki, Salmon Nigiri, Dessert', price: '220', badge: 'Teishoku', isAvailable: true },
        { id: 'item-f6-2', name: 'Tonkatsu & Tempura', description: 'Sezónní zelenina se sezamovým dresinkem, tempura krevety (3ks), Tonkatsu, jasmínová rýže, miso polévka, dezert / Seasonal Vegetables, Tempura Shrimp, Pork Tonkatsu, Jasmine Rice, Miso Soup, Dessert', price: '220', badge: 'Teishoku', isAvailable: true },
        { id: 'item-f6-3', name: 'Gyudon & Gyoza', description: 'Vepřové Gyoza 3ks, Donburi gyudon (hovězí), japonská slaná palačinka, miso polévka, dezert / Pork Gyoza, Gyudon beef donburi, Japanese savory pancake, Miso Soup, Dessert', price: '220', badge: 'Teishoku', isAvailable: true },
        { id: 'item-f6-4', name: 'Sushi mix', description: 'Philadelphia rolky (6 ks), Hosomaki (6ks), Nigiri se sladkou krevetou (2 ks), Nigiri losos (2ks), miso polévka, dezert / Philadelphia Roll, Hosomaki, Sweet Shrimp Nigiri, Salmon Nigiri, Miso Soup, Dessert', price: '220', badge: 'Teishoku', isAvailable: true }
      ]
    },
    {
      id: 'cat-f7',
      name: 'Sushi Menu',
      description: 'Nigiri, Hoso Maki, Uramaki',
      items: [
        { id: 'item-f7-1', name: 'Sake Nigiri / Ebi Nigiri', description: 'Salmon or shrimp Nigiri sushi (2pcs)', price: '220', badge: '', isAvailable: true },
        { id: 'item-f7-2', name: 'Sake / Avocado / Ebi Ten / Kappa Hosomaki', description: 'Hosomaki selection (6pcs)', price: '220', badge: '', isAvailable: true },
        { id: 'item-f7-3', name: 'Tobiko Green', description: 'Losos, Zelený kaviár, Avokádo, Okurka / Salmon | Green Tobiko | Avocado | Cucumber', price: '220', badge: '', isAvailable: true },
        { id: 'item-f7-4', name: 'California Creamy', description: 'Krab, Kaviár, Avokádo, Japonská majonéza / Crab | Tobiko | Avocado | Japanese Mayo', price: '220', badge: '', isAvailable: true },
        { id: 'item-f7-5', name: 'Sesame Roll', description: 'Krab, Avokádo, Pražený sezam, Okurka / Crab | Avocado | Toasted Sesame | Cucumber', price: '220', badge: '', isAvailable: true },
        { id: 'item-f7-6', name: 'Sunrise Roll', description: 'Losos, Krab, Japonská majonéza, Avokádo / Salmon | Crab | Japanese Mayo | Avocado', price: '220', badge: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-f8',
      name: 'Výběr vegetariánkých pokrmů / Veggie Selection',
      description: '',
      items: [
        { id: 'item-f8-1', name: 'Smažené široké rýžové nudle Phở se sezónní zeleninou', description: 'Wok-Tossed Phở Noodles with Seasonal Vegetables', price: '220', badge: '', isAvailable: true },
        { id: 'item-f8-2', name: 'Vegetariánská smažená rýže se zeleninou', description: 'Vegetarian Vegetable Fried Rice', price: '220', badge: '', isAvailable: true },
        { id: 'item-f8-3', name: 'Zeleninová směs „Buddha“ s tofu a rýží', description: 'Buddha’s Delight Mixed Vegetables with Tofu and Rice', price: '220', badge: '', isAvailable: true },
        { id: 'item-f8-4', name: 'Restované brambory s hlívou máčkovou, koprem a jarní cibulkou', description: 'Sautéed Potatoes with King Oyster Mushrooms, Dill, and Spring Onion', price: '220', badge: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-f9',
      name: 'Přílohy / Side Dishes',
      description: '',
      items: [
        { id: 'item-f9-1', name: 'Jasmínová rýže', description: 'Jasmine Rice', price: '50', badge: '', isAvailable: true },
        { id: 'item-f9-2', name: 'Smažené tofu', description: 'Golden Fried Tofu (portion)', price: '80', badge: '', isAvailable: true },
        { id: 'item-f9-3', name: 'Restovaná / Vařená zelenina', description: 'Stir-fried or steamed fresh seasonal vegetables', price: '120', badge: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-f10',
      name: 'Menu pro nejmenší / For Our Little Guests',
      description: '',
      items: [
        { id: 'item-f10-1', name: 'Dětská polévka Phở', description: 'Kids\' Phở Noodle Soup (smaller portion)', price: '120', badge: '', isAvailable: true },
        { id: 'item-f10-2', name: 'Kuřecí nugetky', description: 'Chicken Nuggets with small side', price: '140', badge: '', isAvailable: true },
        { id: 'item-f10-3', name: 'Pařený knedlíček Prasátko Peppa', description: 'Peppa Pig Steamed Bun', price: '90', badge: '', isAvailable: true }
      ]
    },
    {
      id: 'cat-f11',
      name: 'Dezerty / Desserts',
      description: '',
      items: [
        { id: 'item-f11-1', name: 'Mangový cheesecake', description: 'Creamy Cheesecake with Fresh Mango', price: '110', badge: '', isAvailable: true },
        { id: 'item-f11-2', name: 'Zmrzlina', description: 'Ice Cream Selection (3 scoops)', price: '90', badge: '', isAvailable: true },
        { id: 'item-f11-3', name: 'Čokoládový dort', description: 'Rich Chocolate Fudge Cake', price: '110', badge: '', isAvailable: true },
        { id: 'item-f11-4', name: 'Dezert dle denní nabídky', description: 'Dessert of the Day (ask server)', price: '110', badge: '', isAvailable: true }
      ]
    }
  ]
};

// Default entry point fallback
export const INITIAL_MENU_DATA = INITIAL_DRINKS_MENU_DATA;
