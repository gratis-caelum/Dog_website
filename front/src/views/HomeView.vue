<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">🐕 DOGPANG</h1>
          <p class="hero-subtitle">반려견을 위한 최고의 쇼핑 경험</p>
          <div class="hero-features">
            <span>🚚 전국 무료배송</span>
            <span>⚡ 당일발송</span>
            <span>💬 카카오톡 상담</span>
          </div>
          <button class="hero-cta" @click="scrollToProducts">
            지금 쇼핑하기
          </button>
        </div>
      </div>
    </section>

    <!-- Category Section -->
    <section class="category-section" ref="categoriesRef">
      <div class="section-container">
        <h2 class="section-title">카테고리</h2>
        <div class="categories-grid">
          <div 
            v-for="category in categories" 
            :key="category.id"
            class="category-card"
            @click="goToCategory(category.id)"
          >
            <div class="category-icon">{{ category.icon }}</div>
            <div class="category-name">{{ category.name }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Best Products Section -->
    <section class="products-section" ref="productsRef">
      <div class="section-container">
        <h2 class="section-title">베스트셀러</h2>
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>상품을 불러오는 중...</p>
        </div>
        <div v-else class="products-grid">
          <ProductCard
            v-for="product in bestProducts"
            :key="product.id"
            :product="product"
            @addToCart="handleAddToCart"
            @toggleWishlist="handleToggleWishlist"
          />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="section-container">
        <h2 class="section-title">DOGPANG 특별 서비스</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🚚</div>
            <h3>무료배송</h3>
            <p>30,000원 이상 구매 시<br>전국 무료배송</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>당일발송</h3>
            <p>오후 2시 이전 주문 시<br>당일 발송 보장</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💬</div>
            <h3>전문 상담</h3>
            <p>반려동물 전문가와<br>1:1 카카오톡 상담</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔄</div>
            <h3>교환/반품</h3>
            <p>7일 내 무료 교환<br>및 반품 서비스</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '@/stores/counter'
import ProductCard from '@/components/ProductCard.vue'
import type { Product } from '@/types'

const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

const loading = ref<boolean>(false)
const bestProducts = ref<Product[]>([])
const categoriesRef = ref<HTMLElement | null>(null)
const productsRef = ref<HTMLElement | null>(null)

const categories = computed(() => productStore.categories)

const loadBestProducts = async (): Promise<void> => {
  loading.value = true
  
  try {
    // 베스트셀러 상품 로드 (인기순으로 4개)
    const results = await productStore.searchProducts({ 
      sort: 'popular' 
    })
    bestProducts.value = results.slice(0, 4)
  } catch (error) {
    console.error('베스트 상품 로드 오류:', error)
    bestProducts.value = []
  } finally {
    loading.value = false
  }
}

const goToCategory = (categoryId: string): void => {
  router.push(`/category/${categoryId}`)
}

const handleAddToCart = (product: Product): void => {
  cartStore.addItem(product)
}

const handleToggleWishlist = (product: Product): void => {
  productStore.toggleWishlist(product.id)
}

const scrollToProducts = (): void => {
  productsRef.value?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  loadBestProducts()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
}

.hero-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-title {
  font-size: 48px;
  font-weight: bold;
  margin: 0 0 16px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 24px;
  margin: 0 0 30px 0;
  opacity: 0.9;
}

.hero-features {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.hero-features span {
  font-size: 16px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.hero-cta {
  padding: 16px 32px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.category-section, .products-section, .features-section {
  padding: 60px 0;
}

.category-section {
  background: #f8f9fa;
}

.products-section {
  background: white;
}

.features-section {
  background: #f8f9fa;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin: 0 0 40px 0;
  text-align: center;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.category-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.category-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.category-name {
  font-weight: 500;
  color: #333;
  font-size: 16px;
}

.loading {
  text-align: center;
  padding: 40px 20px;
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
  gap: 24px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0 0 12px 0;
}

.feature-card p {
  color: #666;
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .hero-subtitle {
    font-size: 20px;
  }
  
  .hero-features {
    gap: 16px;
  }
  
  .hero-features span {
    font-size: 14px;
    padding: 6px 12px;
  }
  
  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 16px;
  }
  
  .category-card {
    padding: 20px 16px;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
  }
  
  .section-title {
    font-size: 28px;
  }
}
</style>
