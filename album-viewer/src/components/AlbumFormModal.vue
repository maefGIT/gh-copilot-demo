<template>
  <div v-if="show" class="modal-overlay" @click.self="handleClose">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ isEditing ? $t('albumForm.titleEdit') : $t('albumForm.titleAdd') }}</h2>
        <button class="close-button" @click="handleClose" :disabled="isLoading">&times;</button>
      </div>

      <div class="modal-body">
        <div v-if="apiError" class="error-message">
          <p>{{ apiError.error }}</p>
          <ul v-if="apiError.details">
            <li v-for="(message, field) in apiError.details" :key="field">
              <strong>{{ field }}:</strong> {{ message }}
            </li>
          </ul>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="title">{{ $t('albumForm.fieldTitle') }} <span class="required">*</span></label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              :placeholder="$t('albumForm.placeholderTitle')"
              :disabled="isLoading"
              required
            />
          </div>

          <div class="form-group">
            <label for="artist">{{ $t('albumForm.fieldArtist') }} <span class="required">*</span></label>
            <input
              id="artist"
              v-model="formData.artist"
              type="text"
              :placeholder="$t('albumForm.placeholderArtist')"
              :disabled="isLoading"
              required
            />
          </div>

          <div class="form-group">
            <label for="price">{{ $t('albumForm.fieldPrice') }} <span class="required">*</span></label>
            <input
              id="price"
              v-model.number="formData.price"
              type="number"
              step="0.01"
              min="0.01"
              :placeholder="$t('albumForm.placeholderPrice')"
              :disabled="isLoading"
              required
            />
          </div>

          <div class="form-group">
            <label for="image_url">{{ $t('albumForm.fieldImageUrl') }} <span class="required">*</span></label>
            <input
              id="image_url"
              v-model="formData.image_url"
              type="url"
              :placeholder="$t('albumForm.placeholderImageUrl')"
              :disabled="isLoading"
              required
            />
          </div>

          <div class="form-actions">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="handleClose"
              :disabled="isLoading"
            >
              {{ $t('albumForm.buttonCancel') }}
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="spinner-small"></span>
              <span v-else>{{ isEditing ? $t('albumForm.buttonUpdate') : $t('albumForm.buttonCreate') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Album } from '../types/album'

interface Props {
  show: boolean
  album?: Album
  isLoading?: boolean
  apiError?: { error: string; details?: Record<string, string> } | null
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: { title: string; artist: string; price: number; image_url: string }): void
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  apiError: null
})

const emit = defineEmits<Emits>()
const { t } = useI18n()

const formData = ref({
  title: '',
  artist: '',
  price: 0,
  image_url: ''
})

const isEditing = ref(false)

// Watch for album prop changes to populate form for editing
watch(() => props.album, (newAlbum) => {
  if (newAlbum) {
    isEditing.value = true
    formData.value = {
      title: newAlbum.title,
      artist: newAlbum.artist,
      price: newAlbum.price,
      image_url: newAlbum.image_url
    }
  } else {
    isEditing.value = false
    formData.value = {
      title: '',
      artist: '',
      price: 0,
      image_url: ''
    }
  }
}, { immediate: true })

// Reset form when modal is closed
watch(() => props.show, (isShown) => {
  if (!isShown && !props.album) {
    formData.value = {
      title: '',
      artist: '',
      price: 0,
      image_url: ''
    }
  }
})

const handleClose = (): void => {
  if (!props.isLoading) {
    emit('close')
  }
}

const handleSubmit = (): void => {
  emit('save', { ...formData.value })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-button:hover:not(:disabled) {
  background: #f5f5f5;
  color: #333;
}

.close-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-body {
  padding: 1.5rem;
}

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: #c00;
}

.error-message p {
  margin: 0 0 0.5rem 0;
  font-weight: bold;
}

.error-message ul {
  margin: 0;
  padding-left: 1.5rem;
}

.error-message li {
  margin: 0.25rem 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.required {
  color: #e53e3e;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background: #d0d0d0;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
