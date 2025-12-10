<template>
  <div class="album-card">
    <div class="album-image">
      <img 
        :src="album.image_url" 
        :alt="album.title"
        @error="handleImageError"
        loading="lazy"
      />
      <div class="play-overlay">
        <div class="play-button">▶</div>
      </div>
    </div>
    
    <div class="album-info">
      <h3 class="album-title">{{ album.title }}</h3>
      <p class="album-artist">{{ album.artist }}</p>
      <div class="album-price">
        <span class="price">${{ album.price.toFixed(2) }}</span>
      </div>
    </div>
    
    <div class="album-actions">
      <button 
        class="btn btn-add-cart" 
        @click="handleAddToCart" 
        :disabled="inCart"
        :title="inCart ? $t('cart.alreadyInCart') : $t('cart.addToCart')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        {{ inCart ? $t('cart.inCart') : $t('cart.addToCart') }}
      </button>
      <button class="btn btn-edit" @click="handleEdit" :title="$t('albumCard.edit')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        {{ $t('albumCard.edit') }}
      </button>
      <button class="btn btn-delete" @click="handleDelete" :title="$t('albumCard.delete')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
        {{ $t('albumCard.delete') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCart } from '../stores/cart'
import type { Album } from '../types/album'

interface Props {
  album: Album
}

interface Emits {
  (e: 'edit', album: Album): void
  (e: 'delete', album: Album): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()
const { addToCart, isInCart } = useCart()

const inCart = computed(() => isInCart(props.album.id))

const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/300x300/667eea/white?text=Album+Cover'
}

const handleAddToCart = (): void => {
  if (!inCart.value) {
    addToCart(props.album)
  }
}

const handleEdit = (): void => {
  emit('edit', props.album)
}

const handleDelete = (): void => {
  emit('delete', props.album)
}
</script>

<style scoped>
.album-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.album-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.album-image {
  position: relative;
  overflow: hidden;
}

.album-image img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.album-card:hover .album-image img {
  transform: scale(1.1);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.album-card:hover .play-overlay {
  opacity: 1;
}

.play-button {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #667eea;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-button:hover {
  background: white;
  transform: scale(1.1);
}

.album-info {
  padding: 1.5rem;
}

.album-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.album-artist {
  color: #666;
  font-size: 1rem;
  margin: 0 0 1rem 0;
}

.album-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.album-actions {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn {
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn svg {
  width: 18px;
  height: 18px;
}

.btn-add-cart {
  background: #48bb78;
  color: white;
}

.btn-add-cart:hover:not(:disabled) {
  background: #38a169;
  transform: translateY(-2px);
}

.btn-add-cart:disabled {
  background: #a0aec0;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-edit {
  background: #667eea;
  color: white;
}

.btn-edit:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.btn-delete {
  background: #e53e3e;
  color: white;
}

.btn-delete:hover {
  background: #c53030;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .album-info {
    padding: 1rem;
  }
  
  .album-actions {
    padding: 0 1rem 1rem;
  }
}
</style>
