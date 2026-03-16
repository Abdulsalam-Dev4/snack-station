import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/', label: 'Menu', icon: '📋' },
  { to: '/orders', label: 'Orders', icon: '🛎️' },
  { to: '/profile', label: 'Profile', icon: '👤' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white p-2 shadow-soft">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2 text-center">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center rounded-lg py-2 text-xs font-medium transition ${
                isActive ? 'text-brand-600' : 'text-slate-500 hover:text-brand-600'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
