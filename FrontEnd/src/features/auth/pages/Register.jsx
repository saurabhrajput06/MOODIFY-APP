import React, { useState } from 'react'
import "../style/register.scss"
import FormGroup from '../components/FormGroup'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
  const [username, setusername] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const { handleRegister } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!username || !email || !password) {
      setError("Please fill in all fields.")
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      await handleRegister({ username, email, password })
      navigate("/")
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || err.message || "Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className='register-page'>
      {/* Animated Background Mood Blobs */}
      <div className="mood-blob blob-1"></div>
      <div className="mood-blob blob-2"></div>
      <div className="mood-blob blob-3"></div>

      <div className="form-container">
        {/* App Branding Header */}
        <div className="auth-header">
          <div className="app-logo">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#f472b6" />
                </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="10" stroke="url(#logo-grad)" strokeWidth="2" fill="none" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round" fill="none" />
              <circle cx="9" cy="9" r="1.5" fill="url(#logo-grad)" />
              <circle cx="15" cy="9" r="1.5" fill="url(#logo-grad)" />
            </svg>
          </div>
          <h1>Moodify</h1>
          <p className="subtitle">Tune into your vibe</p>
        </div>

        {/* Error Message Alert */}
        {error && (
          <div className="error-message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormGroup
            value={username}
            onchange={(e) => setusername(e.target.value)}
            label="Username"
            placeholder="Choose a username"
            type="text"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
          />

          <FormGroup
            value={email}
            onchange={(e) => setemail(e.target.value)}
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            }
          />

          <FormGroup
            value={password}
            onchange={(e) => setpassword(e.target.value)}
            label='Password'
            placeholder="Create a password"
            type={showPassword ? "text" : "password"}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            }
          >
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </FormGroup>

          <button className='submit-btn' type='submit' disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?
          <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  )
}

export default Register