import { useEffect, useState } from 'react'

const StripeBlockBanner = () => {
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    const handleRejection = (event) => {
      try {
        const reason = event?.reason || event?.detail || ''
        const text = typeof reason === 'string' ? reason : JSON.stringify(reason)
        if (
          text.includes('r.stripe.com') ||
          text.includes('ERR_BLOCKED_BY_CLIENT') ||
          text.includes('Failed to fetch') && text.includes('https://r.stripe.com')
        ) {
          setBlocked(true)
        }
      } catch (e) {
        // ignore
      }
    }

    const handleError = (evt) => {
      try {
        const msg = evt?.message || ''
        if (msg.includes('r.stripe.com') || msg.includes('ERR_BLOCKED_BY_CLIENT')) {
          setBlocked(true)
        }
      } catch (e) {}
    }

    window.addEventListener('unhandledrejection', handleRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  if (!blocked) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: '#fff4e5',
      borderBottom: '1px solid #ffd8a8',
      color: '#92400e',
      padding: '0.75rem 1rem',
      textAlign: 'center',
      zIndex: 9999,
    }}>
      Payments may be blocked by your browser extensions (ad‑blocker). Disable blockers for this site or try a different browser to complete payments.
    </div>
  )
}

export default StripeBlockBanner
