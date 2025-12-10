import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmDialog from '../src/components/ConfirmDialog.vue'

describe('ConfirmDialog', () => {
  it('does not render when show is false', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        show: false,
        title: 'Test Title',
        message: 'Test Message'
      }
    })

    expect(wrapper.find('.dialog-overlay').exists()).toBe(false)
  })

  it('renders when show is true', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        show: true,
        title: 'Test Title',
        message: 'Test Message'
      }
    })

    expect(wrapper.find('.dialog-overlay').exists()).toBe(true)
  })

  it('displays title and message correctly', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        show: true,
        title: 'Delete Album?',
        message: 'Are you sure you want to delete this album?'
      }
    })

    expect(wrapper.text()).toContain('Delete Album?')
    expect(wrapper.text()).toContain('Are you sure you want to delete this album?')
  })

  it('emits confirm event when confirm button is clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        show: true,
        title: 'Test',
        message: 'Test'
      }
    })

    const confirmButton = wrapper.findAll('.btn')[1]
    await confirmButton.trigger('click')

    expect(wrapper.emitted('confirm')).toBeTruthy()
  })

  it('emits cancel event when cancel button is clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        show: true,
        title: 'Test',
        message: 'Test'
      }
    })

    const cancelButton = wrapper.findAll('.btn')[0]
    await cancelButton.trigger('click')

    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('emits cancel when clicking overlay', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        show: true,
        title: 'Test',
        message: 'Test'
      }
    })

    await wrapper.find('.dialog-overlay').trigger('click.self')

    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('disables buttons when isLoading is true', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        show: true,
        title: 'Test',
        message: 'Test',
        isLoading: true
      }
    })

    const buttons = wrapper.findAll('.btn')
    expect(buttons[0].attributes('disabled')).toBeDefined()
    expect(buttons[1].attributes('disabled')).toBeDefined()
  })

  it('shows spinner in confirm button when isLoading is true', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        show: true,
        title: 'Test',
        message: 'Test',
        isLoading: true
      }
    })

    expect(wrapper.find('.spinner-small').exists()).toBe(true)
  })

  it('shows "Delete" text in confirm button when not loading', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        show: true,
        title: 'Test',
        message: 'Test',
        isLoading: false
      }
    })

    expect(wrapper.text()).toContain('Delete')
  })

  it('displays warning icon', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        show: true,
        title: 'Test',
        message: 'Test'
      }
    })

    expect(wrapper.find('.dialog-icon svg').exists()).toBe(true)
  })
})
