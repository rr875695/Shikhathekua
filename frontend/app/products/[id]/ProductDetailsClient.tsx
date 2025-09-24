'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ProductDetailsClient({ product }: { product: any }) {
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
  }

  const handleBuyNow = () => {
    alert(`Proceeding to buy ${product.name}`)
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
                {product.ingredients.map((ing: string, idx: number) => <li key={idx}>{ing}</li>)}
              </ul>
            </section>

            <section className="product-benefits">
              <h3>Benefits</h3>
              <ul>
                {product.benefits.map((benefit: string, idx: number) => <li key={idx}>{benefit}</li>)}
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
