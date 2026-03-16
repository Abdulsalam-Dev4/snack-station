import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Orders from './pages/Orders'
import Admin from './pages/Admin'
import Profile from './pages/Profile'
import CartPage from './pages/CartPage'
import BottomNav from './components/BottomNav'
import { CartProvider } from './hooks/useCart'

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNav />
      </div>
    </CartProvider>
  )
}

export default App
