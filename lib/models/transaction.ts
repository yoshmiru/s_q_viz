export type TransactionType = 'harvest' | 'purchase';

export interface Transaction {
    id: string;
    user_id: string;
    produce_item_id: string;
    transaction_type: TransactionType;
    quantity: number;
    unit: string;
    transaction_date: string; // YYYY-MM-DD string
    notes: string | null;
    cost: number | null;
    location_detail: string | null;
    created_at: string; // ISO 8601 string
}