<template>
  <div class="app">
    <header class="header">
      <h1>🎵 Album Collection</h1>
      <p>Discover amazing music albums</p>
      <button class="add-album-btn" @click="openAddModal">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add New Album
      </button>
    </header>

    <main class="main">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading albums...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="fetchAlbums" class="retry-btn">Try Again</button>
      </div>

      <div v-else class="albums-grid">
        <AlbumCard 
          v-for="album in albums" 
          :key="album.id" 
          :album="album"
          @edit="openEditModal"
          @delete="openDeleteConfirm"
        />
      </div>
    </main>

    <!-- Album Form Modal -->
    <AlbumFormModal
      :show="showModal"
      :album="editingAlbum"
      :isLoading="isSubmitting"
      :apiError="apiError"
      @close="closeModal"
      @save="handleSaveAlbum"
    />

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :show="showDeleteConfirm"
      :title="`Delete ${deletingAlbum?.title}?`"
      :message="`Are you sure you want to delete &quot;${deletingAlbum?.title}&quot; by ${deletingAlbum?.artist}? This action cannot be undone.`"
      :isLoading="isSubmitting"
      @confirm="handleDeleteAlbum"
      @cancel="closeDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios, { AxiosError } from 'axios'
import AlbumCard from './components/AlbumCard.vue'
import AlbumFormModal from './components/AlbumFormModal.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import type { Album } from './types/album'

const albums = ref<Album[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

// Modal states
const showModal = ref<boolean>(false)
const showDeleteConfirm = ref<boolean>(false)
const editingAlbum = ref<Album | undefined>(undefined)
const deletingAlbum = ref<Album | undefined>(undefined)
const isSubmitting = ref<boolean>(false)
const apiError = ref<{ error: string; details?: Record<string, string> } | null>(null)

const fetchAlbums = async (): Promise<void> => {
  try {
    loading.value = true
    error.value = null
    const response = await axios.get<Album[]>('/albums')
    albums.value = response.data
  } catch (err) {
    error.value = 'Failed to load albums. Please make sure the API is running.'
    console.error('Error fetching albums:', err)
  } finally {
    loading.value = false
  }
}

const openAddModal = (): void => {
  editingAlbum.value = undefined
  apiError.value = null
  showModal.value = true
}

const openEditModal = (album: Album): void => {
  editingAlbum.value = album
  apiError.value = null
  showModal.value = true
}

const closeModal = (): void => {
  showModal.value = false
  editingAlbum.value = undefined
  apiError.value = null
  isSubmitting.value = false
}

const handleSaveAlbum = async (data: { title: string; artist: string; price: number; image_url: string }): Promise<void> => {
  try {
    isSubmitting.value = true
    apiError.value = null

    if (editingAlbum.value) {
      // Update existing album
      const response = await axios.put<Album>(`/albums/${editingAlbum.value.id}`, data)
      const index = albums.value.findIndex(a => a.id === editingAlbum.value!.id)
      if (index !== -1) {
        albums.value[index] = response.data
      }
    } else {
      // Create new album
      const response = await axios.post<Album>('/albums', data)
      albums.value.push(response.data)
    }

    closeModal()
  } catch (err) {
    const axiosError = err as AxiosError<{ error: string; details?: Record<string, string> }>
    if (axiosError.response?.status === 400 && axiosError.response.data) {
      apiError.value = axiosError.response.data
    } else {
      apiError.value = {
        error: 'Failed to save album. Please try again.'
      }
    }
    console.error('Error saving album:', err)
  } finally {
    isSubmitting.value = false
  }
}

const openDeleteConfirm = (album: Album): void => {
  deletingAlbum.value = album
  showDeleteConfirm.value = true
}

const closeDeleteConfirm = (): void => {
  showDeleteConfirm.value = false
  deletingAlbum.value = undefined
  isSubmitting.value = false
}

const handleDeleteAlbum = async (): Promise<void> => {
  if (!deletingAlbum.value) return

  try {
    isSubmitting.value = true
    await axios.delete(`/albums/${deletingAlbum.value.id}`)
    albums.value = albums.value.filter(a => a.id !== deletingAlbum.value!.id)
    closeDeleteConfirm()
  } catch (err) {
    console.error('Error deleting album:', err)
    error.value = 'Failed to delete album. Please try again.'
    closeDeleteConfirm()
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchAlbums()
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.header p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.add-album-btn {
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.add-album-btn svg {
  width: 20px;
  height: 20px;
}

.add-album-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  background: white;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 4rem;
  color: white;
}

.error p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.retry-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: white;
  color: #667eea;
}

.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .albums-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
