// TypeScript interfaces matching backend Sequelize models

export interface Admin {
    id: number;
    name: string;
    email: string;
    profile_photo?: string;
}

export interface Petambak {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    profile_photo?: string;
    etalase_photo?: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface Logistik {
    id: number;
    name: string;
    email: string;
    phone?: string;
    vehicle_type?: string;
    license_plate?: string;
    profile_photo?: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface Konsumen {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    profile_photo?: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface Tambak {
    id: number;
    petambak_id: number;
    nama_tambak: string;
    lokasi: string;
    latitude?: number;
    longitude?: number;
    luas_m2: number;
    kapasitas_maks_kg: number;
    kapasitas_terpakai_kg: number;
    created_at?: string;
    updated_at?: string;
}

export interface BatchUdang {
    id: number;
    tambak_id: number;
    tanggal_tebar: string;
    tanggal_panen?: string;
    usia_bibit_hari: number;
    asal_bibit: string;
    kualitas_air_ph: number;
    kualitas_air_salinitas: number;
    estimasi_panen_kg: number;
    blockchain_hash?: string;
    blockchain_tx_hash?: string;
    created_at?: string;
    updated_at?: string;
    Tambak?: Tambak;
    integrity?: 'VALID' | 'DATA TAMPERED';
}

export interface UdangProduk {
    id: number;
    batch_id: number;
    jenis_udang: string;
    grade: string;
    harga_per_kg: number;
    stok_kg: number;
    status: 'AVAILABLE' | 'SOLD_OUT' | 'ARCHIVED';
    created_at?: string;
    updated_at?: string;
    BatchUdang?: BatchUdang;
}

export interface Order {
    id: number;
    konsumen_id: number;
    status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
    total_harga: number;
    total_jarak_km?: number;
    total_biaya_logistik?: number;
    created_at?: string;
    updated_at?: string;
    Konsumen?: Konsumen;
    OrderItems?: OrderItem[];
    Delivery?: Delivery;
}

export interface OrderItem {
    id: number;
    order_id: number;
    produk_id: number;
    qty_kg: number;
    harga_per_kg: number;
    subtotal: number;
    UdangProduk?: UdangProduk;
}

export interface Delivery {
    id: number;
    order_id: number;
    logistik_id?: number;
    vehicle_id?: string;
    jarak_km?: number;
    biaya_logistik?: number;
    status: 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'DELIVERED' | 'COMPLETED';
    pickup_qr_token?: string;
    receive_qr_token?: string;
    created_at?: string;
    updated_at?: string;
    Order?: Order;
    Logistik?: Logistik;
}

export interface Wallet {
    id: number;
    owner_type: 'ADMIN' | 'PETAMBAK' | 'LOGISTIK';
    owner_id: number;
    balance: number;
    transactions?: WalletTransaction[];
}

export interface WalletTransaction {
    id: number;
    wallet_id: number;
    type: 'CREDIT' | 'DEBIT';
    amount: number;
    source: 'ORDER' | 'LOGISTIC_FEE' | 'ADMIN_FEE' | 'WITHDRAWAL' | 'ORDER_RELEASE' | 'WITHDRAW_REFUND';
    reference_id?: string;
    created_at?: string;
}

export interface WithdrawRequest {
    id: number;
    wallet_id: number;
    amount: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    bank_account: string;
    requested_at?: string;
    processed_at?: string;
}

export interface PaymentLog {
    id: number;
    order_id: number;
    midtrans_order_id: string;
    payment_type?: string;
    transaction_status: string;
    gross_amount: number;
    paid_at?: string;
    raw_callback_json?: string;
}

// User type for auth context
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'petambak' | 'logistik' | 'konsumen';
    token?: string;
}
