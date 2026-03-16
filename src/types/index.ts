export type OrderStatus = 'all' | 'ongoing' | 'ready' | 'completed'

export interface FoodItem {
  id: number
  name: string
  price: number
  image: string
  description?: string
}

export interface CartItem extends FoodItem {
  quantity: number
}

export interface Order {
  id: number
  createdAt: string
  status: OrderStatus
  customerName: string
  customerPhone: string
  customerLocation: string
  items: CartItem[]
  total: number
}
