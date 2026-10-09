import { useState } from "react";
import type { NavigableItem } from "../../types";

interface VideoTabProps {
  item: NavigableItem;
}

const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5, 2];

export default function VideoTab({ item }: VideoTabProps) {
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* 16:9 Responsive Video Container */}
      <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-black aspect-video shadow-2xl">
        {item.videoUrl ? (
          <iframe
            src={item.videoUrl}
            title={item.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#120f24] to-[#1c1833] p-8 text-center text-white">
            <span className="text-4xl mb-2">🎥</span>
            <h3 className="text-base font-bold">{item.title}</h3>
            <p className="text-xs text-gray-400 max-w-md">{item.summary}</p>
          </div>
        )}
      </div>

      {/* Video Playback Speed + Chapters + Live Transcript Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Chapter Timestamps */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5">
              <span>⏱️</span> Interactive Chapter Timestamps
            </h4>
            <div className="flex items-center gap-1">
              {PLAYBACK_SPEEDS.map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                    playbackSpeed === spd
                      ? "bg-purple-600 text-white"
                      : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {item.timestamps?.map((ts, idx) => (
              <div
                key={idx}
                className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border-soft)] hover:border-purple-500/50 transition-all flex items-center justify-between text-xs cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-purple-400 font-bold bg-purple-500/10 px-1.5 py-0.5 rounded">
                    {ts.time}
                  </span>
                  <span className="font-semibold group-hover:text-purple-300 transition-colors">
                    {ts.label}
                  </span>
                </div>
                <span className="text-[10px] text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity">
                  Jump ▶
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Searchable Transcript */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5">
              <span>📝</span> Video Transcript & Keyword Search
            </h4>
            <input
              type="text"
              placeholder="Search transcript..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border-soft)] text-xs text-[var(--text)] outline-none focus:border-purple-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-soft)] text-xs leading-relaxed text-[var(--muted)] max-h-48 overflow-y-auto">
            <p>{item.transcript}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
