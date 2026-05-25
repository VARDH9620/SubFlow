import { useEffect, useState } from 'react';
import { MessageSquare, User as UserIcon, Clock } from 'lucide-react';
import * as db from '../../db/database';
import { Card, PageHeader, Badge, SearchBar, Tabs, Button, Modal, Select, EmptyState } from '../../components/ui';
import type { SupportTicket, TicketMessage, TicketStatus } from '../../types';

const statusColors: Record<TicketStatus, 'info' | 'warning' | 'success' | 'default'> = {
  open: 'info', in_progress: 'warning', resolved: 'success', closed: 'default',
};

export default function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [reply, setReply] = useState('');
  const [statusChange, setStatusChange] = useState('');

  const refresh = () => setTickets(db.getAllTickets());
  useEffect(() => { refresh(); }, []);

  const tabs = [
    { key: 'all', label: 'All', count: tickets.length },
    { key: 'open', label: 'Open', count: tickets.filter(t => t.status === 'open').length },
    { key: 'in_progress', label: 'In Progress', count: tickets.filter(t => t.status === 'in_progress').length },
    { key: 'resolved', label: 'Resolved', count: tickets.filter(t => t.status === 'resolved').length },
    { key: 'closed', label: 'Closed', count: tickets.filter(t => t.status === 'closed').length },
  ];

  const filtered = tickets
    .filter(t => tab === 'all' || t.status === tab)
    .filter(t => search === '' || t.subject.toLowerCase().includes(search.toLowerCase()) || (t.user_email || '').toLowerCase().includes(search.toLowerCase()));

  const openTicket = (ticket: SupportTicket) => {
    setSelected(ticket);
    setMessages(db.getMessagesByTicket(ticket.id));
    setStatusChange(ticket.status);
  };

  const handleReply = () => {
    if (!selected || !reply.trim()) return;
    db.addTicketMessage(selected.id, 'admin-001', 'admin', reply);
    setReply('');
    setMessages(db.getMessagesByTicket(selected.id));
  };

  const handleStatusUpdate = () => {
    if (!selected) return;
    db.updateTicket(selected.id, { status: statusChange as TicketStatus, assigned_to: 'admin-001' });
    refresh();
    setSelected(null);
  };

  return (
    <div className="animate-fadeIn">
      <PageHeader title="Support Tickets" description="Manage and respond to user support requests" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
        <div className="w-full sm:w-64"><SearchBar value={search} onChange={setSearch} placeholder="Search tickets..." /></div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<MessageSquare className="w-10 h-10" />} title="No tickets found" description="All clear! No support tickets match your filters." />
      ) : (
        <div className="space-y-3">
          {filtered.map(ticket => (
            <Card key={ticket.id} className="cursor-pointer hover:shadow-md transition-shadow" padding={false}>
              <div className="p-4 flex items-center gap-4" onClick={() => openTicket(ticket)}>
                <div className={`p-2.5 rounded-lg shrink-0 ${ticket.status === 'open' ? 'bg-blue-50 text-blue-600' : ticket.status === 'in_progress' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{ticket.subject}</h4>
                    <Badge variant={ticket.priority === 'critical' ? 'danger' : ticket.priority === 'high' ? 'warning' : 'default'}>{ticket.priority}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{ticket.description}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" /> {ticket.user_name}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(ticket.created_at).toLocaleDateString()}</span>
                    <Badge>{ticket.category}</Badge>
                  </div>
                </div>
                <Badge variant={statusColors[ticket.status]}>{ticket.status.replace('_', ' ')}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Ticket Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.subject || ''} size="lg">
        {selected && (
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant={statusColors[selected.status]}>{selected.status.replace('_', ' ')}</Badge>
              <Badge>{selected.category}</Badge>
              <Badge variant={selected.priority === 'critical' ? 'danger' : 'default'}>{selected.priority}</Badge>
              <span className="text-xs text-gray-400">From: {selected.user_name} ({selected.user_email})</span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700">{selected.description}</p>
            </div>

            {messages.length > 0 && (
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-3 ${msg.sender_role === 'admin' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${msg.sender_role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-primary-100 text-primary-700'}`}>
                      {msg.sender_name?.[0] || '?'}
                    </div>
                    <div className={`max-w-[75%] p-3 rounded-lg text-sm ${msg.sender_role === 'admin' ? 'bg-purple-50 text-gray-700' : 'bg-white border text-gray-700'}`}>
                      <p className="text-xs font-medium text-gray-400 mb-1">{msg.sender_name} · {msg.sender_role}</p>
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reply */}
            <div className="mb-4">
              <textarea value={reply} onChange={e => setReply(e.target.value)} rows={3} placeholder="Type your reply..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2" />
              <Button size="sm" onClick={handleReply} disabled={!reply.trim()}>Send Reply</Button>
            </div>

            {/* Status update */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <Select
                  label=""
                  value={statusChange}
                  onChange={e => setStatusChange(e.target.value)}
                  options={[
                    { value: 'open', label: 'Open' },
                    { value: 'in_progress', label: 'In Progress' },
                    { value: 'resolved', label: 'Resolved' },
                    { value: 'closed', label: 'Closed' },
                  ]}
                />
                <Button size="sm" onClick={handleStatusUpdate}>Update Status</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
