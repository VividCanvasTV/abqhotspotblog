'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Invalid credentials')
      } else {
        toast.success('Login successful!')
        router.push('/admin')
      }
    } catch (error) {
      toast.error('Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style jsx>{`
        input::placeholder {
          color: #6B7280 !important;
          opacity: 1;
        }
        input::-webkit-input-placeholder {
          color: #6B7280 !important;
        }
        input::-moz-placeholder {
          color: #6B7280 !important;
          opacity: 1;
        }
        input:-ms-input-placeholder {
          color: #6B7280 !important;
        }
      `}</style>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#DC2626',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#DC2626',
              marginBottom: '10px'
            }}>
              ABQ Hotspot
            </h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              Admin Dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@abqhotspot.news"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '16px',
                  color: '#111827',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#DC2626'
                  e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#D1D5DB'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '16px',
                  color: '#111827',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#DC2626'
                  e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#D1D5DB'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: isLoading ? '#9CA3AF' : '#DC2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{
            marginTop: '30px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#6B7280',
            padding: '20px',
            backgroundColor: '#F9FAFB',
            borderRadius: '6px'
          }}>
            <p style={{ margin: '0 0 5px 0', fontWeight: '500' }}>Demo credentials:</p>
            <p style={{ margin: '0 0 3px 0' }}>Email: admin@abqhotspot.news</p>
            <p style={{ margin: 0 }}>Password: admin123</p>
          </div>
        </div>
      </div>
    </>
  )
} 