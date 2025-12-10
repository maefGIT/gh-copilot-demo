<template>
  <div v-if="show" class="dialog-overlay" @click.self="handleCancel">
    <div class="dialog-content">
      <div class="dialog-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>
      
      <div class="dialog-body">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
      </div>

      <div class="dialog-actions">
        <button 
          class="btn btn-cancel" 
          @click="handleCancel"
          :disabled="isLoading"
        >
          Cancel
        </button>
        <button 
          class="btn btn-confirm"
          @click="handleConfirm"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="spinner-small"></span>
          <span v-else>Delete</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  title: string
  message: string
  isLoading?: boolean
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

withDefaults(defineProps<Props>(), {
  isLoading: false
})

const emit = defineEmits<Emits>()

const handleConfirm = (): void => {
  emit('confirm')
}

const handleCancel = (): void => {
  emit('cancel')
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.dialog-content {
  background: white;
  border-radius: 15px;
  width: 90%;
  max-width: 400px;
  padding: 2rem;
  animation: scaleIn 0.3s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  text-align: center;
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.dialog-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  color: #e53e3e;
}

.dialog-icon svg {
  width: 100%;
  height: 100%;
}

.dialog-body h3 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  color: #333;
}

.dialog-body p {
  margin: 0 0 2rem 0;
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
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

.btn-cancel {
  background: #e0e0e0;
  color: #333;
}

.btn-cancel:hover:not(:disabled) {
  background: #d0d0d0;
}

.btn-confirm {
  background: #e53e3e;
  color: white;
}

.btn-confirm:hover:not(:disabled) {
  background: #c53030;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(229, 62, 62, 0.4);
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
