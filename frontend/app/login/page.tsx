'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const API_BASE_URL = 'https://shikhathekua.onrender.com/'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        })
        const data = await response.json()
        if (response.ok) {
          localStorage.setItem('thekua_token', data.token)
          localStorage.setItem('thekua_user', JSON.stringify(data.user))
          alert('Login successful! Welcome to Thekua!')
          router.push('/')
        } else {
          setError(data.message || 'Login failed')
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match!')
          setLoading(false)
          return
        }
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          })
        })
        const data = await response.json()
        if (response.ok) {
          localStorage.setItem('thekua_token', data.token)
          localStorage.setItem('thekua_user', JSON.stringify(data.user))
          alert('Account created successfully! Welcome to Thekua!')
          router.push('/')
        } else {
          setError(data.message || 'Signup failed')
        }
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-header">
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <p>{isLogin ? 'Welcome back to Thekua!' : 'Join us for the best Thekua experience!'}</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="auth-tabs">
            <button className={`tab-btn ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)} disabled={loading}>Login</button>
            <button className={`tab-btn ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)} disabled={loading}>Sign Up</button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required={!isLogin} className="form-input" placeholder="Enter your full name" disabled={loading} />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" placeholder="Enter your email" disabled={loading} />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className="form-input" placeholder="Enter your password" disabled={loading} />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required={!isLogin} className="form-input" placeholder="Confirm your password" disabled={loading} />
              </div>
            )}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button className="link-btn" onClick={() => setIsLogin(!isLogin)} disabled={loading}>
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
            <Link href="/" className="back-home">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
