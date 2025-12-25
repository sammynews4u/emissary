
import React, { useState, useMemo } from 'react';
import { DispatchLog, Category, SendPreference, DeliveryMethod, SupportRequest } from '../types';

interface AdminDashboardProps {
  logs: DispatchLog[];
  supportRequests: SupportRequest[];
  onUpdateStatus: (id: string, status: DispatchLog['status']) => void;
  onUpdateSupportStatus: (id: string, status: SupportRequest['status']) => void;
  onDeleteLog: (id: string) => void;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ logs, supportRequests, onUpdateStatus, onUpdateSupportStatus, onDeleteLog, onClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'stream' | 'support' | 'settings'>('overview');
  const [loginError, setLoginError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const [inspectingLog, setInspectingLog] = useState<DispatchLog | null>(null);

  // Settings
  const [newAdminUser, setNewAdminUser] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const getCredentials = () => {
    const saved = localStorage.getItem('emissary_admin');
    if (saved) return JSON.parse(saved);
    return { user: 'admin', pass: 'admin123' };
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const creds = getCredentials();
    if (username === creds.user && password === creds.pass) {
      setIsLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('emissary_admin', JSON.stringify({ user: newAdminUser, pass: newAdminPass }));
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  const stats = useMemo(() => {
    const total = logs.length;
    const emissaryCount = logs.filter(l => l.preference === SendPreference.EMISSARY).length;
    const revenue = logs.reduce((acc, l) => acc + (l.status === 'Delivered' ? l.amount : 0), 0);
    const pendingRevenue = logs.reduce((acc, l) => acc + (l.status === 'Pending' || l.status === 'Processing' || l.status === 'Sent' ? l.amount : 0), 0);
    
    const catMap: Record<string, number> = {};
    logs.forEach(l => { catMap[l.category] = (catMap[l.category] || 0) + 1; });
    const topCat = Object.entries(catMap).sort((a,b) => (b[1] as number) - (a[1] as number))[0]?.[0] || 'N/A';

    return { total, emissaryCount, revenue, pendingRevenue, topCat, catMap };
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter(l => {
      const matchesSearch = l.recipient.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           l.recipientContact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           l.senderName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'All' || l.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [logs, searchQuery, filterCategory]);

  const getStatusPill = (status: DispatchLog['status']) => {
    switch(status) {
      case 'Pending': return <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[9px] font-black uppercase tracking-widest">Pending</span>;
      case 'Processing': return <span className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse">Processing</span>;
      case 'Sent': return <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-[9px] font-black uppercase tracking-widest">Sent</span>;
      case 'Delivered': return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[9px] font-black uppercase tracking-widest">Delivered</span>;
      case 'Failed': return <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[9px] font-black uppercase tracking-widest">Failed</span>;
      default: return <span className="px-3 py-1 bg-slate-50 text-slate-400 border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest">{status}</span>;
    }
  };

  const renderActionButtons = (log: DispatchLog) => {
    if (log.status === 'Pending') {
      return (
        <button 
          onClick={() => onUpdateStatus(log.id, 'Processing')} 
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
        >
          Begin Process
        </button>
      );
    }
    if (log.status === 'Processing') {
      return (
        <div className="flex gap-2">
          <button 
            onClick={() => onUpdateStatus(log.id, 'Sent')} 
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
          >
            Mark Sent
          </button>
          <button 
            onClick={() => onUpdateStatus(log.id, 'Failed')} 
            className="px-4 py-2 bg-white border border-red-100 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all"
          >
            Fail
          </button>
        </div>
      );
    }
    if (log.status === 'Sent') {
      return (
        <button 
          onClick={() => onUpdateStatus(log.id, 'Delivered')} 
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100"
        >
          Confirm Delivered
        </button>
      );
    }
    if (log.status === 'Delivered' || log.status === 'Failed') {
      return (
        <button 
          onClick={() => onUpdateStatus(log.id, 'Archived')} 
          className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
        >
          Archive
        </button>
      );
    }
    return null;
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xl z-[200] flex items-center justify-center p-4">
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl w-full max-w-md border border-slate-100 animate-in zoom-in duration-300">
          <div className="text-center space-y-4 mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-indigo-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Staff Auth</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Authorized Access Only</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="text" placeholder="Username" className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-medium text-slate-900" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-medium text-slate-900" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {loginError && <p className="text-red-500 text-[10px] font-black uppercase text-center tracking-widest">Invalid Entry</p>}
            <button type="submit" className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-xl transition-all">Unlock System</button>
            <button type="button" onClick={onClose} className="w-full py-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Return to Site</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#F8FAFC] z-[100] flex overflow-hidden font-sans">
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <span className="font-black text-slate-900 uppercase tracking-tighter text-lg">Emissary Admin</span>
          </div>
        </div>

        <nav className="p-6 flex-1 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Insights
          </button>
          <button onClick={() => setActiveTab('stream')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all ${activeTab === 'stream' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            Log Stream
          </button>
          <button onClick={() => setActiveTab('support')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all ${activeTab === 'support' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            Support Inbox {supportRequests.filter(r => r.status === 'New').length > 0 && <span className="ml-auto w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white animate-pulse">!</span>}
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            System Security
          </button>
        </nav>

        <div className="p-8 mt-auto border-t border-slate-100">
          <button onClick={() => setIsLoggedIn(false)} className="w-full text-left text-[10px] font-black uppercase text-red-500 tracking-[0.2em] hover:text-red-600 transition-colors">
            Terminate Session
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            {activeTab === 'overview' ? 'Business Intelligence' : activeTab === 'stream' ? 'Operational Log' : activeTab === 'support' ? 'Support Inbox' : 'Security Matrix'}
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Status</span>
              <span className="text-emerald-500 text-xs font-black uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Secure Connection
              </span>
            </div>
            <button onClick={onClose} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-10">
          {activeTab === 'overview' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Volume</p>
                  <p className="text-4xl font-black text-slate-900">{stats.total}</p>
                </div>
                <div className="bg-indigo-600 p-8 rounded-[2rem] shadow-xl shadow-indigo-100 space-y-2">
                  <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Confirmed Revenue</p>
                  <p className="text-4xl font-black text-white">{stats.revenue.toLocaleString()} ₦</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Pipeline</p>
                  <p className="text-4xl font-black text-emerald-600">{stats.pendingRevenue.toLocaleString()} ₦</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Context</p>
                  <p className="text-xl font-black text-slate-900 truncate">{stats.topCat}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-200 space-y-8">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Category Distribution</h3>
                  <div className="space-y-4">
                    {Object.entries(stats.catMap).sort((a,b) => (b[1] as number) - (a[1] as number)).slice(0, 5).map(([cat, count]) => (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                          <span className="text-slate-600">{cat}</span>
                          <span className="text-slate-400">{count} requests</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${stats.total > 0 ? ((count as number) / (stats.total as number)) * 100 : 0}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-10 rounded-[3rem] border border-slate-200 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">System Integrity Normal</h3>
                  <p className="text-slate-400 text-xs font-medium max-w-[240px]">Real-time AI message processing is operating at 99.8% semantic accuracy.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stream' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <svg className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input type="text" placeholder="Search logs..." className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:border-indigo-500 transition-all font-medium text-slate-900" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <select className="px-6 py-4 rounded-2xl bg-white border border-slate-200 font-bold text-xs uppercase tracking-widest outline-none text-slate-900" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as any)}>
                  <option value="All">All Categories</option>
                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200">
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Point</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Workflow</th>
                      <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/30 transition-all group">
                        <td className="px-8 py-8">
                          <p className="text-sm font-black text-slate-900">{log.recipient}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{log.timestamp}</p>
                        </td>
                        <td className="px-8 py-8">
                          <div className="flex items-center gap-2">
                             <span className={`w-2 h-2 rounded-full ${log.method === DeliveryMethod.EMAIL ? 'bg-indigo-400' : 'bg-emerald-400'}`}></span>
                             <span className="text-xs font-bold text-slate-600">{log.recipientContact}</span>
                          </div>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">{log.method}</p>
                        </td>
                        <td className="px-8 py-8">
                           {getStatusPill(log.status)}
                           <p className="text-[9px] font-black text-slate-300 uppercase mt-2">{log.category}</p>
                        </td>
                        <td className="px-8 py-8 text-right flex items-center justify-end gap-3">
                           <button onClick={() => setInspectingLog(log)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                           {renderActionButtons(log)}
                           <button onClick={() => onDeleteLog(log.id)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 gap-6">
                 {supportRequests.map(req => (
                   <div key={req.id} className={`bg-white p-8 rounded-[2rem] border transition-all ${req.status === 'New' ? 'border-indigo-200 shadow-lg shadow-indigo-50 ring-1 ring-indigo-50' : 'border-slate-200 shadow-sm opacity-80'}`}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${req.status === 'New' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-100 text-slate-400'}`}>
                            {req.name[0]}
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-slate-900 leading-tight">{req.name}</h4>
                            <p className="text-xs text-slate-400 font-bold">{req.email} • {req.timestamp}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                             req.status === 'New' ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 
                             req.status === 'Read' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                             'bg-emerald-50 text-emerald-600 border-emerald-100'
                           }`}>
                             {req.status}
                           </span>
                           <div className="flex gap-2">
                             {req.status !== 'Resolved' && (
                               <button onClick={() => onUpdateSupportStatus(req.id, 'Resolved')} className="text-[10px] font-black text-emerald-600 uppercase hover:text-emerald-700">Mark Resolved</button>
                             )}
                             {req.status === 'New' && (
                               <button onClick={() => onUpdateSupportStatus(req.id, 'Read')} className="text-[10px] font-black text-slate-400 uppercase hover:text-indigo-600">Mark Read</button>
                             )}
                           </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                         <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Subject: {req.subject}</p>
                         <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                           {req.message}
                         </p>
                      </div>
                   </div>
                 ))}
                 {supportRequests.length === 0 && (
                   <div className="py-20 text-center space-y-4 bg-white rounded-[3rem] border border-slate-200 shadow-inner">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Inbox Zero - No Active Support Tickets</p>
                   </div>
                 )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-10 animate-in fade-in slide-in-from-bottom-4">
               <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Access Control</h3>
                    <p className="text-sm text-slate-400">Manage administrative credentials for staff entry.</p>
                  </div>
                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">New Administrative ID</label>
                      <input type="text" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-indigo-50 transition-all font-medium text-slate-900" placeholder="Username" value={newAdminUser} onChange={(e) => setNewAdminUser(e.target.value)} required />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">New Master Key</label>
                      <input type="password" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-indigo-50 transition-all font-medium text-slate-900" placeholder="Password" value={newAdminPass} onChange={(e) => setNewAdminPass(e.target.value)} required />
                    </div>
                    {settingsSuccess && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold text-center animate-bounce uppercase tracking-widest">Protocol Updated Successfully</div>}
                    <button type="submit" className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg shadow-slate-200">Overwrite Credentials</button>
                  </form>
               </div>
            </div>
          )}
        </div>
      </main>

      {inspectingLog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-6">
           <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in duration-300">
              <header className="px-10 py-8 bg-slate-50 flex justify-between items-center border-b border-slate-100">
                <div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">Request #{inspectingLog.id.toUpperCase()}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{inspectingLog.timestamp}</p>
                </div>
                <button onClick={() => setInspectingLog(null)} className="p-3 hover:bg-slate-200 rounded-2xl transition-all">
                   <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </header>
              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Input Context</h5>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                       <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Category</p>
                       <p className="text-slate-900 font-bold mb-4">{inspectingLog.category}</p>
                       <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">The Raw Truth</p>
                       <p className="text-slate-700 italic text-sm leading-relaxed">"{inspectingLog.rawTruth}"</p>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] px-1">Emissary Output</h5>
                    <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 min-h-[160px]">
                       <p className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-widest">Final Transmitted Content</p>
                       <p className="text-slate-900 font-medium text-sm leading-relaxed whitespace-pre-wrap">"{inspectingLog.finalMessage}"</p>
                    </div>
                    <div className="flex flex-col gap-3">
                       {renderActionButtons(inspectingLog)}
                       <button onClick={() => { onUpdateStatus(inspectingLog.id, 'Flagged'); setInspectingLog(null); }} className="w-full py-4 bg-white border border-red-100 text-red-500 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-red-50 transition-all">Flag for Review</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
