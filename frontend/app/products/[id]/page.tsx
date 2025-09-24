import { PageProps } from 'next/types'
import Link from 'next/link'

const thekuaDetails = {
  1: {
    name: 'Sugar Thekua',
    price: 150,
    description: 'Traditional Bihar Thekua made with pure sugar, wheat flour, and ghee. This classic recipe has been passed down through generations and is perfect for festivals and special occasions.',
    ingredients: ['Wheat Flour', 'Sugar', 'Ghee', 'Water', 'Cardamom'],
    benefits: ['Rich in carbohydrates', 'Natural sweetness', 'Traditional taste', 'Festival favorite'],
    image: '/thekua-sugar.jpg'
  },
  2: {
    name: 'Flavoured Thekua',
    price: 180,
    description: 'Modern twist on traditional Thekua with various flavors like rose, kesar, and vanilla. Perfect for those who love traditional taste with a contemporary touch.',
    ingredients: ['Wheat Flour', 'Sugar', 'Ghee', 'Rose Water', 'Kesar', 'Vanilla'],
    benefits: ['Multiple flavors', 'Modern appeal', 'Unique taste', 'Gift option'],
    image: '/thekua-flavoured.jpg'
  },
  3: {
    name: 'Fruit Thekua',
    price: 200,
    description: 'Thekua enriched with natural fruit essences like mango, strawberry, and orange. A healthy and delicious option for health-conscious individuals.',
    ingredients: ['Wheat Flour', 'Sugar', 'Ghee', 'Fruit Essence', 'Natural Colors'],
    benefits: ['Fruit nutrition', 'Natural flavors', 'Healthy option', 'Kids favorite'],
    image: '/thekua-fruit.jpg'
  },
  4: {
    name: 'Dry Fruit Thekua',
    price: 250,
    description: 'Premium Thekua loaded with dry fruits like almonds, cashews, and raisins. A luxurious treat perfect for special occasions and gifting.',
    ingredients: ['Wheat Flour', 'Sugar', 'Ghee', 'Almonds', 'Cashews', 'Raisins', 'Pistachios'],
    benefits: ['Rich in nutrients', 'Premium quality', 'Gift worthy', 'Energy booster'],
    image: '/thekua-dryfruit.jpg'
  },
  5: {
    name: 'Cardamom Thekua',
    price: 170,
    description: 'Aromatic Thekua with the rich flavor of cardamom. This traditional recipe brings the authentic taste of Bihar with a delightful aroma.',
    ingredients: ['Wheat Flour', 'Sugar', 'Ghee', 'Cardamom Powder', 'Water'],
    benefits: ['Aromatic flavor', 'Digestive properties', 'Traditional recipe', 'Festival special'],
    image: '/thekua-cardamom.jpg'
  },
  6: {
    name: 'Coconut Thekua',
    price: 160,
    description: 'Thekua with the tropical taste of coconut. A perfect blend of traditional Bihar recipe with the sweetness of coconut.',
    ingredients: ['Wheat Flour', 'Sugar', 'Ghee', 'Coconut', 'Water'],
    benefits: ['Tropical taste', 'Coconut nutrition', 'Unique flavor', 'Moist texture'],
    image: '/thekua-coconut.jpg'
  }
}

type Params = {
  id: string
}

export default function ProductDetails({ params }: PageProps<Params>) {
  const product = thekuaDetails[params.id as keyof typeof thekuaDetails]

  if (!product) {
    return (
      <div className="product-details-page">
        <div className="container">
          <h1>Product not found</h1>
          <Link href="/products" className="back-btn">Back to Products</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="product-details-page">
      <div className="container">
        <Link href="/products" className="back-btn">← Back to Products</Link>
        
        <div className="product-details-content">
          <div className="product-image-section">
            <img src={product.image} alt={product.name} className="product-image" />
          </div>
          
          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-price">₹{product.price}</div>
            
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
            
            <div className="ingredients">
              <h3>Ingredients</h3>
              <ul>
                {product.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            
            <div className="benefits">
              <h3>Benefits</h3>
              <ul>
                {product.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
            
            <div className="product-actions">
              <button className="add-to-cart-btn">Add to Cart</button>
              <button className="buy-now-btn">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
