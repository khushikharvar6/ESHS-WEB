'use client'

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'

export const ALL = '__all__'

/** Compact labelled dropdown used in table toolbars for filtering. */
export function FilterSelect({
  label,
  value,
  onValueChange,
  onChange,
  options,
  className = 'w-[9.5rem]',
}: {
  label: string
  value: string
  onValueChange?: (v: string) => void
  onChange?: (v: string) => void
  options: readonly string[]
  className?: string
}) {
  const handleChange = onValueChange ?? onChange ?? (() => {})
  const allLabel = `All ${label}`
  return (
    <Select value={value} onValueChange={(next) => handleChange(next ?? '')}>
      <SelectTrigger
        size="sm"
        className={className}
        aria-label={`Filter by ${label}`}
      >
        <span data-slot="select-value" className="flex flex-1 text-left">
          {value && value !== ALL && value !== 'all' ? value : allLabel}
        </span>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={ALL}>{allLabel}</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
