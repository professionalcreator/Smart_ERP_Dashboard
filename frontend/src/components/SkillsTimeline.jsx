import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const SKILLS_DATA = [
  {
    id: 'figma',
    phase: 'Phase 01 — Discovery & Research',
    title: 'Figma UI/UX Design',
    subtitle: 'Simplicity & Intuitive User Flow',
    description: 'Began by studying administrative workflows. Developed low-fidelity wireframes focused on reducing screen clutter, planning responsive layouts, and establishing natural logical groups before touching visual styling.',
    tools: ['Figma', 'User Journey Mapping', 'Skeleton Layouts'],
    metrics: { stat: '30+', label: 'wireframes drafted' },
    color: '#0d9488', // Teal
  },
  {
    id: 'prototyping',
    phase: 'Phase 02 — High-Fi Interactive Prototypes',
    title: 'Figma Prototyping',
    subtitle: 'Iterative Micro-animations',
    description: 'Designed premium high-fidelity systems with a Teal-Emerald design system, establishing cohesive color codes, margins, and complex component interactions (e.g. check-ins, sliders) using Figma prototyping.',
    tools: ['Figma Components', 'Auto Layout 4.0', 'Interactive States'],
    metrics: { stat: '100%', label: 'coverage of user flows' },
    color: '#0f766e', // Dark Teal
  },
  {
    id: 'frontend',
    phase: 'Phase 03 — Modern React Engineering',
    title: 'Frontend Component Architecture',
    subtitle: 'Clean Code & State Modularity',
    description: 'Translated designs into highly reusable React components. Maintained rigorous state encapsulation, clean props passing, and optimized updates (e.g. dynamic calculations, filter triggers).',
    tools: ['React 19', 'JavaScript (ES6+)', 'Dynamic States'],
    metrics: { stat: '100%', label: 'reusable UI widgets' },
    color: '#06b6d4', // Cyan
  },
  {
    id: 'responsiveness',
    phase: 'Phase 04 — Fluid CSS Layouts & Animation',
    title: 'Responsive Web & Framer Motion',
    subtitle: 'Visual Perfection on All Viewports',
    description: 'Developed layout systems using responsive grid structures and custom CSS. Implemented Framer Motion animations to breathe life into page entries, stock changes, and calculator structures.',
    tools: ['Custom CSS3', 'Framer Motion', 'SVG Path Drawing'],
    metrics: { stat: '< 300ms', label: 'interaction delays' },
    color: '#10b981', // Emerald
  },
];

export default function SkillsTimeline() {
  const [activeSkill, setActiveSkill] = useState(SKILLS_DATA[0].id);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.sectionBadge}>My Role & Process</span>
        <h3 style={styles.title}>Designing and Engineering the Experience</h3>
        <p style={styles.subtitle}>
          How I bridged the gap between raw creative wireframes in Figma and interactive React engineering.
        </p>
      </div>

      <div className="responsive-grid-sidebar">
        {/* Navigation Sidebar */}
        <div style={styles.sidebar}>
          {SKILLS_DATA.map((skill, index) => {
            const isActive = activeSkill === skill.id;
            return (
              <motion.div
                key={skill.id}
                onClick={() => setActiveSkill(skill.id)}
                style={{
                  ...styles.sidebarItem,
                  backgroundColor: isActive ? 'var(--accent-soft)' : 'transparent',
                  borderColor: isActive ? 'var(--accent-primary)' : 'transparent',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                }}
                className={isActive ? "glass-panel" : ""}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div style={styles.sidebarIndex}>0{index + 1}</div>
                <div>
                  <div style={{
                    ...styles.sidebarTitle,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? '750' : '600',
                  }}>
                    {skill.title}
                  </div>
                  <div style={styles.sidebarPhase}>{skill.phase.split(' — ')[0]}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Content Viewer Panel */}
        <div style={styles.viewer} className="glass-panel">
          {SKILLS_DATA.map((skill) => {
            if (skill.id !== activeSkill) return null;
            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                style={styles.viewerContent}
              >
                <span style={styles.phaseLabel}>{skill.phase}</span>
                <h4 style={styles.viewerTitle}>{skill.title}</h4>
                <p style={styles.viewerSubtitle} className="editorial-italic">{skill.subtitle}</p>
                
                <p style={styles.viewerDesc}>{skill.description}</p>
                
                <div style={styles.detailsRow}>
                  <div style={styles.toolsCol}>
                    <span style={styles.detailsHeader}>Key Standards & Tools</span>
                    <div style={styles.tagsContainer}>
                      {skill.tools.map(tool => (
                        <span key={tool} style={styles.tag}>
                          <CheckCircle size={11} color="var(--accent-primary)" style={{ marginRight: '5px' }} />
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={styles.metricsCol}>
                    <span style={styles.detailsHeader}>Performance Stat</span>
                    <div style={styles.statCard}>
                      <span style={styles.statNumber}>{skill.metrics.stat}</span>
                      <span style={styles.statLabel}>{skill.metrics.label}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    margin: '60px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    textAlign: 'left',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sectionBadge: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--accent-primary)',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    maxWidth: '700px',
  },

  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sidebarItem: {
    padding: '16px 20px',
    borderRadius: '16px',
    border: '1.5px solid transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  sidebarIndex: {
    fontSize: '18px',
    fontFamily: 'var(--font-serif)',
    fontWeight: '700',
    color: 'var(--accent-primary)',
    opacity: 0.8,
  },
  sidebarTitle: {
    fontSize: '14px',
    lineHeight: '1.3',
  },
  sidebarPhase: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginTop: '2px',
  },
  viewer: {
    backgroundColor: 'rgba(13, 18, 34, 0.4)',
    padding: '40px',
    borderRadius: '24px',
    minHeight: '360px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  viewerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  phaseLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  viewerTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  viewerSubtitle: {
    fontSize: '15px',
    color: 'var(--accent-primary)',
    marginTop: '-8px',
  },
  viewerDesc: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    lineHeight: '1.7',
    maxWidth: '560px',
  },
  detailsRow: {
    display: 'grid',
    gridTemplateColumns: '7fr 5fr',
    gap: '24px',
    borderTop: '1px solid var(--accent-soft)',
    paddingTop: '20px',
    marginTop: '12px',
  },
  toolsCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  metricsCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  detailsHeader: {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  tag: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '4px 10px',
    borderRadius: '8px',
    border: '1px solid var(--accent-soft)',
    display: 'inline-flex',
    alignItems: 'center',
  },
  statCard: {
    backgroundColor: 'var(--accent-soft)',
    border: '1px solid var(--accent-border)',
    borderRadius: '16px',
    padding: '12px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    alignSelf: 'flex-start',
  },
  statNumber: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--accent-primary)',
  },
  statLabel: {
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  },
};
