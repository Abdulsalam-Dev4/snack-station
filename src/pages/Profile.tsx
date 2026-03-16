import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'

declare global {
  interface Window {
    PaystackPop?: {
      setup(options: any): {
        openIframe(): void
      }
    }
  }
}

export default function Profile() {
  const navigate = useNavigate()
  const { totalAmount, walletBalance, fundWallet } = useCart()
  const [paystackReady, setPaystackReady] = useState<boolean>(false)

  useEffect(() => {
    if (window.PaystackPop) {
      setPaystackReady(true)
      return
    }

    const existingScript = document.getElementById('paystack-inline-js') as HTMLScriptElement | null
    if (existingScript) {
      if ((window as any).PaystackPop) {
        setPaystackReady(true)
      } else {
        existingScript.addEventListener('load', () => setPaystackReady(true))
      }
      return
    }

    const script = document.createElement('script')
    script.id = 'paystack-inline-js'
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => {
      console.log('Paystack script loaded')
      setPaystackReady(true)
    }
    script.onerror = () => {
      console.error('Paystack script failed to load')
      setPaystackReady(false)
      alert('Unable to load payment gateway. Please refresh the page or check network and retry.')
    }

    document.body.appendChild(script)

    // keep script in DOM, no cleanup removal; we want it globally available until page reload
    return undefined
  }, [totalAmount])

  const startPaystack = useCallback(() => {
    console.log('startPaystack', { paystackReady, paystack: window.PaystackPop })
    if (!paystackReady || !window.PaystackPop) {
      alert('Paystack script not loaded yet. Please wait a moment and retry.')
      return
    }

    const amountNGN = 1000 // minimal demo amount, can be dynamic input
    const PAYSTACK_KEY = (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string) || 'pk_test_301de0c2f9fa9725c43f099c7c35eb4cd43f5f79'

    if (!/^pk_(test|live)_/.test(PAYSTACK_KEY)) {
      alert('Paystack error: invalid public key; use pk_test_... or pk_live_... from your Paystack dashboard')
      console.error('Invalid Paystack key', PAYSTACK_KEY)
      return
    }

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_KEY,
      email: 'customer@example.com',
      amount: amountNGN * 100,
      currency: 'NGN',
      ref: `ss-${Date.now()}`,
      onClose: function () {
        alert('Payment window closed')
      },
      callback: function (response: any) {
        console.log('Paystack callback response:', response)
        if (response.status === 'success') {
          fundWallet(amountNGN)
          alert(`Payment successful. Ref: ${response.reference}`)
        } else {
          alert('Payment failed. Please try again.')
        }
      },
    })

    if (handler && typeof handler.openIframe === 'function') {
      handler.openIframe()
    } else {
      console.error('Paystack handler is invalid', handler)
      alert('Unable to open Paystack checkout. Check console for details.')
    }
  }, [paystackReady])

  const handleLogout = useCallback(() => {
    alert('Logged out (demo)')
    navigate('/')
  }, [navigate])

  return (
    <main className="px-4 pb-28 pt-5">
      <div className="mb-5 flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-brand-400 text-center leading-16 text-3xl font-bold text-white">SN</div>
        <div>
          <p className="text-xs text-slate-500">Customer</p>
          <h1 className="text-xl font-bold">User</h1>
          <p className="text-sm text-slate-600">user@email.com</p>
        </div>
      </div>

      <section className="mb-6 rounded-xlg border border-slate-200 bg-white p-4 shadow-card">
        <h2 className="text-sm font-semibold text-slate-700">Wallet Balance</h2>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-2xl font-bold text-brand-600">₦{walletBalance.toLocaleString()}</p>
          <span className="rounded-full bg-brand-100 px-2 py-1 text-xs font-semibold text-brand-700">Available</span>
        </div>
        <button
          onClick={startPaystack}
          disabled={!paystackReady}
          className={`mt-4 w-full rounded-lg px-4 py-3 text-sm font-semibold text-white ${paystackReady ? 'bg-brand-500 hover:opacity-95' : 'bg-slate-300 cursor-not-allowed'}`}
        >
          {paystackReady ? 'Paystack Fund Wallet' : 'Loading payment gateway...'}
        </button>
      </section>

      <div className="space-y-3">
        <button className="w-full rounded-lg bg-white px-4 py-3 text-left text-sm font-semibold text-slate-800 shadow-soft">
          User Profile
        </button>
        <button className="w-full rounded-lg bg-white px-4 py-3 text-left text-sm font-semibold text-slate-800 shadow-soft">
          Help
        </button>
        <button
          onClick={handleLogout}
          className="w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-soft hover:opacity-95"
        >
          Log Out
        </button>
      </div>
    </main>
  )
}
