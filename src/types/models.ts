export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'petambak' | 'logistik' | 'konsumen';
    profile_photo?: string;
    token?: string;
    phone?: string;
    address?: string;
    status?: string;
}

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
    nik?: string;
    npwp?: string;
    foto_ktp?: string;
    foto_tambak?: string;
    bank_name?: string;
    bank_account_number?: string;
    bank_account_name?: string;
    profile_photo?: string;
    etalase_photo?: string;
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    metadata?: any;
    created_at?: string;
    updated_at?: string;
}

export interface Logistik {
    id: number;
    name: string;
    email: string;
    phone?: string;
    vehicle_type?: string;
    license_plate?: string;
    profile_photo?: string;
    vehicle_capacity_kg?: number;
    driver_name?: string;
    driver_license_number?: string;
    stnk_photo?: string;
    is_cold_storage?: boolean;
    shipping_cost_per_km?: number;
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    metadata?: any;
    created_at?: string;
    updated_at?: string;
}

export interface Konsumen {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    profile_photo?: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at?: string;
    updated_at?: string;
}

export interface Tambak {
    id: number;
    petambak_id: number;
    nama_tambak: string;
    lokasi: string;
    luas_m2: number;
    kapasitas_maks_kg: number;
    kapasitas_terpakai_kg: number;
    created_at?: string;
    updated_at?: string;
    Petambak?: Petambak;
    BatchUdangs?: BatchUdang[];
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
    kode_batch?: string;
    jumlah_bibit?: number;
    sertifikat_bibit?: string;
    kualitas_air_suhu?: number;
    kualitas_air_do?: number;
    jenis_pakan?: string;
    frekuensi_pakan_per_hari?: number;
    catatan?: string;
    status: 'ACTIVE' | 'HARVESTED' | 'CANCELLED';
    blockchain_hash?: string;
    blockchain_tx_hash?: string;
    previous_hash?: string;
    total_umur_panen_hari?: number;
    metadata?: any;
    created_at?: string;
    updated_at?: string;
    Tambak?: Tambak;
}

export interface UdangProduk {
    id: number;
    batch_id: number;
    jenis_udang: string;
    grade: string;
    harga_per_kg: number;
    stok_kg: number;
    kode_produk?: string;
    size_per_kg?: string;
    metode_panen?: string;
    metode_pendinginan?: string;
    sertifikat_halal?: boolean;
    sertifikat_uji_lab?: string;
    minimum_order_kg?: number;
    expired_date?: string;
    metadata?: any;
    kategori?: 'UTAMA' | 'ECO';
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
    delivery_method: string;
    delivery_address?: string;
    delivery_latitude?: number;
    delivery_longitude?: number;
    delivery_note?: string;
    payment_method: string;
    insurance: boolean;
    expected_delivery_date?: string;
    metadata?: any;
    created_at?: string;
    updated_at?: string;
    Konsumen?: Konsumen;
    OrderItems?: OrderItem[];
    Delivery?: Delivery;
    PaymentLogs?: PaymentLog[];
}

export interface OrderItem {
    id: number;
    order_id: number;
    produk_id: number;
    qty_kg: number;
    harga_per_kg: number;
    subtotal: number;
    catatan?: string;
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
    source: 'ORDER' | 'LOGISTIC_FEE' | 'ADMIN_FEE' | 'WITHDRAWAL';
    reference_id?: string;
    created_at?: string;
}

export interface WithdrawRequest {
    id: number;
    wallet_id: number;
    amount: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    bank_name?: string;
    bank_account_number: string;
    bank_account_name?: string;
    metadata?: any;
    requested_at?: string;
    processed_at?: string;
    User?: User; // Backend might join user
}

export interface PaymentLog {
    id: number;
    order_id: number;
    midtrans_order_id?: string;
    payment_type?: string;
    transaction_status?: string;
    gross_amount?: number;
    paid_at?: string;
    raw_callback_json?: string;
}

export interface ChangeRequest {
    id: number;
    user_id: number;
    role: string;
    target_model: string;
    target_id: number;
    changes: any;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    admin_note?: string;
    reviewed_at?: string;
    created_at?: string;
    updated_at?: string;
}
