<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-form-wrapper">
        <div class="logo-section">
          <div class="logo-icon">🐕</div>
          <h1 class="logo-text">DOGPANG</h1>
          <p class="login-subtitle">반려견을 위한 최고의 쇼핑 경험</p>
        </div>

        <form class="login-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="email" class="form-label">이메일</label>
            <input
              id="email"
              type="email"
              class="form-input"
              v-model="formData.email"
              :class="{ error: errors.email }"
              placeholder="이메일을 입력하세요"
              required
            >
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">비밀번호</label>
            <div class="password-input-wrapper">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                v-model="formData.password"
                :class="{ error: errors.password }"
                placeholder="비밀번호를 입력하세요"
                required
              >
              <button
                type="button"
                class="password-toggle"
                @click="togglePassword"
                :title="showPassword ? '비밀번호 숨기기' : '비밀번호 보기'"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="rememberMe">
              <span class="checkbox-custom"></span>
              로그인 상태 유지
            </label>
            <a href="#" class="forgot-password" @click.prevent="handleForgotPassword">
              비밀번호 찾기
            </a>
          </div>

          <button
            type="submit"
            class="login-btn"
            :class="{ loading: isLoading }"
            :disabled="isLoading"
          >
            {{ isLoading ? '로그인 중...' : '로그인' }}
          </button>

          <div class="divider">
            <span>또는</span>
          </div>

          <div class="social-login">
            <button type="button" class="social-btn kakao" @click="handleSocialLogin('kakao')">
              <span class="social-icon">💬</span>
              카카오로 로그인
            </button>
            <button type="button" class="social-btn google" @click="handleSocialLogin('google')">
              <span class="social-icon">🔍</span>
              구글로 로그인
            </button>
          </div>

          <div class="signup-link">
            <span>아직 회원이 아니신가요?</span>
            <a href="#" @click.prevent="goToSignup">회원가입</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const isLoading = ref<boolean>(false)
const showPassword = ref<boolean>(false)
const rememberMe = ref<boolean>(false)

const validateForm = (): boolean => {
  let isValid = true
  
  // Reset errors
  errors.email = ''
  errors.password = ''
  
  // Email validation
  if (!formData.email) {
    errors.email = '이메일을 입력해주세요'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = '올바른 이메일 형식을 입력해주세요'
    isValid = false
  }
  
  // Password validation
  if (!formData.password) {
    errors.password = '비밀번호를 입력해주세요'
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = '비밀번호는 최소 6자 이상이어야 합니다'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true
  
  try {
    // TODO: 실제 로그인 API 호출
    await new Promise(resolve => setTimeout(resolve, 1500)) // Mock delay
    
    console.log('로그인 시도:', {
      email: formData.email,
      password: formData.password,
      rememberMe: rememberMe.value
    })
    
    // 로그인 성공 시 홈으로 이동
    alert('로그인이 완료되었습니다!')
    router.push('/')
    
  } catch (error) {
    console.error('로그인 오류:', error)
    alert('로그인에 실패했습니다. 다시 시도해주세요.')
  } finally {
    isLoading.value = false
  }
}

const togglePassword = (): void => {
  showPassword.value = !showPassword.value
}

const handleForgotPassword = (): void => {
  alert('비밀번호 찾기 기능은 준비 중입니다.')
}

const handleSocialLogin = (provider: string): void => {
  alert(`${provider} 로그인 기능은 준비 중입니다.`)
}

const goToSignup = (): void => {
  alert('회원가입 페이지는 준비 중입니다.')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-form-wrapper {
  background: white;
  border-radius: 16px;
  padding: 40px 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.logo-section {
  text-align: center;
  margin-bottom: 30px;
}

.logo-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.logo-text {
  font-size: 32px;
  font-weight: bold;
  color: #007bff;
  margin: 0 0 8px 0;
}

.login-subtitle {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-input {
  padding: 14px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-input.error {
  border-color: #dc3545;
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
}

.error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 2px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #333;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
  background: #007bff;
  border-color: #007bff;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.forgot-password {
  color: #007bff;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-btn {
  padding: 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;
}

.login-btn:hover:not(:disabled) {
  background: #0056b3;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-btn.loading {
  background: #6c757d;
}

.divider {
  text-align: center;
  position: relative;
  color: #666;
  font-size: 14px;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e9ecef;
  z-index: 0;
}

.divider span {
  background: white;
  padding: 0 15px;
  position: relative;
  z-index: 1;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.social-btn:hover {
  background: #f8f9fa;
}

.social-btn.kakao {
  border-color: #fee500;
  background: #fee500;
}

.social-btn.google {
  border-color: #db4437;
  color: #db4437;
}

.social-icon {
  font-size: 18px;
}

.signup-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.signup-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}

.signup-link a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-form-wrapper {
    padding: 30px 20px;
  }
  
  .logo-text {
    font-size: 28px;
  }
  
  .form-options {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}
</style>