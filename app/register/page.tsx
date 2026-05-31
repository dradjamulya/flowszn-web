'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, X } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setErrorMessage('')
    setSuccessMessage('')

    if (!name.trim()) {
      setErrorMessage('Name is required!')
      return
    }

    if (!email.trim()) {
      setErrorMessage('Email is required!')
      return
    }

    if (!password) {
      setErrorMessage('Password is required!')
      return
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters!')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password does not match!')
      return
    }

    try {
      setLoading(true)

      const supabase = createClient()

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) {
        setErrorMessage(error.message)
        return
      }

      const userId = data.user?.id

      if (!userId) {
        setErrorMessage('Register failed. User ID not found.')
        return
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        full_name: name,
        phone: '',
        role: 'user',
      })

      if (profileError) {
        setErrorMessage(profileError.message)
        return
      }

      setSuccessMessage('Register successful! Redirecting to login...')

      setTimeout(() => {
        router.push('/login')
      }, 1000)
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background: '#1E1E1A',
      }}
    >
      <img
        src="/IMG_9600%201.svg"
        alt="Flowszn yoga background"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(30, 30, 26, 0.62)',
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '34px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
        }}
      >
        <img
          src="/LOGO%20FLOWSZN%20PUTIH.svg"
          alt="Flowszn logo"
          style={{
            width: '78px',
            height: 'auto',
            display: 'block',
          }}
        />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 20px 100px',
        }}
      >
        <div
          className="register-box-wrapper"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '625px',
          }}
        >
          <Link
            href="/"
            style={{
              position: 'absolute',
              top: '-26px',
              left: '-24px',
              width: '52px',
              height: '52px',
              borderRadius: '999px',
              border: '1.5px solid #F3EEE5',
              background: '#4C4A45',
              color: '#F3EEE5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5,
              textDecoration: 'none',
              boxShadow: '0 6px 16px rgba(0,0,0,0.22)',
            }}
          >
            <X size={25} />
          </Link>

          <section
            className="register-card"
            style={{
              width: '100%',
              background: '#F3EEE5',
              borderRadius: '18px',
              padding: '52px 64px 70px',
              boxShadow: '0 18px 50px rgba(0,0,0,0.2)',
            }}
          >
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="name"
                  style={{
                    display: 'block',
                    marginBottom: '12px',
                    fontSize: '18px',
                    color: '#1E1E1A',
                    fontFamily: 'var(--font-playfair)',
                  }}
                >
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Insert your name here"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value)
                    setErrorMessage('')
                    setSuccessMessage('')
                  }}
                  style={{
                    width: '100%',
                    height: '46px',
                    borderRadius: '10px',
                    border: '1px solid #5F5D58',
                    background: 'transparent',
                    padding: '0 14px',
                    outline: 'none',
                    fontSize: '18px',
                    color: '#1E1E1A',
                    fontFamily: 'var(--font-playfair)',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    marginBottom: '12px',
                    fontSize: '18px',
                    color: '#1E1E1A',
                    fontFamily: 'var(--font-playfair)',
                  }}
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Insert your email here"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setErrorMessage('')
                    setSuccessMessage('')
                  }}
                  style={{
                    width: '100%',
                    height: '46px',
                    borderRadius: '10px',
                    border: '1px solid #5F5D58',
                    background: 'transparent',
                    padding: '0 14px',
                    outline: 'none',
                    fontSize: '18px',
                    color: '#1E1E1A',
                    fontFamily: 'var(--font-playfair)',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="password"
                  style={{
                    display: 'block',
                    marginBottom: '12px',
                    fontSize: '18px',
                    color: '#1E1E1A',
                    fontFamily: 'var(--font-playfair)',
                  }}
                >
                  Password
                </label>

                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    className="password-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Insert your password here"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)
                      setErrorMessage('')
                      setSuccessMessage('')
                    }}
                    style={{
                      width: '100%',
                      height: '46px',
                      borderRadius: '10px',
                      border: '1px solid #5F5D58',
                      background: 'transparent',
                      padding: '0 48px 0 14px',
                      outline: 'none',
                      fontSize: '18px',
                      color: '#1E1E1A',
                      fontFamily: 'var(--font-playfair)',
                    }}
                  />

                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '14px',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: '#4C4A45',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              <div
                style={{
                  marginBottom:
                    errorMessage || successMessage ? '14px' : '54px',
                }}
              >
                <label
                  htmlFor="confirm-password"
                  style={{
                    display: 'block',
                    marginBottom: '12px',
                    fontSize: '18px',
                    color: '#1E1E1A',
                    fontFamily: 'var(--font-playfair)',
                  }}
                >
                  Confirm Password
                </label>

                <div style={{ position: 'relative' }}>
                  <input
                    id="confirm-password"
                    className="password-input"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-insert your password here"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value)
                      setErrorMessage('')
                      setSuccessMessage('')
                    }}
                    style={{
                      width: '100%',
                      height: '46px',
                      borderRadius: '10px',
                      border: '1px solid #5F5D58',
                      background: 'transparent',
                      padding: '0 48px 0 14px',
                      outline: 'none',
                      fontSize: '18px',
                      color: '#1E1E1A',
                      fontFamily: 'var(--font-playfair)',
                    }}
                  />

                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    }
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '14px',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: '#4C4A45',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={22} />
                    ) : (
                      <Eye size={22} />
                    )}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <p
                  style={{
                    color: '#D94436',
                    fontSize: '16px',
                    fontFamily: 'var(--font-playfair)',
                    marginBottom: '22px',
                  }}
                >
                  {errorMessage}
                </p>
              )}

              {successMessage && (
                <p
                  style={{
                    color: '#4C7A4C',
                    fontSize: '16px',
                    fontFamily: 'var(--font-playfair)',
                    marginBottom: '22px',
                  }}
                >
                  {successMessage}
                </p>
              )}

              <p
                style={{
                  textAlign: 'center',
                  marginBottom: '10px',
                  color: '#1E1E1A',
                  fontSize: '17px',
                  fontFamily: 'var(--font-playfair)',
                }}
              >
                Already a Flowies?{' '}
                <Link
                  href="/login"
                  style={{
                    color: '#1E1E1A',
                    textDecoration: 'underline',
                  }}
                >
                  Log in here
                </Link>
              </p>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '10px',
                  border: 'none',
                  background: loading ? '#77746D' : '#4C4A45',
                  color: '#F3EEE5',
                  fontSize: '20px',
                  fontFamily: 'var(--font-playfair)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                }}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
          </section>
        </div>
      </div>

      <p
        style={{
          position: 'absolute',
          bottom: '58px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          color: '#F3EEE5',
          fontSize: '18px',
          fontStyle: 'italic',
          fontFamily: 'var(--font-playfair)',
          whiteSpace: 'nowrap',
        }}
      >
        Find your flow, Feel your season
      </p>

      <style>
        {`
          .password-input::-ms-reveal,
          .password-input::-ms-clear {
            display: none;
          }

          .password-input::-webkit-credentials-auto-fill-button {
            visibility: hidden;
            display: none !important;
            pointer-events: none;
          }

          @media (max-width: 767px) {
            .register-box-wrapper {
              max-width: 92vw !important;
            }

            .register-card {
              padding: 44px 24px 48px !important;
              border-radius: 18px !important;
            }
          }

          @media (max-width: 480px) {
            .register-card {
              padding: 42px 20px 44px !important;
            }

            .register-box-wrapper a[href="/"] {
              left: -12px !important;
              top: -24px !important;
            }

            main p {
              font-size: 14px !important;
            }
          }
        `}
      </style>
    </main>
  )
}