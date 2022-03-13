<template>
  <div class="container">
    <h2>{{ title }}</h2>
    <div class="search">
      <div>
        Search:
        <v-text-field v-model="wheel" type="number"></v-text-field>
      </div>
      Wheels: {{ wheel }}
      {{ myThings }}
    </div>
    <div class="category"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { exampleStore } from '~/store'

@Component({
  components: {},
  layout: 'default',
})
export default class MyStore extends Vue {
  title: string = 'Product List'
  inventoryData: Array<object> = [
    {
      sku: 1,
      quantity: 0,
      brand: 'Samsung',
      type: 'Smartphone',
      stock: 'Out of Stock',
    },
    {
      sku: 2,
      quantity: 12,
      type: 'laptop',
    },
  ]

  productList: Array<object> = [
    {
      name: 'Samsung Galaxy s10',
      sku: 1,
      link: '/phone',
      image: 'iphone-11.png',
    },
    {
      name: 'Macbook Pro',
      sku: 2,
      link: '/laptop',
      image: 'macbook.png',
    },
  ]

  get wheel() {
    return exampleStore.wheels
  }

  set wheel(val) {
    exampleStore.change(+val)
  }

  get myThings() {
    console.log(exampleStore)
    return 'test'
  }

  created() {
    exampleStore.fetchUser()
  }

  updated() {
    console.log('update')
  }
}
</script>
<style scoped>
.container {
  text-align: center;
}

.category {
  display: flex;
  justify-content: center;
  padding: 50px;
}

.search {
  display: flex;
  flex-flow: column;
  padding: 20px;
  justify-content: center;
  align-items: center;
}
</style>
