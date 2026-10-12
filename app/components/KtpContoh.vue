<script setup lang="ts">
// Fictional card. NIK serial 0000 is never issued, so it cannot match a real person.
const rows = [
  ['Nama', 'SITI CONTOH'],
  ['Tempat/Tgl Lahir', 'KLATEN, 12-08-1995'],
  ['Jenis Kelamin', 'PEREMPUAN'],
  ['Alamat', 'JL. FIKTIF NO. 0'],
  ['Kecamatan', 'PRAMBANAN'],
  ['Berlaku Hingga', 'SEUMUR HIDUP'],
]
</script>

<template>
  <figure class="ktp" aria-label="Contoh KTP fiktif dengan NIK 3310015208950000">
    <div class="head">
      <p>PROVINSI JAWA TENGAH</p>
      <p>KABUPATEN KLATEN</p>
    </div>
    <p class="nik mono">
      <span class="label">NIK</span>
      <span>:</span>
      <span class="seg-prov">33</span><span class="seg-kab">10</span><span class="seg-kec">01</span><span class="seg-tgl">520895</span><span class="seg-serial">0000</span>
    </p>
    <div class="body">
      <dl>
        <div v-for="[k, v] in rows" :key="k">
          <dt>{{ k }}</dt><dd>: {{ v }}</dd>
        </div>
      </dl>
      <svg class="photo" viewBox="0 0 60 75" aria-hidden="true">
        <rect width="60" height="75" fill="#c2410c" />
        <circle cx="30" cy="28" r="12" fill="#fed7aa" />
        <path d="M8 75c2-16 12-24 22-24s20 8 22 24Z" fill="#fed7aa" />
      </svg>
    </div>
    <p class="stamp" aria-hidden="true">CONTOH · FIKTIF</p>
    <figcaption>Ilustrasi KTP fiktif. Warna menandai tiap bagian NIK.</figcaption>
  </figure>
</template>

<style scoped>
.ktp {
  position: relative; margin: 0; max-width: 30rem; overflow: hidden;
  /* Card colors stay fixed in both themes: it depicts a physical object. */
  background: linear-gradient(135deg, #bfdbfe, #e0f2fe 55%, #bae6fd);
  color: #0f172a; border-radius: 14px; padding: 14px 16px 12px;
  box-shadow: 0 1px 2px rgb(0 0 0 / .1), 0 8px 24px rgb(15 23 42 / .12);
  font-size: .8125rem; line-height: 1.35;
}
.head { text-align: center; font-weight: 700; letter-spacing: .03em; }
.head p { margin: 0; }
.nik { display: flex; gap: 6px; align-items: baseline; margin: 10px 0; font-size: 1.05rem; font-weight: 700; flex-wrap: wrap; }
.nik .label { font-family: var(--font); }
.nik span[class^='seg-'] { border-bottom: 3px solid currentColor; }
/* Darker segment tones to stay readable on the light card in dark mode too. */
.seg-prov { color: #1d4ed8; }
.seg-kab { color: #6d28d9; }
.seg-kec { color: #be185d; }
.seg-tgl { color: #92400e; }
.seg-serial { color: #0f766e; }
.body { display: flex; gap: 12px; justify-content: space-between; }
dl { margin: 0; display: grid; gap: 2px; }
dl div { display: grid; grid-template-columns: 7.5rem 1fr; }
dt { color: #334155; }
dd { margin: 0; font-weight: 600; }
.photo { width: 72px; height: 90px; flex: none; border-radius: 4px; }
.stamp {
  position: absolute; right: -36px; top: 28px; transform: rotate(35deg);
  background: #b91c1c; color: #fff; font-weight: 700; font-size: .7rem; letter-spacing: .1em;
  padding: 3px 44px; margin: 0;
}
figcaption { margin-top: 10px; color: #334155; font-size: .75rem; }
@media (max-width: 420px) {
  dl div { grid-template-columns: 6.5rem 1fr; }
  .photo { width: 56px; height: 70px; }
}
</style>
