import { fCurrency } from '@/utils'

export const FooterBalance: React.FC<{ info: [number, number, number] }> = ({
  info,
}) => {
  return (
    <div className="flex justify-between px-4 pt-6 pb-4 bg-stone-900 sticky bottom-0 text-white font-bold rounded-t-lg">
      <span>Total</span>
      <div className="flex gap-5">
        <span>S/ {fCurrency(info[0], false)}, </span>
        <span>Sin retencion : S/ {fCurrency(info[2], false)}</span>
        <span>$ {fCurrency(info[1], false)}</span>
      </div>
    </div>
  )
}
