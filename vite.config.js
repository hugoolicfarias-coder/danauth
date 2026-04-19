import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        services: resolve(__dirname, 'services.html'),
        contact: resolve(__dirname, 'contact.html'),
        terms: resolve(__dirname, 'terms.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        shopping: resolve(__dirname, 'shopping.html'),
        ai_labs: resolve(__dirname, 'ai-labs.html'),
        entertainment: resolve(__dirname, 'entertainment.html'),
        pricing: resolve(__dirname, 'pricing.html'),
        login: resolve(__dirname, 'login.html'),
        account: resolve(__dirname, 'account.html'),
      },
    },
  },
})
