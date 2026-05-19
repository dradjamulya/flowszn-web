'use client'

import Link from 'next/link'
import { Eye, EyeOff, X } from 'lucide-react'
import { useState } from 'react'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background: '#1E1E1A',
      }}
    >
      {/* Background */}
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

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(30, 30, 26, 0.62)',
          zIndex: 1,
        }}
      />

      {/* Logo atas */}
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

      {/* Register wrapper */}
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
          {/* Close button */}
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

          {/* Register card */}
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
            <form onSubmit={(event) => event.preventDefault()}>
              {/* Name */}
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

              {/* Email */}
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

              {/* Password */}
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

              {/* Confirm Password */}
              <div style={{ marginBottom: '54px' }}>
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

              {/* Login link */}
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

              {/* Register button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#4C4A45',
                  color: '#F3EEE5',
                  fontSize: '20px',
                  fontFamily: 'var(--font-playfair)',
                  cursor: 'pointer',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                }}
              >
                Register
              </button>
            </form>
          </section>
        </div>
      </div>

      {/* Tagline bawah */}
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

      {/* Responsive + hide browser default password eye */}
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