import { defineComponent, ref } from 'vue'

import { mount } from '../src'

describe('setData', () => {
  it('sets component data', async () => {
    const Component = {
      template: '<div>{{ foo }}</div>',
      data: () => ({ foo: 'bar' })
    }

    const wrapper = mount(Component)
    expect(wrapper.html()).toContain('bar')

    await wrapper.setData({ foo: 'qux' })
    expect(wrapper.html()).toContain('qux')
  })

  it('causes nested nodes to re-render', async () => {
    const Component = {
      template: `<div><div v-if="show" id="show">Show</div></div>`,
      data: () => ({ show: false })
    }

    const wrapper = mount(Component)

    expect(wrapper.find('#show').exists()).toBe(false)

    await wrapper.setData({ show: true })

    expect(wrapper.find('#show').exists()).toBe(true)
  })

  it('updates a single property of a complex object', async () => {
    const Component = {
      template: `<div>{{ complexObject.string }}. bar: {{ complexObject.foo.bar }}</div>`,
      data: () => ({
        complexObject: {
          string: 'will not change',
          foo: {
            bar: 'old val'
          }
        }
      })
    }

    const wrapper = mount(Component)

    expect(wrapper.html()).toContain('will not change. bar: old val')

    await wrapper.setData({
      complexObject: {
        foo: {
          bar: 'new val'
        }
      }
    })

    expect(wrapper.html()).toContain('will not change. bar: new val')
  })

  it('does not set new properties', async () => {
    jest.spyOn(console, 'warn').mockImplementationOnce(() => {})

    const Component = {
      template: `<div>{{ foo || 'fallback' }}</div>`
    }

    const wrapper = mount(Component)

    expect(wrapper.html()).toContain('fallback')

    expect(() => wrapper.setData({ foo: 'bar' })).toThrowError(
      'Cannot add property foo'
    )
  })

  it('does not modify composition API setup data', async () => {
    // why defineComponent vs creatApp
    const Component = defineComponent({
      template: `<div>Count is: {{ count }}</div>`,
      setup: () => ({ count: ref(1) })
    })
    const wrapper = mount(Component)

    expect(wrapper.html()).toContain('Count is: 1')

    expect(() => wrapper.setData({ count: 2 })).toThrowError(
      'Cannot add property count'
    )
  })
})
