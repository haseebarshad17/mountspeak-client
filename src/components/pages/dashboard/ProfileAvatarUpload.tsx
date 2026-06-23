'use client'

import { Camera, Loader2, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useId, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase/supabase.client'
import { DEFAULT_PROFILE_AVATAR_SRC } from '@/lib/profile/default-profile-avatar'
import { isUserUploadedAvatarUrl } from '@/lib/profile/avatar-url'
import { getMessage } from '@/lib/messages/get-message'
import { MessageCode } from '@/lib/messages/codes'

const AVATAR_BUCKET = 'avatars'
const MAX_SIZE_BYTES = 2 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const ACCEPTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

type ProfileAvatarUploadProps = {
  userId: string | null
  avatarUrl: string | null
  onAvatarChange: (url: string | null) => void
  disabled?: boolean
}

function getExtension(file: File) {
  const fromName = file.name.split('.').pop()?.toLowerCase()
  if (fromName === 'jpeg') return 'jpg'
  if (fromName && ACCEPTED_EXTENSIONS.includes(fromName)) {
    return fromName === 'jpeg' ? 'jpg' : fromName
  }
  if (file.type === 'image/png') return 'png'
  if (file.type === 'image/webp') return 'webp'
  return 'jpg'
}

function isAcceptedFile(file: File) {
  if (file.type && ACCEPTED_TYPES.includes(file.type)) return true
  const ext = file.name.split('.').pop()?.toLowerCase()
  return ext ? ACCEPTED_EXTENSIONS.includes(ext) : false
}

function getStoragePathFromUrl(url: string | null) {
  if (!url) return null
  const marker = `/storage/v1/object/public/${AVATAR_BUCKET}/`
  const index = url.indexOf(marker)
  if (index === -1) return null
  return url.slice(index + marker.length).split('?')[0] || null
}

export function ProfileAvatarUpload({
  userId,
  avatarUrl,
  onAvatarChange,
  disabled = false,
}: ProfileAvatarUploadProps) {
  const inputId = useId()
  const queryClient = useQueryClient()
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const isBusy = uploading || deleting
  const canUpload = Boolean(userId) && !disabled && !isBusy
  const hasUploadedAvatar = isUserUploadedAvatarUrl(avatarUrl)
  const displayAvatarSrc = hasUploadedAvatar ? avatarUrl : DEFAULT_PROFILE_AVATAR_SRC

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file || !userId) return

    setError('')

    if (!isAcceptedFile(file)) {
      setError(getMessage(MessageCode.DASHBOARD_AVATAR_TYPE_INVALID))
      return
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError(getMessage(MessageCode.DASHBOARD_AVATAR_SIZE_INVALID))
      return
    }

    setUploading(true)
    try {
      const ext = getExtension(file)
      const path = `${userId}/avatar-${Date.now()}.${ext}`

      const previousPath = getStoragePathFromUrl(hasUploadedAvatar ? avatarUrl : null)
      if (previousPath) {
        await supabase.storage.from(AVATAR_BUCKET).remove([previousPath])
      }

      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(path, file, { contentType: file.type || `image/${ext}` })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path)

      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)

      if (updateError) throw updateError

      onAvatarChange(publicUrl)
      await queryClient.invalidateQueries({ queryKey: ['user-profile'] })
    } catch {
      setError(getMessage(MessageCode.API_AVATAR_UPLOAD_FAILED))
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (event: React.MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()

    if (!userId || !hasUploadedAvatar || !avatarUrl || isBusy || disabled) return

    setError('')
    setDeleting(true)
    try {
      const path = getStoragePathFromUrl(avatarUrl)
      if (path) {
        await supabase.storage.from(AVATAR_BUCKET).remove([path])
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: '' })
        .eq('id', userId)

      if (updateError) throw updateError

      onAvatarChange(null)
      await queryClient.invalidateQueries({ queryKey: ['user-profile'] })
    } catch {
      setError(getMessage(MessageCode.DASHBOARD_AVATAR_REMOVE_FAILED))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex w-[236px] flex-col items-start">
      <input
        id={inputId}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={!canUpload}
        onChange={handleFileChange}
      />

      <div className="relative h-[160px] w-[150px]">
        {hasUploadedAvatar ? (
          <button
            type="button"
            disabled={!userId || disabled || isBusy}
            onClick={handleDelete}
            className="absolute left-0 top-0 z-30 flex h-7 w-7 items-center justify-center bg-[#00292C] text-white transition hover:bg-[#07363d] disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Delete profile photo"
          >
            {deleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <Trash2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            )}
          </button>
        ) : null}

        <div className="relative h-full w-full overflow-hidden bg-white">
          <Image
            src={displayAvatarSrc}
            alt="Profile photo"
            fill
            className="pointer-events-none object-cover"
            sizes="150px"
            priority={!hasUploadedAvatar}
          />

          {!hasUploadedAvatar ? (
            <label
              htmlFor={canUpload ? inputId : undefined}
              onClick={(e) => {
                if (!canUpload) {
                  e.preventDefault()
                  if (!userId && !disabled) {
                    setError(getMessage(MessageCode.DASHBOARD_AVATAR_SIGN_IN_REQUIRED))
                  }
                  return
                }
                e.stopPropagation()
              }}
              className={`absolute left-1/2 top-1/2 z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/65 ${
                canUpload ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
              }`}
              aria-label="Upload profile photo"
            >
              <Camera className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </label>
          ) : null}

          {uploading ? (
            <span
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-black/60 py-1 text-center text-[10px] font-medium uppercase tracking-[0.6px] text-white"
            >
              Uploading…
            </span>
          ) : null}
        </div>
      </div>

      <p
        className="mt-2 text-[12px] leading-[18px] text-[#707979]"
      >
        JPG, PNG, or WebP · max 2MB
      </p>

      {!userId && !disabled ? (
        <p
          className="mt-1 text-xs text-[#707979]"
        >
          Sign in to upload a profile photo.
        </p>
      ) : null}

      {error ? (
        <p
          className="mt-1 text-xs font-medium text-[#BA1A1A]"
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}
