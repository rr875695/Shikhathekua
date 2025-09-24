'use client'

import { useState } from 'react'
import Link from 'next/link'

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

// Type for route parameters
type ProductPageProps = {
  params: {
    id: string
  }
}

export default function ProductDetails({ params }: ProductPageProps) {
  const product = products[params.id as keyof typeof products]
  const [addedToCart, setAddedToCart] = useState(false)

  if (!product) {
    return (
      <div className="product-details-page">
        <div className="container">
          <h1>Product not found</h1>
          <Link href="/products" className="back-btn">← Back to Products</Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    console.log(`Added to cart: ${product.name}`)
    setAddedToCart(true)
    alert(`${product.name} added to cart!`)
    // Here you can integrate your real cart API
  }

  const handleBuyNow = () => {
    alert(`Proceeding to buy ${product.name}`)
    // Here you can integrate your real checkout flow
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

            <section className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </section>

            <section className="product-ingredients">
              <h3>Ingredients</h3>
              <ul>
                {product.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
              </ul>
            </section>

            <section className="product-benefits">
              <h3>Benefits</h3>
              <ul>
                {product.benefits.map((benefit, idx) => <li key={idx}>{benefit}</li>)}
              </ul>
            </section>

            <div className="product-actions">
              <button 
                className="add-to-cart-btn" 
                onClick={handleAddToCart} 
                disabled={addedToCart}
              >
                {addedToCart ? 'Added to Cart' : 'Add to Cart'}
              </button>
              <button className="buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
