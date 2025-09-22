'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import './admin.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onResize = () => {
      const wide = window.innerWidth >= 1024
      setIsSidebarOpen(wide)
      if (wide) setMobileOpen(false)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <div className="admin-bg">
      <header className="admin-header">
        <div className="admin-topbar">
          <div className="admin-brand">Thekua Admin</div>
          <button
            className="admin-toggle lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            <span className={`hamburger ${mobileOpen ? 'active' : ''}`}><span></span></span>
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div className={`admin-overlay ${mobileOpen ? 'show' : ''}`} onClick={() => setMobileOpen(false)}></div>

      <div className="admin-shell">
        {/* Desktop sidebar */}
        {isSidebarOpen && (
          <aside className="admin-sidebar">
            <div className="admin-card">
              <nav className="admin-nav">
                <Link href="/admin/dashboard" className={isActive('/admin/dashboard') ? 'active' : ''}>🏠 Dashboard</Link>
                <Link href="/admin/products" className={isActive('/admin/products') ? 'active' : ''}>🧺 Products</Link>
                <Link href="/admin/products/new" className={isActive('/admin/products/new') ? 'active' : ''}>➕ Add Product</Link>
                <Link href="/admin/orders" className={isActive('/admin/orders') ? 'active' : ''}>📦 Orders</Link>
                <Link href="/admin/users" className={isActive('/admin/users') ? 'active' : ''}>👤 Users</Link>
              </nav>
            </div>
          </aside>
        )}

        {/* Mobile drawer */}
        <aside className={`sidebar-drawer ${mobileOpen ? 'open' : ''}`}>
          <div className="admin-card" style={{ height: '100%' }}>
            <nav className="admin-nav" onClick={() => setMobileOpen(false)}>
              <Link href="/admin/dashboard" className={isActive('/admin/dashboard') ? 'active' : ''}>🏠 Dashboard</Link>
              <Link href="/admin/products" className={isActive('/admin/products') ? 'active' : ''}>🧺 Products</Link>
              <Link href="/admin/products/new" className={isActive('/admin/products/new') ? 'active' : ''}>➕ Add Product</Link>
              <Link href="/admin/orders" className={isActive('/admin/orders') ? 'active' : ''}>📦 Orders</Link>
              <Link href="/admin/users" className={isActive('/admin/users') ? 'active' : ''}>👤 Users</Link>
            </nav>
          </div>
        </aside>

        <main>
          {children}
        </main>
      </div>
    </div>
  )
}


