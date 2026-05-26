'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, X } from 'lucide-react'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const router = useRouter()

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleResetPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (newPassword !== confirmPassword) {
      setErrorMessage('Password does not match!')
      return
    }

    setErrorMessage('')

    // Frontend dummy dulu.
    // Nanti bagian ini diganti dengan logic reset password Supabase.
    router.push('/login')
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

      {/* Forgot password wrapper */}
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
          className="forgot-box-wrapper"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '625px',
          }}
        >
          {/* Close button */}
          <Link
            href="/login"
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

          {/* Forgot password card */}
          <section
            className="forgot-card"
            style={{
              width: '100%',
              background: '#F3EEE5',
              borderRadius: '18px',
              padding: '72px 64px 70px',
              boxShadow: '0 18px 50px rgba(0,0,0,0.2)',
            }}
          >
            <form onSubmit={handleResetPassword}>
              {/* New Password */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="new-password"
                  style={{
                    display: 'block',
                    marginBottom: '12px',
                    fontSize: '18px',
                    color: '#1E1E1A',
                    fontFamily: 'var(--font-playfair)',
                  }}
                >
                  New Password
                </label>

                <div style={{ position: 'relative' }}>
                  <input
                    id="new-password"
                    className="password-input"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Insert your password here"
                    value={newPassword}
                    onChange={(event) => {
                      setNewPassword(event.target.value)
                      setErrorMessage('')
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
                      showNewPassword ? 'Hide password' : 'Show password'
                    }
                    onClick={() => setShowNewPassword(!showNewPassword)}
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
                    {showNewPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: errorMessage ? '12px' : '72px' }}>
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
                    placeholder="Insert your password here"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value)
                      setErrorMessage('')
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
                        ? 'Hide password'
                        : 'Show password'
                    }
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
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

              {/* Error message */}
              {errorMessage && (
                <p
                  style={{
                    color: '#D94436',
                    fontSize: '17px',
                    fontFamily: 'var(--font-playfair)',
                    marginBottom: '52px',
                  }}
                >
                  {errorMessage}
                </p>
              )}

              {/* Reset button */}
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
                Reset Password
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
            .forgot-box-wrapper {
              max-width: 92vw !important;
            }

            .forgot-card {
              padding: 58px 24px 56px !important;
              border-radius: 18px !important;
            }
          }

          @media (max-width: 480px) {
            .forgot-card {
              padding: 52px 20px 50px !important;
            }

            .forgot-box-wrapper a[href="/login"] {
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