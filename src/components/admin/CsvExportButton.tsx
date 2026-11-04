'use client'

interface CsvExportButtonProps {
  data: Record<string, unknown>[]
  filename: string
  label?: string
}

export function CsvExportButton({
  data,
  filename,
  label = 'Export CSV',
}: CsvExportButtonProps) {
  function handleExport() {
    if (!data || data.length === 0) {
      alert('No records available to export.')
      return
    }

    // Extract headers
    const headers = Object.keys(data[0])

    const csvRows: string[] = []
    csvRows.push(headers.join(','))

    for (const row of data) {
      const values = headers.map((header) => {
        const val = row[header]
        if (val === null || val === undefined) return '""'
        if (typeof val === 'object') {
          return `"${JSON.stringify(val).replace(/"/g, '""')}"`
        }
        const stringVal = String(val).replace(/"/g, '""')
        return `"${stringVal}"`
      })
      csvRows.push(values.join(','))
    }

    const csvContent = '\uFEFF' + csvRows.join('\n') // UTF-8 BOM for Arabic/French characters
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${filename}-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#231f20] bg-white border border-[#cfc7b9] hover:bg-[#FAF8F5] transition-colors shadow-2xs"
      title="Download CSV spreadsheet"
    >
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {label}
    </button>
  )
}
