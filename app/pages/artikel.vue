<script setup lang="ts">
useSeoMeta({
  title: 'Kenapa ID sensitif tidak boleh bisa ditebak — NIK Decompiler',
  description: 'NIK menyimpan wilayah, tanggal lahir, dan jenis kelamin. Apa risikonya, dan bagaimana seharusnya ID sensitif dirancang.',
})
</script>

<template>
  <article class="wrap page">
    <header class="prose">
      <p class="kicker">Artikel edukasi</p>
      <h1>ID sensitif seharusnya tidak bisa ditebak dan tidak berisi data pribadi</h1>
      <p class="lead">
        NIK terlihat seperti 16 angka acak. Kenyataannya, hampir semua digitnya bisa ditebak dari data
        yang sering kita umbar sendiri: tempat tinggal dan tanggal lahir.
      </p>
    </header>

    <section class="prose">
      <h2>1. NIK adalah data, bukan sekadar nomor</h2>
      <p>
        Menurut Disdukcapil, 16 digit NIK tersusun dari kode provinsi, kabupaten/kota, dan kecamatan
        tempat NIK pertama diterbitkan, lalu tanggal lahir (DDMMYY, perempuan ditambah 40 pada tanggalnya),
        lalu 4 digit nomor urut. Artinya, dari satu NIK siapa pun bisa tahu:
      </p>
      <ul>
        <li>tanggal lahir dan umur,</li>
        <li>jenis kelamin,</li>
        <li>daerah asal sampai tingkat kecamatan.</li>
      </ul>
      <p>
        Ketiganya sering dipakai sebagai "pertanyaan keamanan". Ironisnya, banyak layanan juga memakai
        NIK itu sendiri sebagai bukti identitas: cukup ketik NIK dan nama ibu kandung, akun terbuka.
      </p>
    </section>

    <section class="prose">
      <h2>2. Seberapa mudah ditebak?</h2>
      <p>
        16 digit desimal kelihatannya punya 10<sup>16</sup> kemungkinan, sekitar 53 bit. Tapi strukturnya
        memangkas ruang itu drastis:
      </p>
      <div class="table-wrap">
        <table>
          <caption>Perkiraan kasar ruang kemungkinan NIK</caption>
          <thead>
            <tr><th scope="col">Bagian</th><th scope="col">Kemungkinan nyata</th><th scope="col">≈ bit</th></tr>
          </thead>
          <tbody>
            <tr><td>Provinsi + kab/kota + kecamatan</td><td>±7.285 kecamatan</td><td class="num">12,8</td></tr>
            <tr><td>Tanggal lahir (100 tahun)</td><td>±36.500 hari</td><td class="num">15,2</td></tr>
            <tr><td>Jenis kelamin</td><td>2</td><td class="num">1</td></tr>
            <tr><td>Nomor urut (biasanya kecil)</td><td>±100</td><td class="num">6,6</td></tr>
            <tr class="total"><td>Total</td><td>±5 × 10<sup>10</sup></td><td class="num">±36</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Untuk menebak NIK <em>orang tertentu</em> situasinya jauh lebih buruk. Kalau penyerang tahu tanggal
        lahir (dari ucapan ulang tahun di media sosial), jenis kelamin, dan kecamatannya, yang tersisa hanya
        nomor urut. Itu cuma beberapa puluh tebakan.
      </p>
    </section>

    <section class="prose">
      <h2>3. Hash saja tidak cukup</h2>
      <p>
        Developer sering merasa aman karena menyimpan <code>sha256(nik)</code>. Dengan ruang sekitar
        5 × 10<sup>10</sup> NIK yang realistis, satu GPU yang menghitung miliaran hash per detik bisa
        mencoba semuanya dalam hitungan detik sampai menit. Hash tanpa kunci rahasia atas data berentropi
        rendah praktis sama dengan plaintext.
      </p>
      <div class="compare">
        <figure class="bad">
          <figcaption>Jangan</figcaption>
          <pre><code>// bisa di-brute force dalam hitungan menit
user.nikHash = sha256(nik)
// ID = data pribadi
user.id = nik
// NIK bocor ke log
log.info(`login ${nik}`)</code></pre>
        </figure>
        <figure class="good">
          <figcaption>Lebih baik</figcaption>
          <pre><code>// acak, 122 bit
