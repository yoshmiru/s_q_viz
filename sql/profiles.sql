-- Supabase Authによって自動的に管理される部分に加え、カスタムプロフィール情報を追加
CREATE TABLE public.profiles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name text,
    location text, -- 例: 'Tokyo', 'Rural' など
    created_at timestamp with time zone DEFAULT now()
);

-- RLS (Row Level Security) の設定を忘れずに！
-- ユーザー自身のみが自分のプロフィールを読み書きできるようにする
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
