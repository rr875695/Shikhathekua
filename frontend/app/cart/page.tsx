'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { userAPI } from '../../lib/api.js'

export default function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [user, setUser] = useState(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    address: '',
    contact: '',
    location: '',
    paymentMethod: 'cod'
  })
  const router = useRouter()

  useEffect(() => {
    const loadCart = async () => {
      const savedUser = localStorage.getItem('thekua_user')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        
        try {
          // Load cart from backend
          const cartResponse = await userAPI.getCart()
          setCartItems(cartResponse.cart || [])
        } catch (error) {
          console.error('Error loading cart:', error)
          alert('Error loading cart. Please try again.')
        }
      } else {
        router.push('/login')
      }
    }

    loadCart()
  }, [router])

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      return
    }

    const updatedCart = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updatedCart)
    
    try {
      await userAPI.updateCart(updatedCart)
    } catch (error) {
      console.error('Error updating cart:', error)
      alert('Error updating cart. Please try again.')
    }
  }

  const removeItem = async (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId)
    setCartItems(updatedCart)
    
    try {
      await userAPI.updateCart(updatedCart)
    } catch (error) {
      console.error('Error removing item:', error)
      alert('Error removing item. Please try again.')
    }
  }

  const clearCart = async () => {
    setCartItems([])
    
    try {
      await userAPI.updateCart([])
    } catch (error) {
      console.error('Error clearing cart:', error)
      alert('Error clearing cart. Please try again.')
    }
  }

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!')
      return
    }
    setShowCheckout(true)
  }

  const handleCheckoutInputChange = (e) => {
    const { name, value } = e.target
    setCheckoutData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const placeOrder = async () => {
    // Validate form
    if (!checkoutData.name || !checkoutData.address || !checkoutData.contact) {
      alert('Please fill in all required fields!')
      return
    }

    try {
      // Create order
      const order = {
        id: `ORD${Date.now()}`,
        items: cartItems,
        totalAmount: getTotalAmount(),
        orderDate: new Date().toISOString().split('T')[0],
        orderTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        status: 'processing',
        customerDetails: checkoutData,
        deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }

      // Save order to backend
      await userAPI.createOrder(order)

      // Clear cart
      setCartItems([])
      await userAPI.updateCart([])
      setShowCheckout(false)

      alert(`Order placed successfully! Order ID: ${order.id}`)
      router.push('/orders')
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Error placing order. Please try again.')
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-dashboard">
          <div className="cart-header">
            <h1>My Cart</h1>
            <p>Review your items and proceed to checkout</p>
            {cartItems.length > 0 && (
              <div className="cart-summary">
                <span className="item-count">{getTotalItems()} items</span>
                <span className="total-amount">Total: ₹{getTotalAmount()}</span>
              </div>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your Cart is Empty</h3>
              <p>Add some delicious Thekua to your cart!</p>
              <Link href="/products" className="shop-btn">Start Shopping</Link>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img src={item.image || '/thekua1.jpg'} alt={item.name} />
                    </div>
                    
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="item-description">{item.description || 'Delicious Thekua'}</p>
                      <div className="item-price">₹{item.price}</div>
                    </div>

                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className="item-total">
                      ₹{item.price * item.quantity}
                    </div>

                    <button 
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-actions">
                <button 
                  className="clear-cart-btn"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
                <button 
                  className="checkout-btn"
                  onClick={proceedToCheckout}
                >
                  Place Order
                </button>
              </div>
            </div>
          )}

          {showCheckout && (
            <div className="checkout-modal">
              <div className="checkout-overlay" onClick={() => setShowCheckout(false)}></div>
              <div className="checkout-form-container">
                <div className="checkout-header">
                  <h2>Place Your Order</h2>
                  <button 
                    className="close-btn"
                    onClick={() => setShowCheckout(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="checkout-content">
                  <div className="order-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-items">
                      {cartItems.map((item) => (
                        <div key={item.id} className="summary-item">
                          <span>{item.name} x {item.quantity}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="summary-total">
                      <strong>Total: ₹{getTotalAmount()}</strong>
                    </div>
                  </div>

                  <form className="checkout-form">
                    <h3>Delivery Details</h3>
                    
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={checkoutData.name}
                        onChange={handleCheckoutInputChange}
                        required
                        className="form-input"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="contact">Contact Number *</label>
                      <input
                        type="tel"
                        id="contact"
                        name="contact"
                        value={checkoutData.contact}
                        onChange={handleCheckoutInputChange}
                        required
                        className="form-input"
                        placeholder="+91 9876543210"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="address">Delivery Address *</label>
                      <textarea
                        id="address"
                        name="address"
                        value={checkoutData.address}
                        onChange={handleCheckoutInputChange}
                        required
                        className="form-textarea"
                        placeholder="Enter complete delivery address"
                        rows="3"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="location">City/Location</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={checkoutData.location}
                        onChange={handleCheckoutInputChange}
                        className="form-input"
                        placeholder="Enter your city"
                      />
                    </div>

                    <div className="form-group">
                      <label>Payment Method *</label>
                      <div className="payment-options">
                        <label className="payment-option">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={checkoutData.paymentMethod === 'cod'}
                            onChange={handleCheckoutInputChange}
                          />
                          <span className="payment-label">
                            <span className="payment-icon">💵</span>
                            Cash on Delivery
                          </span>
                        </label>

                        <label className="payment-option">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="upi"
                            checked={checkoutData.paymentMethod === 'upi'}
                            onChange={handleCheckoutInputChange}
                          />
                          <span className="payment-label">
                            <span className="payment-icon">📱</span>
                            UPI Payment
                          </span>
                        </label>

                        <label className="payment-option">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={checkoutData.paymentMethod === 'card'}
                            onChange={handleCheckoutInputChange}
                          />
                          <span className="payment-label">
                            <span className="payment-icon">💳</span>
                            Debit/Credit Card
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="checkout-actions">
                      <button 
                        type="button"
                        className="cancel-btn"
                        onClick={() => setShowCheckout(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        type="button"
                        className="place-order-btn"
                        onClick={placeOrder}
                      >
                        Place Order - ₹{getTotalAmount()}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
