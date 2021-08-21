import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  computed: {
    ...mapGetters('search', ['fetchData'])
  },
  methods: {
    ...mapActions('search', ['getProducts']),
    getData () {
      this.getProducts({
        data: {
          page: 1,
          searchTerm: 'samsung',
          channelId: 'web',
          showFacet: false
        },
        success: res => {
          console.log(res)
        },
        fail: res => {
          console.log(res)
        }
      })
    }
  }
}
