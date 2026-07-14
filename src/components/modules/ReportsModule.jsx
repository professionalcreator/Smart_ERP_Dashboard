import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Users, Award, Calendar, Layers } from 'lucide-react';

const MONTHLY_DATA = [
  { label: 'Jan', revenue: 45000, expenses: 32000, headcount: 14 },
  { label: 'Feb', revenue: 52000, expenses: 35000, headcount: 15 },
  { label: 'Mar', revenue: 61000, expenses: 38000, headcount: 15 },
  { label: 'Apr', revenue: 58000, expenses: 40000, headcount: 16 },
  { label: 'May', revenue: 69000, expenses: 41000, headcount: 18 },
  { label: 'Jun', revenue: 84000, expenses: 45000, headcount: 20 },
];

export default function ReportsModule() {
  const [activeTab, setActiveTab] = useState('financials'); // financials or operational
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // SVG dimensions for chart
  const width = 500;
  const height = 240;
  const padding = 40;

  // Max value to scale graph
  const maxVal = 100000;

  // Helper to scale Y coordinate
  const getScaleY = (val) => {
    return height - padding - (val / maxVal) * (height - 2 * padding);
  };

  // Helper to scale X coordinate
  const getScaleX = (index) => {
    const chartWidth = width - 2 * padding;
    return padding + (index / (MONTHLY_DATA.length - 1)) * chartWidth;
  };

  // Build SVG Path for line chart
  const revenuePoints = MONTHLY_DATA.map((d, i) => `${getScaleX(i)},${getScaleY(d.revenue)}`).join(' L ');
  const expensesPoints = MONTHLY_DATA.map((d, i) => `${getScaleX(i)},${getScaleY(d.expenses)}`).join(' L ');

  const totalRevenue = MONTHLY_DATA.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = MONTHLY_DATA.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const averageHeadcount = Math.round(MONTHLY_DATA.reduce((sum, item) => sum + item.headcount, 0) / MONTHLY_DATA.length);

  return (
    <div style={styles.container}>
      <div className="responsive-grid-reports">
        
        {/* Analytics Card */}
        <div style={styles.chartCard} className="glass-panel">
          <div style={styles.chartHeader}>
            <div style={styles.headerTitleRow}>
              <TrendingUp size={18} color="var(--accent-primary)" />
              <h4 style={styles.cardTitle}>Performance Analytics</h4>
            </div>
            
            <div style={styles.toggleRow}>
              <button 
                onClick={() => setActiveTab('financials')}
                style={{
                  ...styles.miniTab,
                  backgroundColor: activeTab === 'financials' ? 'var(--accent-soft)' : 'transparent',
                  color: activeTab === 'financials' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                }}
              >
                Financial Flow
              </button>
              <button 
                onClick={() => setActiveTab('operational')}
                style={{
                  ...styles.miniTab,
                  backgroundColor: activeTab === 'operational' ? 'var(--accent-soft)' : 'transparent',
                  color: activeTab === 'operational' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                }}
              >
                Operations (Headcount)
              </button>
            </div>
          </div>

          <div style={styles.chartWrapper}>
            <svg viewBox={`0 0 ${width} ${height}`} style={styles.svg}>
              {/* Y Gridlines */}
              {[20000, 40000, 60000, 80000, 100000].map((val) => (
                <g key={val}>
                  <line
                    x1={padding}
                    y1={getScaleY(val)}
                    x2={width - padding}
                    y2={getScaleY(val)}
                    stroke="var(--accent-soft)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padding - 10}
                    y={getScaleY(val) + 4}
                    fontSize="9"
                    fontWeight="600"
                    textAnchor="end"
                    fill="var(--text-muted)"
                  >
                    ${val / 1000}k
                  </text>
                </g>
              ))}

              {/* X Labels */}
              {MONTHLY_DATA.map((d, i) => (
                <text
                  key={d.label}
                  x={getScaleX(i)}
                  y={height - padding + 18}
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                  fill="var(--text-secondary)"
                >
                  {d.label}
                </text>
              ))}

              {activeTab === 'financials' ? (
                <>
                  {/* Expense Line */}
                  <motion.path
                    d={`M ${expensesPoints}`}
                    fill="none"
                    stroke="var(--text-muted)"
                    strokeWidth="2.5"
                    strokeOpacity="0.4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1 }}
                  />

                  {/* Revenue Line */}
                  <motion.path
                    d={`M ${revenuePoints}`}
                    fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth="3.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1 }}
                  />

                  {/* Interactive Nodes for Revenue */}
                  {MONTHLY_DATA.map((d, i) => (
                    <circle
                      key={i}
                      cx={getScaleX(i)}
                      cy={getScaleY(d.revenue)}
                      r={hoveredIndex === i ? 6 : 4}
                      fill={hoveredIndex === i ? 'var(--accent-primary)' : '#ffffff'}
                      stroke="var(--accent-primary)"
                      strokeWidth="2.5"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      style={{ cursor: 'pointer', transition: 'r 0.1s ease' }}
                    />
                  ))}
                </>
              ) : (
                <>
                  {/* Headcount Bar Chart */}
                  {MONTHLY_DATA.map((d, i) => {
                    const barWidth = 24;
                    const x = getScaleX(i) - barWidth / 2;
                    const barHeight = ((d.headcount) / 25) * (height - 2 * padding);
                    const y = height - padding - barHeight;

                    return (
                      <motion.rect
                        key={i}
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        rx="4"
                        fill="var(--accent-primary)"
                        opacity="0.85"
                        initial={{ height: 0, y: height - padding }}
                        animate={{ height: barHeight, y: y }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{ cursor: 'pointer' }}
                      />
                    );
                  })}
                </>
              )}
            </svg>

            {/* Custom Tooltip Card overlaying */}
            {hoveredIndex !== null && (
              <div
                style={{
                  ...styles.tooltip,
                  left: `${getScaleX(hoveredIndex) - 60}px`,
                  top: `${getScaleY(
                    activeTab === 'financials'
                      ? MONTHLY_DATA[hoveredIndex].revenue
                      : (MONTHLY_DATA[hoveredIndex].headcount / 25) * 100000
                  ) - 75}px`,
                }}
              >
                <div style={styles.tooltipMonth}>{MONTHLY_DATA[hoveredIndex].label} Metrics</div>
                {activeTab === 'financials' ? (
                  <>
                    <div style={styles.tooltipRow}>
                      <span style={{ color: 'var(--accent-primary)' }}>Revenue:</span>
                      <strong>${MONTHLY_DATA[hoveredIndex].revenue.toLocaleString()}</strong>
                    </div>
                    <div style={styles.tooltipRow}>
                      <span style={{ color: 'var(--text-secondary)' }}>Expenses:</span>
                      <strong>${MONTHLY_DATA[hoveredIndex].expenses.toLocaleString()}</strong>
                    </div>
                  </>
                ) : (
                  <div style={styles.tooltipRow}>
                    <span style={{ color: 'var(--accent-primary)' }}>Team Members:</span>
                    <strong>{MONTHLY_DATA[hoveredIndex].headcount} active</strong>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Financial Highlights */}
        <div style={styles.metricsColumn}>
          <div style={styles.metricCard} className="glass-panel">
            <div style={styles.metricIconBox}>
              <DollarSign size={20} color="var(--accent-primary)" />
            </div>
            <div>
              <span style={styles.metricLabel}>YTD Net Profit</span>
              <h4 style={styles.metricValue}>+${totalProfit.toLocaleString()}</h4>
              <span style={styles.metricTrend}>YTD Revenue: ${totalRevenue.toLocaleString()}</span>
            </div>
          </div>

          <div style={styles.metricCard} className="glass-panel">
            <div style={styles.metricIconBox}>
              <Users size={20} color="var(--accent-primary)" />
            </div>
            <div>
              <span style={styles.metricLabel}>Average Headcount</span>
              <h4 style={styles.metricValue}>{averageHeadcount} employees</h4>
              <span style={styles.metricTrend}>Organic Growth Rate: +35%</span>
            </div>
          </div>

          <div style={styles.metricCard} className="glass-panel">
            <div style={styles.metricIconBox}>
              <Award size={20} color="var(--accent-primary)" />
            </div>
            <div>
              <span style={styles.metricLabel}>Budget Compliance</span>
              <h4 style={styles.metricValue}>94.2%</h4>
              <span style={styles.metricTrend}>Target variance: &lt; 5.0%</span>
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

  chartCard: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    borderBottom: '1px solid var(--accent-soft)',
    paddingBottom: '14px',
    flexWrap: 'wrap',
  },
  headerTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  toggleRow: {
    display: 'flex',
    gap: '6px',
    backgroundColor: 'var(--bg-primary)',
    padding: '4px',
    borderRadius: '10px',
    border: '1px solid var(--accent-border)',
  },
  miniTab: {
    padding: '5px 12px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    transition: 'all 0.1s ease',
  },
  chartWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  svg: {
    width: '100%',
    height: 'auto',
    overflow: 'visible',
  },
  tooltip: {
    position: 'absolute',
    width: '125px',
    padding: '10px',
    backgroundColor: 'rgba(61, 34, 41, 0.95)',
    color: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(255, 94, 132, 0.15)',
    zIndex: 10,
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  tooltipMonth: {
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--accent-primary)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
    paddingBottom: '4px',
    marginBottom: '2px',
    textTransform: 'uppercase',
  },
  tooltipRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
  },
  metricsColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  metricCard: {
    backgroundColor: '#ffffff',
    padding: '18px 20px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  metricIconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '14px',
    backgroundColor: 'var(--accent-soft)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--accent-border)',
    flexShrink: 0,
  },
  metricLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginTop: '2px',
    fontFamily: 'var(--font-sans)',
  },
  metricTrend: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
    display: 'block',
  },
};

