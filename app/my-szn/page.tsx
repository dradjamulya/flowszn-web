'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const totalStamps = 12

type ProfileState = {
  name: string
  email: string
  whatsapp: string
  avatarUrl: string
}

const emptyProfile: ProfileState = {
  name: '',
  email: '',
  whatsapp: '',
  avatarUrl: '',
}

export default function MySznPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<ProfileState>(emptyProfile)
  const [editData, setEditData] = useState<ProfileState>(emptyProfile)

  const [userId, setUserId] = useState('')
  const [filledStamps, setFilledStamps] = useState(1)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setErrorMessage('')

        const supabase = createClient()

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          router.replace('/login')
          return
        }

        setUserId(user.id)

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, phone, role, avatar_url')
          .eq('id', user.id)
          .maybeSingle()

        if (profileError) {
          setErrorMessage(profileError.message)
          return
        }

        const defaultName =
          user.user_metadata?.full_name || user.email?.split('@')[0] || ''

        if (!profileData) {
          const { error: insertProfileError } = await supabase
            .from('profiles')
            .upsert(
              {
                id: user.id,
                full_name: defaultName,
                phone: '',
                role: 'user',
                avatar_url: '',
              },
              {
                onConflict: 'id',
              }
            )

          if (insertProfileError) {
            setErrorMessage(insertProfileError.message)
            return
          }
        }

        const userProfile: ProfileState = {
          name: profileData?.full_name || defaultName,
          email: user.email || '',
          whatsapp: profileData?.phone || '',
          avatarUrl: profileData?.avatar_url || '',
        }

        setProfile(userProfile)
        setEditData(userProfile)

        setFilledStamps(1)
      } catch {
        setErrorMessage('Failed to load profile.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    setErrorMessage('')
    setSuccessMessage('')

    if (!userId) {
      setErrorMessage('User not found. Please login again.')
      return
    }

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload an image file.')
      return
    }

    const maxSizeInMb = 2
    const maxSizeInBytes = maxSizeInMb * 1024 * 1024

    if (file.size > maxSizeInBytes) {
      setErrorMessage(`Image size must be under ${maxSizeInMb}MB.`)
      return
    }

    try {
      setUploadingAvatar(true)

      const supabase = createClient()

      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'png'
      const filePath = `${userId}/avatar-${Date.now()}.${fileExtension}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        })

      if (uploadError) {
        setErrorMessage(uploadError.message)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const avatarUrl = publicUrlData.publicUrl

      const { error: updateProfileError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: userId,
            full_name: profile.name,
            phone: profile.whatsapp,
            role: 'user',
            avatar_url: avatarUrl,
          },
          {
            onConflict: 'id',
          }
        )

      if (updateProfileError) {
        setErrorMessage(updateProfileError.message)
        return
      }

      const updatedProfile = {
        ...profile,
        avatarUrl,
      }

      setProfile(updatedProfile)
      setEditData(updatedProfile)
      setSuccessMessage('Profile photo updated successfully!')
    } catch {
      setErrorMessage('Failed to upload profile photo.')
    } finally {
      setUploadingAvatar(false)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleToggleEdit = async () => {
    setErrorMessage('')
    setSuccessMessage('')

    if (!isEditing) {
      setEditData(profile)
      setIsEditing(true)
      return
    }

    if (!editData.name.trim()) {
      setErrorMessage('Name is required!')
      return
    }

    try {
      setSaving(true)

      const supabase = createClient()

      const { error } = await supabase
        .from('profiles')
        .upsert(
          {
            id: userId,
            full_name: editData.name,
            phone: editData.whatsapp,
            role: 'user',
            avatar_url: profile.avatarUrl,
          },
          {
            onConflict: 'id',
          }
        )

      if (error) {
        setErrorMessage(error.message)
        return
      }

      const updatedProfile = {
        ...profile,
        name: editData.name,
        whatsapp: editData.whatsapp,
      }

      setProfile(updatedProfile)
      setEditData(updatedProfile)
      setIsEditing(false)
      setSuccessMessage('Profile updated successfully!')
    } catch {
      setErrorMessage('Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const profileFields: {
    label: string
    key: keyof Pick<ProfileState, 'name' | 'email' | 'whatsapp'>
    type: string
    editable: boolean
  }[] = [
    { label: 'Name', key: 'name', type: 'text', editable: true },
    { label: 'Email', key: 'email', type: 'email', editable: false },
    { label: 'Whatsapp Number', key: 'whatsapp', type: 'tel', editable: true },
  ]

  if (loading) {
    return (
      <main
        style={{
          paddingTop: '140px',
          minHeight: '100vh',
          background: '#F0EDE5',
          paddingBottom: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-playfair)',
          fontSize: '24px',
          color: 'var(--text-primary)',
        }}
      >
        Loading your profile...
      </main>
    )
  }

  return (
    <main
      style={{
        paddingTop: '140px',
        minHeight: '100vh',
        background: '#F0EDE5',
        paddingBottom: '80px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 32px' }}>
        <h1
          className="myszn-welcome"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(36px, 5vw, 64px)',
            color: 'var(--text-primary)',
            textAlign: 'right',
            marginBottom: '48px',
            lineHeight: 1.1,
          }}
        >
          Welcome back!
        </h1>

        <div className="myszn-layout">
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                top: '-22px',
                left: '24px',
                background: '#5A5A55',
                borderRadius: '999px',
                padding: '12px 28px',
                zIndex: 2,
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '18px',
                  color: 'white',
                  fontStyle: 'italic',
                  margin: 0,
                }}
              >
                Flowies Loyalty Card
              </p>
            </div>

            <div
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '60px 28px 28px',
                border: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '14px',
                  marginBottom: '28px',
                }}
              >
                {Array.from({ length: totalStamps }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '14px',
                      border: '1.5px solid #D0CCC4',
                      background: i < filledStamps ? '#F0EDE5' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    {i < filledStamps && (
                      <Image
                        src="/LOGO FLOWSZN PUTIH.svg"
                        alt="stamp"
                        width={60}
                        height={60}
                        style={{ objectFit: 'contain' }}
                      />
                    )}
                  </div>
                ))}
              </div>

              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                }}
              >
                Please contact us if there has been a mistake on the stamp
              </p>
            </div>
          </div>

          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '32px 28px',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: 'none' }}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                background: '#D4CFC6',
                border: 'none',
                padding: 0,
                cursor: uploadingAvatar ? 'not-allowed' : 'pointer',
                position: 'relative',
              }}
              title="Change profile photo"
            >
              <img
                src={profile.avatarUrl || 'https://i.pravatar.cc/80?img=47'}
                alt="profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.35)',
                  color: 'white',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                }}
                className="avatar-overlay"
              >
                Change
              </div>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                textDecoration: 'underline',
                cursor: uploadingAvatar ? 'not-allowed' : 'pointer',
                marginTop: '-8px',
              }}
            >
              {uploadingAvatar ? 'Uploading photo...' : 'Change Photo'}
            </button>

            {errorMessage && (
              <p
                style={{
                  width: '100%',
                  color: '#D94436',
                  fontSize: '13px',
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p
                style={{
                  width: '100%',
                  color: '#4C7A4C',
                  fontSize: '13px',
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                {successMessage}
              </p>
            )}

            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {profileFields.map((field) => (
                <div
                  key={field.key}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      marginBottom: '4px',
                    }}
                  >
                    {field.label}
                  </p>

                  {isEditing ? (
                    <input
                      type={field.type}
                      value={editData[field.key]}
                      disabled={!field.editable}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          [field.key]: e.target.value,
                        })
                      }
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: field.editable
                          ? 'var(--text-primary)'
                          : 'var(--text-muted)',
                        background: 'transparent',
                        cursor: field.editable ? 'text' : 'not-allowed',
                      }}
                    />
                  ) : (
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {profile[field.key] || '-'}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleToggleEdit}
              disabled={saving}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                border: 'none',
                background: isEditing ? '#22c55e' : 'var(--text-primary)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s ease',
                marginTop: '8px',
              }}
            >
              {saving ? 'Saving...' : isEditing ? 'Done' : 'Update Profile'}
            </button>

            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                border: '1.5px solid var(--text-primary)',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .myszn-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
        }

        button:hover .avatar-overlay {
          opacity: 1 !important;
        }

        @media (min-width: 768px) {
          .myszn-layout {
            grid-template-columns: 1.1fr 1fr;
            gap: 24px;
            align-items: start;
          }
        }

        @media (max-width: 767px) {
          .myszn-welcome {
            margin-bottom: 56px !important;
            text-align: center !important;
          }
        }
      `}</style>
    </main>
  )
}