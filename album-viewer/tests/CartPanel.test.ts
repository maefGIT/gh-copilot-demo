import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CartPanel from '../src/components/CartPanel.vue'
import { useCart } from '../src/stores/cart'
import type { Album } from '../src/types/album'
import { createI18n } from 'vue-i18n'

// Create i18n instance for tests
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      cart: {
        title: 'Shopping Cart',
        empty: 'Your cart is empty. Start adding some albums!',
        total: 'Total',
        checkout: 'Proceed to Checkout',
        clear: 'Clear Cart',
        close: 'Close cart',
        remove: 'Remove from cart',
        confirmClear: 'Are you sure you want to clear your cart?'
      }
    }
  }
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

describe('CartPanel', () => {
  beforeEach(() => {
    const { clearCart } = useCart()
    clearCart()
  })

  it('should render when show prop is true', () => {
    const wrapper = mount(CartPanel, {
      props: {
        show: true
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.cart-panel').exists()).toBe(true)
  })

  it('should not render when show prop is false', () => {
    const wrapper = mount(CartPanel, {
      props: {
        show: false
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.cart-panel').exists()).toBe(false)
  })

  it('should display empty state when cart is empty', () => {
    const wrapper = mount(CartPanel, {
      props: {
        show: true
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.cart-empty').exists()).toBe(true)
    expect(wrapper.text()).toContain('Your cart is empty. Start adding some albums!')
  })

  it('should display cart items when cart has items', () => {
    const { addToCart } = useCart()
    addToCart(album1)
    addToCart(album2)

    const wrapper = mount(CartPanel, {
      props: {
        show: true
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.cart-empty').exists()).toBe(false)
    expect(wrapper.findAll('.cart-item')).toHaveLength(2)
  })

  it('should display album details correctly', () => {
    const { addToCart } = useCart()
    addToCart(album1)

    const wrapper = mount(CartPanel, {
      props: {
        show: true
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toContain('Test Album 1')
    expect(wrapper.text()).toContain('Test Artist 1')
    expect(wrapper.text()).toContain('$19.99')
  })

  it('should display total price correctly', () => {
    const { addToCart } = useCart()
    addToCart(album1) // 19.99
    addToCart(album2) // 24.99

    const wrapper = mount(CartPanel, {
      props: {
        show: true
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toContain('$44.98')
  })

  it('should emit close event when close button is clicked', async () => {
    const wrapper = mount(CartPanel, {
      props: {
        show: true
      },
      global: {
        plugins: [i18n]
      }
    })

    await wrapper.find('.close-button').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('should emit close event when clicking overlay', async () => {
    const wrapper = mount(CartPanel, {
      props: {
        show: true
      },
      global: {
        plugins: [i18n]
      }
    })

    await wrapper.find('.cart-overlay').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should remove item from cart when remove button is clicked', async () => {
    const { addToCart, cartItems } = useCart()
    addToCart(album1)
    addToCart(album2)

    const wrapper = mount(CartPanel, {
      props: {
        show: true
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(cartItems.value).toHaveLength(2)

    await wrapper.findAll('.btn-remove')[0].trigger('click')

    expect(cartItems.value).toHaveLength(1)
  })

  it('should show footer with total and buttons when cart has items', () => {
    const { addToCart } = useCart()
    addToCart(album1)

    const wrapper = mount(CartPanel, {
      props: {
        show: true
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.cart-footer').exists()).toBe(true)
    expect(wrapper.find('.btn-checkout').exists()).toBe(true)
    expect(wrapper.find('.btn-clear').exists()).toBe(true)
  })

  it('should not show footer when cart is empty', () => {
    const wrapper = mount(CartPanel, {
      props: {
        show: true
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.cart-footer').exists()).toBe(false)
  })

  it('should display cart title', () => {
    const wrapper = mount(CartPanel, {
      props: {
        show: true
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.cart-header h2').text()).toContain('Shopping Cart')
  })

  it('should clear cart when clear button is clicked and confirmed', async () => {
    const { addToCart, cartItems } = useCart()
    addToCart(album1)
    addToCart(album2)

    // Mock window.confirm
    window.confirm = vi.fn(() => true)

    const wrapper = mount(CartPanel, {
      props: {
        show: true
      },
      global: {
        plugins: [i18n]
      }
    })

    await wrapper.find('.btn-clear').trigger('click')

    expect(cartItems.value).toHaveLength(0)
    expect(window.confirm).toHaveBeenCalled()
  })

  it('should not clear cart when clear is cancelled', async () => {
    const { addToCart, cartItems } = useCart()
    addToCart(album1)
    addToCart(album2)

    // Mock window.confirm to return false
    window.confirm = vi.fn(() => false)

    const wrapper = mount(CartPanel, {
      props: {
        show: true
      },
      global: {
        plugins: [i18n]
      }
    })

    await wrapper.find('.btn-clear').trigger('click')

    expect(cartItems.value).toHaveLength(2)
  })

  it('should handle image error gracefully', async () => {
    const { addToCart } = useCart()
    addToCart(album1)

    const wrapper = mount(CartPanel, {
      props: {
        show: true
      },
      global: {
        plugins: [i18n]
      }
    })

    const img = wrapper.find('.cart-item-image')
    await img.trigger('error')

    expect((img.element as HTMLImageElement).src).toContain('placeholder')
  })

  it('should update when cart changes', async () => {
    const { addToCart } = useCart()

    const wrapper = mount(CartPanel, {
      props: {
        show: true
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.findAll('.cart-item')).toHaveLength(0)

    addToCart(album1)
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.cart-item')).toHaveLength(1)
  })

  it('should have checkout button disabled', () => {
    const { addToCart } = useCart()
    addToCart(album1)

    const wrapper = mount(CartPanel, {
      props: {
        show: true
      },
      global: {
        plugins: [i18n]
      }
    })

    const checkoutBtn = wrapper.find('.btn-checkout')
    expect(checkoutBtn.attributes('disabled')).toBeDefined()
  })
})
