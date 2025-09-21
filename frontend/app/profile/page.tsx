'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { userAPI } from '../../lib/api.js'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    dateOfBirth: ''
  })
  const [profileImage, setProfileImage] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      const savedUser = localStorage.getItem('thekua_user')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          mobile: userData.mobile || '',
          dateOfBirth: userData.dateOfBirth || ''
        })
        
        try {
          // Load profile from backend
          const profileResponse = await userAPI.getProfile()
          const backendUser = profileResponse.user
          setUser(backendUser)
          setFormData({
            name: backendUser.name || '',
            email: backendUser.email || '',
            mobile: backendUser.mobile || '',
            dateOfBirth: backendUser.dob || ''
          })
        } catch (error) {
          console.error('Error loading profile:', error)
          // Use localStorage data as fallback
        }
      } else {
        router.push('/login')
      }
    }

    loadProfile()
  }, [router])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      // Update profile on backend
      const updateData = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        dob: formData.dateOfBirth,
        avatar: profileImage
      }
      
      const response = await userAPI.updateProfile(updateData)
      const updatedUser = response.user
      
      // Update localStorage
      localStorage.setItem('thekua_user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile. Please try again.')
    }
  }

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-dashboard">
          <div className="profile-header">
            <h1>My Profile</h1>
            <p>Manage your account information and preferences</p>
          </div>

          <div className="profile-content">
            <div className="profile-avatar-section">
              <div className="avatar-container">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="profile-avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    <span className="avatar-initials">{getInitials(user.name)}</span>
                  </div>
                )}
                <div className="avatar-upload">
                  <input
                    type="file"
                    id="profile-image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="profile-image" className="upload-btn">
                    📷 Upload Photo
                  </label>
                </div>
              </div>
            </div>

            <div className="profile-form-section">
              <div className="form-header">
                <h2>Personal Information</h2>
                <button 
                  className="edit-btn"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <form className="profile-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mobile">Mobile Number</label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button type="button" className="save-btn" onClick={handleSave}>
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}