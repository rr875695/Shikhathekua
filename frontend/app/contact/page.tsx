'use client'

import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', address: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="contact-page">
      <div className="container">
        <h1 className="page-title">Contact Us</h1>
        
        <div className="contact-content">
          <div className="contact-form-section">
            <h2>Get in Touch</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email ID *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Your complete address"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="form-textarea"
                  placeholder="Tell us about your Thekua requirements..."
                />
              </div>
              
              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
          
          <div className="contact-info-section">
            <h2>Our Location</h2>
            <div className="map-container">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.5270753603!2d85.86151047441314!3d26.179527291215923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39edb75b85cc6827%3A0x6323aca3b97a9fe1!2sDarbhanga%20College%20of%20Engineering%2C%20Dar1bhanga!5e0!3m2!1sen!2sin!4v1758280144290!5m2!1sen!2sin" width="500" height="200" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
            
            <div className="contact-details">
              <h3>Contact Information</h3>
              <div className="contact-item">
                <strong>Address:</strong>
                
                <p>123 Thekua Street<br />Patna, Bihar 800001<br />India</p>
              </div>
              
              <div className="contact-item">
                <strong>Phone:</strong>
                <p>+91 98765 43210</p>
              </div>
              
              <div className="contact-item">
                <strong>Email:</strong>
                <p>info@thekua.com</p>
              </div>
              
              <div className="contact-item">
                <strong>Business Hours:</strong>
                <p>Monday - Sunday: 9:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
