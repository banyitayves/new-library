'use client'

import { useState } from 'react'
import { Upload, Download, FileText, AlertCircle } from 'lucide-react'
import { parseCSVMembers, parseCSVBooks, generateCSVSampleMembers, generateCSVSampleBooks } from '@/lib/features'
import { getMembers, saveMembers, getBooks, saveBooks } from '@/lib/database'

interface ImportCSVProps {
  onClose: () => void
  onSuccess: () => void
}

export default function ImportCSV({ onClose, onSuccess }: ImportCSVProps) {
  const [importType, setImportType] = useState<'members' | 'books'>('members')
  const [csvContent, setCsvContent] = useState('')
  const [preview, setPreview] = useState<any[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setCsvContent(content)
      setError('')
      
      try {
        let previewData = []
        if (importType === 'members') {
          previewData = parseCSVMembers(content).slice(0, 5)
        } else {
          previewData = parseCSVBooks(content).slice(0, 5)
        }
        setPreview(previewData)
      } catch (err: any) {
        setError('Error parsing CSV: ' + err.message)
      }
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (!csvContent.trim()) {
      setError('Please select a CSV file first')
      return
    }

    setLoading(true)
    try {
      let data = []
      if (importType === 'members') {
        data = parseCSVMembers(csvContent)
        const existing = getMembers()
        saveMembers([...existing, ...data])
      } else {
        data = parseCSVBooks(csvContent)
        const existing = getBooks()
        saveBooks([...existing, ...data])
      }

      setError('')
      setCsvContent('')
      setPreview([])
      onSuccess()
    } catch (err: any) {
      setError('Import failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const downloadSample = () => {
    let csvContent = ''
    let filename = ''

    if (importType === 'members') {
      csvContent = generateCSVSampleMembers()
      filename = 'sample-members.csv'
    } else {
      csvContent = generateCSVSampleBooks()
      filename = 'sample-books.csv'
    }

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="import-modal-overlay">
      <div className="import-modal">
        <div className="import-header">
          <h2>📥 Import Data from CSV</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="import-tabs">
          <button
            className={`tab-btn ${importType === 'members' ? 'active' : ''}`}
            onClick={() => {
              setImportType('members')
              setCsvContent('')
              setPreview([])
            }}
          >
            👥 Members
          </button>
          <button
            className={`tab-btn ${importType === 'books' ? 'active' : ''}`}
            onClick={() => {
              setImportType('books')
              setCsvContent('')
              setPreview([])
            }}
          >
            📚 Books
          </button>
        </div>

        <div className="import-content">
          <div className="upload-section">
            <div className="upload-box">
              <FileText size={40} />
              <p>Drop your CSV file here or click to upload</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden-input"
              />
            </div>

            <button onClick={downloadSample} className="btn btn-secondary">
              <Download size={18} /> Download Sample CSV
            </button>
          </div>

          {error && (
            <div className="error-box">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {preview.length > 0 && (
            <div className="preview-section">
              <h3>Preview ({preview.length} items)</h3>
              <div className="preview-table">
                {importType === 'members' && (
                  <>
                    <div className="table-header">
                      <div>Name</div>
                      <div>Email</div>
                      <div>Student ID</div>
                      <div>Class</div>
                    </div>
                    {preview.map((item, idx) => (
                      <div key={idx} className="table-row">
                        <div>{item.name}</div>
                        <div>{item.email}</div>
                        <div>{item.studentId}</div>
                        <div>{item.class}</div>
                      </div>
                    ))}
                  </>
                )}

                {importType === 'books' && (
                  <>
                    <div className="table-header">
                      <div>Title</div>
                      <div>Author</div>
                      <div>Category</div>
                      <div>Copies</div>
                    </div>
                    {preview.map((item, idx) => (
                      <div key={idx} className="table-row">
                        <div>{item.title}</div>
                        <div>{item.author}</div>
                        <div>{item.category}</div>
                        <div>{item.copies}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          <div className="import-actions">
            <button onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!csvContent || loading}
              className="btn btn-primary"
            >
              <Upload size={18} />
              {loading ? 'Importing...' : 'Import Now'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .import-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .import-modal {
          background: white;
          border-radius: 12px;
          max-width: 700px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .import-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 25px;
          border-bottom: 2px solid #eee;
        }

        .import-header h2 {
          margin: 0;
          color: #333;
          font-size: 22px;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
          transition: color 0.3s;
        }

        .close-btn:hover {
          color: #333;
        }

        .import-tabs {
          display: flex;
          border-bottom: 2px solid #eee;
          background: #f8f9fa;
        }

        .tab-btn {
          flex: 1;
          padding: 15px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 600;
          color: #666;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
        }

        .tab-btn.active {
          color: #667eea;
          border-bottom-color: #667eea;
          background: white;
        }

        .import-content {
          padding: 25px;
        }

        .upload-section {
          margin-bottom: 25px;
        }

        .upload-box {
          border: 3px dashed #667eea;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          background: #f8f9ff;
          position: relative;
        }

        .upload-box:hover {
          border-color: #764ba2;
          background: #f0f2ff;
        }

        .upload-box p {
          margin: 10px 0 0;
          color: #666;
          font-size: 14px;
        }

        .hidden-input {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0;
          cursor: pointer;
        }

        .error-box {
          background: #ffebee;
          border: 2px solid #f44336;
          color: #d32f2f;
          padding: 15px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .preview-section {
          margin-bottom: 20px;
        }

        .preview-section h3 {
          color: #333;
          margin-bottom: 15px;
          font-size: 16px;
        }

        .preview-table {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        }

        .table-header, .table-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          padding: 12px;
          border-bottom: 1px solid #eee;
          align-items: center;
        }

        .table-header {
          background: #f8f9fa;
          font-weight: 700;
          color: #666;
        }

        .table-row {
          background: white;
        }

        .table-row:hover {
          background: #f8f9fa;
        }

        .table-row div {
          font-size: 13px;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .import-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          padding-top: 20px;
          border-top: 2px solid #eee;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #f0f0f0;
          color: #333;
        }

        .btn-secondary:hover {
          background: #e0e0e0;
        }
      `}</style>
    </div>
  )
}
