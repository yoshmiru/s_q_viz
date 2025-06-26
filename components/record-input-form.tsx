"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProduceItem } from '@/lib/models/produce_item';
import { Transaction } from '@/lib/models/transaction';
import { createClient } from "@/lib/supabase/client";
import { createTransaction } from '@/lib/actions';
import { useTransition } from 'react';

export default function RecordInputForm() {
  const [recordType, setRecordType] = useState<'harvest' | 'purchase'>('harvest');
  const router = useRouter();

  // フォームの状態管理
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState<string>('');
  const [unit, setUnit] = useState('個'); // Default unit
  const [locationDetail, setLocationDetail] = useState(''); // For harvest
  const [cost, setCost] = useState<string>(''); // For purchase
  const [notes, setNotes] = useState('');
  const [produceItems, setProduceItems] = useState<ProduceItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  useEffect(() => {
    const fetchProduceItems = async () => {
      try {
        const { data, error } = await supabase
          .from('produce_items')
          .select('*');

        if (error) {
          console.error("Error fetching produce items:", error);
          alert("品目の取得に失敗しました。");
        } else {
          setProduceItems(data || []);
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        alert("予期せぬエラーが発生しました。");
      }
    };

    fetchProduceItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('supabase_session')).user || null;
    console.log("User session:", user.id);
    const userId = user?.id;
    // transactionsテーブルに登録
    const recordData: Transaction = {
      // ユーザーIDはセッションから取得する必要があります
      user_id: userId || '',
      produce_item_id: produceItems.find(p => p.name_ja === item)?.id || '',
      transaction_type: recordType,
      quantity: parseFloat(quantity),
      unit: unit,
      transaction_date: date,
      notes: notes || null,
      cost: recordType === 'purchase' ? (cost ? parseFloat(cost) : null) : null,
      location_detail: recordType === 'harvest' ? (locationDetail || null) : null,
      created_at: new Date().toISOString(), // 現在の日時をISO 8601形式で保存
    };

    startTransition(async () => {
      const result = await createTransaction(recordData);
      if (result.success) {
        alert("記録しました!");
        router.push('/protected');
      } else {
        alert("記録に失敗しました。");
      }
    })
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex items-center p-4 bg-white shadow-md">
        <button onClick={() => router.back()} className="mr-4 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold flex-grow text-center pr-10">記録する</h1>
      </header>

      <main className="p-4">
        {/* 種別選択 */}
        <div className="flex bg-gray-200 rounded-lg p-1 mb-6">
          <button
            className={`flex-1 py-2 text-center rounded-md ${recordType === 'harvest' ? 'bg-white shadow' : 'text-gray-600'}`}
            onClick={() => setRecordType('harvest')}
          >
            収穫を記録
          </button>
          <button
            className={`flex-1 py-2 text-center rounded-md ${recordType === 'purchase' ? 'bg-white shadow' : 'text-gray-600'}`}
            onClick={() => setRecordType('purchase')}
          >
            購入を記録
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          {/* 日付 */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">日付:</label>
            <input
              type="date"
              id="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* 品目 */}
          <div>
            <label htmlFor="item" className="block text-sm font-medium text-gray-700">品目:</label>
            <select
              id="item"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">品目を選択</option>
              {produceItems.map((produceItem) => (
                <option key={produceItem.id} value={produceItem.name_ja}>
                  {produceItem.name_ja}
                </option>
              ))}
            </select>
          </div>

          {/* 数量と単位 */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">数量:</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="number"
                id="quantity"
                className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="例: 5"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min="0"
              />
              <select
                id="unit"
                className="block rounded-none rounded-r-md border-gray-300 bg-gray-50 py-0 pl-3 pr-7 text-gray-500 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option>個</option>
                <option>g</option>
                <option>kg</option>
                <option>ml</option>
                <option>L</option>
              </select>
            </div>
          </div>

          {recordType === 'harvest' && (
            <>
              {/* 場所 (収穫時のみ) */}
              <div>
                <label htmlFor="locationDetail" className="block text-sm font-medium text-gray-700">場所 (任意):</label>
                <input
                  type="text"
                  id="locationDetail"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="例: ベランダ菜園"
                  value={locationDetail}
                  onChange={(e) => setLocationDetail(e.target.value)}
                />
              </div>
              {/* 写真を追加 (収穫時のみ) */}
              {/* 現時点ではダミーボタン */}
              <div>
                <label className="block text-sm font-medium text-gray-700">写真を追加 (任意):</label>
                <button
                  type="button"
                  className="mt-1 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => alert('写真追加機能は未実装です！')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-4 3 3 5-5V15z" clipRule="evenodd" />
                  </svg>
                  写真を選択 / 撮影
                </button>
              </div>
            </>
          )}

          {recordType === 'purchase' && (
            <>
              {/* 費用 (購入時のみ) */}
              <div>
                <label htmlFor="cost" className="block text-sm font-medium text-gray-700">費用 (任意):</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="number"
                    id="cost"
                    className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="例: 500"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    min="0"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">円</span>
                </div>
              </div>
            </>
          )}

          {/* メモ */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">メモ (任意):</label>
            <textarea
              id="notes"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="今日の料理に使いました"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          {/* 記録するボタン */}
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            記録する
          </button>
        </form>
      </main>
    </div>
  );
}
