import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { CartItem, Product } from '@/types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  
  const count = computed((): number => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )
  
  const totalPrice = computed((): number => 
    items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  )
  
  const addItem = (product: Product): void => {
    const existingItem = items.value.find(item => item.productId === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      const cartItem: CartItem = {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        quantity: 1
      }
      items.value.push(cartItem)
    }
  }
  
  const removeItem = (cartItemId: number): void => {
    const index = items.value.findIndex(item => item.id === cartItemId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }
  
  const updateQuantity = (cartItemId: number, quantity: number): void => {
    const item = items.value.find(item => item.id === cartItemId)
    if (item) {
      if (quantity <= 0) {
        removeItem(cartItemId)
      } else {
        item.quantity = quantity
      }
    }
  }
  
  const clearCart = (): void => {
    items.value = []
  }
  
  const getItemByProductId = (productId: number): CartItem | undefined => {
    return items.value.find(item => item.productId === productId)
  }
  
  return {
    items: readonly(items),
    count,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemByProductId
  }
})
