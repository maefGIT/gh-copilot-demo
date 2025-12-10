import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AlbumFormModal from '../src/components/AlbumFormModal.vue'
import type { Album } from '../src/types/album'

describe('AlbumFormModal', () => {
  const mockAlbum: Album = {
    id: 1,
    title: 'Test Album',
    artist: 'Test Artist',
    price: 12.99,
    image_url: 'https://example.com/image.jpg'
  }

  it('does not render when show is false', () => {
    const wrapper = mount(AlbumFormModal, {
      props: {
        show: false
      }
    })

    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })

  it('renders when show is true', () => {
    const wrapper = mount(AlbumFormModal, {
      props: {
        show: true
      }
    })

    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
  })

  it('shows "Add New Album" title when no album prop', () => {
    const wrapper = mount(AlbumFormModal, {
      props: {
        show: true
      }
    })

    expect(wrapper.text()).toContain('Add New Album')
  })

  it('shows "Edit Album" title when album prop is provided', () => {
    const wrapper = mount(AlbumFormModal, {
      props: {
        show: true,
        album: mockAlbum
      }
    })

    expect(wrapper.text()).toContain('Edit Album')
  })

  it('populates form fields when editing an album', async () => {
    const wrapper = mount(AlbumFormModal, {
      props: {
        show: true,
        album: mockAlbum
      }
    })

    await wrapper.vm.$nextTick()

    const titleInput = wrapper.find('#title')
    const artistInput = wrapper.find('#artist')
    const priceInput = wrapper.find('#price')
    const imageInput = wrapper.find('#image_url')

    expect((titleInput.element as HTMLInputElement).value).toBe('Test Album')
    expect((artistInput.element as HTMLInputElement).value).toBe('Test Artist')
    expect((priceInput.element as HTMLInputElement).value).toBe('12.99')
    expect((imageInput.element as HTMLInputElement).value).toBe('https://example.com/image.jpg')
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(AlbumFormModal, {
      props: {
        show: true
      }
    })

    const closeButton = wrapper.find('.close-button')
    await closeButton.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close event when cancel button is clicked', async () => {
    const wrapper = mount(AlbumFormModal, {
      props: {
        show: true
      }
    })

    const cancelButton = wrapper.findAll('.btn')[0]
    await cancelButton.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits save event with form data when form is submitted', async () => {
    const wrapper = mount(AlbumFormModal, {
      props: {
        show: true
      }
    })

    await wrapper.find('#title').setValue('New Album')
    await wrapper.find('#artist').setValue('New Artist')
    await wrapper.find('#price').setValue('15.99')
    await wrapper.find('#image_url').setValue('https://example.com/new.jpg')

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('save')).toBeTruthy()
    expect(wrapper.emitted('save')?.[0]).toEqual([{
      title: 'New Album',
      artist: 'New Artist',
      price: 15.99,
      image_url: 'https://example.com/new.jpg'
    }])
  })

  it('displays API error messages', () => {
    const apiError = {
      error: 'Validation failed',
      details: {
        title: 'Title is required',
        price: 'Price must be positive'
      }
    }

    const wrapper = mount(AlbumFormModal, {
      props: {
        show: true,
        apiError
      }
    })

    expect(wrapper.text()).toContain('Validation failed')
    expect(wrapper.text()).toContain('Title is required')
    expect(wrapper.text()).toContain('Price must be positive')
  })

  it('disables buttons when isLoading is true', () => {
    const wrapper = mount(AlbumFormModal, {
      props: {
        show: true,
        isLoading: true
      }
    })

    const closeButton = wrapper.find('.close-button')
    const submitButton = wrapper.findAll('.btn')[1]

    expect(closeButton.attributes('disabled')).toBeDefined()
    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it('shows spinner in submit button when isLoading is true', () => {
    const wrapper = mount(AlbumFormModal, {
      props: {
        show: true,
        isLoading: true
      }
    })

    expect(wrapper.find('.spinner-small').exists()).toBe(true)
  })

  it('shows correct button text based on editing state', async () => {
    const wrapper = mount(AlbumFormModal, {
      props: {
        show: true
      }
    })

    expect(wrapper.text()).toContain('Create')

    await wrapper.setProps({ album: mockAlbum })
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Update')
  })

  it('emits close when clicking overlay', async () => {
    const wrapper = mount(AlbumFormModal, {
      props: {
        show: true
      }
    })

    await wrapper.find('.modal-overlay').trigger('click.self')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('does not emit close when clicking overlay if isLoading', async () => {
    const wrapper = mount(AlbumFormModal, {
      props: {
        show: true,
        isLoading: true
      }
    })

    await wrapper.find('.modal-overlay').trigger('click.self')

    expect(wrapper.emitted('close')).toBeFalsy()
  })
})
