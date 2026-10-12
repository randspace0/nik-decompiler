<script setup lang="ts">
const route = useRoute()
const links = [
  { to: '/', label: 'Decoder' },
  { to: '/artikel', label: 'Artikel: Kenapa ini masalah?' },
]
</script>

<template>
  <a class="skip" href="#main">Lompat ke konten</a>
  <header class="top">
    <div class="wrap bar">
      <NuxtLink to="/" class="brand">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="M6.5 16a3 3 0 0 1 5 0M14 10h4M14 14h3" /></svg>
        <span>NIK Decompiler</span>
      </NuxtLink>
      <nav aria-label="Utama">
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to" :aria-current="route.path === l.to ? 'page' : undefined">{{ l.label }}</NuxtLink>
      </nav>
    </div>
  </header>
  <main id="main" tabindex="-1">
    <NuxtPage />
  </main>
  <footer class="wrap foot">
    <p>
      Semua proses berjalan di browser kamu. NIK tidak dikirim, tidak disimpan, tidak masuk URL.
      Data kode wilayah: Kepmendagri No. 300.2.2-2138 Tahun 2025 via
      <a href="https://github.com/cahyadsn/wilayah" rel="noopener">cahyadsn/wilayah</a>.
      Struktur NIK: <a href="https://dukcapil.klaten.go.id/arti-16-digit-nomor-induk-kependudukan-nik" rel="noopener">Disdukcapil Klaten</a>.
      <a href="https://github.com/randspace0/nik-decompiler" rel="noopener">Source code</a>.
    </p>
  </footer>
</template>

<style scoped>
.top { border-bottom: 1px solid var(--border); background: var(--surface); }
.bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 24px; padding-block: 8px; }
.brand { display: inline-flex; align-items: center; gap: 8px; font-weight: 700; color: var(--fg); text-decoration: none; min-height: 44px; }
nav { display: flex; flex-wrap: wrap; gap: 4px; }
nav a {
  display: inline-flex; align-items: center; min-height: 44px; padding: 0 12px;
  border-radius: 8px; color: var(--muted); text-decoration: none; font-weight: 500;
  transition: background-color .15s, color .15s;
}
nav a:hover { background: var(--bg); color: var(--fg); }
nav a[aria-current='page'] { color: var(--fg); box-shadow: inset 0 -3px 0 var(--primary); }
main { outline: none; }
.foot { color: var(--muted); font-size: .875rem; padding-block: 32px 48px; }
</style>
