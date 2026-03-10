// Sample cosmetic product data
const products = [
  // Foundation & Base
  {
    id: 1,
    name: 'Flawless Foundation',
    category: 'Foundation',
    price: 2999,
    image: 'https://via.placeholder.com/300x300?text=Flawless+Foundation',
    description: 'Long-lasting, full-coverage foundation that provides a smooth and even skin tone.',
    rating: 4.5,
    reviews: [
      { author: 'Sarah', text: 'Amazing quality!', rating: 5 },
      { author: 'John', text: 'Great coverage', rating: 4 }
    ]
  },
  {
    id: 2,
    name: 'Glow Primer',
    category: 'Primers',
    price: 1599,
    image: 'https://via.placeholder.com/300x300?text=Glow+Primer',
    description: 'Creates a smooth base for perfect makeup application and extends wear time.',
    rating: 4.7,
    reviews: [
      { author: 'Emma', text: 'Perfect primer!', rating: 5 }
    ]
  },
  {
    id: 3,
    name: 'Shimmer Highlighter',
    category: 'Highlighters',
    price: 1299,
    image: 'https://via.placeholder.com/300x300?text=Shimmer+Highlighter',
    description: 'Adds a radiant glow and luminosity to your skin.',
    rating: 4.6,
    reviews: []
  },
  {
    id: 4,
    name: 'Blushing Pink Blush',
    category: 'Blush',
    price: 999,
    image: 'https://via.placeholder.com/300x300?text=Blush',
    description: 'Natural-looking blush that adds a healthy flush to your cheeks.',
    rating: 4.4,
    reviews: []
  },
  {
    id: 5,
    name: 'Classic Red Lipstick',
    category: 'Lipstick',
    price: 799,
    image: 'https://via.placeholder.com/300x300?text=Red+Lipstick',
    description: 'Iconic red lipstick with long-lasting color and comfortable wear.',
    rating: 4.8,
    reviews: []
  },
  {
    id: 6,
    name: 'Matte Lipstick Nude',
    category: 'Lipstick',
    price: 799,
    image: 'https://via.placeholder.com/300x300?text=Nude+Lipstick',
    description: 'Stunning nude shade for everyday elegance.',
    rating: 4.3,
    reviews: []
  },
  {
    id: 7,
    name: 'Waterproof Eyeliner',
    category: 'Eyeliner',
    price: 599,
    image: 'https://via.placeholder.com/300x300?text=Eyeliner',
    description: 'Precise application with waterproof formula that lasts all day.',
    rating: 4.5,
    reviews: []
  },
  {
    id: 8,
    name: 'Volumizing Mascara',
    category: 'Mascara',
    price: 899,
    image: 'https://via.placeholder.com/300x300?text=Mascara',
    description: 'Builds volume and definition for dramatic lashes.',
    rating: 4.6,
    reviews: []
  },
  {
    id: 9,
    name: 'Eyeshadow Palette',
    category: 'Eyeshadow',
    price: 1899,
    image: 'https://via.placeholder.com/300x300?text=Eyeshadow+Palette',
    description: '12 stunning shades for endless eye looks.',
    rating: 4.7,
    reviews: []
  },
  {
    id: 10,
    name: 'Setting Spray',
    category: 'Setting',
    price: 1099,
    image: 'https://via.placeholder.com/300x300?text=Setting+Spray',
    description: 'Keep your makeup fresh all day with our long-lasting setting spray.',
    rating: 4.4,
    reviews: []
  },
  {
    id: 11,
    name: 'Powder Brush Set',
    category: 'Brushes',
    price: 1499,
    image: 'https://via.placeholder.com/300x300?text=Brush+Set',
    description: 'Professional makeup brush set with 5 essential brushes.',
    rating: 4.5,
    reviews: []
  },
  {
    id: 12,
    name: 'Makeup Remover Oil',
    category: 'Skincare',
    price: 799,
    image: 'https://via.placeholder.com/300x300?text=Remover+Oil',
    description: 'Gentle makeup remover that also nourishes the skin.',
    rating: 4.6,
    reviews: []
  }
];

// Categories
const categories = [
  'Foundation',
  'Primers',
  'Highlighters',
  'Blush',
  'Lipstick',
  'Eyeliner',
  'Mascara',
  'Eyeshadow',
  'Setting',
  'Brushes',
  'Skincare'
];
