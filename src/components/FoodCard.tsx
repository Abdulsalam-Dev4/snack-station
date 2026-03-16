import type { FoodItem } from '../types'

type FoodCardProps = {
  item: FoodItem
  onAdd: (item: FoodItem) => void
}

export default function FoodCard({ item, onAdd }: FoodCardProps) {
  return (
    <article className="rounded-xlg border border-slate-200 bg-white shadow-card overflow-hidden">
      <div className="h-44 w-full overflow-hidden bg-slate-100">
        <img className="h-full w-full object-cover" src={item.image} alt={item.name} />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
        <p className="text-sm text-slate-500 mt-1">{item.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-red-600 font-bold">₦{item.price.toLocaleString()}</span>
          <button
            onClick={() => onAdd(item)}
            className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white shadow-soft hover:opacity-95"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}
