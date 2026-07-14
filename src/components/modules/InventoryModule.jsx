import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Minus, AlertTriangle, CheckCircle, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const INITIAL_ITEMS = [
  { id: '1', name: 'Premium Office Desks', category: 'Furniture', stock: 12, minStock: 5 },
  { id: '2', name: 'Ergonomic Mesh Chairs', category: 'Furniture', stock: 4, minStock: 8 },
  { id: '3', name: '4K UltraWide Monitors', category: 'Electronics', stock: 18, minStock: 6 },
  { id: '4', name: 'Mechanical Keyboards', category: 'Electronics', stock: 6, minStock: 10 },
  { id: '5', name: 'USB-C Charging Hubs', category: 'Accessories', stock: 24, minStock: 15 },
  { id: '6', name: 'Rose Gold Desk Pads', category: 'Accessories', stock: 2, minStock: 5 },
];

export default function InventoryModule() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [sortDirection, setSortDirection] = useState('asc'); // asc or desc by stock count

  const adjustStock = (id, amount) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, item.stock + amount);
        return { ...item, stock: newStock };
      }
      return item;
    }));
  };

  const toggleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const sortedAndFilteredItems = items
    .filter(item => !filterLowStock || item.stock < item.minStock)
    .sort((a, b) => {
      return sortDirection === 'asc' ? a.stock - b.stock : b.stock - a.stock;
    });

  const lowStockCount = items.filter(item => item.stock < item.minStock).length;

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <div style={styles.summaryBar}>
          <Package size={18} color="var(--accent-primary)" />
          <span style={styles.summaryText}>
            Showing {sortedAndFilteredItems.length} products. 
            {lowStockCount > 0 ? (
              <span style={styles.warningAlertInline}>
                <AlertTriangle size={14} style={{ marginRight: '4px' }} />
                {lowStockCount} items critically low on stock!
              </span>
            ) : (
              <span style={styles.successAlertInline}>
                <CheckCircle size={14} style={{ marginRight: '4px' }} />
                All stock levels healthy.
              </span>
            )}
          </span>
        </div>

        <div style={styles.filterControls}>
          <button 
            onClick={() => setFilterLowStock(!filterLowStock)}
            style={{
              ...styles.toggleBtn,
              backgroundColor: filterLowStock ? 'var(--danger-soft)' : '#ffffff',
              borderColor: filterLowStock ? 'var(--danger)' : 'var(--accent-border)',
              color: filterLowStock ? 'var(--danger)' : 'var(--text-secondary)',
            }}
          >
            <AlertTriangle size={14} />
            Show Critically Low
          </button>

          <button 
            onClick={toggleSort}
            style={styles.actionBtn}
          >
            <ArrowUpDown size={14} />
            Sort by Stock ({sortDirection.toUpperCase()})
          </button>
        </div>
      </div>

      <div style={styles.grid}>
        <AnimatePresence mode="popLayout">
          {sortedAndFilteredItems.map(item => {
            const isLowStock = item.stock < item.minStock;
            const progressPercent = Math.min(100, (item.stock / (item.minStock * 2)) * 100);

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 20 }}
                style={{
                  ...styles.card,
                  borderColor: isLowStock ? 'rgba(255, 77, 77, 0.25)' : 'rgba(255, 94, 132, 0.12)',
                  boxShadow: isLowStock ? '0 10px 30px rgba(255, 77, 77, 0.04)' : 'var(--shadow-md)',
                }}
                className="glass-panel"
              >
                {/* Header */}
                <div style={styles.cardHeader}>
                  <div>
                    <span style={styles.categoryBadge}>{item.category}</span>
                    <h4 style={styles.productName}>{item.name}</h4>
                  </div>
                  {isLowStock && (
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      style={styles.alertIcon}
                      title="Below Minimum Threshold!"
                    >
                      <AlertTriangle size={15} color="var(--danger)" />
                    </motion.div>
                  )}
                </div>

                {/* Progress bar representing capacity */}
                <div style={styles.stockStatus}>
                  <div style={styles.stockLabelRow}>
                    <span style={styles.stockCount}>
                      Stock: <strong style={{ color: isLowStock ? 'var(--danger)' : 'var(--text-primary)' }}>{item.stock}</strong> units
                    </span>
                    <span style={styles.minRequirement}>Min: {item.minStock}</span>
                  </div>
                  <div style={styles.progressBarBg}>
                    <motion.div 
                      style={{
                        ...styles.progressBarActive,
                        backgroundColor: isLowStock ? 'var(--danger)' : 'var(--accent-primary)',
                      }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                {/* Footer Controls */}
                <div style={styles.cardActions}>
                  <button 
                    onClick={() => adjustStock(item.id, -1)}
                    style={styles.adjustBtn}
                    title="Deduct 1 unit"
                  >
                    <Minus size={14} />
                  </button>
                  
                  <span style={styles.quickLabel}>Quick Adjust</span>
                  
                  <button 
                    onClick={() => adjustStock(item.id, 1)}
                    style={styles.adjustBtn}
                    title="Add 1 unit"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  summaryBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  summaryText: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    display: 'inline-flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  warningAlertInline: {
    marginLeft: '12px',
    padding: '3px 8px',
    backgroundColor: 'var(--danger-soft)',
    color: 'var(--danger)',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
    display: 'inline-flex',
    alignItems: 'center',
  },
  successAlertInline: {
    marginLeft: '12px',
    padding: '3px 8px',
    backgroundColor: 'var(--success-soft)',
    color: 'var(--success)',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
    display: 'inline-flex',
    alignItems: 'center',
  },
  filterControls: {
    display: 'flex',
    gap: '10px',
  },
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 18px',
    borderRadius: 'var(--border-radius-full)',
    border: '1px solid',
    fontSize: '13px',
    fontWeight: '600',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 18px',
    borderRadius: 'var(--border-radius-full)',
    border: '1px solid var(--accent-border)',
    fontSize: '13px',
    fontWeight: '600',
    backgroundColor: '#ffffff',
    color: 'var(--text-secondary)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '24px',
    border: '1px solid',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    justifyContent: 'space-between',
    minHeight: '200px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  categoryBadge: {
    fontSize: '10px',
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: '1px',
    color: 'var(--text-muted)',
  },
  productName: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginTop: '4px',
  },
  alertIcon: {
    backgroundColor: 'var(--danger-soft)',
    padding: '6px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockStatus: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  stockLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
  },
  stockCount: {
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  minRequirement: {
    color: 'var(--text-muted)',
    fontSize: '11px',
  },
  progressBarBg: {
    height: '6px',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressBarActive: {
    height: '100%',
    borderRadius: '3px',
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'var(--bg-primary)',
    padding: '8px 12px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 94, 132, 0.04)',
  },
  adjustBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: 'var(--accent-primary)',
    border: '1px solid var(--accent-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-sm)',
  },
  quickLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
};
