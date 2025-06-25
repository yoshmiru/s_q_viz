CREATE TABLE public.transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    produce_item_id uuid REFERENCES public.produce_items(id) ON DELETE RESTRICT NOT NULL, -- 品目が削除されても記録は残せるように RESTRICT
    transaction_type text NOT NULL, -- 'harvest' (収穫) or 'purchase' (購入)
    quantity numeric NOT NULL,      -- 数量 (例: 5, 200)
    unit text NOT NULL,             -- 単位 (例: '個', 'g')
    transaction_date date NOT NULL, -- 取引日
    notes text,                     -- ユーザーのメモ
    cost numeric,                   -- 購入時の費用 (purchaseの場合)
    location_detail text,           -- 収穫場所の詳細 (例: 'ベランダ菜園', '市民農園A区')
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT chk_transaction_type CHECK (transaction_type IN ('harvest', 'purchase')) -- 型の制約
);

-- RLS の設定
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own transactions." ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions." ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own transactions." ON public.transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own transactions." ON public.transactions FOR DELETE USING (auth.uid() = user_id);
