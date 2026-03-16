import { useMemo, useState } from 'react'
import { useCart } from '../hooks/useCart'
import type { OrderStatus } from '../types'

const tabs: OrderStatus[] = ['all', 'ongoing', 'ready', 'completed']

export default function Admin() {
  const { orders, updateOrderStatus } = useCart()
  const [status, setStatus] = useState<OrderStatus>('all')

  const filteredOrders = useMemo(() => {
    if (status === 'all') return orders
    return orders.filter((order) => order.status === status)
  }, [orders, status])

  return (
    <main className="px-4 pb-28 pt-5">
      <h1 className="mb-2 text-xl font-bold">Admin Orders</h1>
      <div className="mb-5 flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatus(tab)}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              status === tab
                ? 'bg-brand-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-xlg border border-dashed border-slate-300 bg-white p-8 text-center shadow-soft">
          <p className="text-slate-500">No orders on this status yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <article key={order.id} className="rounded-xlg border border-slate-200 bg-white p-4 shadow-card">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h2 className="text-sm font-semibold">Order #{order.id}</h2>
                  <p className="text-xs text-slate-500">{order.createdAt}</p>
                  <p className="text-xs text-slate-500">Customer: {order.customerName}</p>
                  <p className="text-xs text-slate-500">Phone: {order.customerPhone || 'N/A'}</p>
                  <p className="text-xs text-slate-500">Location: {order.customerLocation || 'N/A'}</p>
                  <p className="text-xs text-slate-500">{order.items.length} items</p>
                </div>
                <span className="rounded-full bg-brand-50 px-2 py-1 text-[11px] font-semibold text-brand-700">{order.status}</span>
              </div>

              <ul className="mb-3 text-sm text-slate-700">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₦{(item.quantity * item.price).toLocaleString()}</span>
                  </li>
                ))}
              </ul>

              <div className="mb-3 flex items-center justify-between text-sm font-bold">
                <span>Total</span>
                <span>₦{order.total.toLocaleString()}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => updateOrderStatus(order.id, 'ready')}
                  className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold hover:bg-slate-100"
                >
                  Mark Ready
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, 'completed')}
                  className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold hover:bg-slate-100"
                >
                  Mark Completed
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
