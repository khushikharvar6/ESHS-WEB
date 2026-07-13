'use client'

import { useState } from 'react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'

export function TextField({
  label,
  id,
  type = 'text',
  placeholder,
  defaultValue,
}: {
  label: string
  id: string
  type?: string
  placeholder?: string
  defaultValue?: string
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </Field>
  )
}

export function TextareaField({
  label,
  id,
  placeholder,
}: {
  label: string
  id: string
  placeholder?: string
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea id={id} placeholder={placeholder} rows={3} />
    </Field>
  )
}

export function SelectField({
  label,
  placeholder = 'Select...',
  options,
  defaultValue,
}: {
  label: string
  placeholder?: string
  options: readonly string[]
  defaultValue?: string
}) {
  const [value, setValue] = useState<string | undefined>(defaultValue)
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Select value={value} onValueChange={(v) => setValue(v as string)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
