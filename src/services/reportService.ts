import api from './api';

export const downloadAdminReport = async () => {
    try {
        const response = await api.get('/reports/admin', {
            responseType: 'blob', // Important for PDF
        });

        // Create a download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Laporan_Admin_CRONOS.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return true;
    } catch (error: any) {
        throw error.response?.data?.message || 'Gagal mengunduh laporan';
    }
};
