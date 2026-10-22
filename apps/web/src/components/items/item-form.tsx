import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { FormEvent } from 'react'

interface ItemFormProps {
  onSubmit: (name: string) => Promise<unknown>
  pending?: boolean
}

export function ItemForm({ onSubmit, pending = false }: ItemFormProps) {
  const [name, setName] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) return
    try {
      await onSubmit(name.trim())
      setName('')
    } catch {
      // Keep the draft; the caller displays the error.
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="New item name"
        aria-label="Item name"
        maxLength={120}
      />
      <Button type="submit" disabled={pending || !name.trim()}>
        Add
      </Button>
    </form>
  )
}
