'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import RecordInputForm from 'components/record-input-form';

export default function ProtectedPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selfSufficiency, setSelfSufficiency] = useState(35);
  const [recentActivities, setRecentActivities] = useState([
    { date: '6/24', type: '自家製', item: 'トマト', quantity: 3, unit: '個' },
    { date: '6/23', type: '購入', item: '鶏むね肉', quantity: 500, unit: 'g' },
  ]);

  return (
    <div>
      {/* Header */}
      {/*
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <div className="text-xl font-bold">アプリ名</div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="focus:outline-none">
              <img src="/notification-icon.png" alt="通知" className="h-6 w-6" />
              */}
              {/* Add a badge here if there are unread notifications
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
          </div>
          <button className="focus:outline-none">
            <img src="/user-icon.png" alt="ユーザーアイコン" className="h-8 w-8 rounded-full" />
          </button>
        </div>
      </header> */}

      {/* 今週の自給率 */}
      <section className="p-4 mt-4 bg-white shadow-md rounded-lg">
        <h2 className="text-lg font-semibold mb-2">今週の自給率</h2>
        <div className="flex flex-col items-center justify-center py-4">
          {/* Placeholder for a circular progress bar or similar */}
          <div className="relative w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(#4CAF50 0% ${selfSufficiency}%, #E0E0E0 ${selfSufficiency}% 100%)`,
              }}
            ></div>
            <div className="text-3xl font-bold z-10">{selfSufficiency}%</div>
          </div>
          <p className="text-center mt-4 text-gray-700">
            {selfSufficiency > 50
              ? "素晴らしい！今週はキュウリとトマトが食卓を彩りましたね！"
              : "あと少しで目標達成！今週も頑張りましょう！"}
          </p>
        </div>
      </section>

      {/* 最近の活動 */}
      <section className="p-4 mt-4 bg-white shadow-md rounded-lg">
        <h2 className="text-lg font-semibold mb-2 cursor-pointer" onClick={() => console.log('Navigate to full history')}>
          最近の食卓 (タップで全履歴へ)
        </h2>
        <ul className="space-y-2">
          {recentActivities.map((activity, index) => (
            <li key={index} className="border-b pb-2 last:border-b-0 cursor-pointer" onClick={() => console.log('Navigate to detail/edit for', activity)}>
              <span className="font-semibold">{activity.date}:</span>{' '}
              <strong>{activity.type}{activity.item}</strong> {activity.quantity}{activity.unit} を記録しました。
            </li>
          ))}
        </ul>
      </section>

      {/* 行動喚起 */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white text-xl font-bold rounded-full w-16 h-16 flex items-center justify-center shadow-lg"
        >
          <span>+ 記録する</span>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <RecordInputForm />
            <div className="p-4 bg-gray-100 border-t border-gray-300">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">閉じる</button>
            </div>
          </div>
        </div>
      )}

      {/* ナビゲーション */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-inner p-4 flex justify-around items-center">
        <nav className="flex justify-around w-full">
          <a href="#" className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600">
            <img src="/home-icon.png" alt="ホーム" className="h-6 w-6" />
            <span>ホーム</span>
          </a>
          <a href="#" className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600">
            <img src="/record-icon.png" alt="記録" className="h-6 w-6" />
            <span>記録</span>
          </a>
          <a href="#" className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600">
            <img src="/report-icon.png" alt="レポート" className="h-6 w-6" />
            <span>レポート</span>
          </a>
          <a href="#" className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600">
            <img src="/settings-icon.png" alt="設定" className="h-6 w-6" />
            <span>設定</span>
          </a>
        </nav>
      </footer>
    </div>
  );
}
