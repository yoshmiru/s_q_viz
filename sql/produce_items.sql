CREATE TABLE public.produce_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name_ja text NOT NULL UNIQUE, -- 例: 'トマト', 'キュウリ'
    category text NOT NULL,        -- 例: '野菜', '果物', '穀物', '畜産物'
    main_unit text NOT NULL,       -- 例: '個', 'g', 'kg', 'ml' (主要な記録単位)
    is_active boolean DEFAULT TRUE -- 現在利用可能か
    -- 必要に応じて、一般的な栄養情報やカロリー、一般的な購入単価などを追加
);