user.id = crypto.randomUUID()
// lookup butuh kunci rahasia
user.nikLookup = hmac(KMS_KEY, nik)
// simpan terenkripsi
user.nikEnc = encrypt(KMS_KEY, nik)
log.info(`login ${user.id}`)</code></pre>
        </figure>
      </div>
    </section>

    <section class="prose">
      <h2>4. Pelajaran dari negara lain</h2>
      <p>
        Amerika Serikat pernah punya masalah yang sama. Nomor Social Security (SSN) dulu disusun dari kode
        area dan urutan penerbitan. Pada 2009, peneliti Alessandro Acquisti dan Ralph Gross menunjukkan bahwa
        SSN bisa diprediksi hanya dari tanggal dan tempat lahir. Sejak Juni 2011, Social Security
        Administration mengacak penerbitan SSN.
      </p>
      <p>
        Beberapa negara seperti Estonia dan Swedia juga memasukkan tanggal lahir ke nomor identitas. Bedanya,
        di sana nomor itu dianggap <strong>publik</strong>. Untuk membuktikan identitas, warga memakai kartu
        ber-chip dengan PIN atau tanda tangan digital, bukan sekadar mengetik nomornya.
      </p>
    </section>

    <section class="prose">
      <h2>5. Prinsip merancang ID sensitif</h2>
      <ol class="principles">
        <li>
          <strong>Pisahkan identifier dari atribut.</strong>
          ID cukup menunjuk ke orangnya. Tanggal lahir, gender, dan wilayah disimpan sebagai kolom terpisah
          yang aksesnya bisa dibatasi.
        </li>
        <li>
          <strong>Buat tidak bisa ditebak.</strong>
          Gunakan generator acak yang aman secara kriptografi (CSPRNG), misalnya UUIDv4 atau minimal 80 bit
          acak. Jangan nomor urut, jangan turunan dari data pribadi.
        </li>
        <li>
          <strong>Identifier bukan password.</strong>
          Tahu nomor seseorang tidak boleh cukup untuk bertindak atas namanya. Autentikasi butuh faktor
          lain: OTP, biometrik, atau sertifikat digital.
        </li>
        <li>
          <strong>Minimalkan paparan.</strong>
          Tampilkan versi tersamar (<code>3310********0001</code>), jangan tulis ke log, jangan taruh di URL.
        </li>
        <li>
          <strong>Kalau terpaksa mencari berdasarkan NIK</strong>, pakai HMAC dengan kunci yang disimpan di
          KMS, bukan hash polos.
        </li>
      </ol>
    </section>

    <section class="prose">
      <h2>6. Yang bisa kamu lakukan sebagai pemilik NIK</h2>
      <ul>
        <li>Jangan unggah foto KTP atau KK ke media sosial atau grup chat.</li>
        <li>Saat menyerahkan fotokopi atau foto KTP, beri tulisan tujuan dan tanggal di atasnya, misalnya "Untuk verifikasi Bank X, 12/10/2026".</li>
        <li>Curigai pihak yang meminta NIK lewat telepon atau chat, walaupun mereka sudah tahu tanggal lahirmu.</li>
        <li>Batasi tanggal lahir lengkap di profil publik. Dengan tanggal lahir dan kecamatan, NIK-mu hampir terbongkar.</li>
        <li>Pantau akun dan pinjaman atas namamu. Kalau ada yang janggal, lapor ke layanan terkait dan ke Disdukcapil.</li>
      </ul>
    </section>

    <aside class="card note prose" aria-label="Catatan">
      <p>
        <strong>Catatan.</strong> Struktur NIK ditetapkan pemerintah dan tidak bisa kamu ubah. Tujuan artikel
        ini bukan menakut-nakuti, tapi supaya pembuat sistem berhenti memperlakukan NIK sebagai rahasia,
        dan supaya kita lebih hati-hati membagikannya.
      </p>
      <p><NuxtLink to="/">← Coba decoder NIK</NuxtLink></p>
    </aside>
  </article>
</template>

<style scoped>
.page { display: grid; gap: 32px; padding-block: 32px 16px; }
.prose { max-width: 68ch; }
.kicker { color: var(--accent); font-weight: 600; font-size: .875rem; text-transform: uppercase; letter-spacing: .06em; margin: 0 0 8px; }
h1 { font-size: clamp(1.75rem, 4vw, 2.5rem); margin: 0 0 12px; }
h2 { font-size: 1.375rem; margin: 0 0 12px; }
.lead { color: var(--muted); font-size: 1.125rem; margin: 0; }
p, li { margin: 0 0 12px; }
ul, ol { padding-left: 1.25rem; margin: 0 0 12px; }
code { font-size: .9em; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 1px 4px; }

.table-wrap { overflow-x: auto; margin: 0 0 12px; }
table { width: 100%; border-collapse: collapse; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
caption { text-align: left; color: var(--muted); font-size: .875rem; padding-bottom: 6px; }
th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--border); }
th { font-weight: 600; }
.num { text-align: right; font-variant-numeric: tabular-nums; }
.total td { font-weight: 700; border-bottom: 0; }

.compare { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr)); }
figure { margin: 0; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; background: var(--surface); }
figcaption { font-weight: 700; padding: 8px 12px; border-bottom: 1px solid var(--border); }
.bad figcaption { color: var(--danger); }
.good figcaption { color: var(--accent); }
figure pre { margin: 0; padding: 12px; overflow-x: auto; font-size: .8125rem; line-height: 1.5; }
figure pre code { background: none; border: 0; padding: 0; }

.principles li { padding-left: 4px; }
.note { border-left: 4px solid var(--primary); }
.note p:last-child { margin: 0; }
</style>
