"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement login logic here
    console.log('Login attempt with:', { email, password });
    alert('Login button clicked!');
  };

  const handleSocialLogin = (provider: string) => {
    // Implement social login logic here
    console.log(`Continue with ${provider}`);
    alert(`Continue with ${provider} clicked!`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* App Name and Message */}
        <div className="text-center mb-8">
          {/* Replace with your app logo/illustration */}
          <img src="/app-logo.png" alt="App Logo" className="mx-auto h-24 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">アプリ名</h1>
          <p className="text-gray-600">あなたの食料自給率を楽しく可視化しよう！</p>
          <p className="text-gray-600">今日から始める、食の自律への第一歩。</p>
        </div>

        {/* Login / New Registration Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="your@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ログイン
          </button>
          <div className="text-center">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              パスワードをお忘れですか？
            </Link>
          </div>
        </form>

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">または</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => handleSocialLogin('Google')}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <img src="/google-icon.png" alt="Google Icon" className="h-5 w-5 mr-2" />
            Googleで続ける
          </button>
          <button
            onClick={() => handleSocialLogin('GitHub')}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <img src="/github-icon.png" alt="GitHub Icon" className="h-5 w-5 mr-2" />
            GitHubで続ける
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-gray-600">
        <Link href="/privacy-policy" className="hover:underline mx-2">
          プライバシーポリシー
        </Link>
        <Link href="/terms-of-service" className="hover:underline mx-2">
          利用規約
        </Link>
      </footer>
    </div>
  );
}
