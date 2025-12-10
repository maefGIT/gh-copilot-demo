<template>
  <div class="language-selector">
    <button class="language-button" @click="toggleDropdown" :title="$t('language.select')">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
      <span class="current-language">{{ currentLanguageCode.toUpperCase() }}</span>
      <svg class="chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>

    <div v-if="showDropdown" class="language-dropdown">
      <button
        v-for="lang in languages"
        :key="lang.code"
        class="language-option"
        :class="{ active: currentLanguageCode === lang.code }"
        @click="changeLanguage(lang.code)"
      >
        <span class="flag">{{ lang.flag }}</span>
        <span class="language-name">{{ $t(`language.${lang.code}`) }}</span>
        <span v-if="currentLanguageCode === lang.code" class="check">✓</span>
      </button>
    </div>

    <div v-if="showDropdown" class="dropdown-overlay" @click="closeDropdown"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const showDropdown = ref(false)

const languages = [
  { code: 'en', flag: '🇬🇧' },
  { code: 'fr', flag: '🇫🇷' },
  { code: 'de', flag: '🇩🇪' }
]

const currentLanguageCode = computed(() => locale.value)

const toggleDropdown = (): void => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = (): void => {
  showDropdown.value = false
}

const changeLanguage = (lang: string): void => {
  locale.value = lang
  closeDropdown()
}
</script>

<style scoped>
.language-selector {
  position: relative;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 600;
}

.language-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.language-button svg:first-child {
  width: 20px;
  height: 20px;
}

.chevron {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.current-language {
  font-weight: bold;
}

.language-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  z-index: 1002;
  min-width: 180px;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.language-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: white;
  color: #333;
  cursor: pointer;
  transition: background 0.2s ease;
  text-align: left;
  font-size: 0.95rem;
}

.language-option:hover {
  background: #f5f5f5;
}

.language-option.active {
  background: #e8edff;
  color: #667eea;
  font-weight: 600;
}

.flag {
  font-size: 1.5rem;
}

.language-name {
  flex: 1;
}

.check {
  color: #667eea;
  font-weight: bold;
  font-size: 1.2rem;
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
}

@media (max-width: 768px) {
  .language-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }

  .language-dropdown {
    min-width: 160px;
  }

  .language-option {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
}
</style>
