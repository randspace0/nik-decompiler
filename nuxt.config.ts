// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'NIK Decompiler',
      meta: [
        { name: 'description', content: 'Bongkar 16 digit NIK: wilayah, tanggal lahir, jenis kelamin. Diproses di browser, tidak dikirim ke server.' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap' },
      ],
    },
  },
})
