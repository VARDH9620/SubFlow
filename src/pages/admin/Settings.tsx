import { useState } from 'react';
import { Database, RefreshCw, Shield, Bell, Zap } from 'lucide-react';
import { resetDatabase } from '../../db/database';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, PageHeader, Input, Badge, ConfirmDialog } from '../../components/ui';

export default function AdminSettings() {
  const { addToast } = useAuth();
  const [showReset, setShowReset] = useState(false);
  const [taxRate, setTaxRate] = useState('18');
  const [currency, setCurrency] = useState('USD');
  const [siteName, setSiteName] = useState('SubFlow');
  const [trialDays, setTrialDays] = useState('14');

  const handleReset = () => {
    resetDatabase();
    addToast('Database has been reset to defaults', 'info');
    setShowReset(false);
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="animate-fadeIn max-w-3xl">
      <PageHeader title="Settings" description="Configure platform settings and preferences" />

      {/* General */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary-500" /> General Settings
        </h3>
        <div className="space-y-4">
          <Input label="Platform Name" value={siteName} onChange={e => setSiteName(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Default Currency" value={currency} onChange={e => setCurrency(e.target.value)} />
            <Input label="Default Trial Days" type="number" value={trialDays} onChange={e => setTrialDays(e.target.value)} />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => addToast('Settings saved successfully', 'success')}>Save Settings</Button>
          </div>
        </div>
      </Card>

      {/* Billing */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-500" /> Billing & Tax
        </h3>
        <div className="space-y-4">
          <Input label="Tax Rate (%)" type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} helper="Applied to all invoices" />
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Payment Methods</h4>
            <div className="flex gap-3">
              {['Credit Card', 'PayPal', 'Bank Transfer'].map(method => (
                <Badge key={method} variant="success">{method} ✓</Badge>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => addToast('Billing settings saved', 'success')}>Save</Button>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary-500" /> Notification Preferences
        </h3>
        <div className="space-y-3">
          {[
            { label: 'New subscription created', enabled: true },
            { label: 'Payment received', enabled: true },
            { label: 'Subscription cancelled', enabled: true },
            { label: 'New support ticket', enabled: true },
            { label: 'Invoice overdue', enabled: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <button className={`relative w-10 h-5 rounded-full transition-colors ${item.enabled ? 'bg-primary' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.enabled ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Database */}
      <Card className="border-red-200">
        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Database className="w-5 h-5 text-red-500" /> Database Management
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Reset the database to its initial state with seed data. This will delete all changes made since initialization.
        </p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={() => setShowReset(true)} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Reset Database
          </Button>
        </div>
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>SQL Schema:</strong> The complete SQL schema is available in <code className="bg-gray-200 px-1 py-0.5 rounded text-xs">src/db/schema.sql</code> for migration to a real database (MySQL/PostgreSQL).
          </p>
        </div>
      </Card>

      <ConfirmDialog
        open={showReset}
        onClose={() => setShowReset(false)}
        onConfirm={handleReset}
        title="Reset Database"
        message="This will delete all data and reset to the default seed data. This action cannot be undone."
        confirmLabel="Reset Database"
      />
    </div>
  );
}
