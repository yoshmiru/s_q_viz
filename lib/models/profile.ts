export interface Profile {
    id: string;
    display_name: string | null;
    location: string | null;
    created_at: string; // ISO 8601 string
}