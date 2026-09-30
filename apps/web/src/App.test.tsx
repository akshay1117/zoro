import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders successfully', () => {
    render(<App />)
    expect(screen.getAllByText(/ZORO/i).length).toBeGreaterThan(0)
  })
})
