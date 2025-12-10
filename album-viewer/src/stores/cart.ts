import { ref, computed, watch } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { Album } from '../types/album'

export interface CartItem {
  album: Album
  quantity: number
  addedAt: Date
}

const CART_STORAGE_KEY = 'album-viewer-cart'

// Reactive cart state
const cartItems: Ref<CartItem[]> = ref([])

// Load cart from localStorage on initialization
const loadCart = (): void => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      const parsed = JSON.parse(savedCart)
      // Convert addedAt strings back to Date objects
      cartItems.value = parsed.map((item: CartItem) => ({
        ...item,
        addedAt: new Date(item.addedAt)
      }))
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error)
    cartItems.value = []
  }
}

// Save cart to localStorage with debouncing
let saveTimeout: number | undefined
const saveCart = (): void => {
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }
  
  saveTimeout = window.setTimeout(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems.value))
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error)
    }
  }, 500)
}

// Watch for cart changes and save to localStorage
watch(cartItems, () => {
  saveCart()
}, { deep: true })

// Initialize cart on module load
loadCart()

// Computed properties
const totalItems: ComputedRef<number> = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0)
})

const totalPrice: ComputedRef<number> = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (item.album.price * item.quantity)
  }, 0)
})

// Cart operations
const addToCart = (album: Album): boolean => {
  // Check if album already exists in cart
  const existingItem = cartItems.value.find(item => item.album.id === album.id)
  
  if (existingItem) {
    // Album already in cart, don't add duplicate
    return false
  }
  
  // Add new item to cart
  cartItems.value.push({
    album,
    quantity: 1,
    addedAt: new Date()
  })
  
  return true
}

const removeFromCart = (albumId: number): boolean => {
  const index = cartItems.value.findIndex(item => item.album.id === albumId)
  
  if (index === -1) {
    return false
  }
  
  cartItems.value.splice(index, 1)
  return true
}

const clearCart = (): void => {
  cartItems.value = []
}

const isInCart = (albumId: number): boolean => {
  return cartItems.value.some(item => item.album.id === albumId)
}

const getCartItem = (albumId: number): CartItem | undefined => {
  return cartItems.value.find(item => item.album.id === albumId)
}

// Export composable function
export const useCart = () => {
  return {
    cartItems: computed(() => cartItems.value),
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    getCartItem
  }
}
