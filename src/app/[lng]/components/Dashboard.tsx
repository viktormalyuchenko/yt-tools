"use client";
import { useState } from "react";
import {
  CalendarDays,
  Users,
  Trophy,
  Clock,
  Share2,
  Send,
  Download,
  History,
} from "lucide-react";

export default function Dashboard({
  subs,
  t,
  onReset,
}: {
  subs: any[];
  t: any;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  if (subs.length === 0) return null;

  const total = subs.length;
  const sortedByDate = [...subs].sort(
    (a, b) =>
      new Date(a.snippet.publishedAt).getTime() -
      new Date(b.snippet.publishedAt).getTime(),
  );
  const oldestSub = sortedByDate[0];
  const newestSub = sortedByDate[sortedByDate.length - 1];
  const oldestYear = new Date(oldestSub.snippet.publishedAt).getFullYear();

  const yearsCount = subs.reduce(
    (acc, sub) => {
      const year = new Date(sub.snippet.publishedAt).getFullYear();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const favoriteYear = Object.keys(yearsCount).reduce((a, b) =>
    yearsCount[a] > yearsCount[b] ? a : b,
  );

  // --- Логика шаринга ---
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareMessage =
    t.shareText?.replace("{year}", oldestYear.toString()) ||
    `My oldest sub is from ${oldestYear}!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareMessage}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTelegram = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareMessage)}`;
    window.open(tgUrl, "_blank");
  };

  // --- Логика экспорта в CSV ---
  const handleExportCSV = () => {
    const headers = ["Channel Name", "Subscription Date", "Channel URL"];
    const rows = sortedByDate.map((sub) => [
      `"${sub.snippet.title.replace(/"/g, '""')}"`, // Экранируем кавычки в названиях
      new Date(sub.snippet.publishedAt).toISOString().split("T")[0],
      `https://www.youtube.com/channel/${sub.snippet.resourceId.channelId}`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "youtube_subscriptions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mb-8">
      {/* СТАТИСТИКА */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {/* ... твои 4 карточки из прошлого кода (Users, CalendarDays, Trophy, Clock) оставляем без изменений ... */}
        {/* Карточка 1: Всего подписок */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500 mb-3">
            <Users size={16} />
            <span className="text-sm font-medium">Всего каналов</span>
          </div>
          <div className="text-3xl font-black text-slate-800">{total}</div>
        </div>

        {/* Карточка 2: Любимый год */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500 mb-3">
            <CalendarDays size={16} />
            <span className="text-sm font-medium">Любимый год</span>
          </div>
          <div className="text-3xl font-black text-red-600">{favoriteYear}</div>
          <div className="text-xs text-slate-400 mt-1">
            Больше всего подписок
          </div>
        </div>

        {/* Карточка 3: Самая старая подписка */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between text-white col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 text-slate-400 mb-3">
            <Trophy size={16} className="text-yellow-500" />
            <span className="text-sm font-medium">Первая подписка</span>
          </div>
          <div
            className="truncate font-bold text-lg"
            title={oldestSub.snippet.title}
          >
            {oldestSub.snippet.title}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {new Date(oldestSub.snippet.publishedAt).getFullYear()} год
          </div>
        </div>

        {/* Карточка 4: Самая новая */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 text-slate-500 mb-3">
            <Clock size={16} className="text-blue-500" />
            <span className="text-sm font-medium">Последняя подписка</span>
          </div>
          <div
            className="truncate font-bold text-lg text-slate-800"
            title={newestSub.snippet.title}
          >
            {newestSub.snippet.title}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {new Date(newestSub.snippet.publishedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* ПАНЕЛЬ ДЕЙСТВИЙ (ШАРИНГ И ЭКСПОРТ) */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onReset}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 text-slate-600 px-5 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
        >
          <History size={18} />
          {t.newSearch}
        </button>
        <button
          onClick={handleCopy}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Share2 size={18} />
          {copied ? t.copied : t.copyLink}
        </button>

        <button
          onClick={shareTelegram}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#229ED9] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#1E8CC0] transition-colors shadow-sm"
        >
          <Send size={18} />
          Telegram
        </button>

        <button
          onClick={handleExportCSV}
          className="w-full md:w-auto md:ml-auto flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-xl font-bold hover:bg-green-100 transition-colors"
        >
          <Download size={18} />
          {t.exportCsv || "Export CSV"}
        </button>
      </div>
    </div>
  );
}
