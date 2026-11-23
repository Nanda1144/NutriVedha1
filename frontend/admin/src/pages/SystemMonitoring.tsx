import React, { useState, useEffect } from 'react';
import { Activity, Database, RefreshCw, Server, Zap, CheckCircle2, Clock } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { adminMonitoringService } from '../services/adminMonitoringService';
import { MicroserviceStatus, DatabaseMetrics } from '../types';
import { useAdminNotificationStore } from '../store/useAdminNotificationStore';

export const SystemMonitoring: React.FC = () => {
  const [services, setServices] = useState<MicroserviceStatus[]>([]);
  const [dbMetrics, setDbMetrics] = useState<DatabaseMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pingingId, setPingingId] = useState<string | null>(null);

  const { addToast } = useAdminNotificationStore();

  const loadMonitoring = async () => {
    setIsLoading(true);
    try {
      const [svc, db] = await Promise.all([
        adminMonitoringService.getMicroservices(),
        adminMonitoringService.getDatabaseHealth(),
      ]);
      setServices(svc);
      setDbMetrics(db);
    } catch (e) {
      addToast('ERROR', 'Failed to retrieve telemetry from service mesh.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMonitoring();
  }, []);

  const handlePing = async (id: string, name: string) => {
    setPingingId(id);
    try {
      const res = await adminMonitoringService.pingService(id);
      addToast('SUCCESS', `Ping ${name} OK: ${res.latencyMs}ms`);
      loadMonitoring();
    } catch (e) {
      addToast('ERROR', `Ping to ${name} timed out.`);
    } finally {
      setPingingId(null);
    }
  };

  if (isLoading || !dbMetrics) {
    return (
      <div className="py-20">
        <LoadingSpinner size="lg" text="Polling microservices cluster..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-soft-beige">
        <div>
          <h1 className="font-serif text-2xl font-bold text-forest">System Services Monitoring</h1>
          <p className="text-xs text-warm-brown mt-0.5">
            Live telemetry, latency diagnostics, and connection pool metrics for all 11 decoupled microservices.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<RefreshCw className="w-4 h-4" />}
          onClick={loadMonitoring}
        >
          Refresh Cluster
        </Button>
      </div>

      {/* Database Health Card */}
      <Card className="p-5 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cream text-forest">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-charcoal">PostgreSQL 16 Cluster Health</h3>
              <p className="text-xs text-warm-brown">Normalized multi-tenant database instance (:5432)</p>
            </div>
          </div>
          <Badge variant="success">Cluster Healthy</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-soft-beige text-xs">
          <div>
            <span className="text-[11px] text-warm-brown">Connection Pool</span>
            <p className="font-bold text-charcoal text-sm mt-0.5">{dbMetrics.connectionsActive} / {dbMetrics.connectionsMax} active</p>
          </div>
          <div>
            <span className="text-[11px] text-warm-brown">Query Latency</span>
            <p className="font-bold text-[#047857] text-sm mt-0.5">{dbMetrics.latencyMs} ms</p>
          </div>
          <div>
            <span className="text-[11px] text-warm-brown">Storage Allocated</span>
            <p className="font-bold text-charcoal text-sm mt-0.5">{(dbMetrics.storageUsedMb / 1024).toFixed(2)} GB / 10 GB</p>
          </div>
          <div>
            <span className="text-[11px] text-warm-brown">Cache Hit Ratio</span>
            <p className="font-bold text-[#047857] text-sm mt-0.5">{dbMetrics.cacheHitRatio}%</p>
          </div>
        </div>
      </Card>

      {/* 11 Microservices Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal/60 px-1">
          Decoupled Microservice Topology (11 Services)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc) => (
            <Card key={svc.serviceId} className="p-4 bg-white flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <Badge variant={svc.status === 'HEALTHY' ? 'success' : 'danger'}>
                    {svc.status}
                  </Badge>
                  <span className="text-[11px] font-mono text-warm-brown">Port :{svc.port}</span>
                </div>
                <h4 className="font-bold text-sm text-charcoal leading-tight">{svc.name}</h4>
                <p className="text-[11px] text-warm-brown mt-1">v{svc.version} • Uptime {svc.uptimePct}%</p>
              </div>

              <div className="pt-2 border-t border-soft-beige flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-warm-brown block">Latency</span>
                  <span className="font-bold text-charcoal">{svc.latencyMs} ms</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePing(svc.serviceId, svc.name)}
                  isLoading={pingingId === svc.serviceId}
                >
                  Ping Service
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
