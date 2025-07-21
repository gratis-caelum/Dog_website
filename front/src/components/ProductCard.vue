<template>
  <div class="product-card" @click="navigateToProduct">
    <div class="product-image">
      {{ product.image }}
      <div v-if="product.badge" class="product-badge">{{ product.badge }}</div>
    </div>
    <div class="product-info">
      <div class="product-brand">[{{ product.brand }}]</div>
      <div class="product-name">{{ product.name }}</div>
      <div class="product-price">
        <span class="current-price">{{ formatPrice(product.price) }}원</span>
        <span v-if="product.originalPrice" class="original-price">
          {{ formatPrice(product.originalPrice) }}원
        </span>
        <span v-if="product.discountRate > 0" class="discount-rate">
          {{ product.discountRate }}%
        </span>
      </div>
      <div class="product-rating">
        <div class="rating-info">
          <span class="stars">{{ getStarDisplay(product.rating) }}</span>
          <span>({{ product.reviewCount.toLocaleString() }})</span>
        </div>
        <div class="product-actions" @click.stop>
          <button
            class="wishlist-btn"
            :class="{ active: isInWishlist }"
            @click="toggleWishlist"
            :title="isInWishlist ? '찜 해제' : '찜하기'"
          >
            {{ isInWishlist ? '♥' : '♡' }}
          </button>
          <button
            class="cart-btn"
            :class="{ loading: isAddingToCart }"
            @click="addToCart"
            :disabled="isAddingToCart || !product.inStock"
          >
            {{ cartButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/products'
import type { Product } from '@/types'

interface Props {
  product: Product
}
const props = defineProps<Props>()

interface Emits {
  addToCart: [product: Product]
  toggleWishlist: [product: Product]
}
const emit = defineEmits<Emits>()

const router = useRouter()
const productStore = useProductStore()

const isAddingToCart = ref<boolean>(false)

const isInWishlist = computed((): boolean => 
  productStore.isInWishlist(props.product.id)
)

const cartButtonText = computed((): string => {
  if (!props.product.inStock) return '품절'
  return isAddingToCart.value ? '완료!' : '담기'
})

const formatPrice = (price: number): string => {
  return price.toLocaleString()
}

const getStarDisplay = (rating: number): string => {
  return '⭐'.repeat(rating)
}

const navigateToProduct = (): void => {
  router.push(`/product/${props.product.id}`)
}

const toggleWishlist = (): void => {
  emit('toggleWishlist', props.product)
}

const addToCart = async (): Promise<void> => {
  if (!props.product.inStock) return
  
  isAddingToCart.value = true
  emit('addToCart', props.product)
  
  setTimeout(() => {
    isAddingToCart.value = false
  }, 1500)
}
</script>

<style scoped>
.product-card {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.product-card:hover {
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
}

.product-image {
  position: relative;
  text-align: center;
  font-size: 48px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  background: #f8f9fa;
  border-radius: 4px;
}

.product-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ff4444;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.product-brand {
  color: #666;
  font-size: 12px;
  margin-bottom: 4px;
}

.product-name {
  font-weight: 500;
  margin-bottom: 8px;
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  margin-bottom: 8px;
}

.current-price {
  font-weight: bold;
  color: #007bff;
}

.original-price {
  text-decoration: line-through;
  color: #999;
  font-size: 14px;
  margin-left: 8px;
}

.discount-rate {
  background: #ff4444;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 8px;
}

.product-rating {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.product-actions {
  display: flex;
  gap: 8px;
}

.wishlist-btn, .cart-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.wishlist-btn:hover, .cart-btn:hover:not(:disabled) {
  background: #f8f9fa;
}

.wishlist-btn.active {
  color: #ff4444;
  border-color: #ff4444;
}

.cart-btn {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.cart-btn:hover:not(:disabled) {
  background: #0056b3;
}

.cart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cart-btn.loading {
  background: #28a745;
  border-color: #28a745;
}
</style>