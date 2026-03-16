import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartItem, FoodItem, Order, OrderStatus } from '../types'

type CartContextType = {
  cart: CartItem[]
  addToCart: (item: FoodItem) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
  totalAmount: number
  totalItems: number
  walletBalance: number
  fundWallet: (amount: number) => void
  debitWallet: (amount: number) => boolean
  orders: Order[]
  createOrder: (
    items: CartItem[],
    total: number,
    customerName: string,
    customerPhone: string,
    customerLocation: string,
  ) => Order
  updateOrderStatus: (orderId: number, status: OrderStatus) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (item: FoodItem) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id)
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  )

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  )

  const [walletBalance, setWalletBalance] = useState(() => {
    const stored = window.localStorage.getItem('ss-wallet-balance')
    return stored ? Number(stored) : 5000
  })
  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = window.localStorage.getItem('ss-orders')
    try {
      return stored ? (JSON.parse(stored) as Order[]) : []
    } catch {
      return []
    }
  })

  const fundWallet = (amount: number) => {
    setWalletBalance((prev) => prev + amount)
  }

  const debitWallet = (amount: number) => {
    if (walletBalance < amount) return false
    setWalletBalance((prev) => prev - amount)
    return true
  }

  const createOrder = (
    items: CartItem[],
    total: number,
    customerName: string,
    customerPhone: string,
    customerLocation: string,
  ): Order => {
    const newOrder: Order = {
      id: Date.now(),
      createdAt: new Date().toLocaleString(),
      status: 'ongoing',
      customerName,
      customerPhone,
      customerLocation,
      items,
      total,
    }

    setOrders((prev) => [newOrder, ...prev])
    return newOrder
  }

  const updateOrderStatus = (orderId: number, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
            }
          : order,
      ),
    )
  }

  useEffect(() => {
    window.localStorage.setItem('ss-orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    window.localStorage.setItem('ss-wallet-balance', String(walletBalance))
  }, [walletBalance])

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalAmount,
        totalItems,
        walletBalance,
        fundWallet,
        debitWallet,
        orders,
        createOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
