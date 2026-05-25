import { useEffect, useState } from 'react';
import { LifeBuoy, Plus, Clock, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import * as db from '../../db/database';
import { Card, Badge, Button, PageHeader, Modal, Input, Textarea, Select, EmptyState, Tabs } from '../../components/ui';
import type { SupportTicket, TicketMessage, TicketStatus } from '../../types';

const statusColors: Record<TicketStatus, 'info' | 'warning' | 'success' | 'default'> = {
  open: 'info',
  in_progress: 'warning',
  resolved: 'success',
  closed: 'default',
};

export default function Support() {
  const { user, addToast } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [tab, setTab] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const [createForm, setCreateForm] = useState({ subject: '', description: '', category: 'General', priority: 'medium' as 'low' | 'medium' | 'high' | 'critical' });

  const refresh = () => { if (user) setTickets(db.getTicketsByUser(user.id)); };

  useEffect(() => { refresh(); }, [user]);

  const tabs = [
    { key: 'all', label: 'All', count: tickets.length },
    { key: 'open', label: 'Open', count: tickets.filter(t => t.status === 'open').length },
    { key: 'in_progress', label: 'In Progress', count: tickets.filter(t => t.status === 'in_progress').length },
    { key: 'resolved', label: 'Resolved', count: tickets.filter(t => t.status === 'resolved').length },
  ];

  const filtered = tab === 'all' ? tickets : tickets.filter(t => t.status === tab);

  const handleCreate = () => {
    if (!user) return;
    db.createTicket(user.id, createForm);
    addToast('Ticket created successfully', 'success');
    setShowCreate(false);
    setCreateForm({ subject: '', description: '', category: 'General', priority: 'medium' });
    refresh();
  };

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setMessages(db.getMessagesByTicket(ticket.id));
  };

  const handleReply = () => {
    if (!user || !selectedTicket || !newMessage.trim()) return;
    db.addTicketMessage(selectedTicket.id, user.id, 'user', newMessage);
    setNewMessage('');
    setMessages(db.getMessagesByTicket(selectedTicket.id));
  };

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Support"
        description="Get help with your subscriptions and account"
        action={<Button onClick={() => setShowCreate(true)} className="gap-2"><Plus className="w-4 h-4" /> New Ticket</Button>}
      />

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      <div className="mt-4">
        {filtered.length === 0 ? (
          <EmptyState icon={<LifeBuoy className="w-10 h-10" />} title="No support tickets" description="You haven't created any support tickets yet" action={<Button onClick={() => setShowCreate(true)}>Create Ticket</Button>} />
        ) : (
          <div className="space-y-3">
            {filtered.map(ticket => (
              <Card key={ticket.id} className="cursor-pointer hover:shadow-md transition-shadow" padding={false}>
                <div className="p-4 flex items-center gap-4" onClick={() => handleViewTicket(ticket)}>
                  <div className={`p-2.5 rounded-lg ${ticket.status === 'open' ? 'bg-blue-50 text-blue-600' : ticket.status === 'in_progress' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{ticket.subject}</h4>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{ticket.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(ticket.created_at).toLocaleDateString()}</span>
                      <Badge>{ticket.category}</Badge>
                      <Badge variant={ticket.priority === 'critical' ? 'danger' : ticket.priority === 'high' ? 'warning' : 'default'}>
                        {ticket.priority}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant={statusColors[ticket.status]}>{ticket.status.replace('_', ' ')}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Support Ticket" size="md">
        <div className="space-y-4">
          <Input label="Subject" value={createForm.subject} onChange={e => setCreateForm(p => ({ ...p, subject: e.target.value }))} required placeholder="Brief description of your issue" />
          <Select label="Category" value={createForm.category} onChange={e => setCreateForm(p => ({ ...p, category: e.target.value }))}
            options={[{ value: 'General', label: 'General' }, { value: 'Billing', label: 'Billing' }, { value: 'Technical', label: 'Technical' }, { value: 'Account', label: 'Account' }, { value: 'Feature Request', label: 'Feature Request' }]} />
          <Select label="Priority" value={createForm.priority} onChange={e => setCreateForm(p => ({ ...p, priority: e.target.value as 'low' | 'medium' | 'high' | 'critical' }))}
            options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'critical', label: 'Critical' }]} />
          <Textarea label="Description" value={createForm.description} onChange={e => setCreateForm(p => ({ ...p, description: e.target.value }))} required rows={4} placeholder="Provide details about your issue..." />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!createForm.subject || !createForm.description}>Submit Ticket</Button>
          </div>
        </div>
      </Modal>

      {/* View Ticket Modal */}
      <Modal open={!!selectedTicket} onClose={() => { setSelectedTicket(null); setMessages([]); }} title={selectedTicket?.subject || ''} size="lg">
        {selectedTicket && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant={statusColors[selectedTicket.status]}>{selectedTicket.status.replace('_', ' ')}</Badge>
              <Badge>{selectedTicket.category}</Badge>
              <Badge variant={selectedTicket.priority === 'critical' ? 'danger' : 'default'}>{selectedTicket.priority}</Badge>
              <span className="text-xs text-gray-400 ml-auto">{new Date(selectedTicket.created_at).toLocaleString()}</span>
            </div>

            {/* Original message */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700">{selectedTicket.description}</p>
            </div>

            {/* Messages */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender_role === 'admin' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${msg.sender_role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-primary-100 text-primary-700'}`}>
                    {msg.sender_name?.[0] || '?'}
                  </div>
                  <div className={`max-w-[75%] p-3 rounded-lg text-sm ${msg.sender_role === 'admin' ? 'bg-purple-50 text-gray-700' : 'bg-white border text-gray-700'}`}>
                    <p className="text-xs font-medium text-gray-500 mb-1">{msg.sender_name} · {msg.sender_role}</p>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Reply */}
            {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
              <div className="flex gap-3">
                <input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a reply..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onKeyDown={e => { if (e.key === 'Enter' && newMessage.trim()) handleReply(); }} />
                <Button onClick={handleReply} disabled={!newMessage.trim()}>Send</Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
