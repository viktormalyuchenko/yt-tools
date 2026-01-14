"use client";

import { useState, useMemo, use } from "react"; // Добавили use
import { translations } from "../i18n/translations";
import {
  Search,
  Calendar,
  AlertCircle,
  Info,
  ExternalLink,
  ArrowUpDown,
  Youtube,
  History,
  CheckCircle2,
  Lock,
} from "lucide-react";

// Типизация для параметров
type Props = {
  params: Promise<{ lng: string }>;
};

export default function Page({ params }: Props) {
  // В Next.js 15 params — это Promise, разворачиваем его через use()
  const { lng } = use(params);
  const t = translations[lng] || translations.en;

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [subs, setSubs] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/analyze?url=${encodeURIComponent(input)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error === "SUBS_PRIVATE" ? "private" : "not_found");
        setSubs([]);
      } else {
        setSubs(data);
      }
    } catch {
      setError("error");
    } finally {
      setLoading(false);
    }
  };

  const processedSubs = useMemo(() => {
    let result = [...subs].filter((sub) =>
      sub.snippet.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return result.sort((a, b) => {
      const dateA = new Date(a.snippet.publishedAt).getTime();
      const dateB = new Date(b.snippet.publishedAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [subs, searchQuery, sortOrder]);

  return (
    <div className="min-h-screen bg-[#f9fafb] text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-200">
            <History className="text-white" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            {t.title}
          </h1>
          <p className="text-lg text-slate-500 mb-10">{t.description}</p>

          <form onSubmit={handleAnalyze} className="max-w-xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              className="w-full pl-6 pr-36 py-5 bg-white border-2 border-slate-200 rounded-2xl shadow-sm outline-none focus:border-red-500 transition-all text-lg"
              required
            />
            <button
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-red-600 text-white px-6 rounded-xl font-bold hover:bg-red-700 disabled:bg-slate-300 transition-all"
            >
              {loading ? t.loading : t.analyzeBtn}
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {error === "private" && (
          <div className="mb-8 p-6 bg-amber-50 border-2 border-amber-200 rounded-2xl flex gap-4">
            <Lock className="text-amber-600 shrink-0" size={28} />
            <div>
              <h3 className="font-bold text-amber-900">{t.privateTitle}</h3>
              <p className="text-amber-800 text-sm mt-1">{t.privateDesc}</p>
            </div>
          </div>
        )}

        {subs.length > 0 && (
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-red-500"
              />
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              <ArrowUpDown size={18} />
              {sortOrder === "asc" ? t.sortOld : t.sortNew}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {processedSubs.map((sub) => (
            <a
              key={sub.id}
              href={`https://www.youtube.com/channel/${sub.snippet.resourceId.channelId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white p-4 rounded-2xl border border-slate-200 hover:border-red-500 hover:shadow-xl transition-all flex items-center gap-4 relative"
            >
              <img
                src={sub.snippet.thumbnails.default.url}
                className="w-12 h-12 rounded-full object-cover shadow-sm"
                alt=""
              />
              <div className="min-w-0">
                <h3 className="font-bold text-slate-800 truncate text-sm group-hover:text-red-600 transition-colors">
                  {sub.snippet.title}
                </h3>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                  <Calendar size={12} />
                  {new Date(sub.snippet.publishedAt).toLocaleDateString(
                    lng === "ru" ? "ru-RU" : "en-US"
                  )}
                </p>
              </div>
              <ExternalLink
                className="absolute right-4 text-slate-100 group-hover:text-red-200 transition-colors"
                size={14}
              />
            </a>
          ))}
        </div>

        {subs.length === 0 && !loading && (
          <div className="mt-20">
            <h2 className="text-3xl font-black text-center mb-12">
              {t.howItWorks}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
              <div>
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  1
                </div>
                <h3 className="font-bold mb-2">{t.step1}</h3>
                <p className="text-slate-500 text-sm">{t.step1Desc}</p>
              </div>
              <div>
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  2
                </div>
                <h3 className="font-bold mb-2">{t.step2}</h3>
                <p className="text-slate-500 text-sm">{t.step2Desc}</p>
              </div>
              <div>
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  3
                </div>
                <h3 className="font-bold mb-2">{t.step3}</h3>
                <p className="text-slate-500 text-sm">{t.step3Desc}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-12 text-center text-slate-400 text-sm border-t border-slate-200 mt-20">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}
