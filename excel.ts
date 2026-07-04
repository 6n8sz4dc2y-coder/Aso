import * as XLSX from 'xlsx'
import type { Centre, DashboardData } from './types'

const groupMap: Record<string, string> = {
  Bolton: 'North CDA', Bury: 'North CDA', Rochdale: 'North CDA', SQ: 'North CDA',
  Bradford: 'West Yorkshire', Huddersfield: 'West Yorkshire', Silsden: 'West Yorkshire'
}

const centreNames = Object.keys(groupMap)

const number = (value: any) => Number(value || 0) || 0

export async function parseWeeklyUpdate(file: File): Promise<DashboardData> {
  const arrayBuffer = await file.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer)
  const sheet = workbook.Sheets['2026 - Q3'] || workbook.Sheets[workbook.SheetNames[0]]
  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, defval: null })

  const centres: Centre[] = centreNames.map(name => {
    const regRow = findRow(rows, name, 3, 12)
    const usedRow = findRow(rows, name, 29, 38)
    const bchRow = findRow(rows, name, 43, 52)

    return {
      name,
      group: groupMap[name],
      registrations: {
        july: number(regRow?.[4]),
        august: number(regRow?.[10]),
        september: number(regRow?.[16]),
        current: number(regRow?.[21]),
        target: number(regRow?.[22]),
        fleet: number(regRow?.[20]),
        clcp: number(regRow?.[2]) + number(regRow?.[8]) + number(regRow?.[14]),
      },
      used: {
        current: number(usedRow?.[10]),
        target: number(usedRow?.[11]),
      },
      bch: {
        current: number(bchRow?.[1]),
        target: number(bchRow?.[2]),
      }
    }
  })

  return {
    organisationName: 'RRG Group',
    quarter: 'Q3 2026',
    updatedAt: new Date().toISOString().slice(0, 10),
    source: file.name,
    centres
  }
}

function findRow(rows: any[][], name: string, start: number, end: number) {
  return rows.slice(start, end).find(row => String(row?.[0] || '').trim().toLowerCase() === name.toLowerCase())
}
