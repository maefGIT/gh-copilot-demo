import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useCart } from '../src/stores/cart'
import type { Album } from '../src/types/album'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Sample test albums
const album1: Album = {
  id: 1,
  title: 'Test Album 1',
  artist: 'Test Artist 1',
  price: 19.99,
  image_url: 'https://example.com/image1.jpg'
}

const album2: Album = {
  id: 2,
  title: 'Test Album 2',
  artist: 'Test Artist 2',
  price: 24.99,
  image_url: 'https://example.com/image2.jpg'
}

const album3: Album = {
  id: 3,
  title: 'Test Album 3',
  artist: 'Test Artist 3',
  price: 14.99,
  image_url: 'https://example.com/image3.jpg'
}

describe('Cart Store', () => {
  beforeEach(() => {
    localStorage.clear()
    // Clear cart before each test
    const { clearCart } = useCart()
    clearCart()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('addToCart', () => {
    it('should add an album to the cart', () => {
      const { addToCart, cartItems } = useCart()

      const result = addToCart(album1)

      expect(result).toBe(true)
      expect(cartItems.value).toHaveLength(1)
      expect(cartItems.value[0].album).toEqual(album1)
      expect(cartItems.value[0].quantity).toBe(1)
    })

    it('should not add duplicate albums', () => {
      const { addToCart, cartItems } = useCart()

      addToCart(album1)
      const result = addToCart(album1)

      expect(result).toBe(false)
      expect(cartItems.value).toHaveLength(1)
    })

    it('should add multiple different albums', () => {
      const { addToCart, cartItems } = useCart()

      addToCart(album1)
      addToCart(album2)
      addToCart(album3)

      expect(cartItems.value).toHaveLength(3)
    })

    it('should set addedAt timestamp when adding album', () => {
      const { addToCart, cartItems } = useCart()
      const beforeTime = new Date()

      addToCart(album1)

      const afterTime = new Date()
      const addedAt = cartItems.value[0].addedAt

      expect(addedAt).toBeInstanceOf(Date)
      expect(addedAt.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime())
      expect(addedAt.getTime()).toBeLessThanOrEqual(afterTime.getTime())
    })
  })

  describe('removeFromCart', () => {
    it('should remove an album from the cart', () => {
      const { addToCart, removeFromCart, cartItems } = useCart()

      addToCart(album1)
      addToCart(album2)

      const result = removeFromCart(album1.id)

      expect(result).toBe(true)
      expect(cartItems.value).toHaveLength(1)
      expect(cartItems.value[0].album.id).toBe(album2.id)
    })

    it('should return false when removing non-existent album', () => {
      const { addToCart, removeFromCart } = useCart()

      addToCart(album1)

      const result = removeFromCart(999)

      expect(result).toBe(false)
    })

    it('should handle removing from empty cart', () => {
      const { removeFromCart } = useCart()

      const result = removeFromCart(1)

      expect(result).toBe(false)
    })
  })

  describe('clearCart', () => {
    it('should remove all items from cart', () => {
      const { addToCart, clearCart, cartItems } = useCart()

      addToCart(album1)
      addToCart(album2)
      addToCart(album3)

      clearCart()

      expect(cartItems.value).toHaveLength(0)
    })

    it('should work on empty cart', () => {
      const { clearCart, cartItems } = useCart()

      clearCart()

      expect(cartItems.value).toHaveLength(0)
    })
  })

  describe('isInCart', () => {
    it('should return true for albums in cart', () => {
      const { addToCart, isInCart } = useCart()

      addToCart(album1)

      expect(isInCart(album1.id)).toBe(true)
    })

    it('should return false for albums not in cart', () => {
      const { addToCart, isInCart } = useCart()

      addToCart(album1)

      expect(isInCart(album2.id)).toBe(false)
    })

    it('should return false for empty cart', () => {
      const { isInCart } = useCart()

      expect(isInCart(1)).toBe(false)
    })
  })

  describe('getCartItem', () => {
    it('should return cart item for album in cart', () => {
      const { addToCart, getCartItem } = useCart()

      addToCart(album1)

      const item = getCartItem(album1.id)

      expect(item).toBeDefined()
      expect(item?.album).toEqual(album1)
    })

    it('should return undefined for album not in cart', () => {
      const { addToCart, getCartItem } = useCart()

      addToCart(album1)

      const item = getCartItem(999)

      expect(item).toBeUndefined()
    })
  })

  describe('totalItems', () => {
    it('should return 0 for empty cart', () => {
      const { totalItems } = useCart()

      expect(totalItems.value).toBe(0)
    })

    it('should calculate total items correctly', () => {
      const { addToCart, totalItems } = useCart()

      addToCart(album1)
      expect(totalItems.value).toBe(1)

      addToCart(album2)
      expect(totalItems.value).toBe(2)

      addToCart(album3)
      expect(totalItems.value).toBe(3)
    })

    it('should update when items are removed', () => {
      const { addToCart, removeFromCart, totalItems } = useCart()

      addToCart(album1)
      addToCart(album2)
      expect(totalItems.value).toBe(2)

      removeFromCart(album1.id)
      expect(totalItems.value).toBe(1)
    })
  })

  describe('totalPrice', () => {
    it('should return 0 for empty cart', () => {
      const { totalPrice } = useCart()

      expect(totalPrice.value).toBe(0)
    })

    it('should calculate total price correctly', () => {
      const { addToCart, totalPrice } = useCart()

      addToCart(album1) // 19.99
      expect(totalPrice.value).toBe(19.99)

      addToCart(album2) // 24.99
      expect(totalPrice.value).toBe(44.98)

      addToCart(album3) // 14.99
      expect(totalPrice.value).toBe(59.97)
    })

    it('should update when items are removed', () => {
      const { addToCart, removeFromCart, totalPrice } = useCart()

      addToCart(album1) // 19.99
      addToCart(album2) // 24.99
      expect(totalPrice.value).toBe(44.98)

      removeFromCart(album1.id)
      expect(totalPrice.value).toBe(24.99)
    })
  })

  describe('localStorage persistence', () => {
    it('should save cart to localStorage', async () => {
      const { addToCart } = useCart()

      addToCart(album1)

      // Wait for debounced save (500ms)
      await new Promise(resolve => setTimeout(resolve, 600))

      const saved = localStorage.getItem('album-viewer-cart')
      expect(saved).not.toBeNull()

      const parsed = JSON.parse(saved!)
      expect(parsed).toHaveLength(1)
      expect(parsed[0].album.id).toBe(album1.id)
    })

    it('should update localStorage when cart changes', async () => {
      const { addToCart, removeFromCart } = useCart()

      addToCart(album1)
      addToCart(album2)

      await new Promise(resolve => setTimeout(resolve, 600))

      removeFromCart(album1.id)

      await new Promise(resolve => setTimeout(resolve, 600))

      const saved = localStorage.getItem('album-viewer-cart')
      const parsed = JSON.parse(saved!)
      expect(parsed).toHaveLength(1)
      expect(parsed[0].album.id).toBe(album2.id)
    })

    it('should handle localStorage errors gracefully', () => {
      const { addToCart } = useCart()

      // Mock localStorage.setItem to throw an error
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => {
        throw new Error('Quota exceeded')
      })

      // Should not throw
      expect(() => addToCart(album1)).not.toThrow()

      // Restore original
      localStorage.setItem = originalSetItem
    })
  })
})
