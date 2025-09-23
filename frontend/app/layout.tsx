'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { authAPI } from './lib/api'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children, }) {
  const [user, setUser] = useState(null)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('thekua_user')
      const token = localStorage.getItem('thekua_token')
      if (savedUser && token) {
        setUser(JSON.parse(savedUser))
        try { await authAPI.verify() } catch { localStorage.removeItem('thekua_user'); localStorage.removeItem('thekua_token'); setUser(null) }
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('thekua_user')
    localStorage.removeItem('thekua_token')
    setUser(null)
    setShowProfileDropdown(false)
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        {!pathname?.startsWith('/admin') && (
        <header className="header">
          <div className="container" style={{ gap: 12 }}>
            <div className="logo">
              <h1>Thekua!</h1>
            </div>
            <nav className="navbar">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/products" className="nav-link">Products</Link>
              <Link href="/about" className="nav-link">About</Link>
              <Link href="/contact" className="nav-link">Contact Us</Link>
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
                <div className="auth-links">
                  <a href="/login" className="nav-link">Login/Signup</a>
                  <a href="/admin/login" className="nav-link">Admin Login</a>
                </div>
              )}
            </nav>
            <button
              className="public-nav-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              <span className={`public-hamburger ${mobileOpen ? 'active' : ''}`}><span></span></span>
            </button>
          </div>
        </header>
        )}

        {/* Mobile overlay and drawer for public navbar */}
        {!pathname?.startsWith('/admin') && (
          <>
            <div className={`public-overlay ${mobileOpen ? 'show' : ''}`} onClick={() => setMobileOpen(false)}></div>
            <aside className={`public-drawer ${mobileOpen ? 'open' : ''}`}>
              <nav onClick={() => setMobileOpen(false)}>
                <Link href="/" className="nav-link">Home</Link>
                <Link href="/products" className="nav-link">Products</Link>
                <Link href="/about" className="nav-link">About</Link>
                <Link href="/contact" className="nav-link">Contact Us</Link>
                {user ? (
                  <>
                    <Link href="/profile" className="nav-link">Profile</Link>
                    <Link href="/orders" className="nav-link">Orders</Link>
                    <Link href="/cart" className="nav-link">Cart</Link>
                    <button onClick={handleLogout} className="nav-link" style={{ textAlign: 'left', background: 'none', border: 'none' }}>Logout</button>
                  </>
                ) : (
                  <>
                    <a href="/login" className="nav-link">Login/Signup</a>
                    <a href="/admin/login" className="nav-link">Admin Login</a>
                  </>
                )}
              </nav>
            </aside>
          </>
        )}

        {loading && (
          <div className="preloader-overlay" role="status" aria-live="polite" aria-label="Loading">
            <div className="preloader">
              <span className="preloader-ring"></span>
              <span className="preloader-core">Thekua!</span>
            </div>
          </div>
        )}

        <main>{children}</main>
      </body>
    </html>
  )
}
