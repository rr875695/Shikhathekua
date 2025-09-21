'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { authAPI } from '../lib/api.js'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}) {
  const [user, setUser] = useState(null)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in and verify token
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('thekua_user')
      const token = localStorage.getItem('thekua_token')
      
      if (savedUser && token) {
        try {
          // Verify token with backend
          await authAPI.verify()
          setUser(JSON.parse(savedUser))
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('thekua_user')
          localStorage.removeItem('thekua_token')
          setUser(null)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('thekua_user')
    localStorage.removeItem('thekua_token')
    setUser(null)
    setShowProfileDropdown(false)
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="header">
          <div className="container">
            <div className="logo">
              <h1>Thekua!</h1>
            </div>
            <nav className="navbar">
              <a href="/" className="nav-link">Home</a>
              <a href="/products" className="nav-link">Products</a>
              <a href="/about" className="nav-link">About</a>
              <a href="/contact" className="nav-link">Contact Us</a>
              {user ? (
                <div className="profile-container">
                  <button 
                    className="profile-btn"
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  >
                    Hi {user.name} 👤
                  </button>
             {showProfileDropdown && (
               <div className="profile-dropdown">
                 <Link href="/profile" className="dropdown-item">Profile</Link>
                 <Link href="/orders" className="dropdown-item">Orders</Link>
                 <Link href="/cart" className="dropdown-item">Cart</Link>
                 <button onClick={handleLogout} className="dropdown-item logout">Logout</button>
               </div>
             )}
                </div>
              ) : (
                <a href="/login" className="nav-link">Login/Signup</a>
              )}
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
