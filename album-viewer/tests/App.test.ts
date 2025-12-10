import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import axios from 'axios'
import App from '../src/App.vue'
import type { Album } from '../src/types/album'

vi.mock('axios')

describe('App', () => {
  const mockAlbums: Album[] = [
    {
      id: 1,
      title: 'Test Album 1',
      artist: 'Test Artist 1',
      price: 12.99,
      image_url: 'https://example.com/1.jpg'
    },
    {
      id: 2,
      title: 'Test Album 2',
      artist: 'Test Artist 2',
      price: 15.99,
      image_url: 'https://example.com/2.jpg'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches and displays albums on mount', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockAlbums })

    const wrapper = mount(App)
    await flushPromises()

    expect(axios.get).toHaveBeenCalledWith('/albums')
    expect(wrapper.text()).toContain('Test Album 1')
    expect(wrapper.text()).toContain('Test Album 2')
  })

  it('shows loading state while fetching albums', () => {
    vi.mocked(axios.get).mockImplementation(() => new Promise(() => {}))

    const wrapper = mount(App)

    expect(wrapper.text()).toContain('Loading albums...')
    expect(wrapper.find('.spinner').exists()).toBe(true)
  })

  it('shows error message when fetch fails', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Network error'))

    const wrapper = mount(App)
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to load albums')
    expect(wrapper.find('.retry-btn').exists()).toBe(true)
  })

  it('retries fetching albums when retry button is clicked', async () => {
    vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'))
    vi.mocked(axios.get).mockResolvedValueOnce({ data: mockAlbums })

    const wrapper = mount(App)
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to load albums')

    await wrapper.find('.retry-btn').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Test Album 1')
    expect(axios.get).toHaveBeenCalledTimes(2)
  })

  it('opens add modal when add button is clicked', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockAlbums })

    const wrapper = mount(App)
    await flushPromises()

    await wrapper.find('.add-album-btn').trigger('click')

    expect(wrapper.text()).toContain('Add New Album')
  })

  it('creates a new album and updates list', async () => {
    const newAlbum: Album = {
      id: 3,
      title: 'New Album',
      artist: 'New Artist',
      price: 19.99,
      image_url: 'https://example.com/3.jpg'
    }

    vi.mocked(axios.get).mockResolvedValue({ data: mockAlbums })
    vi.mocked(axios.post).mockResolvedValue({ data: newAlbum })

    const wrapper = mount(App)
    await flushPromises()

    // Open add modal
    await wrapper.find('.add-album-btn').trigger('click')
    await flushPromises()

    // Fill form
    const modal = wrapper.findComponent({ name: 'AlbumFormModal' })
    await modal.vm.$emit('save', {
      title: 'New Album',
      artist: 'New Artist',
      price: 19.99,
      image_url: 'https://example.com/3.jpg'
    })
    await flushPromises()

    expect(axios.post).toHaveBeenCalledWith('/albums', {
      title: 'New Album',
      artist: 'New Artist',
      price: 19.99,
      image_url: 'https://example.com/3.jpg'
    })
    expect(wrapper.text()).toContain('New Album')
  })

  it('updates an existing album', async () => {
    const updatedAlbum: Album = {
      ...mockAlbums[0],
      title: 'Updated Title'
    }

    vi.mocked(axios.get).mockResolvedValue({ data: mockAlbums })
    vi.mocked(axios.put).mockResolvedValue({ data: updatedAlbum })

    const wrapper = mount(App)
    await flushPromises()

    // Trigger edit on first album card
    const albumCard = wrapper.findAllComponents({ name: 'AlbumCard' })[0]
    await albumCard.vm.$emit('edit', mockAlbums[0])
    await flushPromises()

    // Submit updated data
    const modal = wrapper.findComponent({ name: 'AlbumFormModal' })
    await modal.vm.$emit('save', {
      title: 'Updated Title',
      artist: 'Test Artist 1',
      price: 12.99,
      image_url: 'https://example.com/1.jpg'
    })
    await flushPromises()

    expect(axios.put).toHaveBeenCalledWith('/albums/1', {
      title: 'Updated Title',
      artist: 'Test Artist 1',
      price: 12.99,
      image_url: 'https://example.com/1.jpg'
    })
    expect(wrapper.text()).toContain('Updated Title')
  })

  it('deletes an album after confirmation', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockAlbums })
    vi.mocked(axios.delete).mockResolvedValue({ data: {} })

    const wrapper = mount(App)
    await flushPromises()

    // Trigger delete on first album
    const albumCard = wrapper.findAllComponents({ name: 'AlbumCard' })[0]
    await albumCard.vm.$emit('delete', mockAlbums[0])
    await flushPromises()

    // Confirm deletion
    const confirmDialog = wrapper.findComponent({ name: 'ConfirmDialog' })
    expect(confirmDialog.props('show')).toBe(true)
    
    await confirmDialog.vm.$emit('confirm')
    await flushPromises()

    expect(axios.delete).toHaveBeenCalledWith('/albums/1')
    expect(wrapper.text()).not.toContain('Test Album 1')
  })

  it('cancels deletion when cancel is clicked', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockAlbums })

    const wrapper = mount(App)
    await flushPromises()

    // Trigger delete
    const albumCard = wrapper.findAllComponents({ name: 'AlbumCard' })[0]
    await albumCard.vm.$emit('delete', mockAlbums[0])
    await flushPromises()

    // Cancel deletion
    const confirmDialog = wrapper.findComponent({ name: 'ConfirmDialog' })
    await confirmDialog.vm.$emit('cancel')
    await flushPromises()

    expect(axios.delete).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Test Album 1')
  })

  it('displays validation errors from API', async () => {
    const validationError = {
      response: {
        status: 400,
        data: {
          error: 'Validation failed',
          details: {
            price: 'Must be a positive number'
          }
        }
      }
    }

    vi.mocked(axios.get).mockResolvedValue({ data: mockAlbums })
    vi.mocked(axios.post).mockRejectedValue(validationError)

    const wrapper = mount(App)
    await flushPromises()

    // Open add modal
    await wrapper.find('.add-album-btn').trigger('click')

    // Submit invalid data
    const modal = wrapper.findComponent({ name: 'AlbumFormModal' })
    await modal.vm.$emit('save', {
      title: 'Test',
      artist: 'Test',
      price: -10,
      image_url: 'test.jpg'
    })
    await flushPromises()

    expect(modal.props('apiError')).toEqual({
      error: 'Validation failed',
      details: {
        price: 'Must be a positive number'
      }
    })
  })

  it('closes modal after successful save', async () => {
    const newAlbum: Album = {
      id: 3,
      title: 'New Album',
      artist: 'New Artist',
      price: 19.99,
      image_url: 'https://example.com/3.jpg'
    }

    vi.mocked(axios.get).mockResolvedValue({ data: mockAlbums })
    vi.mocked(axios.post).mockResolvedValue({ data: newAlbum })

    const wrapper = mount(App)
    await flushPromises()

    await wrapper.find('.add-album-btn').trigger('click')
    
    const modal = wrapper.findComponent({ name: 'AlbumFormModal' })
    expect(modal.props('show')).toBe(true)

    await modal.vm.$emit('save', {
      title: 'New Album',
      artist: 'New Artist',
      price: 19.99,
      image_url: 'https://example.com/3.jpg'
    })
    await flushPromises()

    expect(modal.props('show')).toBe(false)
  })

  it('shows loading state during album operations', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockAlbums })
    vi.mocked(axios.post).mockImplementation(() => new Promise(() => {}))

    const wrapper = mount(App)
    await flushPromises()

    await wrapper.find('.add-album-btn').trigger('click')
    
    const modal = wrapper.findComponent({ name: 'AlbumFormModal' })
    modal.vm.$emit('save', {
      title: 'Test',
      artist: 'Test',
      price: 10,
      image_url: 'test.jpg'
    })
    await flushPromises()

    expect(modal.props('isLoading')).toBe(true)
  })
})
