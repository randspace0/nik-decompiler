export interface Wilayah {
  provinsi: Record<string, string>
  kabkota: Record<string, string>
  kecamatan: Record<string, string>
}

export interface NikResult {
  nik: string
  kode: { provinsi: string, kabkota: string, kecamatan: string, tanggal: string, serial: string }
  provinsi?: string
  kabkota?: string
  kecamatan?: string
  gender: 'Perempuan' | 'Laki-laki'
  hari: number
  bulan: number
  tahun: number
  tanggalValid: boolean
  serial: number
}

export function cleanNik(input: string): string {
  return input.replace(/\D/g, '')
}

// `today` injectable for deterministic tests.
export function decodeNik(input: string, wilayah?: Wilayah, today = new Date()): NikResult {
  const nik = cleanNik(input)
  if (nik.length !== 16) throw new Error(`NIK harus 16 digit, sekarang ${nik.length} digit.`)

  const rawDay = Number(nik.slice(6, 8))
  const gender = rawDay > 40 ? 'Perempuan' : 'Laki-laki'
  const hari = rawDay > 40 ? rawDay - 40 : rawDay
  const bulan = Number(nik.slice(8, 10))
  const yy = Number(nik.slice(10, 12))
  // ponytail: NIK only stores 2-digit year; assume the most recent century not in the future.
  const tahun = yy <= today.getFullYear() % 100 ? 2000 + yy : 1900 + yy
  const date = new Date(tahun, bulan - 1, hari)

  return {
    nik,
    kode: {
      provinsi: nik.slice(0, 2),
      kabkota: nik.slice(2, 4),
      kecamatan: nik.slice(4, 6),
      tanggal: nik.slice(6, 12),
      serial: nik.slice(12, 16),
    },
    provinsi: wilayah?.provinsi[nik.slice(0, 2)],
    kabkota: wilayah?.kabkota[nik.slice(0, 4)],
    kecamatan: wilayah?.kecamatan[nik.slice(0, 6)],
    gender,
    hari,
    bulan,
    tahun,
    tanggalValid: date.getFullYear() === tahun && date.getMonth() === bulan - 1 && date.getDate() === hari,
    serial: Number(nik.slice(12, 16)),
  }
}

export function hitungUmur(r: Pick<NikResult, 'hari' | 'bulan' | 'tahun'>, today = new Date()): number {
  const lewat = today.getMonth() + 1 > r.bulan || (today.getMonth() + 1 === r.bulan && today.getDate() >= r.hari)
  return today.getFullYear() - r.tahun - (lewat ? 0 : 1)
}
