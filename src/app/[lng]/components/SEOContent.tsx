import { HelpCircle, BookOpen, ShieldCheck } from "lucide-react";

export default function SEOContent({ t }: { t: any }) {
  return (
    <div className="mt-24 max-w-4xl mx-auto border-t border-slate-200 pt-16 pb-20 px-4">
      {/* FAQ Section */}
      <h2 className="text-3xl font-black text-center mb-12 flex items-center justify-center gap-3">
        <HelpCircle className="text-red-600" size={32} />
        {t.faqTitle}
      </h2>

      <div className="grid gap-8 mb-20">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-2 text-slate-800 tracking-tight">
            {t.faq1Q}
          </h3>
          <p className="text-slate-600 leading-relaxed">{t.faq1A}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-2 text-slate-800 tracking-tight">
            {t.faq2Q}
          </h3>
          <p className="text-slate-600 leading-relaxed">{t.faq2A}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-2 text-slate-800 tracking-tight">
            {t.faq3Q}
          </h3>
          <p className="text-slate-600 leading-relaxed">{t.faq3A}</p>
        </div>
      </div>

      {/* SEO Article Section */}
      <div className="prose prose-slate max-w-none bg-slate-100/50 p-8 md:p-12 rounded-3xl border border-slate-200">
        <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-slate-900">
          <BookOpen className="text-red-600" />
          {t.seoTextTitle}
        </h2>
        <p className="text-slate-600 text-lg leading-relaxed mb-6">
          {t.seoTextP1}
        </p>
        <p className="text-slate-600 text-lg leading-relaxed">{t.seoTextP2}</p>

        <div className="mt-8 flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
          <ShieldCheck size={16} />
          100% Privacy Focused
        </div>
      </div>
    </div>
  );
}
