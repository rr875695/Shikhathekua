'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { userAPI } from '../lib/api'
import { apiRequest } from '@/app/lib/api'

const thekuaVarieties = [
  { id: 1, name: 'Sugar Thekua', price: 150, image: '/sugar.jpeg', description: 'Traditional sweet Thekua with sugar', flavor: 'Traditional Sweet' },
  { id: 2, name: 'Flavoured Thekua', price: 180, image: '/flavour.webp', description: 'Thekua with various flavors', flavor: 'Mixed Flavors' },
  { id: 3, name: 'Mango Thekua', price: 200, image: '/fruit.jpeg', description: 'Delicious Thekua with mango flavor', flavor: 'Fruity Fresh' },
  { id: 4, name: 'Orange Thekua', price: 190, image: '/fruit.jpeg', description: 'Tangy Thekua with orange essence', flavor: 'Fruity Fresh' },
  { id: 5, name: 'Apple Thekua', price: 195, image: '/fruit.jpeg', description: 'Sweet Thekua with apple flavor', flavor: 'Fruity Fresh' },
  { id: 6, name: 'Banana Thekua', price: 185, image: '/fruit.jpeg', description: 'Creamy Thekua with banana taste', flavor: 'Fruity Fresh' },
  { id: 7, name: 'Dry Fruit Thekua', price: 250, image: '/dryfruit.jpg', description: 'Thekua with dry fruits', flavor: 'Nutty Rich' },
  { id: 8, name: 'Cardamom Thekua', price: 170, image: '/cardamom.jpeg', description: 'Thekua with cardamom flavor', flavor: 'Aromatic Spice' },
  { id: 9, name: 'Coconut Thekua', price: 160, image: '/coconut.jpg', description: 'Thekua with coconut', flavor: 'Tropical Delight' },
]

export default function Products() {
  const [selectedVariety, setSelectedVariety] = useState('all')
  const [priceRange, setPriceRange] = useState(300)
  const [dynamicProducts, setDynamicProducts] = useState<any[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('thekua_user')
    setIsLoggedIn(!!savedUser)
    // Load products from backend
    apiRequest('/products', 'GET').then((data) => setDynamicProducts(data || [])).catch(() => setDynamicProducts([]))
  }, [])

  const allProducts = dynamicProducts.map((p) => ({ id: p._id, name: p.name, price: p.price, image: p.image || '/sugar.jpeg', description: p.description || '' }))

  const filteredProducts = allProducts.filter(product => {
    const varietyMatch = selectedVariety === 'all' || product.name.toLowerCase().includes(selectedVariety.toLowerCase())
    const priceMatch = product.price <= priceRange
    return varietyMatch && priceMatch
  })

  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      alert('Please login first to add items to cart!')
      window.location.href = '/login'
      return
    }

    try {
      // Get current cart from backend
      const cartResponse = await userAPI.getCart()
      let cartItems = cartResponse.cart || []

      // Check if item already exists in cart
      const existingItem = cartItems.find(item => item.id === product.id)
      
      if (existingItem) {
        // Update quantity if item exists
        cartItems = cartItems.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // Add new item to cart
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description,
          quantity: 1
        })
      }

      // Update cart on backend
      await userAPI.updateCart(cartItems)
      alert(`${product.name} added to cart!`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Error adding item to cart. Please try again.')
    }
  }

  const getSafeImageSrc = (src?: string) => {
    if (!src || typeof src !== 'string') return '/sugar.jpeg'
    const trimmed = src.trim()
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
    // Ensure relative paths always start with '/'
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  }

  const isExternal = (src: string) => src.startsWith('http://') || src.startsWith('https://')

  return (
    <div className="products-page">
      <div className="container">
        <h1 className="page-title">Our Thekua Collection</h1>
        
        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Price Range: ₹{priceRange}</label>
            <input
              type="range"
              min="100"
              max="300"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="price-slider"
            />
          </div>
          
          <div className="filter-group">
            <label>Variety:</label>
            <select
              value={selectedVariety}
              onChange={(e) => setSelectedVariety(e.target.value)}
              className="variety-select"
            >
              <option value="all">All Varieties</option>
              <option value="sugar">Sugar Thekua</option>
              <option value="flavoured">Flavoured Thekua</option>
              <option value="fruit">Fruit Thekua</option>
              <option value="dry">Dry Fruit Thekua</option>
              <option value="cardamom">Cardamom Thekua</option>
              <option value="coconut">Coconut Thekua</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const safeSrc = getSafeImageSrc(product.image)
            const external = isExternal(safeSrc)
            return (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {external ? (
                    <img
                      src={safeSrc}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="product-img"
                    />
                  ) : (
                    <Image
                      src={safeSrc}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="product-img"
                    />
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-flavor">{product.flavor}</p>
                  <p className="product-description">{product.description}</p>
                  <div className="product-price">₹{product.price}</div>
                  <div className="product-actions">
                    <Link href={`/products/${product.id}`} className="view-details-btn">
                      View Details
                    </Link>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="add-to-cart-btn"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
