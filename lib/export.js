/**
 * Shared export utility for XLSX and PDF
 * Uses dynamic imports so libraries only load when user clicks export
 */

// Format date: "6/5/2026" or "6/5/2026 14:32" for timestamps
export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  // Date-only string (from mock data or date column)
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(dateStr))) {
    const [y, m, d] = String(dateStr).split('-')
    return `${parseInt(d)}/${parseInt(m)}/${y}`
  }
  // Full ISO timestamp (from Supabase)
  const dt = new Date(dateStr)
  if (isNaN(dt.getTime())) return String(dateStr)
  const date = `${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}`
  const time = `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`
  return `${date} ${time}`
}

/**
 * Export data to XLSX
 * @param {Array} rows      - Array of flat objects to export
 * @param {string} filename - Output filename (without extension)
 */
export async function exportToXLSX(rows, filename = 'export') {
  const XLSX = await import('xlsx')
  const ws = XLSX.utils.json_to_sheet(rows)

  // Auto-width columns
  const colWidths = Object.keys(rows[0] || {}).map((key) => ({
    wch: Math.max(key.length, ...rows.map((r) => String(r[key] ?? '').length)) + 2
  }))
  ws['!cols'] = colWidths

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Data')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

/**
 * Export data to PDF (landscape table)
 * @param {Array}  rows    - Array of flat objects
 * @param {Array}  columns - [{ header: 'Name', key: 'student_name' }, ...]
 * @param {string} filename
 * @param {string} title   - Report title shown at top of PDF
 */
export async function exportToPDF(rows, columns, filename = 'export', title = 'Report') {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  // Header
  doc.setFillColor(255, 92, 26)
  doc.rect(0, 0, 297, 18, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('Art Smart Academy', 14, 11)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(title, 297 - 14, 11, { align: 'right' })

  // Sub-header
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(8)
  doc.text(`Generated: ${formatDateTime(new Date().toISOString())}  ·  ${rows.length} records`, 14, 24)

  autoTable(doc, {
    head: [columns.map((c) => c.header)],
    body: rows.map((row) => columns.map((c) => row[c.key] ?? '—')),
    startY: 28,
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 3,
      textColor: [30, 30, 30],
    },
    headStyles: {
      fillColor: [255, 92, 26],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    alternateRowStyles: { fillColor: [255, 248, 244] },
    columnStyles: columns.reduce((acc, col, i) => {
      if (col.width) acc[i] = { cellWidth: col.width }
      return acc
    }, {}),
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Footer
      const pageNum = doc.internal.getCurrentPageInfo().pageNumber
      const total   = doc.internal.getNumberOfPages()
      doc.setFontSize(7)
      doc.setTextColor(160, 160, 160)
      doc.text(`Page ${pageNum} of ${total}`, 297 / 2, 205, { align: 'center' })
    },
  })

  doc.save(`${filename}.pdf`)
}
