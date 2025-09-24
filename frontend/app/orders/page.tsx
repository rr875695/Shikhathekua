'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { userAPI } from '../lib/api'

interface OrderItem {
  id: string
  name: string
  price: number
  image: string
  description: string
  quantity: number
}

interface Order {
  id: string
  items: OrderItem[]
  totalAmount: number
  orderDate: string
  orderTime: string
  status: string
  deliveryDate?: string
  rating: number
}

interface User {
  name: string
  email: string
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadOrders = async () => {
      const savedUser = localStorage.getItem('thekua_user')
      if (savedUser) {
        const userData: User = JSON.parse(savedUser)
        setUser(userData)
        
        try {
          const ordersResponse = await userAPI.getOrders()
          const normalized: Order[] = (ordersResponse.orders || []).map((o: any) => ({
            id: o.orderId || o._id || `ord-${Math.random().toString(36).slice(2)}`,
            items: (o.items || []).map((it: any, idx: number) => ({
              id: it.id || it._id || `${o.orderId || o._id}-item-${idx}`,
              name: it.name,
              price: it.price,
              image: it.image,
              description: it.description,
              quantity: it.quantity
            })),
            totalAmount: o.totalAmount,
            orderDate: o.orderDate,
            orderTime: o.orderTime,
            status: o.status,
            deliveryDate: o.deliveryDate,
            rating: o.rating || 0
          }))
          setOrders(normalized)
        } catch (error) {
          console.error('Error loading orders:', error)
          loadSampleOrders()
        }
      } else {
        router.push('/login')
      }
    }

    loadOrders()
  }, [router])

  const loadSampleOrders = () => {
    const sampleOrders: Order[] = [
      {
        id: 'ORD001',
        items: [
          { id: '1', name: 'Sugar Thekua', price: 150, image: '/thekua1.jpg', description: 'Traditional sweet Thekua with sugar', quantity: 2 },
          { id: '2', name: 'Flavoured Thekua', price: 180, image: '/thekua1.jpg', description: 'Thekua with various flavors', quantity: 1 }
        ],
        totalAmount: 480,
        orderDate: '2024-01-15',
        orderTime: '14:30',
        status: 'delivered',
        deliveryDate: '2024-01-17',
        rating: 5
      },
      {
        id: 'ORD002',
        items: [
          { id: '3', name: 'Fruit Thekua', price: 200, image: '/thekua1.jpg', description: 'Thekua with fruit essence', quantity: 3 }
        ],
        totalAmount: 600,
        orderDate: '2024-01-20',
        orderTime: '10:15',
        status: 'shipped',
        deliveryDate: '2024-01-22',
        rating: 0
      },
      {
        id: 'ORD003',
        items: [
          { id: '1', name: 'Sugar Thekua', price: 150, image: '/thekua1.jpg', description: 'Traditional sweet Thekua with sugar', quantity: 1 }
        ],
        totalAmount: 150,
        orderDate: '2024-01-25',
        orderTime: '16:45',
        status: 'processing',
        deliveryDate: '2024-01-27',
        rating: 0
      }
    ]
    setOrders(sampleOrders)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#28a745'
      case 'shipped': return '#17a2b8'
      case 'processing': return '#ffc107'
      case 'cancelled': return '#dc3545'
      default: return '#6c757d'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered'
      case 'shipped': return 'Shipped'
      case 'processing': return 'Processing'
      case 'cancelled': return 'Cancelled'
      default: return 'Unknown'
    }
  }

  const handleRating = (orderId: string, rating: number) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, rating } : order
    ))
  }

  const handleReorder = async (order: Order) => {
    try {
      const cartResponse = await userAPI.getCart()
      let cartItems: any[] = cartResponse.cart || []

      order.items.forEach(orderItem => {
        const existingCartItem = cartItems.find(item => item.id === orderItem.id)
        if (existingCartItem) {
          cartItems = cartItems.map(item =>
            item.id === orderItem.id
              ? { ...item, quantity: item.quantity + orderItem.quantity }
              : item
          )
        } else {
          cartItems.push({ ...orderItem })
        }
      })

      await userAPI.updateCart(cartItems)
      alert('Items added to cart! Redirecting to checkout...')
      router.push('/cart')
    } catch (error) {
      console.error('Error reordering:', error)
      alert('Error adding items to cart. Please try again.')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-dashboard">
          <div className="orders-header">
            <h1>My Orders</h1>
            <p>Track your order history and manage your purchases</p>
          </div>

          {orders.length === 0 ? (
            <div className="no-orders">
              <div className="no-orders-icon">📦</div>
              <h3>No Orders Yet</h3>
              <p>Your order history will appear here once you make your first purchase.</p>
              <a href="/products" className="shop-btn">Start Shopping</a>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Order #{order.id}</h3>
                      <p className="order-date">
                        Placed on {formatDate(order.orderDate)} at {order.orderTime}
                      </p>
                    </div>
                    <div className="order-status">
                      <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>

                  <div className="order-items">
                    {order.items.map((item) => (
                      <div key={`${order.id}-${item.id}`} className="order-item">
                        <div className="item-image">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <p className="item-description">{item.description}</p>
                          <div className="item-meta">
                            <span className="item-quantity">Qty: {item.quantity}</span>
                            <span className="item-price">₹{item.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      <strong>Total: ₹{order.totalAmount}</strong>
                    </div>
                    
                    {order.status === 'delivered' && (
                      <div className="rating-section">
                        <span>Rate this order:</span>
                        <div className="star-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={`${order.id}-star-${star}`}
                              className={`star ${star <= order.rating ? 'active' : ''}`}
                              onClick={() => handleRating(order.id, star)}
                            >
                              ⭐
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="order-actions">
                      <button className="reorder-btn" onClick={() => handleReorder(order)}>
                        🔄 Reorder
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
