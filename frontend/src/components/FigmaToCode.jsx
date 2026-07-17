import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Code, Shield, RefreshCw } from 'lucide-react';

export default function FigmaToCode() {
  const [sliderPos, setSliderPos] = useState(50);
  const [interactiveCount, setInteractiveCount] = useState(0);

  const handleSliderChange = (e) => {
    setSliderPos(Number(e.target.value));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Figma Blueprint to React Component</h3>
        <p style={styles.subtitle}>
          Drag the slider to see how my Figma designs transition into fully functional, responsive React components.
        </p>
      </div>

      <div style={styles.comparisonWrapper} className="glass-panel">
        {/* Figma Wireframe View (Base Layer) */}
        <div style={styles.wireframeView}>
          <div style={styles.wireframeContent}>
            {/* Sketchy, blueprint-like graphics */}
            <div style={styles.blueprintGrid}></div>
            <div style={styles.blueprintCard}>
              <div style={styles.blueprintHeader}>
                <div style={styles.blueprintCircle}></div>
                <div style={styles.blueprintLineLong}></div>
              </div>
              <div style={styles.blueprintBody}>
                <div style={styles.blueprintBox}>
                  <div style={styles.blueprintDiagonal}></div>
                </div>
                <div style={styles.blueprintLineShort}></div>
                <div style={styles.blueprintLineMedium}></div>
              </div>
              <div style={styles.blueprintFooter}>
                <div style={styles.blueprintBtn}></div>
              </div>
            </div>
            <div style={styles.blueprintLabel}>FIGMA WIREFRAME (NEON TEAL SCHEMATICS)</div>
          </div>
        </div>

        {/* Polished Code View (Overlay Layer) */}
        <div
          style={{
            ...styles.codeView,
            width: '100%',
            clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
          }}
        >
          <div style={styles.codeContent}>
            <div style={styles.polishedCard} className="glass-panel">
              <div style={styles.polishedHeader}>
                <div style={styles.userProfile}>
                  <div style={styles.avatar}>UX</div>
                  <div>
                    <h4 style={styles.avatarName}>Elena Rostova</h4>
                    <p style={styles.avatarRole}>Lead UI Designer</p>
                  </div>
                </div>
                <span style={styles.statusBadge}>Active</span>
              </div>
              <div style={styles.polishedBody}>
                <div style={styles.interactiveArea}>
                  <p style={styles.interactiveLabel}>React Micro-interaction</p>
                  <div style={styles.counterDisplay}>{interactiveCount} clicks registered</div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setInteractiveCount((c) => c + 1)}
                    style={styles.interactiveBtn}
                  >
                    <RefreshCw size={14} style={{ marginRight: '6px' }} />
                    Trigger State Update
                  </motion.button>
                </div>
              </div>
              <div style={styles.polishedFooter}>
                <span style={styles.footerNote}>Verified Production Code</span>
                <Shield size={16} color="var(--accent-primary)" />
              </div>
            </div>
            <div style={styles.polishedLabel}>REACT COMPONENT (DARK TEAL STYLING)</div>
          </div>
        </div>

        {/* Custom Visual Slider Control */}
        <div
          style={{
            ...styles.sliderLine,
            left: `${sliderPos}%`,
          }}
        >
          <div style={styles.sliderHandle}>
            <Code size={12} color="var(--accent-primary)" style={{ marginRight: '-2px' }} />
            <Eye size={12} color="var(--accent-primary)" style={{ marginLeft: '-2px' }} />
          </div>
        </div>

        {/* Hidden Accessibility Range Slider spanning the whole width */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={handleSliderChange}
          style={styles.rangeInput}
          aria-label="Figma to Code Slider"
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    margin: '40px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    textAlign: 'left',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
  },
  comparisonWrapper: {
    position: 'relative',
    height: '420px',
    width: '100%',
    overflow: 'hidden',
    userSelect: 'none',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '24px',
  },
  wireframeView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle, var(--accent-soft) 10%, transparent 11%)',
    backgroundSize: '12px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wireframeContent: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueprintGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: '1px dashed var(--accent-border)',
    margin: '30px',
    pointerEvents: 'none',
  },
  blueprintCard: {
    width: '320px',
    height: '280px',
    border: '2px dashed var(--accent-primary)',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  blueprintHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  blueprintCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1.5px dashed var(--accent-primary)',
  },
  blueprintLineLong: {
    width: '120px',
    height: '8px',
    borderRadius: '4px',
    backgroundColor: 'var(--accent-soft)',
  },
  blueprintBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    margin: '20px 0',
  },
  blueprintBox: {
    height: '60px',
    border: '1.5px dashed var(--accent-primary)',
    position: 'relative',
    borderRadius: '8px',
  },
  blueprintDiagonal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to top right, transparent 49%, var(--accent-border) 50%, transparent 51%)',
  },
  blueprintLineShort: {
    width: '70px',
    height: '8px',
    borderRadius: '4px',
    backgroundColor: 'var(--accent-soft)',
  },
  blueprintLineMedium: {
    width: '180px',
    height: '8px',
    borderRadius: '4px',
    backgroundColor: 'var(--accent-soft)',
  },
  blueprintBtn: {
    width: '100%',
    height: '32px',
    border: '1.5px dashed var(--accent-primary)',
    borderRadius: '20px',
  },
  blueprintLabel: {
    position: 'absolute',
    bottom: '15px',
    left: '20px',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '1.5px',
    color: 'var(--text-muted)',
  },
  codeView: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    zIndex: 1,
  },
  codeContent: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  polishedCard: {
    width: '320px',
    height: '280px',
    backgroundColor: 'rgba(13, 18, 34, 0.95)',
    borderRadius: '24px',
    padding: '24px',
    border: '1px solid var(--accent-border)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  polishedHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '40px',
    height: '40px',
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
  avatarName: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  avatarRole: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  statusBadge: {
    fontSize: '10px',
    fontWeight: '700',
    backgroundColor: 'var(--success-soft)',
    color: 'var(--success)',
    padding: '3px 8px',
    borderRadius: '12px',
    letterSpacing: '0.5px',
  },
  polishedBody: {
    margin: '16px 0',
  },
  interactiveArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid var(--accent-border)',
    textAlign: 'center',
  },
  interactiveLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  counterDisplay: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '12px',
  },
  interactiveBtn: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--accent-primary)',
    border: '1px solid var(--accent-border)',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  polishedFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerNote: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  polishedLabel: {
    position: 'absolute',
    bottom: '15px',
    right: '20px',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '1.5px',
    color: 'var(--accent-primary)',
  },
  sliderLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '2px',
    backgroundColor: 'var(--accent-primary)',
    zIndex: 2,
    pointerEvents: 'none',
  },
  sliderHandle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-secondary)',
    border: '2px solid var(--accent-primary)',
    boxShadow: 'var(--shadow-glow)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'ew-resize',
  },
  rangeInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'ew-resize',
    zIndex: 3,
  },
};
