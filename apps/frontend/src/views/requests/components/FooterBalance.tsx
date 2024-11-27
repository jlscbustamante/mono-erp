import { fCurrency } from '@/utils'

export const FooterBalance: React.FC<{ info: [number, number] }> = ({
  info,
}) => {
  return (
    <div className="flex justify-between px-4 pt-6 pb-4 bg-stone-900 sticky bottom-0 text-white font-bold rounded-t-lg">
      <span>Total</span>
      <div className="flex gap-5">
        <span>{fCurrency(info[0])}</span>
        <span>Con retencion {fCurrency(info[1])}</span>
      </div>
    </div>
  )
}
