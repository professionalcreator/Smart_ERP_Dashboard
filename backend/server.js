import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory log stream for the visual dashboard console
let serverLogs = [
  { id: 'log_init', timestamp: new Date().toLocaleTimeString(), text: 'System Initializing...', method: 'SYSTEM', status: 200, latency: '0ms' },
  { id: 'log_boot', timestamp: new Date().toLocaleTimeString(), text: `SmartERP Backend Server listening on port ${PORT}`, method: 'SYSTEM', status: 200, latency: '2ms' },
];

const addLog = (method, text, status = 200) => {
  const latency = Math.floor(Math.random() * 25) + 5; // Simulating 5-30ms latency
  const logEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toLocaleTimeString(),
    text,
    method,
    status,
    latency: `${latency}ms`
  };
  serverLogs.unshift(logEntry);
  if (serverLogs.length > 50) serverLogs.pop(); // keep last 50 logs
};

// Helper read/write functions
const readData = (filename) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`Error reading file ${filename}:`, err);
    return [];
  }
};

const writeData = (filename, data) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing file ${filename}:`, err);
    return false;
  }
};

// --- API LOGGER MIDDLEWARE ---
app.use((req, res, next) => {
  if (req.path.startsWith('/api/logs')) {
    return next(); // Don't log requests to the log API itself to avoid infinite polling feedback
  }
  
  res.on('finish', () => {
    addLog(req.method, `${req.path} completed`, res.statusCode);
  });
  next();
});

// --- API ENDPOINTS ---

// Server logs endpoint
app.get('/api/logs', (req, res) => {
  res.json(serverLogs);
});

app.post('/api/logs/clear', (req, res) => {
  serverLogs = [
    { id: `log_${Date.now()}`, timestamp: new Date().toLocaleTimeString(), text: 'Logs cleared by admin.', method: 'SYSTEM', status: 200, latency: '0ms' }
  ];
  res.json(serverLogs);
});

// Employees Endpoints
app.get('/api/employees', (req, res) => {
  const data = readData('employees.json');
  res.json(data);
});

app.post('/api/employees', (req, res) => {
  const employees = readData('employees.json');
  const newEmp = {
    id: Date.now().toString(),
    name: req.body.name,
    role: req.body.role,
    dept: req.body.dept,
    status: req.body.status || 'Active'
  };
  employees.unshift(newEmp);
  writeData('employees.json', employees);
  addLog('POST', `Added Employee: ${newEmp.name} (${newEmp.role})`);
  res.status(201).json(newEmp);
});

app.delete('/api/employees/:id', (req, res) => {
  let employees = readData('employees.json');
  const empId = req.params.id;
  const emp = employees.find(e => e.id === empId);
  
  if (emp) {
    employees = employees.filter(e => e.id !== empId);
    writeData('employees.json', employees);
    addLog('DELETE', `Deleted Employee: ${emp.name}`);
    res.json({ success: true, message: `Employee ${emp.name} deleted` });
  } else {
    res.status(404).json({ success: false, message: 'Employee not found' });
  }
});

// Attendance Endpoints
app.get('/api/attendance', (req, res) => {
  const data = readData('attendance.json');
  res.json(data);
});

app.post('/api/attendance/status', (req, res) => {
  const attendance = readData('attendance.json');
  const { userId, status } = req.body;
  const timeNow = status === 'Absent' ? '-' : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  let targetUser = null;
  attendance.roster = attendance.roster.map(member => {
    if (member.id === userId) {
      targetUser = member;
      return { ...member, status, time: timeNow };
    }
    return member;
  });
  
  if (targetUser) {
    const logText = `${targetUser.name} marked ${status.toUpperCase()}${status !== 'Absent' ? ` at ${timeNow}` : ''}`;
    const newLog = {
      id: Date.now().toString(),
      text: logText,
      type: status === 'Present' ? 'info' : status === 'Late' ? 'warn' : 'danger'
    };
    attendance.logs.unshift(newLog);
    attendance.logs = attendance.logs.slice(0, 5); // Keep last 5
    
    writeData('attendance.json', attendance);
    addLog('POST', `Attendance Update: ${targetUser.name} -> ${status}`);
    res.json(attendance);
  } else {
    res.status(404).json({ success: false, message: 'Roster member not found' });
  }
});

// Payroll Endpoints
app.get('/api/payroll', (req, res) => {
  const data = readData('payroll.json');
  res.json(data);
});

app.post('/api/payroll', (req, res) => {
  const payroll = req.body;
  writeData('payroll.json', payroll);
  addLog('POST', `Updated Payroll Parameters: Base=$${payroll.basePay}, Bonus=${payroll.bonusPercent}%`);
  res.json(payroll);
});

// Inventory Endpoints
app.get('/api/inventory', (req, res) => {
  const data = readData('inventory.json');
  res.json(data);
});

app.put('/api/inventory/:id/adjust', (req, res) => {
  let inventory = readData('inventory.json');
  const itemId = req.params.id;
  const { amount } = req.body;
  
  let targetItem = null;
  inventory = inventory.map(item => {
    if (item.id === itemId) {
      const newStock = Math.max(0, item.stock + amount);
      targetItem = { ...item, stock: newStock };
      return targetItem;
    }
    return item;
  });
  
  if (targetItem) {
    writeData('inventory.json', inventory);
    addLog('PUT', `Stock Adjustment: ${targetItem.name} ${amount > 0 ? '+' : ''}${amount} units (New Total: ${targetItem.stock})`);
    res.json(targetItem);
  } else {
    res.status(404).json({ success: false, message: 'Item not found' });
  }
});

// Reports / Overview Statistics
app.get('/api/reports', (req, res) => {
  const employees = readData('employees.json');
  const attendance = readData('attendance.json');
  const inventory = readData('inventory.json');
  
  const totalEmployees = employees.length;
  const activeCount = employees.filter(e => e.status === 'Active').length;
  
  let roster = attendance.roster || [];
  const presentCount = roster.filter(m => m.status === 'Present').length;
  const lateCount = roster.filter(m => m.status === 'Late').length;
  
  const presentRate = roster.length > 0 ? Math.round(((presentCount + lateCount) / roster.length) * 100) : 0;
  
  const totalStockItems = inventory.length;
  const lowStockCount = inventory.filter(i => i.stock < i.minStock).length;
  
  res.json({
    totalEmployees,
    activeCount,
    presentRate,
    totalStockItems,
    lowStockCount
  });
});

app.listen(PORT, () => {
  console.log(`Backend Server booted and running on http://localhost:${PORT}`);
});
