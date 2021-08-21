import HelloWorld from '@/components/HelloWorld.vue'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'

describe('HelloWorld.vue', () => {
  const search = {
    namespaced: true,
    state () {
      return {
        fetchData: 0
      }
    },
    mutations: {},
    actions: {
      getProducts: jest.fn()
    },
    getters: {
      fetchData: () => false
    }
  }

  const store = createStore({
    state: {},
    mutations: {},
    actions: {},
    modules: {
      search
    }
  })

  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = mount(HelloWorld, {
      props: { msg },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
