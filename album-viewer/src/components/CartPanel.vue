<template>
  <Transition name="cart-slide">
    <div v-if="show" class="cart-overlay" @click.self="handleClose">
      <div class="cart-panel">
        <!-- Header -->
        <div class="cart-header">
          <h2>🛒 {{ $t('cart.title') }}</h2>
          <button 
            class="close-button" 
            @click="handleClose"
            :aria-label="$t('cart.close')"
          >
            &times;
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="cartItems.length === 0" class="cart-empty">
          <div class="empty-icon">🛒</div>
          <p>{{ $t('cart.empty') }}</p>
        </div>

        <!-- Cart Items -->
        <div v-else class="cart-content">
          <div 
            v-for="item in cartItems" 
            :key="item.album.id" 
            class="cart-item"
          >
            <img 
              :src="item.album.image_url" 
              :alt="item.album.title"
              class="cart-item-image"
              @error="handleImageError"
            />
            <div class="cart-item-info">
              <h3>{{ item.album.title }}</h3>
              <p class="artist">{{ item.album.artist }}</p>
              <p class="price">${{ item.album.price.toFixed(2) }}</p>
            </div>
            <button 
              class="btn-remove" 
              @click="handleRemove(item.album.id)"
              :title="$t('cart.remove')"
              :aria-label="$t('cart.remove')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Footer with Total -->
        <div v-if="cartItems.length > 0" class="cart-footer">
          <div class="cart-total">
            <span class="total-label">{{ $t('cart.total') }}:</span>
            <span class="total-price">${{ totalPrice.toFixed(2) }}</span>
          </div>
          <button class="btn btn-primary btn-checkout" disabled>
            {{ $t('cart.checkout') }}
          </button>
          <button class="btn btn-secondary btn-clear" @click="handleClearCart">
            {{ $t('cart.clear') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCart } from '../stores/cart'

interface Props {
  show: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()
const { cartItems, totalPrice, removeFromCart, clearCart } = useCart()

const handleClose = (): void => {
  emit('close')
}

const handleRemove = (albumId: number): void => {
  removeFromCart(albumId)
}

const handleClearCart = (): void => {
  if (confirm(t('cart.confirmClear'))) {
    clearCart()
  }
}

const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/60x60/667eea/white?text=Album'
}

// Handle Escape key to close panel
const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    handleClose()
  }
}

// Add/remove event listener when panel is shown/hidden
watch(() => props.show, (isShown) => {
  if (isShown) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Overlay */
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

/* Panel */
.cart-panel {
  width: 400px;
  max-width: 100%;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 100vh;
}

/* Header */
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.cart-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  color: white;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Empty State */
.cart-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
  color: #718096;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.cart-empty p {
  font-size: 1.1rem;
  margin: 0;
}

/* Cart Content */
.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  transition: background 0.2s;
}

.cart-item:hover {
  background: #f7fafc;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.cart-item-info {
  flex: 1;
  min-width: 0;
}

.cart-item-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cart-item-info .artist {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: #718096;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cart-item-info .price {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #667eea;
}

.btn-remove {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #e53e3e;
  transition: all 0.2s;
  border-radius: 4px;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove svg {
  width: 20px;
  height: 20px;
}

.btn-remove:hover {
  background: #fed7d7;
  transform: scale(1.1);
}

/* Footer */
.cart-footer {
  border-top: 1px solid #e2e8f0;
  padding: 1.5rem;
  background: #f7fafc;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.total-label {
  color: #2d3748;
}

.total-price {
  color: #667eea;
  font-size: 1.5rem;
}

.btn {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 0.5rem;
}

.btn:last-child {
  margin-bottom: 0;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #e53e3e;
  border: 2px solid #e53e3e;
}

.btn-secondary:hover {
  background: #e53e3e;
  color: white;
}

/* Transitions */
.cart-slide-enter-active,
.cart-slide-leave-active {
  transition: all 0.3s ease;
}

.cart-slide-enter-from {
  transform: translateX(100%);
}

.cart-slide-leave-to {
  transform: translateX(100%);
}

.cart-slide-enter-from .cart-overlay,
.cart-slide-leave-to .cart-overlay {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .cart-panel {
    width: 100%;
  }
}
</style>
