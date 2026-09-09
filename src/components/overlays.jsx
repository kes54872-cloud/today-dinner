import { useEffect } from 'react'
import { useApp } from '../store/AppStore'
import { Icon } from './ui'
import { cx } from '../lib/format'

function useLockScroll(active) {
  useEffect(() => {
    if (!active) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [active])
}

function useEscape(active, onClose) {
  useEffect(() => {
    if (!active) return
    const h = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [active, onClose])
}

/* ── Bottom Sheet ──────────────────────────────────────
   모바일: 하단에서 올라옴 / 데스크톱: 화면 중앙 카드처럼 */
export function BottomSheet({ open, onClose, title, children, footer }) {
  useLockScroll(open)
  useEscape(open, onClose)
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-ink/40 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="animate-sheet-up relative flex max-h-[88vh] w-full flex-col rounded-t-[24px] bg-card shadow-[var(--shadow-pop)] sm:max-w-md sm:rounded-[24px]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 pb-3 pt-4">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-line-strong sm:hidden"
          />
          <h2 className="text-base font-bold text-ink">{title}</h2>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="rounded-full p-1.5 text-muted hover:bg-line/60 hover:text-ink"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>
        {footer && (
          <div className="border-t border-line px-5 py-3 pb-safe">{footer}</div>
        )}
      </div>
    </div>
  )
}

/* ── 확인 Modal ────────────────────────────────────────*/
export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  danger,
}) {
  useLockScroll(open)
  useEscape(open, onClose)
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/40 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className="animate-rise relative w-full max-w-sm rounded-[20px] bg-card p-6 text-center shadow-[var(--shadow-pop)]"
      >
        <h2 className="text-base font-bold text-ink">{title}</h2>
        {message && (
          <p className="mt-2 text-sm leading-relaxed text-muted">{message}</p>
        )}
        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-line-strong bg-card py-3 text-sm font-semibold text-ink hover:border-ink/40"
          >
            취소
          </button>
          <button
            onClick={() => {
              onConfirm?.()
              onClose?.()
            }}
            className={cx(
              'flex-1 rounded-full py-3 text-sm font-semibold text-white',
              danger
                ? 'bg-[#c0492e] hover:bg-[#a83e28]'
                : 'bg-primary hover:bg-primary-hover',
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Toast host ────────────────────────────────────────*/
export function ToastHost() {
  const { toasts } = useApp()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 sm:bottom-8">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-rise pointer-events-auto flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-pop)]"
          role="status"
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
