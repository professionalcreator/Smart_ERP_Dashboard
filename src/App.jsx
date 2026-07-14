import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  DollarSign, 
  Package, 
  TrendingUp, 
  ChevronRight, 
  Compass, 
  Play, 
  BookOpen, 
  Layers, 
  Heart,
  Grid
} from 'lucide-react';

import FigmaToCode from './components/FigmaToCode';
import SkillsTimeline from './components/SkillsTimeline';

// Modules
import EmployeeModule from './components/modules/EmployeeModule';
import AttendanceModule from './components/modules/AttendanceModule';
import PayrollModule from './components/modules/PayrollModule';
import InventoryModule from './components/modules/InventoryModule';
import ReportsModule from './components/modules/ReportsModule';

export default function App() {
  const [activeTab, setActiveTab] = useState('casestudy'); // casestudy or sandbox
  const [sandboxModule, setSandboxModule] = useState('employee'); // employee, attendance, payroll, inventory, reports

  const modules = [
    { id: 'employee', name: 'Employee Roster', icon: Users, component: EmployeeModule, color: '#ff5e84', desc: 'Manage profiles and team positions.', image: '/smarterp_employee.jpg' },
    { id: 'attendance', name: 'Attendance sheets', icon: Calendar, component: AttendanceModule, color: '#ff7ca0', desc: 'Roster logs and check-in statuses.', image: '/smarterp_attendance.jpg' },
    { id: 'payroll', name: 'Payroll Calculator', icon: DollarSign, component: PayrollModule, color: '#ff8ca4', desc: 'Salary sliders and tax structures.', image: '/smarterp_payroll.jpg' },
    { id: 'inventory', name: 'Inventory Ledger', icon: Package, component: InventoryModule, color: '#ffa6b8', desc: 'Stock alerts and direct level adjusters.', image: '/smarterp_inventory.jpg' },
    { id: 'reports', name: 'Reports Desk', icon: TrendingUp, component: ReportsModule, color: '#ffc0cb', desc: 'SVG charts and dynamic tooltip values.', image: '/smarterp_reports.jpg' },
  ];

  const handleLaunchSandbox = (modId) => {
    setSandboxModule(modId);
    setActiveTab('sandbox');
    // Scroll to sandbox section if needed
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div style={styles.appContainer}>
      
      {/* Sticky Header Nav */}
      <header style={styles.navBar} className="glass-panel">
        <div style={styles.navContent}>
          <div style={styles.logoRow}>
            <span className="glow-dot" style={{ marginRight: '8px' }}></span>
            <span style={styles.logoText}>SmartERP<span style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-serif)', fontSize: '20px' }}>.</span></span>
          </div>
          
          <div style={styles.navTabs}>
            <button
              onClick={() => setActiveTab('casestudy')}
              style={{
                ...styles.navTabBtn,
                color: activeTab === 'casestudy' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'casestudy' ? '700' : '500',
              }}
            >
              <BookOpen size={14} style={{ marginRight: '6px' }} />
              UX Design & Process
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              style={{
                ...styles.navTabBtn,
                color: activeTab === 'sandbox' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'sandbox' ? '700' : '500',
              }}
            >
              <Play size={14} style={{ marginRight: '6px' }} />
              Interactive Sandbox
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container" style={styles.mainContent}>
        <AnimatePresence mode="wait">
          
          {/* CASE STUDY TAB */}
          {activeTab === 'casestudy' && (
            <motion.div
              key="casestudy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={styles.contentSection}
            >
              {/* Hero Banner */}
              <section style={styles.heroSection}>
                <div style={styles.heroBadgeRow}>
                  <span style={styles.heroBadge}>CASE STUDY & PLAYGROUND</span>
                </div>
                <h1 style={styles.heroTitle} className="shimmer-text">
                  Reimagining Corporate <br />
                  <span className="editorial-italic">Operations & Management</span>
                </h1>
                <p style={styles.heroLead}>
                  An Enterprise Resource Planning dashboard designed to consolidate daily business operations—employee profiles, attendance patterns, payroll matrices, inventory counts, and reporting desks—into a clean, responsive layout.
                </p>
                
                <div style={styles.heroActions}>
                  <button 
                    onClick={() => handleLaunchSandbox('employee')}
                    className="btn-primary"
                  >
                    Launch Interactive Playground
                    <Play size={14} />
                  </button>
                  <a href="#workflow" style={styles.secondaryAnchor} className="btn-secondary">
                    View UI/UX Workflow
                    <ChevronRight size={14} />
                  </a>
                </div>
              </section>

              {/* Hero Showcase Image */}
              <div style={styles.showcaseImageWrapper} className="glass-panel">
                <img 
                  src="/smarterp_hero_cinematic.jpg" 
                  alt="SmartERP Visual Design Concept" 
                  style={styles.showcaseImage} 
                />
              </div>

              {/* Grid cards detailing Role & Impact */}
              <section style={styles.introGrid} className="grid grid-cols-3">
                <div style={styles.introCard} className="glass-panel">
                  <div style={styles.cardIconBox}>
                    <Briefcase size={20} color="var(--accent-primary)" />
                  </div>
                  <h3 style={styles.cardHeaderSmall}>My Role</h3>
                  <p style={styles.cardText}>
                    Served as <strong>UI/UX Designer</strong> and <strong>Frontend Developer</strong>, managing structural wireframing, interactive Figma mockups, design specifications, and writing modular React code.
                  </p>
                </div>

                <div style={styles.introCard} className="glass-panel">
                  <div style={styles.cardIconBox}>
                    <Compass size={20} color="var(--accent-primary)" />
                  </div>
                  <h3 style={styles.cardHeaderSmall}>UX Philosophy</h3>
                  <p style={styles.cardText}>
                    Focused on reducing system layout friction. Modeled easy navigational structures, logical dashboard segments, and natural status triggers so users can access modules instantly.
                  </p>
                </div>

                <div style={styles.introCard} className="glass-panel">
                  <div style={styles.cardIconBox}>
                    <Layers size={20} color="var(--accent-primary)" />
                  </div>
                  <h3 style={styles.cardHeaderSmall}>Technical Scope</h3>
                  <p style={styles.cardText}>
                    Constructed the frontend architecture using <strong>React</strong>, <strong>Framer Motion</strong> for interface micro-interactions, and custom responsive <strong>CSS Grid</strong> rules.
                  </p>
                </div>
              </section>

              {/* Figma To Code Slide Section */}
              <section id="workflow" style={styles.sectionDivider}>
                <FigmaToCode />
              </section>

              {/* Process and Skills Timeline */}
              <section style={styles.sectionDivider}>
                <SkillsTimeline />
              </section>

              {/* Modules Quick Preview list */}
              <section style={styles.modulesSection}>
                <div style={styles.moduleSectionHeader}>
                  <span style={styles.miniBadge}>System Modules</span>
                  <h3 style={styles.sectionTitle}>Modular Architecture Preview</h3>
                  <p style={styles.sectionSubtitle}>
                    Click any module below to immediately jump into the interactive sandbox and view live operations.
                  </p>
                </div>

                <div style={styles.modulesGrid}>
                  {modules.map((mod) => {
                    const IconComp = mod.icon;
                    return (
                      <motion.div
                        key={mod.id}
                        whileHover={{ y: -8, borderColor: 'var(--accent-primary)' }}
                        onClick={() => handleLaunchSandbox(mod.id)}
                        style={styles.modulePreviewCard}
                        className="glass-panel"
                      >
                        <div style={styles.moduleImageWrapper}>
                          <img src={mod.image} alt={mod.name} style={styles.moduleImage} />
                        </div>
                        <div style={styles.moduleCardHeader}>
                          <div style={{ ...styles.moduleIconContainer, backgroundColor: `${mod.color}15` }}>
                            <IconComp size={18} color={mod.color} />
                          </div>
                          <h4 style={styles.moduleNameText}>{mod.name}</h4>
                        </div>
                        <p style={styles.moduleDescText}>{mod.desc}</p>
                        <div style={styles.moduleCardFooter}>
                          <span style={styles.moduleActionText}>Explore Live Demo</span>
                          <ChevronRight size={14} color="var(--accent-primary)" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          )}

          {/* INTERACTIVE SANDBOX TAB */}
          {activeTab === 'sandbox' && (
            <motion.div
              key="sandbox"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={styles.contentSection}
            >
              <div style={styles.sandboxContainer}>
                
                {/* Sandbox Left Panel - Module Selector */}
                <div style={styles.sandboxSidebar} className="glass-panel">
                  <div style={styles.sidebarHeader}>
                    <Grid size={16} color="var(--accent-primary)" />
                    <span style={styles.sidebarHeaderText}>MODULES DESK</span>
                  </div>
                  
                  <nav style={styles.sidebarNav}>
                    {modules.map((mod) => {
                      const IconComp = mod.icon;
                      const isSelected = sandboxModule === mod.id;
                      return (
                        <button
                          key={mod.id}
                          onClick={() => setSandboxModule(mod.id)}
                          style={{
                            ...styles.sidebarBtn,
                            backgroundColor: isSelected ? 'var(--accent-soft)' : 'transparent',
                            borderColor: isSelected ? 'var(--accent-primary)' : 'transparent',
                            color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            fontWeight: isSelected ? '700' : '500',
                          }}
                        >
                          <IconComp size={16} color={isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                          {mod.name.split(' ')[0]} {mod.name.split(' ')[1] || ''}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Sandbox Right Panel - Active Component View */}
                <div style={styles.sandboxConsole}>
                  <div style={styles.consoleHeader}>
                    <div style={styles.headerIndicator}>
                      <span className="glow-dot"></span>
                      <span style={styles.consoleTitle}>
                        SmartERP Core — {modules.find(m => m.id === sandboxModule)?.name}
                      </span>
                    </div>
                    <span style={styles.environmentTag}>Live Sandbox Environment</span>
                  </div>
                  
                  <div style={styles.consoleBody} className="glass-panel">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={sandboxModule}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                      >
                        {(() => {
                          const SelectedComponent = modules.find(m => m.id === sandboxModule)?.component;
                          return SelectedComponent ? <SelectedComponent /> : null;
                        })()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer style={styles.footer}>
        <div className="container" style={styles.footerContent}>
          <p>© 2026 SmartERP Case Study. Constructed with React, Framer Motion, and Custom CSS.</p>
          <div style={styles.designerSignature}>
            <span>Designed & Engineered with</span>
            <Heart size={14} color="var(--accent-primary)" style={{ fill: 'var(--accent-primary)' }} />
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  appContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--bg-primary)',
  },
  navBar: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: 'rgba(255, 249, 249, 0.8)',
    borderBottom: '1px solid var(--accent-border)',
    borderRadius: 0,
    padding: '12px 0',
  },
  navContent: {
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '800',
    letterSpacing: '-0.5px',
    color: 'var(--text-primary)',
  },
  navTabs: {
    display: 'flex',
    gap: '8px',
  },
  navTabBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    borderRadius: 'var(--border-radius-full)',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  mainContent: {
    flex: 1,
    paddingTop: '40px',
    paddingBottom: '60px',
  },
  contentSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  heroSection: {
    textAlign: 'center',
    maxWidth: '800px',
    margin: '40px auto 20px auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  heroBadgeRow: {
    display: 'flex',
    justifyContent: 'center',
  },
  heroBadge: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--accent-primary)',
    backgroundColor: 'var(--accent-soft)',
    padding: '6px 14px',
    borderRadius: 'var(--border-radius-full)',
    letterSpacing: '2px',
    border: '1px solid var(--accent-border)',
  },
  heroTitle: {
    fontSize: '52px',
    lineHeight: '1.15',
    letterSpacing: '-1.5px',
    color: 'var(--text-primary)',
  },
  heroLead: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    lineHeight: '1.7',
    maxWidth: '680px',
  },
  heroActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '10px',
  },
  secondaryAnchor: {
    textDecoration: 'none',
  },
  introGrid: {
    margin: '20px 0',
  },
  introCard: {
    backgroundColor: '#ffffff',
    padding: '30px 24px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    textAlign: 'left',
  },
  cardIconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '16px',
    backgroundColor: 'var(--accent-soft)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--accent-border)',
  },
  cardHeaderSmall: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  cardText: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  },
  sectionDivider: {
    borderTop: '1px solid var(--accent-border)',
    paddingTop: '40px',
  },
  modulesSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    textAlign: 'left',
    borderTop: '1px solid var(--accent-border)',
    paddingTop: '40px',
  },
  moduleSectionHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  miniBadge: {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--accent-primary)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
    maxWidth: '600px',
  },
  modulesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '24px',
  },
  modulePreviewCard: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '24px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    border: '1px solid rgba(255, 94, 132, 0.08)',
    minHeight: '340px',
  },
  moduleIconContainer: {
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  moduleNameText: {
    fontSize: '15px',
    fontWeight: '750',
    color: 'var(--text-primary)',
  },
  moduleDescText: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
  },
  moduleImageWrapper: {
    width: '100%',
    height: '140px',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid var(--accent-soft)',
  },
  moduleImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  moduleCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '4px',
  },
  moduleCardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: '12px',
    borderTop: '1px solid var(--accent-soft)',
  },
  moduleActionText: {
    fontSize: '12px',
    fontWeight: '750',
    color: 'var(--accent-primary)',
  },
  sandboxContainer: {
    display: 'grid',
    gridTemplateColumns: '3fr 9fr',
    gap: '28px',
    margin: '30px 0',
    alignItems: 'start',
  },
  sandboxSidebar: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    position: 'sticky',
    top: '90px',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid var(--accent-soft)',
    paddingBottom: '12px',
  },
  sidebarHeaderText: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '1px',
  },
  sidebarNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  sidebarBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid transparent',
    fontSize: '13px',
    textAlign: 'left',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    transition: 'all 0.15s ease',
  },
  sandboxConsole: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  consoleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  consoleTitle: {
    fontSize: '15px',
    fontWeight: '750',
    color: 'var(--text-primary)',
  },
  environmentTag: {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--accent-primary)',
    backgroundColor: 'var(--accent-soft)',
    border: '1px solid var(--accent-border)',
    padding: '4px 10px',
    borderRadius: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  consoleBody: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '28px',
    minHeight: '440px',
    border: '1px solid rgba(255, 94, 132, 0.12)',
  },
  footer: {
    borderTop: '1px solid var(--accent-border)',
    backgroundColor: '#ffffff',
    padding: '24px 0',
    marginTop: 'auto',
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    color: 'var(--text-muted)',
    flexWrap: 'wrap',
    gap: '12px',
  },
  designerSignature: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: '600',
  },
  showcaseImageWrapper: {
    width: '100%',
    maxWidth: '800px',
    margin: '30px auto',
    borderRadius: '24px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 94, 132, 0.12)',
    boxShadow: 'var(--shadow-lg)',
    backgroundColor: '#ffffff',
  },
  showcaseImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
};
