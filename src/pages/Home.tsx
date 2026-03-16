import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { menuItems } from '../data/menuData'
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
import hero1 from '../assets/menu5.jpeg'
import hero2 from '../assets/menu6.jpeg'
import hero3 from '../assets/menu7.jpeg'
import hero4 from '../assets/menu8.jpeg'

const heroImages = [
  {
    src: hero1,
    title: ' Chicken Fries',
    subtitle: 'Wawuuu',
  },
  {
    src: hero2,
    title: 'Burger',
    subtitle: 'Hot and fresh',
  },
  {
    src: hero3,
    title: 'Milk Shake',
    subtitle: 'Fruity and rich',
  },
  {
    src: hero4,
    title: 'Shawarma',
    subtitle: 'Loaded with flavor',
  },
]

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0)
  const [paystackReady, setPaystackReady] = useState(false)
  const { addToCart, totalItems, fundWallet } = useCart()
  const navigate = useNavigate()

  const popular = useMemo(() => menuItems, [])

  const startPaystack = useCallback(
    (amountNGN: number) => {
      if (!paystackReady || !window.PaystackPop) {
        alert('Paystack script not loaded yet. Please wait a moment and retry.')
        return
      }

      if (amountNGN <= 0) {
        alert('Invalid amount. Please enter a positive number.')
        return
      }

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
    },
    [paystackReady, fundWallet],
  )

  const handleFundWallet = () => {
    const amountInput = window.prompt('Enter amount to fund (NGN):')
    if (!amountInput) return

    const amount = Number(amountInput.replace(/[^\d.]/g, ''))
    if (!amount || amount <= 0) {
      alert('Please enter a valid positive amount.')
      return
    }

    startPaystack(amount)
  }

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
    script.onload = () => setPaystackReady(true)
    script.onerror = () => {
      console.error('Paystack script failed to load')
      alert('Unable to load payment gateway. Please refresh the page and try again.')
    }

    document.body.appendChild(script)

    return () => {
      // we don't remove script from DOM, keep it for session life
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="px-4 pb-28 pt-4 bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 pb-3 pt-2 backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600">
            <span className="text-red-600">Snack</span>{' '}
            <span className="text-red-600">Station</span>{' '}
            Pickup
          </span>
          <div className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">Oye Ekiti</div>
          <button
            onClick={() => navigate('/admin')}
            className="rounded-full border border-slate-200 px-2 py-1 text-xs"
          >
            Admin
          </button>
          <div className="relative rounded-full border border-slate-200 px-2 py-1 text-sm">🛒 <span className="ml-1 text-xs font-bold text-red-600">{totalItems}</span></div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome, Abdulsalam</h1>
            <p className="text-sm text-slate-500">What would you like to eat today?</p>
          </div>
          <button onClick={handleFundWallet} className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">Fund Wallet +</button>
        </div>
      </header>

      <section className="relative mt-4 mb-4 overflow-hidden rounded-xlg bg-white shadow-card">
        <div className="h-64 w-full overflow-hidden bg-slate-100">
          <img
            src={heroImages[heroIndex].src}
            alt={heroImages[heroIndex].title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
        <div className="absolute inset-0 p-4">
          <h2 className="text-xl font-black">{heroImages[heroIndex].subtitle}</h2>
          <p className="text-sm">{heroImages[heroIndex].title}</p>
        </div>
        <div className="absolute bottom-2 left-2 flex gap-1">
          {heroImages.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 w-8 rounded-full ${
                idx === heroIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      <section className="mb-4">
        <div className="mb-3 rounded-xl bg-slate-900 p-3 text-center">
          <h2 className="text-2xl font-black tracking-widest text-white">MENU</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {popular.map((item) => (
            <article key={item.id} className="rounded-xlg border border-slate-200 bg-white p-4 shadow-card transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex flex-col items-start gap-2">
                <h3 className="text-2xl font-black text-slate-900">{item.name}</h3>
                <p className="text-lg font-extrabold text-red-600">₦{item.price.toLocaleString()}</p>
              </div>
              <div className="my-3 h-48 w-full overflow-hidden rounded-xl bg-slate-100">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <p className="text-sm text-slate-500">{item.description}</p>
              <button
                onClick={() => addToCart(item)}
                className="mt-4 w-full rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
              >
                Add to cart
              </button>
            </article>
          ))}
        </div>
      </section>

      <button
        onClick={() => navigate('/cart')}
        className="fixed bottom-16 left-1/2 z-40 -translate-x-1/2 rounded-full bg-red-600 px-6 py-3 text-white shadow-soft"
      >
        View Cart {totalItems > 0 ? `(${totalItems})` : ''}
      </button>
    </main>
  )
}
