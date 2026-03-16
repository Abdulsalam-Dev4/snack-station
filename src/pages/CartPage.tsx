import { useState } from 'react'
import { useCart } from '../hooks/useCart'

type DeliveryMode = 'pickup' | 'delivery'

export default function CartPage() {
  const { cart, totalAmount, removeFromCart, clearCart, walletBalance, debitWallet, createOrder } = useCart()
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerLocation, setCustomerLocation] = useState('')

  const checkout = () => {
    if (!cart.length) return

    if (!deliveryMode) {
      alert('Please select Pickup or Delivery before checking out.')
      return
    }

    if (deliveryMode === 'delivery') {
      if (!customerName.trim() || !customerPhone.trim() || !customerLocation.trim()) {
        alert('For delivery, name, phone, and location are required.')
        return
      }
    }

    if (totalAmount > walletBalance) {
      alert(`Insufficient wallet balance. Current balance: ₦${walletBalance.toLocaleString()}. Please fund your wallet.`)
      return
    }

    const success = debitWallet(totalAmount)
    if (!success) {
      alert('Unable to complete checkout due to low wallet balance.')
      return
    }

    const order = createOrder(
      cart,
      totalAmount,
      deliveryMode === 'delivery' ? customerName.trim() : 'Pickup Customer',
      deliveryMode === 'delivery' ? customerPhone.trim() : '',
      deliveryMode === 'delivery' ? customerLocation.trim() : 'Pickup',
    )

    if (deliveryMode === 'delivery') {
      alert(`Delivery order for ${customerName.trim()} placed. Phone: ${customerPhone.trim()}. Location: ${customerLocation.trim()}. Order #${order.id}. Total: ₦${totalAmount.toLocaleString()}. New balance: ₦${(walletBalance - totalAmount).toLocaleString()}`)
    } else {
      alert(`Pickup order placed. Order #${order.id}. Total: ₦${totalAmount.toLocaleString()}. New balance: ₦${(walletBalance - totalAmount).toLocaleString()}`)
    }

    clearCart()
    setDeliveryMode(null)
    setCustomerName('')
    setCustomerPhone('')
    setCustomerLocation('')
  }

  return (
    <main className="px-4 pb-28 pt-5">
      <h1 className="mb-3 text-xl font-bold">My Cart</h1>
      <p className="mb-3 text-sm text-slate-500">Wallet Balance: ₦{walletBalance.toLocaleString()}</p>

      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
        <p className="mb-2 font-semibold">Choose Delivery Mode</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDeliveryMode('pickup')}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${deliveryMode === 'pickup' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Pickup
          </button>
          <button
            onClick={() => setDeliveryMode('delivery')}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${deliveryMode === 'delivery' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Delivery
          </button>
        </div>

        {deliveryMode === 'delivery' && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Name</label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Phone</label>
              <input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Enter your contact number"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Delivery Location</label>
              <input
                value={customerLocation}
                onChange={(e) => setCustomerLocation(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Enter delivery location"
              />
            </div>
          </div>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="rounded-xlg border border-dashed border-slate-300 bg-white p-8 text-center shadow-soft">
          <p className="text-slate-500">Your cart is empty</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => (
            <article key={item.id} className="rounded-xlg border border-slate-200 bg-white p-4 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-2 text-xs text-red-600 underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}

          <div className="rounded-xlg border border-slate-200 bg-white p-4 shadow-card">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
              <span>Total</span>
              <span>₦{totalAmount.toLocaleString()}</span>
            </div>
            <button
              onClick={checkout}
              className="w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
