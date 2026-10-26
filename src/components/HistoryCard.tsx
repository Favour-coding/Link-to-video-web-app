import React from 'react';
import { History, Trash2, ArrowUpRight, Clock, Film, ListVideo } from 'lucide-react';
import { HistoryItem } from '../types.ts';
import { formatDuration, formatTimeAgo, getPlatformMeta } from '../utils/helpers.ts';

interface HistoryCardProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  onRemoveItem: (id: string) => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({
  history,
  onSelect,
  onClear,
  onRemoveItem,
}) => {
  if (!history || history.length === 0) return null;

  return (
    <div className="w-full max-w-lg mx-auto mt-8 bg-[#0c1429]/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-lg">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-slate-200">
          <History className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            Recent Links ({history.length}/5)
          </h3>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
          title="Clear all download history"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="space-y-2">
        {history.map((item) => {
          const meta = getPlatformMeta(item.platform);
          const isPlaylist = item.type === 'playlist';

          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#070d1d] hover:bg-[#091226] border border-slate-800/60 hover:border-cyan-500/30 transition-all group"
            >
              <div
                onClick={() => onSelect(item)}
                className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
              >
                {/* Thumbnail Preview */}
                <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center relative">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : isPlaylist ? (
                    <ListVideo className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <Film className="w-5 h-5 text-slate-600" />
                  )}
                  {item.duration !== undefined && item.duration > 0 && (
                    <span className="absolute bottom-0.5 right-0.5 text-[9px] font-mono px-1 rounded bg-black/80 text-white">
                      {formatDuration(item.duration)}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${meta.bg}`}
                    >
                      {meta.name}
                    </span>
                    {isPlaylist && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                        Playlist
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {formatTimeAgo(item.timestamp)}
                    </span>
                  </div>
                  <h4 className="text-xs font-medium text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
                    {item.title || item.url}
                  </h4>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  title="Load link"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem(item.id);
                  }}
                  title="Remove from history"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
