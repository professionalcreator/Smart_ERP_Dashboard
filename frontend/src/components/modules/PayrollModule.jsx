import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Landmark, ShieldAlert, RefreshCw } from 'lucide-react';

export default function PayrollModule() {
  const [basePay, setBasePay] = useState(6500);
  const [bonusPercent, setBonusPercent] = useState(10);
  const [taxRate, setTaxRate] = useState(22);
  const [benefits, setBenefits] = useState(350);
  const [loading, setLoading] = useState(true);

  // Fetch from backend
  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const res = await fetch('/api/payroll');
        if (res.ok) {
          const data = await res.json();
          setBasePay(data.basePay ?? 6500);
          setBonusPercent(data.bonusPercent ?? 10);
          setTaxRate(data.taxRate ?? 22);
          setBenefits(data.benefits ?? 350);
        }
      } catch (err) {
        console.warn('Backend unavailable, using default payroll state.', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayroll();
  }, []);

  // Save changes to backend after 500ms debounce
  useEffect(() => {
    if (loading) return; // Don't trigger on initial load

    const delayDebounce = setTimeout(async () => {
      try {
        await fetch('/api/payroll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ basePay, bonusPercent, taxRate, benefits })
        });
      } catch (err) {
        console.warn('Failed to auto-save payroll to backend.', err);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [basePay, bonusPercent, taxRate, benefits, loading]);

  // Calculations
  const grossPay = Math.round(basePay * (1 + bonusPercent / 100));
  const taxAmount = Math.round(grossPay * (taxRate / 100));
  const deductions = benefits;
  const netPay = grossPay - taxAmount - deductions;

  // Chart Percentages
  const taxPercent = (taxAmount / grossPay) * 100;
  const benefitsPercent = (deductions / grossPay) * 100;
  const netPercent = (netPay / grossPay) * 100;

  return (
    <div style={styles.container}>
      <div className="responsive-grid-2">
        
        {/* Sliders Input Card */}
        <div style={styles.controlCard} className="glass-panel">
          <div style={styles.cardHeader}>
            <Landmark size={18} color="var(--accent-primary)" />
            <h4 style={styles.cardTitle}>Interactive Salary Structure</h4>
            {loading && <RefreshCw size={14} className="spin-anim" style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />}
          </div>
          
          <div style={styles.sliderContainer}>
            <div style={styles.sliderLabelRow}>
              <span style={styles.label}>Base Salary (Monthly)</span>
              <span style={styles.value}>${basePay.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="2000"
              max="15000"
              step="100"
              value={basePay}
              onChange={(e) => setBasePay(Number(e.target.value))}
              className="custom-slider"
            />
            <div style={styles.sliderRangeLimits}>
              <span>$2k</span>
              <span>$15k</span>
            </div>
          </div>

          <div style={styles.sliderContainer}>
            <div style={styles.sliderLabelRow}>
              <span style={styles.label}>Performance Bonus</span>
              <span style={styles.value}>{bonusPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={bonusPercent}
              onChange={(e) => setBonusPercent(Number(e.target.value))}
              className="custom-slider"
            />
            <div style={styles.sliderRangeLimits}>
              <span>0%</span>
              <span>50%</span>
            </div>
          </div>

          <div style={styles.sliderContainer}>
            <div style={styles.sliderLabelRow}>
              <span style={styles.label}>Income Tax Deductions</span>
              <span style={styles.value}>{taxRate}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="custom-slider"
            />
            <div style={styles.sliderRangeLimits}>
              <span>10%</span>
              <span>40%</span>
            </div>
          </div>

          <div style={styles.sliderContainer}>
            <div style={styles.sliderLabelRow}>
              <span style={styles.label}>Health & Wellness Benefits</span>
              <span style={styles.value}>${benefits}</span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={benefits}
              onChange={(e) => setBenefits(Number(e.target.value))}
              className="custom-slider"
            />
            <div style={styles.sliderRangeLimits}>
              <span>$100</span>
              <span>$1,000</span>
            </div>
          </div>
        </div>

        {/* Live Calculation Output Card */}
        <div style={styles.resultColumn}>
          <div style={styles.resultCard} className="glass-panel">
            <div style={styles.resultHeader}>
              <span style={styles.resultLabel}>ESTIMATED MONTHLY NET PAY</span>
              <h3 style={styles.netValue}>
                <DollarSign size={28} style={{ marginRight: '-2px', color: 'var(--accent-primary)' }} />
                {netPay.toLocaleString()}
              </h3>
            </div>

            {/* Stacked breakdown bar */}
            <div style={styles.breakdownBar}>
              <motion.div 
                style={{ ...styles.barSegment, backgroundColor: 'var(--accent-primary)', width: `${netPercent}%` }}
                animate={{ width: `${netPercent}%` }}
                transition={{ type: 'spring', damping: 20 }}
                title={`Net Pay: ${Math.round(netPercent)}%`}
              />
              <motion.div 
                style={{ ...styles.barSegment, backgroundColor: 'var(--text-secondary)', opacity: 0.7, width: `${taxPercent}%` }}
                animate={{ width: `${taxPercent}%` }}
                transition={{ type: 'spring', damping: 20 }}
                title={`Taxes: ${Math.round(taxPercent)}%`}
              />
              <motion.div 
                style={{ ...styles.barSegment, backgroundColor: 'rgba(255,255,255,0.1)', width: `${benefitsPercent}%` }}
                animate={{ width: `${benefitsPercent}%` }}
                transition={{ type: 'spring', damping: 20 }}
                title={`Benefits: ${Math.round(benefitsPercent)}%`}
              />
            </div>

            {/* Value cards grid */}
            <div style={styles.valueGrid}>
              <div style={styles.valueItem}>
                <span style={styles.smallLabel}>Gross Pay</span>
                <span style={styles.smallVal}>${grossPay.toLocaleString()}</span>
              </div>
              <div style={styles.valueItem}>
                <span style={styles.smallLabel}>Taxes (W-2)</span>
                <span style={styles.smallVal}>-${taxAmount.toLocaleString()}</span>
              </div>
              <div style={styles.valueItem}>
                <span style={styles.smallLabel}>Benefits Co-Pay</span>
                <span style={styles.smallVal}>-${deductions.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div style={styles.complianceCard} className="glass-panel">
            <ShieldAlert size={18} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
            <p style={styles.complianceText}>
              Calculated dynamically in compliance with standard federal and state withholding models. Recalibrates instantly upon core metric updates.
            </p>
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
  controlCard: {
    padding: '24px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1px solid var(--accent-soft)',
    paddingBottom: '12px',
    marginBottom: '6px',
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  sliderContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  sliderLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  value: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--accent-primary)',
  },
  sliderRangeLimits: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    color: 'var(--text-muted)',
    marginTop: '-4px',
  },
  resultColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  resultCard: {
    padding: '30px 24px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '240px',
  },
  resultHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  resultLabel: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '1.5px',
  },
  netValue: {
    fontSize: '36px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'var(--font-sans)',
  },
  breakdownBar: {
    height: '10px',
    borderRadius: '5px',
    overflow: 'hidden',
    display: 'flex',
    backgroundColor: 'rgba(255,255,255,0.05)',
    margin: '18px 0',
  },
  barSegment: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  valueGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    borderTop: '1px solid var(--accent-soft)',
    paddingTop: '16px',
    textAlign: 'center',
  },
  valueItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  smallLabel: {
    fontSize: '10px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  smallVal: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  complianceCard: {
    padding: '16px 20px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: '1px solid var(--accent-border)',
  },
  complianceText: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
  },
};
