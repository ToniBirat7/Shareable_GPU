'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [status, setStatus] = useState({
    online: false,
    peer_id: 'Disconnected',
    device: 'Loading...',
    cuda: false,
    peers: 0
  });

  const fetchStatus = async () => {
    try {
      const res = await fetch('http://localhost:8000/status');
      if (res.ok) {
        const data = await res.json();
        setStatus({
          online: true,
          peer_id: data.peer_id,
          device: data.device,
          cuda: data.cuda_available,
          peers: data.visible_peers
        });
      } else {
        setStatus(prev => ({ ...prev, online: false }));
      }
    } catch (err) {
      setStatus(prev => ({ ...prev, online: false }));
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold gradient-text">DSCP Protocol</h1>
          <p className="text-gray-400 mt-1">Decentralized Shareable Compute Protocol</p>
        </div>
        <div className="glass-card flex items-center gap-3 py-2 px-4 rounded-full">
          <span className={`status-indicator ${status.online ? 'status-online' : 'status-offline'}`}></span>
          <span className="text-sm font-medium">Node: {status.online ? 'Active' : 'Offline'}</span>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Node Identity Card */}
        <div className="glass-card col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-white">Local Node Identity</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Peer ID</label>
              <p className="font-mono text-sm bg-black/40 p-2 rounded mt-1 border border-white/5 break-all">
                {status.peer_id}
              </p>
            </div>
            <div className="flex gap-8">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Device</label>
                <p className="font-medium mt-1">{status.device}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Acceleration</label>
                <p className={`mt-1 font-semibold ${status.cuda ? 'text-green-400' : 'text-red-400'}`}>
                  {status.cuda ? 'CUDA Enabled' : 'CPU Mode'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Swarm Metrics Card */}
        <div className="glass-card">
          <h2 className="text-xl font-semibold mb-4 text-white">Swarm Metrics</h2>
          <div className="flex flex-col items-center justify-center h-full pb-4">
            <div className="text-6xl font-bold text-violet-400 mb-2">{status.peers}</div>
            <p className="text-gray-400">Total Peers Connected</p>
            <div className="w-full h-1 bg-white/5 rounded-full mt-6 overflow-hidden">
              <div className="h-full bg-violet-500 w-1/3 shadow-[0_0_10px_#7c3aed]"></div>
            </div>
          </div>
        </div>

        {/* Compute Load - Placeholder */}
        <div className="glass-card col-span-1 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-6 text-white">Compute Activity</h2>
          <div className="flex items-center justify-center p-12 border-2 border-dashed border-white/5 rounded-xl">
            <div className="text-center">
              <p className="text-gray-500 italic mb-2">"Waiting for training sequence..."</p>
              <button
                disabled={!status.online}
                className={`px-6 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Initiate Swarm Participation
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <footer className="mt-12 pt-8 border-t border-white/5 flex justify-between text-xs text-gray-600">
        <p>Phase 1: Research & Local Validation</p>
        <p>Start-sys | Shareable GPU Infrastructure</p>
      </footer>
    </main>
  );
}
