import { expect, test } from 'bun:test'
import { decodeNik, hitungUmur } from './nik'

const today = new Date(2026, 9, 12)
const wilayah = {
  provinsi: { 33: 'Jawa Tengah' },
  kabkota: { 3310: 'Kabupaten Klaten' },
  kecamatan: { 331001: 'Prambanan' },
}

test('decodes region, female date offset, serial', () => {
  const r = decodeNik('3310 0152 0895 0000', wilayah, today)
  expect([r.provinsi, r.kabkota, r.kecamatan, r.gender, r.hari, r.bulan, r.tahun, r.serial, r.tanggalValid])
    .toEqual(['Jawa Tengah', 'Kabupaten Klaten', 'Prambanan', 'Perempuan', 12, 8, 1995, 0, true])
})

test('male, 2000s year, invalid date flagged', () => {
  const r = decodeNik('3310013102100001', wilayah, today)
  expect([r.gender, r.tahun, r.tanggalValid]).toEqual(['Laki-laki', 2010, false])
})

test('rejects wrong length', () => {
  expect(() => decodeNik('123', wilayah, today)).toThrow('16 digit')
})

test('age before and after birthday', () => {
  expect(hitungUmur({ hari: 12, bulan: 10, tahun: 2000 }, today)).toBe(26)
  expect(hitungUmur({ hari: 13, bulan: 10, tahun: 2000 }, today)).toBe(25)
})
