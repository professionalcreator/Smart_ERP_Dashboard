import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, XCircle, UserCheck, Calendar, Activity } from 'lucide-react';

const MOCK_ROSTER = [
  { id: '1', name: 'Sophia Sterling', status: 'Present', time: '08:52 AM' },
  { id: '2', name: 'Liam Sterling', status: 'Present', time: '08:58 AM' },
  { id: '3', name: 'Chloe Vance', status: 'Late', time: '09:15 AM' },
  { id: '4', name: 'James Mercer', status: 'Absent', time: '-' },
  { id: '5', name: 'Mia Thorne', status: 'Present', time: '08:45 AM' },
];

export default function AttendanceModule() {
  const [roster, setRoster] = useState(MOCK_ROSTER);
  const [selectedUser, setSelectedUser] = useState(MOCK_ROSTER[3].id); // default to James (Absent)
  const [logs, setLogs] = useState([
    { id: '1', text: 'Mia Thorne checked in at 08:45 AM', type: 'info' },
    { id: '2', text: 'Sophia Sterling checked in at 08:52 AM', type: 'info' },
    { id: '3', text: 'Chloe Vance marked LATE at 09:15 AM', type: 'warn' },
  ]);

  const handleStatusChange = (userId, newStatus) => {
    const timeNow = newStatus === 'Absent' ? '-' : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setRoster(roster.map(member => {
      if (member.id === userId) {
        return { ...member, status: newStatus, time: timeNow };
      }
      return member;
    }));

    const member = roster.find(m => m.id === userId);
    const newLog = {
      id: Date.now().toString(),
      text: `${member.name} marked ${newStatus.toUpperCase()}${newStatus !== 'Absent' ? ` at ${timeNow}` : ''}`,
      type: newStatus === 'Present' ? 'info' : newStatus === 'Late' ? 'warn' : 'danger',
    };
    setLogs([newLog, ...logs].slice(0, 5)); // Keep last 5 logs
  };

  // Math for stats
  const presentCount = roster.filter(m => m.status === 'Present').length;
  const lateCount = roster.filter(m => m.status === 'Late').length;
  const absentCount = roster.filter(m => m.status === 'Absent').length;
  
  const presentRate = roster.length > 0 
    ? Math.round(((presentCount + lateCount) / roster.length) * 100) 
    : 0;

  // SVG parameters for radial progress
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (presentRate / 100) * circumference;

  return (
    <div style={styles.container}>
      <div className="responsive-grid-roster">
        
        {/* Roster list */}
        <div style={styles.rosterCard} className="glass-panel">
          <div style={styles.cardHeader}>
            <Calendar size={18} color="var(--accent-primary)" />
            <h4 style={styles.cardTitle}>Today's Attendance Roster</h4>
          </div>
          
          <div style={styles.rosterList}>
            {roster.map(emp => (
              <div key={emp.id} style={styles.rosterRow}>
                <div style={styles.memberInfo}>
                  <div style={styles.rosterAvatar}>
                    {emp.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={styles.memberName}>{emp.name}</div>
                    <div style={styles.checkTime}>
                      {emp.status !== 'Absent' ? `Checked in: ${emp.time}` : 'Not checked in'}
                    </div>
                  </div>
                </div>
                
                <div style={styles.actions}>
                  <button 
                    onClick={() => handleStatusChange(emp.id, 'Present')}
                    style={{
                      ...styles.statusBtn,
                      backgroundColor: emp.status === 'Present' ? 'var(--success-soft)' : 'transparent',
                      borderColor: emp.status === 'Present' ? 'var(--success)' : 'var(--accent-border)',
                      color: emp.status === 'Present' ? 'var(--success)' : 'var(--text-muted)',
                    }}
                    title="Mark Present"
                  >
                    <CheckCircle size={15} />
                  </button>
                  <button 
                    onClick={() => handleStatusChange(emp.id, 'Late')}
                    style={{
                      ...styles.statusBtn,
                      backgroundColor: emp.status === 'Late' ? 'var(--warning-soft)' : 'transparent',
                      borderColor: emp.status === 'Late' ? 'var(--warning)' : 'var(--accent-border)',
                      color: emp.status === 'Late' ? 'var(--warning)' : 'var(--text-muted)',
                    }}
                    title="Mark Late"
                  >
                    <Clock size={15} />
                  </button>
                  <button 
                    onClick={() => handleStatusChange(emp.id, 'Absent')}
                    style={{
                      ...styles.statusBtn,
                      backgroundColor: emp.status === 'Absent' ? 'var(--danger-soft)' : 'transparent',
                      borderColor: emp.status === 'Absent' ? 'var(--danger)' : 'var(--accent-border)',
                      color: emp.status === 'Absent' ? 'var(--danger)' : 'var(--text-muted)',
                    }}
                    title="Mark Absent"
                  >
                    <XCircle size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Stats and console */}
        <div style={styles.rightColumn}>
          
          {/* Circular Stats Card */}
          <div style={styles.statsCard} className="glass-panel">
            <div style={styles.statsHeader}>
              <Activity size={18} color="var(--accent-primary)" />
              <h4 style={styles.cardTitle}>Live Engagement Rate</h4>
            </div>
            <div style={styles.statsContent}>
              <div style={styles.progressSvgWrapper}>
                <svg width="90" height="90" viewBox="0 0 90 90">
                  {/* Background Circle */}
                  <circle
                    cx="45"
                    cy="45"
                    r={radius}
                    fill="transparent"
                    stroke="var(--accent-soft)"
                    strokeWidth="8"
                  />
                  {/* Active Segment */}
                  <motion.circle
                    cx="45"
                    cy="45"
                    r={radius}
                    fill="transparent"
                    stroke="var(--accent-primary)"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset: strokeOffset }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    strokeLinecap="round"
                    transform="rotate(-90 45 45)"
                  />
                </svg>
                <div style={styles.progressText}>{presentRate}%</div>
              </div>
              
              <div style={styles.statsMetrics}>
                <div style={styles.metricItem}>
                  <div style={{ ...styles.metricDot, backgroundColor: 'var(--success)' }}></div>
                  <span style={styles.metricLabel}>Present: {presentCount}</span>
                </div>
                <div style={styles.metricItem}>
                  <div style={{ ...styles.metricDot, backgroundColor: 'var(--warning)' }}></div>
                  <span style={styles.metricLabel}>Late: {lateCount}</span>
                </div>
                <div style={styles.metricItem}>
                  <div style={{ ...styles.metricDot, backgroundColor: 'var(--danger)' }}></div>
                  <span style={styles.metricLabel}>Absent: {absentCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Activity Logs */}
          <div style={styles.logsCard} className="glass-panel">
            <div style={styles.cardHeader}>
              <UserCheck size={18} color="var(--accent-primary)" />
              <h4 style={styles.cardTitle}>Activity Stream</h4>
            </div>
            <div style={styles.logsList}>
              <AnimatePresence initial={false}>
                {logs.map(log => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      ...styles.logItem,
                      borderLeftColor: log.type === 'warn' ? 'var(--warning)' : log.type === 'danger' ? 'var(--danger)' : 'var(--success)',
                    }}
                  >
                    {log.text}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

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

  rosterCard: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '24px',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  statsCard: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
  },
  logsCard: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '24px',
    flex: '1',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    borderBottom: '1px solid var(--accent-soft)',
    paddingBottom: '12px',
  },
  statsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  rosterList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  rosterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '16px',
    border: '1px solid var(--accent-soft)',
    backgroundColor: '#fffdfd',
    transition: 'all 0.2s ease',
  },
  memberInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  rosterAvatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-soft)',
    color: 'var(--accent-primary)',
    fontWeight: '700',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--accent-border)',
  },
  memberName: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  checkTime: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  actions: {
    display: 'flex',
    gap: '6px',
  },
  statusBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  statsContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: '16px',
  },
  progressSvgWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    position: 'absolute',
    fontSize: '15px',
    fontWeight: '800',
    color: 'var(--text-primary)',
  },
  statsMetrics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  metricItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  metricDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  metricLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  logsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '160px',
    overflowY: 'auto',
  },
  logItem: {
    padding: '8px 12px',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '8px',
    borderLeft: '3px solid',
    fontSize: '11px',
    color: 'var(--text-secondary)',
    fontWeight: '500',
    boxShadow: 'var(--shadow-sm)',
  },
};

