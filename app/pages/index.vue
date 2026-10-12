<script setup lang="ts">
useSeoMeta({ title: 'NIK Decompiler — bongkar 16 digit NIK' })

// Serial 0000 is never issued (starts at 0001), so this example cannot belong to a real person.
const CONTOH = '3310015208950000'
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

const input = ref('')
const { data: wilayah, status, refresh } = useLazyFetch<Wilayah>('/wilayah.json', { server: false })

const digits = computed(() => cleanNik(input.value))
const result = computed(() => {
  if (digits.value.length !== 16) return null
  return decodeNik(digits.value, wilayah.value ?? undefined)
})
const error = computed(() => {
  if (!input.value || digits.value.length === 16) return ''
  if (digits.value.length > 16) return `Kelebihan ${digits.value.length - 16} digit. NIK selalu 16 digit.`
  return ''
})

const segments = computed(() => {
  const r = result.value
  if (!r) return []
  const wilayahLoading = status.value === 'pending' || status.value === 'idle'
  const nama = (n?: string) => n ?? (wilayahLoading ? 'Memuat…' : 'Tidak ditemukan')
  return [
    {
      key: 'prov', digits: r.kode.provinsi, pos: '1–2', label: 'Provinsi', value: nama(r.provinsi),
      why: `Kode ${r.kode.provinsi} = provinsi tempat NIK pertama kali diterbitkan.`,
    },
    {
      key: 'kab', digits: r.kode.kabkota, pos: '3–4', label: 'Kabupaten/Kota', value: nama(r.kabkota),
      why: `Digabung dengan kode provinsi jadi ${r.nik.slice(0, 4)}. Kode 01–69 umumnya kabupaten, 71–99 kota.`,
    },
    {
      key: 'kec', digits: r.kode.kecamatan, pos: '5–6', label: 'Kecamatan', value: nama(r.kecamatan),
      why: `Kode lengkap ${r.nik.slice(0, 2)}.${r.nik.slice(2, 4)}.${r.nik.slice(4, 6)}. Kalau tidak ketemu, mungkin wilayahnya sudah dimekarkan atau kodenya berubah sejak NIK terbit.`,
    },
    {
      key: 'tgl', digits: r.kode.tanggal, pos: '7–12', label: 'Tanggal lahir & jenis kelamin',
      value: r.tanggalValid ? `${r.hari} ${BULAN[r.bulan - 1]} ${r.tahun} · ${r.gender}` : 'Tanggal tidak valid',
      why: r.gender === 'Perempuan'
        ? `Format DDMMYY. Hari tertulis ${r.kode.tanggal.slice(0, 2)}: lebih dari 40, artinya perempuan (${r.kode.tanggal.slice(0, 2)} − 40 = ${r.hari}). Tahun hanya 2 digit, abadnya ditebak.`
        : `Format DDMMYY. Hari tertulis ${r.kode.tanggal.slice(0, 2)}: tidak ditambah 40, artinya laki-laki. Tahun hanya 2 digit, abadnya ditebak.`,
    },
    {
      key: 'serial', digits: r.kode.serial, pos: '13–16', label: 'Nomor urut', value: `#${r.serial}`,
      why: r.serial === 0
        ? 'Nomor urut dimulai dari 0001, jadi 0000 tidak pernah diterbitkan. Ini NIK fiktif.'
        : `Urutan ke-${r.serial} untuk kombinasi wilayah + tanggal lahir + jenis kelamin yang sama. Biasanya angka kecil, jadi mudah ditebak.`,
    },
  ]
})

const bocor = computed(() => {
  const r = result.value
  if (!r || !r.tanggalValid) return []
  return [
    `Lahir ${r.hari} ${BULAN[r.bulan - 1]} ${r.tahun}, sekarang sekitar ${hitungUmur(r)} tahun.`,
    `Jenis kelamin: ${r.gender}.`,
    `Pertama terdaftar di ${[r.kecamatan, r.kabkota, r.provinsi].filter(Boolean).join(', ') || 'wilayah yang kodenya tercantum'}.`,
    'Data di atas sering dipakai sebagai "pertanyaan keamanan" oleh bank, operator seluler, dan pinjol.',
  ]
})
</script>

