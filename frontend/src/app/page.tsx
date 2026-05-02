"use client";

import { useState } from "react";
import { Link2, Copy, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Home() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError("");
    setShortUrl("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await axios.post(`${apiUrl}/api/shorten`, { url, alias });
      setShortUrl(response.data.shortUrl);
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 overflow-hidden relative bg-white">
      {/* Background Glows (Soft Sky Blue) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-100/50 blur-[140px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-50/40 blur-[140px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-2xl"
      >
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-100 mb-6"
          >
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span className="text-xs font-bold text-sky-600 tracking-wider uppercase">Next Gen Shortener</span>
          </motion.div>
          <h1 className="text-6xl sm:text-7xl font-black tracking-tighter mb-4 text-slate-900">
            Z-SHORT
          </h1>
          <p className="text-slate-500 text-lg sm:text-xl font-medium">
            Make your links <span className="text-sky-500 font-bold">fast</span>, <span className="text-sky-500 font-bold">clean</span>, and <span className="text-sky-500 font-bold">dynamic</span>.
          </p>
        </div>

        <div className="glass rounded-[3rem] p-8 sm:p-12 border-sky-100 text-slate-900">
          <form onSubmit={handleShorten} className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Link2 className="w-6 h-6 text-sky-400 group-focus-within:text-sky-500 transition-colors" />
              </div>
              <input
                type="url"
                placeholder="Paste your long URL here..."
                required
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-5 text-lg focus:outline-none focus:border-sky-400/50 focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:text-slate-300 text-slate-900 font-medium"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                 <input
                  type="text"
                  placeholder="Custom alias (optional)"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 px-6 text-lg focus:outline-none focus:border-sky-400/50 focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:text-slate-300 text-slate-900 font-medium"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all active:scale-95 shadow-xl shadow-sky-500/20 uppercase tracking-widest"
              >
                {loading ? "..." : "Shorten"}
              </button>
            </div>
          </form>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-red-500 text-sm text-center font-bold"
            >
              {error}
            </motion.p>
          )}

          <AnimatePresence>
            {shortUrl && (
              <motion.div
                initial={{ opacity: 0, height: 0, mt: 0 }}
                animate={{ opacity: 1, height: "auto", mt: 32 }}
                exit={{ opacity: 0, height: 0, mt: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-sky-50 border border-sky-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col gap-1 w-full truncate">
                    <span className="text-[10px] uppercase tracking-widest text-sky-400 font-bold">Your Short Link</span>
                    <span className="text-xl font-bold text-sky-600 truncate">{shortUrl}</span>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 bg-sky-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-sky-600 transition-colors active:scale-95 whitespace-nowrap shadow-lg shadow-sky-500/20"
                  >
                    {copied ? (
                      <><Check className="w-5 h-5" /> COPIED</>
                    ) : (
                      <><Copy className="w-5 h-5" /> COPY</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
}
