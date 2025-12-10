import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AlbumCard from '../src/components/AlbumCard.vue'
import type { Album } from '../src/types/album'

describe('AlbumCard', () => {
  const mockAlbum: Album = {
    id: 1,
    title: 'Test Album',
    artist: 'Test Artist',
    price: 12.99,
    image_url: 'https://example.com/image.jpg'
  }

  it('renders album information correctly', () => {
    const wrapper = mount(AlbumCard, {
      props: { album: mockAlbum }
    })

    expect(wrapper.text()).toContain('Test Album')
    expect(wrapper.text()).toContain('Test Artist')
    expect(wrapper.text()).toContain('$12.99')
  })

  it('displays album image with correct src', () => {
    const wrapper = mount(AlbumCard, {
      props: { album: mockAlbum }
    })

    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('https://example.com/image.jpg')
    expect(img.attributes('alt')).toBe('Test Album')
  })

  it('emits edit event when edit button is clicked', async () => {
    const wrapper = mount(AlbumCard, {
      props: { album: mockAlbum }
    })

    const editButton = wrapper.findAll('button')[0]
    await editButton.trigger('click')

    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')?.[0]).toEqual([mockAlbum])
  })

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(AlbumCard, {
      props: { album: mockAlbum }
    })

    const deleteButton = wrapper.findAll('button')[1]
    await deleteButton.trigger('click')

    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')?.[0]).toEqual([mockAlbum])
  })

  it('handles image error by setting placeholder', async () => {
    const wrapper = mount(AlbumCard, {
      props: { album: mockAlbum }
    })

    const img = wrapper.find('img')
    await img.trigger('error')

    expect(img.element.src).toContain('placeholder')
  })

  it('formats price with two decimal places', () => {
    const albumWithPrice = { ...mockAlbum, price: 10 }
    const wrapper = mount(AlbumCard, {
      props: { album: albumWithPrice }
    })

    expect(wrapper.text()).toContain('$10.00')
  })
})
