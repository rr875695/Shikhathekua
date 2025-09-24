import ProductDetailsClient from './ProductDetailsClient'

// Sample product data
const products = {
  1: {
    name: 'Sugar Thekua',
    price: 150,
    description: 'Traditional Bihar Thekua made with pure sugar, wheat flour, and ghee. Perfect for festivals and special occasions.',
    ingredients: ['Wheat Flour', 'Sugar', 'Ghee', 'Water', 'Cardamom'],
    benefits: ['Rich in carbohydrates', 'Natural sweetness', 'Traditional taste', 'Festival favorite'],
    image: '/thekua-sugar.jpg'
  },
  2: {
    name: 'Flavoured Thekua',
    price: 180,
    description: 'Modern twist on traditional Thekua with flavors like rose, kesar, and vanilla.',
    ingredients: ['Wheat Flour', 'Sugar', 'Ghee', 'Rose Water', 'Kesar', 'Vanilla'],
    benefits: ['Multiple flavors', 'Modern appeal', 'Unique taste', 'Gift option'],
    image: '/thekua-flavoured.jpg'
  },
  3: {
    name: 'Fruit Thekua',
    price: 200,
    description: 'Thekua enriched with natural fruit essences like mango, strawberry, and orange.',
    ingredients: ['Wheat Flour', 'Sugar', 'Ghee', 'Fruit Essence', 'Natural Colors'],
    benefits: ['Fruit nutrition', 'Natural flavors', 'Healthy option', 'Kids favorite'],
    image: '/thekua-fruit.jpg'
  },
  4: {
    name: 'Dry Fruit Thekua',
    price: 250,
    description: 'Premium Thekua loaded with dry fruits like almonds, cashews, and raisins.',
    ingredients: ['Wheat Flour', 'Sugar', 'Ghee', 'Almonds', 'Cashews', 'Raisins', 'Pistachios'],
    benefits: ['Rich in nutrients', 'Premium quality', 'Gift worthy', 'Energy booster'],
    image: '/thekua-dryfruit.jpg'
  },
  5: {
    name: 'Cardamom Thekua',
    price: 170,
    description: 'Aromatic Thekua with the rich flavor of cardamom.',
    ingredients: ['Wheat Flour', 'Sugar', 'Ghee', 'Cardamom Powder', 'Water'],
    benefits: ['Aromatic flavor', 'Digestive properties', 'Traditional recipe', 'Festival special'],
    image: '/thekua-cardamom.jpg'
  },
  6: {
    name: 'Coconut Thekua',
    price: 160,
    description: 'Thekua with the tropical taste of coconut.',
    ingredients: ['Wheat Flour', 'Sugar', 'Ghee', 'Coconut', 'Water'],
    benefits: ['Tropical taste', 'Coconut nutrition', 'Unique flavor', 'Moist texture'],
    image: '/thekua-coconut.jpg'
  }
}

// ✅ Correct typing for generateStaticParams
export function generateStaticParams(): { id: string }[] {
  return Object.keys(products).map((id) => ({ id }))
}

// ✅ Correct typing for page component
export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products[params.id as keyof typeof products]
  return <ProductDetailsClient product={product} />
}
