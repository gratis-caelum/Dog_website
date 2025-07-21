<template>
  <div class="category-page">
    <div class="category-container">
      <div class="category-header">
        <div class="category-title">
          <span class="category-icon">{{ categoryInfo?.icon }}</span>
          <h1>{{ categoryInfo?.name }}</h1>
        </div>
        <div class="product-count">
          {{ products.length }}개의 상품
        </div>
      </div>

      <div class="filter-section">
        <div class="sort-options">
          <select v-model="sortOption" @change="applySorting" class="sort-select">
            <option value="popular">인기순</option>
            <option value="price_low">가격 낮은순</option>
            <option value="price_high">가격 높은순</option>
            <option value="newest">신상품순</option>
            <option value="reviews">리뷰 많은순</option>
          </select>
        </div>

        <div class="filter-options">
          <div class="price-filter">
            <label>가격대</label>
            <select v-model="priceRange" @change="applyFilters">
              <option value="all">전체</option>
              <option value="under10k">1만원 이하</option>
              <option value="10k-30k">1만원 - 3만원</option>
              <option value="30k-50k">3만원 - 5만원</option>
              <option value="over50k">5만원 이상</option>
            </select>
          </div>
        </div>
      </div>

      <div class="products-section">
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>상품을 불러오는 중...</p>
        </div>

        <div v-else-if="products.length > 0" class="products-grid">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            @addToCart="handleAddToCart"
            @toggleWishlist="handleToggleWishlist"
          />
        </div>

        <div v-else class="no-products">
          <div class="no-products-icon">📦</div>
          <h3>해당 조건에 맞는 상품이 없습니다</h3>
          <p>다른 조건으로 검색해보세요!</p>
          <button @click="resetFilters" class="reset-filters-btn">
            필터 초기화
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '@/stores/counter'
import ProductCard from '@/components/ProductCard.vue'
import type { Product, Category, SearchFilters } from '@/types'

interface Props {
  category?: string
}

const props = defineProps<Props>()
const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()

const products = ref<Product[]>([])
const loading = ref<boolean>(false)
const sortOption = ref<SearchFilters['sort']>('popular')
const priceRange = ref<SearchFilters['priceRange']>('all')

const currentCategory = computed((): string => {
  return props.category || (route.params.category as string) || ''
})

const categoryInfo = computed((): Category | undefined => {
  return [...productStore.categories].find(cat => cat.id === currentCategory.value)
})

const searchProducts = async (): Promise<void> => {
  loading.value = true
  
  try {
    const filters: Partial<SearchFilters> = {
      category: currentCategory.value,
      sort: sortOption.value,
      priceRange: priceRange.value
    }
    
    const results = await productStore.searchProducts(filters)
    products.value = results
  } catch (error) {
    console.error('상품 검색 오류:', error)
    products.value = []
  } finally {
    loading.value = false
  }
}

const applySorting = (): void => {
  searchProducts()
}

const applyFilters = (): void => {
  searchProducts()
}

const resetFilters = (): void => {
  sortOption.value = 'popular'
  priceRange.value = 'all'
  searchProducts()
}

const handleAddToCart = (product: Product): void => {
  cartStore.addItem(product)
}

const handleToggleWishlist = (product: Product): void => {
  productStore.toggleWishlist(product.id)
}

// 카테고리 변경 시 상품 다시 로드
watch(currentCategory, () => {
  searchProducts()
})

onMounted(() => {
  searchProducts()
})
</script>

<style scoped>
.category-page {
  min-height: 80vh;
  background: #f8f9fa;
  padding: 20px 0;
}

.category-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.category-header {
  background: white;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-icon {
  font-size: 32px;
}

.category-title h1 {
  font-size: 28px;
  color: #333;
  margin: 0;
}

.product-count {
  color: #666;
  font-size: 16px;
}

.filter-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.sort-options, .filter-options {
  display: flex;
  align-items: center;
  gap: 12px;
}

.price-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-filter label {
  font-weight: 500;
  color: #333;
}

.sort-select, .price-filter select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
}

.sort-select:focus, .price-filter select:focus {
  outline: none;
  border-color: #007bff;
}

.products-section {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.no-products {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-products-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.no-products h3 {
  color: #333;
  margin-bottom: 10px;
}

.no-products p {
  margin-bottom: 20px;
}

.reset-filters-btn {
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s ease;
}

.reset-filters-btn:hover {
  background: #0056b3;
}

@media (max-width: 768px) {
  .category-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .filter-section {
    flex-direction: column;
    gap: 16px;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }

  .category-title h1 {
    font-size: 24px;
  }
}
</style>