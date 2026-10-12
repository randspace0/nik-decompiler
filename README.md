# NIK Decompiler

Bongkar 16 digit NIK (Nomor Induk Kependudukan): kode provinsi, kabupaten/kota, kecamatan,
tanggal lahir, jenis kelamin, dan nomor urut. Plus artikel edukasi kenapa ID sensitif
tidak boleh bisa ditebak dan tidak boleh berisi data pribadi.

Semua proses berjalan di browser. NIK tidak dikirim ke server.

- Struktur NIK: https://dukcapil.klaten.go.id/arti-16-digit-nomor-induk-kependudukan-nik
- Kode wilayah: Kepmendagri No. 300.2.2-2138 Tahun 2025 via https://github.com/cahyadsn/wilayah

```sh
bun install
bun run dev      # http://localhost:3000
bun run test
bun run deploy   # nuxt generate + wrangler deploy (Cloudflare Workers static assets)

# regenerate public/wilayah.json
curl -LO https://raw.githubusercontent.com/cahyadsn/wilayah/master/db/wilayah.sql
node scripts/build-wilayah.mjs wilayah.sql
```
