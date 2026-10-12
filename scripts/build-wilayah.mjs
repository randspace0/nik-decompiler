// Builds public/wilayah.json from cahyadsn/wilayah (Kepmendagri 2025) SQL dump.
// Usage: node scripts/build-wilayah.mjs path/to/wilayah.sql
import { readFileSync, writeFileSync } from 'node:fs'

const sql = readFileSync(process.argv[2], 'utf8')
const out = { provinsi: {}, kabkota: {}, kecamatan: {} }
for (const [, kode, nama] of sql.matchAll(/\('([\d.]+)','((?:[^']|'')*)'\)/g)) {
  const parts = kode.split('.')
  const key = parts.join('')
  const name = nama.replaceAll("''", "'")
  if (parts.length === 1) out.provinsi[key] = name
  else if (parts.length === 2) out.kabkota[key] = name
  else if (parts.length === 3) out.kecamatan[key] = name
}
writeFileSync(new URL('../public/wilayah.json', import.meta.url), JSON.stringify(out))
console.log(Object.values(out).map(o => Object.keys(o).length).join(' / '))
