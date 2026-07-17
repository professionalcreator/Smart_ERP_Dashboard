import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, UserPlus, Briefcase, RefreshCw } from 'lucide-react';

const INITIAL_MOCK_EMPLOYEES = [
  { id: '1', name: 'Sophia Sterling', role: 'UI/UX Designer', dept: 'Design', status: 'Active' },
  { id: '2', name: 'Liam Sterling', role: 'Frontend Architect', dept: 'Engineering', status: 'Active' },
  { id: '3', name: 'Chloe Vance', role: 'Product Manager', dept: 'Product', status: 'Active' },
  { id: '4', name: 'James Mercer', role: 'DevOps Lead', dept: 'Engineering', status: 'On Leave' },
  { id: '5', name: 'Mia Thorne', role: 'Brand Strategist', dept: 'Marketing', status: 'Active' },
];

export default function EmployeeModule() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  
  // Form states
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDept, setNewDept] = useState('Design');
  const [showAddForm, setShowAddForm] = useState(false);

  const departments = ['All', 'Design', 'Engineering', 'Product', 'Marketing'];

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/employees');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
        setError(false);
      } else {
        throw new Error('Failed to fetch');
      }
    } catch (err) {
      console.warn('Backend unavailable, using local mock data.', err);
      setEmployees(INITIAL_MOCK_EMPLOYEES);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newName || !newRole) return;
    
    const newEmpData = {
      name: newName,
      role: newRole,
      dept: newDept,
      status: 'Active',
    };

    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmpData)
      });
      if (res.ok) {
        const addedEmp = await res.json();
        setEmployees([addedEmp, ...employees]);
      } else {
        throw new Error('Post failed');
      }
    } catch (err) {
      console.warn('Backend write failed, saving to local state only.', err);
      const offlineEmp = {
        id: Date.now().toString(),
        ...newEmpData
      };
      setEmployees([offlineEmp, ...employees]);
    }
    
    setNewName('');
    setNewRole('');
    setShowAddForm(false);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setEmployees(employees.filter(emp => emp.id !== id));
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      console.warn('Backend delete failed, removing from local state only.', err);
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) || 
                          emp.role.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div style={styles.container}>
      <div style={styles.actionRow}>
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        
        <div style={styles.btnRow}>
          <button 
            onClick={fetchEmployees}
            style={styles.refreshBtn}
            title="Refresh from Server"
          >
            <RefreshCw size={15} className={loading ? 'spin-anim' : ''} />
          </button>
          
          <button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className="btn-primary"
            style={styles.addBtn}
          >
            {showAddForm ? 'Cancel' : 'Add Employee'}
            <UserPlus size={16} />
          </button>
        </div>
      </div>

      {/* Add Employee Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onSubmit={handleAddEmployee}
            style={styles.form}
            className="glass-panel"
          >
            <h4 style={styles.formTitle}>Add New Team Member</h4>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Interaction Designer"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Department</label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  style={styles.select}
                >
                  <option value="Design">Design</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn-primary" style={styles.submitBtn}>
              Confirm and Add Member
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Department Filter Bar */}
      <div style={styles.filterBar}>
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            style={{
              ...styles.filterTab,
              color: selectedDept === dept ? 'var(--accent-primary)' : 'var(--text-secondary)',
              borderColor: selectedDept === dept ? 'var(--accent-primary)' : 'var(--accent-border)',
              backgroundColor: selectedDept === dept ? 'var(--accent-soft)' : 'transparent',
              fontWeight: selectedDept === dept ? '700' : '500',
            }}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Employee List Table */}
      <div style={styles.tableWrapper} className="glass-panel">
        <div style={styles.tableHeader}>
          <div style={styles.colName}>Employee</div>
          <div style={styles.colDept}>Department</div>
          <div style={styles.colStatus}>Status</div>
          <div style={styles.colAction}>Action</div>
        </div>
        
        <div style={styles.tableBody}>
          {loading ? (
            <div style={styles.emptyState}>
              <RefreshCw size={24} className="spin-anim" style={{ color: 'var(--accent-primary)', marginBottom: '8px' }} />
              <p>Fetching records from server...</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <motion.div
                    key={emp.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                    style={styles.tableRow}
                  >
                    <div style={styles.colName}>
                      <div style={styles.avatarCell}>
                        <div style={styles.avatar}>
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style={styles.empName}>{emp.name}</div>
                          <div style={styles.empRole}>{emp.role}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div style={styles.colDept}>
                      <span style={styles.deptBadge}>
                        <Briefcase size={12} style={{ marginRight: '4px', opacity: 0.7 }} />
                        {emp.dept}
                      </span>
                    </div>
                    
                    <div style={styles.colStatus}>
                      <span style={{
                        ...styles.statusBadge,
                        color: emp.status === 'Active' ? 'var(--success)' : 'var(--warning)',
                        backgroundColor: emp.status === 'Active' ? 'var(--success-soft)' : 'var(--warning-soft)',
                      }}>
                        {emp.status}
                      </span>
                    </div>
                    
                    <div style={styles.colAction}>
                      <motion.button
                        whileHover={{ scale: 1.1, color: 'var(--danger)' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(emp.id)}
                        style={styles.deleteBtn}
                        aria-label={`Delete ${emp.name}`}
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div style={styles.emptyState}>
                  <p>No team members found matching criteria.</p>
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  searchWrapper: {
    position: 'relative',
    flex: '1',
    minWidth: '240px',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
  },
  searchInput: {
    width: '100%',
    padding: '12px 12px 12px 42px',
    borderRadius: 'var(--border-radius-full)',
    border: '1px solid var(--accent-border)',
    outline: 'none',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    color: 'var(--text-primary)',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    transition: 'all 0.2s ease',
  },
  btnRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  refreshBtn: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--accent-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  addBtn: {
    height: '46px',
  },
  form: {
    padding: '24px',
    borderRadius: '24px',
    backgroundColor: 'var(--bg-secondary)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    border: '1px solid var(--accent-border)',
  },
  formTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid var(--accent-border)',
    outline: 'none',
    fontFamily: 'var(--font-sans)',
    fontSize: '13px',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)'
  },
  select: {
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid var(--accent-border)',
    outline: 'none',
    fontFamily: 'var(--font-sans)',
    fontSize: '13px',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)'
  },
  submitBtn: {
    alignSelf: 'flex-start',
    padding: '10px 20px',
  },
  filterBar: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '4px',
  },
  filterTab: {
    padding: '8px 16px',
    borderRadius: 'var(--border-radius-full)',
    border: '1px solid',
    fontSize: '13px',
    backgroundColor: 'transparent',
    cursor: 'pointer'
  },
  tableWrapper: {
    overflow: 'hidden',
    border: '1px solid var(--accent-border)',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '24px',
  },
  tableHeader: {
    display: 'flex',
    backgroundColor: 'rgba(109, 76, 65, 0.03)',
    padding: '16px 24px',
    borderBottom: '1px solid var(--accent-border)',
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableBody: {
    display: 'flex',
    flexDirection: 'column',
  },
  tableRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '18px 24px',
    borderBottom: '1px solid var(--accent-soft)',
    backgroundColor: 'transparent',
  },
  colName: {
    flex: '2',
    minWidth: '200px',
  },
  colDept: {
    flex: '1',
    minWidth: '120px',
  },
  colStatus: {
    flex: '1',
    minWidth: '100px',
  },
  colAction: {
    width: '60px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  avatarCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-soft)',
    color: 'var(--accent-primary)',
    fontWeight: '700',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--accent-border)',
  },
  empName: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  empRole: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  deptBadge: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    display: 'inline-flex',
    alignItems: 'center',
  },
  statusBadge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '12px',
    letterSpacing: '0.5px',
    display: 'inline-block',
  },
  deleteBtn: {
    backgroundColor: 'transparent',
    color: 'var(--text-muted)',
    cursor: 'pointer'
  },
  emptyState: {
    padding: '40px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
};
