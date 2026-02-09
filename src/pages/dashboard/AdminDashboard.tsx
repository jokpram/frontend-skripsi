import { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Check, X, User, DollarSign, Users, TrendingUp, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminPendingUsers, useVerifyUser } from '../../hooks/api/useOrders';
import { useMyWallet, useWithdrawRequests, useProcessWithdraw } from '../../hooks/api/useWallet';
import { downloadAdminReport } from '../../services/reportService';
import type { WithdrawRequest } from '../../types/models';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const { data: pendingUsers = [], isLoading: loadingUsers } = useAdminPendingUsers();
    const { data: withdrawRequests = [], isLoading: loadingWithdraws } = useWithdrawRequests();
    const { data: wallet, isLoading: loadingWallet } = useMyWallet();
    const [isDownloading, setIsDownloading] = useState(false);

    const verifyMutation = useVerifyUser();
    const processWithdrawMutation = useProcessWithdraw();

    const [activeTab, setActiveTab] = useState<'users' | 'withdrawals'>('users');

    const handleDownloadReport = async () => {
        setIsDownloading(true);
        try {
            await downloadAdminReport();
            toast.success('Laporan berhasil diunduh');
        } catch (error: any) {
            toast.error(error);
        } finally {
            setIsDownloading(false);
        }
    };

    const formatCurrency = (amount: number) => `Rp ${Number(amount).toLocaleString('id-ID')}`;

    const stats = [
        { label: 'Escrow Balance', value: wallet ? formatCurrency(wallet.balance) : 'Rp 0', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { label: 'Pending Users', value: pendingUsers.length, icon: Users, color: 'text-amber-600', bg: 'bg-amber-100' },
        { label: 'Pending Withdrawals', value: withdrawRequests.filter((w: any) => w.status === 'PENDING').length, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    ];

    if (loadingUsers || loadingWithdraws || loadingWallet) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 pt-24 pb-12 min-h-screen bg-slate-50">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Admin Dashboard</h1>
                    <p className="text-slate-500 text-lg">Kelola pengguna, verifikasi, dan penarikan dana terpusat.</p>
                </div>
                <Button
                    onClick={handleDownloadReport}
                    disabled={isDownloading}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/20"
                >
                    {isDownloading ? (
                        <>Downloading...</>
                    ) : (
                        <>
                            <FileText size={20} /> Unduh Laporan PDF
                        </>
                    )}
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {stats.map((stat, i) => (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6">
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={32} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex bg-slate-200/50 p-1.5 rounded-2xl mb-8 w-fit shadow-inner">
                <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'users' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500'}`}>
                    <User size={18} /> Verifikasi User ({pendingUsers.length})
                </button>
                <button onClick={() => setActiveTab('withdrawals')} className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'withdrawals' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500'}`}>
                    <DollarSign size={18} /> Penarikan Dana ({withdrawRequests.filter((w) => w.status === 'PENDING').length})
                </button>
            </div>

            {activeTab === 'users' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingUsers.map((user: any, i: number) => (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} key={user.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
                                    <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest mt-2">{user.role}</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button onClick={() => verifyMutation.mutate({ userId: user.id, role: user.role, action: 'approve' })} className="flex-1" disabled={verifyMutation.isPending}>
                                    Setujui
                                </Button>
                                <Button variant="outline" onClick={() => verifyMutation.mutate({ userId: user.id, role: user.role, action: 'reject' })} className="flex-1 text-red-500 border-red-200" disabled={verifyMutation.isPending}>
                                    Tolak
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 text-xs font-black text-slate-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-5 text-left">Jumlah</th>
                                <th className="px-8 py-5 text-left">Rekening</th>
                                <th className="px-8 py-5 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 italic">
                            {withdrawRequests.filter((w) => w.status === 'PENDING').map((wr: WithdrawRequest) => (
                                <tr key={wr.id}>
                                    <td className="px-8 py-6 text-lg font-black text-emerald-600">{formatCurrency(wr.amount)}</td>
                                    <td className="px-8 py-6 font-medium text-slate-600">{wr.bank_account}</td>
                                    <td className="px-8 py-6 flex gap-2 justify-center">
                                        <button onClick={() => processWithdrawMutation.mutate({ id: wr.id, action: 'APPROVED' })} className="p-3 bg-emerald-100 text-emerald-600 rounded-xl" disabled={processWithdrawMutation.isPending}>
                                            <Check size={20} />
                                        </button>
                                        <button onClick={() => processWithdrawMutation.mutate({ id: wr.id, action: 'REJECTED' })} className="p-3 bg-red-100 text-red-600 rounded-xl" disabled={processWithdrawMutation.isPending}>
                                            <X size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
