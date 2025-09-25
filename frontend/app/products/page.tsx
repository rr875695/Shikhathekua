// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import Image from 'next/image'
// import { userAPI } from '../lib/api'
// import { apiRequest } from '@/app/lib/api'

// // TypeScript interfaces
// interface Product {
//   id: string
//   name: string
//   price: number
//   image?: string
//   description?: string
//   flavor?: string
//   category?: string
// }

// interface CartItem extends Product {
//   quantity: number
// }

// export default function Products() {
//   const [products, setProducts] = useState<Product[]>([])
//   const [selectedVariety, setSelectedVariety] = useState<string>('all')
//   const [priceRange, setPriceRange] = useState<number>(300)
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
//   const [loading, setLoading] = useState<boolean>(true)

//   // Fetch products and check login
//   useEffect(() => {
//     const savedUser = localStorage.getItem('thekua_user')
//     setIsLoggedIn(!!savedUser)

//     apiRequest('/products', 'GET')
//       .then((data) => {
//         if (Array.isArray(data)) {
//           const mapped = data.map((p: any) => ({
//             id: p._id,
//             name: p.name,
//             price: p.price,
//             image: p.image || '/sugar.jpeg',
//             description: p.description || '',
//             flavor: p.flavor || '',
//             category: p.category || '',
//           }))
//           setProducts(mapped)
//         } else {
//           setProducts([])
//         }
//       })
//       .catch(() => setProducts([]))
//       .finally(() => setLoading(false))
//   }, [])

//   // Filtered products
//   const filteredProducts = products.filter((product) => {
//     const varietyMatch =
//       selectedVariety === 'all' ||
//       product.category?.toLowerCase().includes(selectedVariety.toLowerCase())
//     const priceMatch = product.price <= priceRange
//     return varietyMatch && priceMatch
//   })

//   // Add to cart handler
//   const handleAddToCart = async (product: Product) => {
//     if (!isLoggedIn) {
//       alert('Please login first to add items to cart!')
//       window.location.href = '/login'
//       return
//     }

//     try {
//       const cartResponse = await userAPI.getCart()
//       let cartItems: CartItem[] = cartResponse.cart || []

//       const existingItem = cartItems.find((item) => item.id === product.id)

//       if (existingItem) {
//         cartItems = cartItems.map((item) =>
//           item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
//         )
//       } else {
//         cartItems.push({ ...product, quantity: 1 })
//       }

//       await userAPI.updateCart(cartItems)
//       alert(`${product.name} added to cart!`)
//     } catch (error) {
//       console.error('Error adding to cart:', error)
//       alert('Error adding item to cart. Please try again.')
//     }
//   }

//   const getSafeImageSrc = (src?: string) => {
//     if (!src || typeof src !== 'string') return '/sugar.jpeg'
//     const trimmed = src.trim()
//     if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
//     return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
//   }

//   const isExternal = (src: string) => src.startsWith('http://') || src.startsWith('https://')

//   if (loading) return <div className="text-center mt-10">Loading products...</div>

//   return (
//     <div className="products-page">
//       <div className="container">
//         <h1 className="page-title">Our Thekua Collection</h1>

//         {/* Filters */}
//         <div className="filters-section">
//           <div className="filter-group">
//             <label>Price Range: ₹{priceRange}</label>
//             <input
//               type="range"
//               min={100}
//               max={300}
//               value={priceRange}
//               onChange={(e) => setPriceRange(Number(e.target.value))}
//               className="price-slider"
//             />
//           </div>

//           <div className="filter-group">
//             <label>Variety:</label>
//             <select
//               value={selectedVariety}
//               onChange={(e) => setSelectedVariety(e.target.value)}
//               className="variety-select"
//             >
//               <option value="all">All Varieties</option>
//               <option value="sugar">Sugar Thekua</option>
//               <option value="flavoured">Flavoured Thekua</option>
//               <option value="fruit">Fruit Thekua</option>
//               <option value="dry">Dry Fruit Thekua</option>
//               <option value="cardamom">Cardamom Thekua</option>
//               <option value="coconut">Coconut Thekua</option>
//             </select>
//           </div>
//         </div>

//         {/* Products Grid */}
//         <div className="products-grid">
//           {filteredProducts.map((product) => {
//             const safeSrc = getSafeImageSrc(product.image)
//             const external = isExternal(safeSrc)
//             return (
//               <div key={product.id} className="product-card">
//                 <div className="product-image">
//                   {external ? (
//                     <img
//                       src={safeSrc}
//                       alt={product.name}
//                       width={300}
//                       height={200}
//                       className="product-img"
//                     />
//                   ) : (
//                     <Image
//                       src={safeSrc}
//                       alt={product.name}
//                       width={300}
//                       height={200}
//                       className="product-img"
//                     />
//                   )}
//                 </div>
//                 <div className="product-info">
//                   <h3 className="product-name">{product.name}</h3>
//                   {product.flavor && <p className="product-flavor">{product.flavor}</p>}
//                   {product.description && <p className="product-description">{product.description}</p>}
//                   <div className="product-price">₹{product.price}</div>
//                   <div className="product-actions">
//                     <Link href={`/products/${product.id}`} className="view-details-btn">
//                       View Details
//                     </Link>
//                     <button
//                       onClick={() => handleAddToCart(product)}
//                       className="add-to-cart-btn"
//                     >
//                       Add to Cart
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </div>
//     </div>
//   )
// }


'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { userAPI } from '../lib/api'
import { apiRequest } from '@/app/lib/api'

interface Product {
  id: string
  name: string
  price: number
  image?: string
  description?: string
  flavor?: string
  category?: string
}

interface CartItem extends Product {
  quantity: number
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedVariety, setSelectedVariety] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<number>(300)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('thekua_user')
    setIsLoggedIn(!!savedUser)

    apiRequest('/products', 'GET')
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data.map((p: any) => ({
            id: p._id,
            name: p.name,
            price: p.price,
            image: p.image || '/sugar.jpeg', // default image
            description: p.description || '',
            flavor: p.flavor || '',
            category: p.category || ''
          }))
          setProducts(mapped)
        } else {
          setProducts([])
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const filteredProducts = products.filter((product) => {
    const varietyMatch =
      selectedVariety === 'all' ||
      product.category?.toLowerCase().includes(selectedVariety.toLowerCase())
    const priceMatch = product.price <= priceRange
    return varietyMatch && priceMatch
  })

  const handleAddToCart = async (product: Product) => {
    if (!isLoggedIn) {
      alert('Please login first to add items to cart!')
      window.location.href = '/login'
      return
    }

    try {
      const cartResponse = await userAPI.getCart()
      let cartItems: CartItem[] = cartResponse.cart || []

      const existingItem = cartItems.find((item) => item.id === product.id)
      if (existingItem) {
        cartItems = cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        cartItems.push({ ...product, quantity: 1 })
      }

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
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  }

  const isExternal = (src: string) => src.startsWith('http://') || src.startsWith('https://')

  if (loading) return <div className="text-center mt-10">Loading products...</div>

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
              min={100}
              max={300}
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
                  {product.flavor && <p className="product-flavor">{product.flavor}</p>}
                  {product.description && <p className="product-description">{product.description}</p>}
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

