/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Shield, Database, Layout, Terminal, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { LoggerProvider, useLogger } from '../ts-sdk/src/react/useLogger';
import { Level } from '../ts-sdk/src/core/enums';

function Dashboard() {
  const logger = useLogger();
  const [logs, setLogs] = useState<any[]>([]);

  // Intercept console.log for demo display
  useEffect(() => {
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      originalLog(...args);
      if (args[0]?.includes('%c[')) {
        const layer = args[0].match(/\[(.*?)\]/)?.[1] || 'UNKNOWN';
        const message = args[0].replace(/%c\[.*?\] /g, '');
        const data = args[2];
        setLogs(prev => [{ layer, message, ...data }, ...prev].slice(0, 50));
      }
    };
    return () => { console.log = originalLog; };
  }, []);

  const triggerDomainEvent = () => {
    logger.info("Order Processed Successfully", {
      layer: "DOMAIN",
      event_name: "order_placed",
      entity_type: "Order",
      entity_id: "ORD-" + Math.floor(Math.random() * 1000),
      prev_state: "pending",
      next_state: "confirmed"
    });
  };

  const triggerSecurityAlert = () => {
    logger.error("Multiple Failed Login Attempts Detected", {
      layer: "SECURITY",
      event_type: "AUTH_FAIL",
      actor_id: "user_123",
      action: "LOGIN",
      ip: "192.168.1.1"
    });
  };

  const triggerUIInteraction = (btnName: string) => {
    logger.logClick(btnName, { variant: 'primary' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              <Activity className="text-emerald-500 w-10 h-10" />
              mylogger
            </h1>
            <p className="text-slate-400 mt-2 text-lg">Universal DDD-Integrated Logging Infrastructure</p>
          </div>
          <div className="flex gap-3">
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">Python SDK Ready</div>
            <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">TypeScript SDK Active</div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <section className="space-y-6 lg:col-span-1">
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                Trigger Contexts
              </h2>
              
              <div className="grid gap-4">
                <button 
                  onClick={() => triggerDomainEvent()}
                  className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-emerald-400" />
                    <span className="font-medium">Emit Business Event</span>
                  </div>
                  <Send className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button 
                  onClick={() => triggerSecurityAlert()}
                  className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-red-400" />
                    <span className="font-medium">Trigger Security Audit</span>
                  </div>
                  <Send className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button 
                  onClick={() => triggerUIInteraction('Dashboard')}
                  className="flex items-center justify-between p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Layout className="w-5 h-5 text-blue-400" />
                    <span className="font-medium">Track Presentation</span>
                  </div>
                  <Send className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">System Identity</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Environment</span>
                    <span className="text-emerald-400 font-mono italic">production</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Service</span>
                    <span className="text-blue-400 font-mono">checkout-service</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Live Stream */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-semibold text-white">Consolidated Stream</h2>
              <span className="text-xs text-slate-500 font-mono">{logs.length} events processed</span>
            </div>
            
            <div className="bg-black/40 rounded-2xl border border-slate-800 min-h-[500px] max-h-[600px] overflow-y-auto p-4 custom-scrollbar">
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {logs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 py-20">
                      <Terminal className="w-12 h-12 mb-4 opacity-20" />
                      <p>Waiting for domain events...</p>
                    </div>
                  ) : logs.map((log) => (
                    <motion.div
                      key={log.record_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center gap-4 group hover:border-slate-700 transition-colors"
                    >
                      <div className={`w-1 h-8 rounded-full ${
                        log.layer === 'DOMAIN' ? 'bg-emerald-500' : 
                        log.layer === 'SECURITY' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            log.layer === 'DOMAIN' ? 'bg-emerald-500/10 text-emerald-400' : 
                            log.layer === 'SECURITY' ? 'bg-red-500/10 text-red-500' : 
                            'bg-blue-500/10 text-blue-400'
                          }`}>
                            {log.layer}
                          </span>
                          <span className="text-[10px] font-mono text-slate-600 truncate">
                            {log.record_id}
                          </span>
                        </div>
                        <p className="text-sm text-slate-200 font-medium truncate">{log.message}</p>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                        <div className="flex flex-col items-end">
                          <span className="text-slate-400">{log.level === 20 ? 'INFO' : 'ERROR'}</span>
                          <time className="text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</time>
                        </div>
                        {log.level >= 40 ? <AlertCircle className="w-5 h-5 text-red-500" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LoggerProvider config={{ service: "checkout-service", env: "production" }}>
      <Dashboard />
    </LoggerProvider>
  );
}
