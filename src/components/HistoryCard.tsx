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
    <section id="recent-links" className="w-full max-w-2xl mx-auto mt-8 px-4">
      <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#1B2742] shadow-xl">
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#1B2742]">
          <div className="flex items-center gap-2.5 text-[#E8EEFF]">
            <div className="w-7 h-7 rounded-lg bg-[#070B16] border border-[#1B2742] flex items-center justify-center text-[#00C2FF]">
              <History className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
              Recent Links ({history.length}/5)
            </h3>
          </div>

          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 text-xs text-[#8A97B8] hover:text-[#F43F5E] transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-[#1B2742]/40"
            title="Clear all recent links"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {history.map((item) => {
            const meta = getPlatformMeta(item.platform);
            const isPlaylist = item.type === 'playlist';

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#070B16]/80 hover:bg-[#070B16] border border-[#1B2742] hover:border-[#3B82F6]/40 transition-all duration-200 group"
              >
                <div
                  onClick={() => onSelect(item)}
                  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                >
                  {/* Thumbnail Preview */}
                  <div className="w-12 h-12 rounded-lg bg-[#0E1526] border border-[#1B2742] overflow-hidden shrink-0 flex items-center justify-center relative">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    ) : isPlaylist ? (
                      <ListVideo className="w-5 h-5 text-[#00C2FF]" />
                    ) : (
                      <Film className="w-5 h-5 text-[#8A97B8]" />
                    )}
                    {item.duration !== undefined && item.duration > 0 && (
                      <span className="absolute bottom-0.5 right-0.5 text-[9px] font-mono px-1 rounded bg-black/85 text-white">
                        {formatDuration(item.duration)}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${meta.bg}`}
                      >
                        {meta.name}
                      </span>
                      {isPlaylist && (
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#7A3CFF]/20 text-[#00C2FF] border border-[#7A3CFF]/40">
                          Playlist
                        </span>
                      )}
                      <span className="text-[10px] text-[#8A97B8] flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {formatTimeAgo(item.timestamp)}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-medium text-[#E8EEFF] truncate group-hover:text-[#00C2FF] transition-colors">
                      {item.title || item.url}
                    </h4>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    title="Load and fetch link"
                    className="min-h-[36px] min-w-[36px] flex items-center justify-center p-2 rounded-lg text-[#8A97B8] hover:text-[#00C2FF] hover:bg-[#1B2742] transition-colors cursor-pointer"
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
                    className="min-h-[36px] min-w-[36px] flex items-center justify-center p-2 rounded-lg text-[#8A97B8] hover:text-[#F43F5E] hover:bg-[#1B2742] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