<template>
  <div class="wrap page">
    <section class="hero">
      <h1>Bongkar 16 digit NIK</h1>
      <p class="lead prose">
        NIK bukan angka acak. Di dalamnya ada wilayah, tanggal lahir, dan jenis kelamin.
        Masukkan NIK untuk melihat apa saja yang bisa dibaca siapa pun yang melihat KTP kamu.
      </p>
    </section>

    <section class="card form" aria-labelledby="form-h">
      <h2 id="form-h" class="sr-only">Input NIK</h2>
      <label for="nik">Nomor Induk Kependudukan</label>
      <div class="row">
        <input
          id="nik" v-model="input" class="mono" inputmode="numeric" autocomplete="off" spellcheck="false"
          placeholder="16 digit, contoh 3310015208950000" maxlength="24"
          :aria-invalid="!!error" aria-describedby="nik-help nik-err"
        >
        <button type="button" class="btn secondary" @click="input = CONTOH">Pakai contoh</button>
        <button v-if="input" type="button" class="btn ghost" @click="input = ''">Hapus</button>
      </div>
      <p id="nik-help" class="help">
        {{ digits.length }}/16 digit. Spasi dan titik diabaikan. Diproses di browser, tidak dikirim ke mana pun.
      </p>
      <p id="nik-err" class="err" role="alert">{{ error }}</p>
      <p v-if="status === 'error'" class="err" role="alert">
        Gagal memuat data wilayah. <button type="button" class="link" @click="refresh()">Coba lagi</button>
      </p>
    </section>

    <template v-if="result">
      <section aria-labelledby="hasil-h" class="result">
        <h2 id="hasil-h">Hasil decompile</h2>
        <p class="digits mono" aria-label="NIK dipecah per bagian">
          <span v-for="s in segments" :key="s.key" :class="`seg seg-${s.key}`">{{ s.digits }}</span>
        </p>
        <ol class="list">
          <li v-for="s in segments" :key="s.key" :class="`item seg-${s.key}`">
            <div class="item-head">
              <span class="chip mono">{{ s.digits }}</span>
              <span class="pos">Digit {{ s.pos }} · {{ s.label }}</span>
            </div>
            <p class="value">{{ s.value }}</p>
            <p class="why">{{ s.why }}</p>
          </li>
        </ol>
      </section>

      <section v-if="bocor.length" class="card warn" aria-labelledby="bocor-h">
        <h2 id="bocor-h">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
          Yang bocor hanya dari 16 angka ini
        </h2>
        <ul>
          <li v-for="b in bocor" :key="b">{{ b }}</li>
        </ul>
        <p>
          Sebaliknya juga berlaku: kalau orang tahu tanggal lahir dan kecamatanmu, sisa tebakannya cuma nomor urut yang biasanya kecil.
          <NuxtLink to="/artikel">Baca kenapa ID sensitif seharusnya tidak dirancang seperti ini →</NuxtLink>
        </p>
      </section>
    </template>

    <section v-else class="card empty" aria-labelledby="struktur-h">
      <h2 id="struktur-h">Struktur NIK</h2>
      <div class="struktur">
        <KtpContoh />
        <dl class="legend">
        <div><dt class="seg-prov">PP</dt><dd>Kode provinsi</dd></div>
        <div><dt class="seg-kab">KK</dt><dd>Kode kabupaten/kota</dd></div>
        <div><dt class="seg-kec">CC</dt><dd>Kode kecamatan</dd></div>
        <div><dt class="seg-tgl">DDMMYY</dt><dd>Tanggal lahir; perempuan: hari + 40</dd></div>
        <div><dt class="seg-serial">SSSS</dt><dd>Nomor urut, mulai 0001</dd></div>
        </dl>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page { display: grid; gap: 24px; padding-block: 32px; }
.hero h1 { font-size: clamp(1.75rem, 4vw, 2.5rem); margin: 0 0 8px; }
.lead { color: var(--muted); font-size: 1.125rem; margin: 0; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }

.form label { display: block; font-weight: 600; margin-bottom: 8px; }
.row { display: flex; flex-wrap: wrap; gap: 8px; }
input {
  flex: 1 1 16rem; min-width: 0; min-height: 48px; padding: 0 14px;
  font-size: 1.125rem; letter-spacing: .06em;
  color: var(--fg); background: var(--bg); border: 1px solid var(--border); border-radius: 10px;
}
input[aria-invalid='true'] { border-color: var(--danger); }
.btn {
  min-height: 48px; padding: 0 16px; border-radius: 10px; font: 600 1rem var(--font); cursor: pointer;
  transition: background-color .15s, border-color .15s;
}
.secondary { background: var(--primary); color: var(--on-primary); border: 1px solid var(--primary); }
.secondary:hover { filter: brightness(1.1); }
.ghost { background: transparent; color: var(--fg); border: 1px solid var(--border); }
.ghost:hover { background: var(--bg); }
.link { background: none; border: 0; padding: 0; color: var(--primary); text-decoration: underline; font: inherit; cursor: pointer; }
.help { color: var(--muted); font-size: .875rem; margin: 8px 0 0; }
.err { color: var(--danger); font-size: .875rem; margin: 4px 0 0; min-height: 1.4em; }

.result h2, .card h2 { font-size: 1.25rem; margin: 0 0 12px; }
.digits {
  display: flex; flex-wrap: wrap; gap: 6px; margin: 0 0 16px;
  font-size: clamp(1.25rem, 5vw, 2rem); font-weight: 700; letter-spacing: .08em;
}
.seg { padding: 4px 8px; border-radius: 8px; border: 2px solid currentColor; }
.seg-prov { color: var(--seg-prov); }
.seg-kab { color: var(--seg-kab); }
.seg-kec { color: var(--seg-kec); }
.seg-tgl { color: var(--seg-tgl); }
.seg-serial { color: var(--seg-serial); }

.list { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); }
.item {
  background: var(--surface); border: 1px solid var(--border); border-left: 4px solid currentColor;
  border-radius: var(--radius); padding: 16px;
}
.item-head { display: flex; align-items: center; gap: 10px; }
.chip { font-weight: 700; padding: 2px 8px; border-radius: 6px; border: 1px solid currentColor; }
.pos { color: var(--muted); font-size: .875rem; font-weight: 500; }
.value { color: var(--fg); font-size: 1.125rem; font-weight: 600; margin: 10px 0 4px; overflow-wrap: anywhere; }
.why { color: var(--muted); font-size: .9375rem; margin: 0; }

.warn { background: var(--warn-bg); border-color: color-mix(in srgb, var(--warn-fg) 40%, transparent); }
.warn h2 { display: flex; align-items: center; gap: 8px; color: var(--warn-fg); }
.warn ul { margin: 0 0 12px; padding-left: 1.25rem; }
.warn p { margin: 0; }

.struktur { display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr)); align-items: center; }
.legend { display: grid; gap: 10px; margin: 0; }
.legend div { display: flex; gap: 10px; align-items: baseline; }
.legend dt { font-family: var(--mono); font-weight: 700; min-width: 4.5rem; }
.legend dd { margin: 0; color: var(--muted); }
</style>
