import type { FoodItem, Order } from '../types'
import menu1 from '../assets/menu1.jpeg'
import menu2 from '../assets/menu2.jpeg'
import menu3 from '../assets/menu3.jpeg'
import menu4 from '../assets/menu4.jpeg'

export const menuItems: FoodItem[] = [
  {
    id: 1,
    name: 'Milk Shake',
    price: 3300,
    image: menu1,
    description: 'A shake burst with flavor.',
  },
  {
    id: 2,
    name: 'Chicken Fries',
    price: 2300,
    image: menu2,
    description: 'Crispy chicken strips served with a side of fries.',
  },
  {
    id: 3,
    name: 'Chicken and Chips',
    price: 2500,
    image: menu3,
    description: 'Crispy chicken with seasoned chips and secret sauce.',
  },
  {
    id: 4,
    name: 'Grilled Catfish',
    price: 12000,
    image: menu4,
    description: 'Spiced catfish grilled to perfection and served with tangy garlic sauce.',
  },
]

export const sampleOrders: Order[] = [
  {
    id: 101,
    createdAt: '2026-03-10',
    status: 'completed',
    items: [
      { ...menuItems[0], quantity: 1 },
      { ...menuItems[2], quantity: 1 },
    ],
    total: 5800,
    customerName: '',
    customerPhone: '',
    customerLocation: ''
  },
  {
    id: 102,
    createdAt: '2026-03-13',
    status: 'ready',
    items: [{ ...menuItems[3], quantity: 2 }],
    total: 4000,
    customerName: '',
    customerPhone: '',
    customerLocation: ''
  },
]
