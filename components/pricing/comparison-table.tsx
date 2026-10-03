import { Check, Minus } from 'lucide-react'
import { comparisonRows, plans, type ComparisonValue } from '@/lib/plans'

function Cell({ value }: { value: ComparisonValue }) {
  if (value === true) return <Check className="mx-auto size-4 text-primary" aria-label="Included" />
  if (value === false) return <Minus className="mx-auto size-4 text-muted-foreground" aria-label="Not included" />
  return <span className="font-mono text-xs">{value}</span>
}

export function ComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[560px] text-sm">
        <caption className="sr-only">Plan comparison</caption>
        <thead className="bg-card">
          <tr>
            <th scope="col" className="px-5 py-4 text-left font-medium text-muted-foreground">
              Feature
            </th>
            {plans.map((plan) => (
              <th key={plan.id} scope="col" className="px-5 py-4 text-center font-semibold">
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row) => (
            <tr key={row.label} className="border-t border-border">
              <th scope="row" className="px-5 py-3.5 text-left font-normal text-muted-foreground">
                {row.label}
              </th>
              {row.values.map((value, i) => (
                <td key={i} className="px-5 py-3.5 text-center">
                  <Cell value={value} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
