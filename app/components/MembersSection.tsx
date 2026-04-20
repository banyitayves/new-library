'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Search } from 'lucide-react'
import { getMembers, saveMembers, addMember } from '@/lib/database'
import type { Member } from '@/lib/database'

export default function MembersSection() {
  const [members, setMembers] = useState<Member[]>([])
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    maxBooks: 1,
    studentId: '',
    cardBarcode: '',
    class: 'S1',
  })

  useEffect(() => {
    const storedMembers = getMembers()
    setMembers(storedMembers)
  }, [])

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    const newMember = addMember(formData)
    setMembers([...members, newMember])
    setFormData({ name: '', email: '', phone: '', maxBooks: 1, studentId: '', cardBarcode: '', class: 'S1' })
    setShowForm(false)
  }

  const handleDeleteMember = (id: string) => {
    const updated = members.filter(m => m.id !== id)
    setMembers(updated)
    saveMembers(updated)
  }

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="section">
      <div className="section-header">
        <h2>Members Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          <Plus size={18} /> Add Member
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddMember} className="form-card">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Student ID</label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) =>
                  setFormData({ ...formData, studentId: e.target.value })
                }
                placeholder="e.g., GSB-001"
              />
            </div>
            <div className="form-group">
              <label>Card Barcode</label>
              <input
                type="text"
                value={formData.cardBarcode}
                onChange={(e) =>
                  setFormData({ ...formData, cardBarcode: e.target.value })
                }
                placeholder="Library card barcode"
              />
            </div>
            <div className="form-group">
              <label>Class</label>
              <select
                value={formData.class}
                onChange={(e) =>
                  setFormData({ ...formData, class: e.target.value })
                }
              >
                <option>S1</option>
                <option>S2</option>
                <option>S3</option>
                <option>S4</option>
                <option>S5</option>
                <option>S6</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Max Books</label>
            <input
              type="number"
              min="1"
              value={formData.maxBooks}
              onChange={(e) =>
                setFormData({ ...formData, maxBooks: parseInt(e.target.value) })
              }
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Add Member
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search members by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Max Books</th>
              <th>Join Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.studentId || '-'}</td>
                <td>{member.class || '-'}</td>
                <td>{member.phone}</td>
                <td>{member.maxBooks}</td>
                <td>{new Date(member.joinDate).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="btn-icon btn-danger"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMembers.length === 0 && (
          <p className="empty-state">No members found</p>
        )}
      </div>
    </div>
  )
}
