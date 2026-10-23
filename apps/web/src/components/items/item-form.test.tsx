import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ItemForm } from './item-form'

describe('ItemForm', () => {
  it('submits the trimmed name then clears the field', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ItemForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('Item name'), '  Ember  ')
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))

    expect(onSubmit).toHaveBeenCalledWith('Ember')
    expect(screen.getByLabelText('Item name')).toHaveValue('')
  })

  it('keeps the draft when the request fails', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('boom'))
    render(<ItemForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('Item name'), 'Draft')
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))

    expect(screen.getByLabelText('Item name')).toHaveValue('Draft')
  })
})
