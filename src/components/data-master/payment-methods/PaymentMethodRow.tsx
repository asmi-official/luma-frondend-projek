import StatusBadge from '../../../components/data-master/category/StatusBadge'
import DynamicLucideIcon from '../../../icon/DynamicLucideIcon'
import type { PaymentMethod } from '../../../pages/data-master/payment-methods/types'
import { getPaymentMethodIconStyle } from './paymentMethodIconStyles'

type PaymentMethodRowProps = {
  method: PaymentMethod
  isAlternate: boolean
  onToggleActive: (active: boolean) => void
}

export default function PaymentMethodRow({ method, isAlternate, onToggleActive }: PaymentMethodRowProps) {
  const style = getPaymentMethodIconStyle(method.icon)
  const toggleTrackClass = method.active ? 'bg-[#4e5bd6]' : 'bg-[#d2d3d5]'
  const toggleThumbClass = method.active ? 'translate-x-[18px]' : 'translate-x-0'

  return (
    <div className={`flex w-full items-center gap-4 px-4 py-3 ${isAlternate ? 'bg-[#fafafb]' : 'bg-white'}`}>
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: style.bg }}
      >
        <DynamicLucideIcon name={method.icon} size={18} style={{ color: style.color }} />
      </span>

      <div className="flex min-w-0 flex-1 flex-col items-start">
        <p className="text-sm font-semibold leading-[1.4] text-[#20242d]">{method.name}</p>
        <p className="pt-0.5 text-xs leading-[1.4] text-[#8f99a7]">{method.description}</p>
      </div>

      <StatusBadge active={method.active} />

      <button
        type="button"
        onClick={() => onToggleActive(!method.active)}
        className={`relative h-[22px] w-10 shrink-0 rounded-full transition-colors ${toggleTrackClass}`}
      >
        <span
          className={`absolute left-[3px] top-[3px] size-4 rounded-full bg-white shadow transition-transform ${toggleThumbClass}`}
        />
      </button>
    </div>
  )
}
