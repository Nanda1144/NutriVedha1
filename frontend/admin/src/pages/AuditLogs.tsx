import React, { useState, useEffect } from 'react';
import { ScrollText, Search, Filter, ShieldCheck, Eye, Terminal } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { DataTable, Column } from '../components/common/DataTable';
import { Pagination } from '../components/common/Pagination';
import { adminAuditService } from '../services/adminAuditService';
import { AuditLog } from '../types';
import { useAdminNotificationStore } from '../store/useAdminNotificationStore';

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Inspector Modal
  const [inspectLog, setInspectLog] = useState<AuditLog | null>(null);

  const { addToast } = useAdminNotificationStore();

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await adminAuditService.getAuditLogs({
        search,
        action: actionFilter,
        status: statusFilter,
        page,
        limit: 10,
      });
      setLogs(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (e) {
      addToast('ERROR', 'Failed to retrieve immutable audit ledger.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const columns: Column<AuditLog>[] = [
    {
      header: 'Timestamp & Status',
      cell: (a) => (
        <div>
          <div className="flex items-center gap-1.5">
            <Badge variant={a.status === 'SUCCESS' ? 'success' : a.status === 'WARNING' ? 'warning' : 'danger'} size="sm">
              {a.status}
            </Badge>
          </div>
          <p className="text-[11px] text-warm-brown mt-1">
            {new Date(a.timestamp).toLocaleString()}
          </p>
        </div>
      ),
    },
    {
      header: 'Administrator Operator',
      cell: (a) => (
        <div>
          <p className="font-semibold text-charcoal">{a.adminName}</p>
          <p className="text-[11px] text-warm-brown font-mono">{a.ipAddress}</p>
        </div>
      ),
    },
    {
      header: 'Action & Target',
      cell: (a) => (
        <div>
          <code className="text-xs font-bold text-forest bg-cream/70 px-1.5 py-0.5 rounded">
            {a.action}
          </code>
          <p className="text-[11px] text-warm-brown mt-1">Resource: {a.resource} {a.resourceId ? `(${a.resourceId})` : ''}</p>
        </div>
      ),
    },
    {
      header: 'Audit Modification Summary',
      cell: (a) => (
        <p className="text-xs text-charcoal max-w-sm line-clamp-2 leading-relaxed">
          {a.changesSummary}
        </p>
      ),
    },
    {
      header: 'Details',
      className: 'text-right',
      cell: (a) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setInspectLog(a)}
          title="Inspect Cryptographic Entry"
        >
          <Eye className="w-4 h-4 text-forest" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-soft-beige">
        <div>
          <h1 className="font-serif text-2xl font-bold text-forest">Immutable Administrative Audit Trail</h1>
          <p className="text-xs text-warm-brown mt-0.5">
            Cryptographically sealed operational audit events across patient KYC, role updates, order status, and configuration.
          </p>
        </div>
        <Badge variant="success">Read-Only Append Ledger</Badge>
      </div>

      {/* Filter / Search */}
      <Card className="p-4 bg-white">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <Input
              placeholder="Search by operator name, IP, resource, or summary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <Select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Audit Actions' },
              { value: 'USER_STATUS_CHANGE', label: 'User Status Change' },
              { value: 'USER_DELETION_REVIEW', label: 'Statutory Deletion Review' },
              { value: 'ORDER_STATUS_UPDATE', label: 'Order Status Update' },
              { value: 'CONTENT_PUBLISH', label: 'Content Publication' },
              { value: 'SECURITY_POLICY_UPDATE', label: 'Security Policy Update' },
              { value: 'ADMIN_INVITE', label: 'Admin Account Invitation' },
            ]}
          />

          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Outcome States' },
              { value: 'SUCCESS', label: 'Success' },
              { value: 'WARNING', label: 'Warning' },
              { value: 'FAILURE', label: 'Failure' },
            ]}
          />
        </form>
      </Card>

      {/* Table */}
      <div className="space-y-0">
        <DataTable
          columns={columns}
          data={logs}
          isLoading={isLoading}
          keyExtractor={(a) => a.id}
          emptyMessage="No audit records found matching query parameters."
        />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={total}
          pageSize={10}
        />
      </div>

      {/* Inspector Modal */}
      {inspectLog && (
        <Modal
          isOpen={!!inspectLog}
          onClose={() => setInspectLog(null)}
          title={`Audit Record: ${inspectLog.id}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs text-charcoal">
            <div className="p-3.5 rounded-xl bg-cream/40 border border-sand/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-forest">{inspectLog.action}</span>
                <Badge variant={inspectLog.status === 'SUCCESS' ? 'success' : 'warning'}>
                  {inspectLog.status}
                </Badge>
              </div>
              <p className="text-charcoal font-medium mt-1">{inspectLog.changesSummary}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white border border-sand/60 space-y-1">
                <p className="text-[10px] uppercase font-bold text-warm-brown">Operator</p>
                <p className="font-semibold text-charcoal">{inspectLog.adminName}</p>
                <p className="text-warm-brown">{inspectLog.adminEmail}</p>
                <p className="text-warm-brown">Operator ID: <code className="bg-sand/30 px-1 rounded">{inspectLog.adminId}</code></p>
              </div>

              <div className="p-3 rounded-lg bg-white border border-sand/60 space-y-1">
                <p className="text-[10px] uppercase font-bold text-warm-brown">Network & Device Telemetry</p>
                <p className="font-mono text-charcoal">{inspectLog.ipAddress}</p>
                <p className="text-warm-brown">{inspectLog.userAgent}</p>
                <p className="text-warm-brown">Recorded: {new Date(inspectLog.timestamp).toISOString()}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-warm-brown flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5" />
                <span>Raw Cryptographic Audit Payload</span>
              </p>
              <pre className="p-3 rounded-lg bg-charcoal text-ivory font-mono text-[11px] overflow-x-auto leading-relaxed">
                {JSON.stringify(inspectLog, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setInspectLog(null)}>
                Close Record
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
