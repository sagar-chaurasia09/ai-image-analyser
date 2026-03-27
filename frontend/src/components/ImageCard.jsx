import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function ImageCard({ result }) {
  const { originalName, description, previewUrl, error, timestamp } = result;

  return (
    <div className="group glass-panel rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fade-in flex flex-col h-full bg-white dark:bg-gray-800">
      
      {/* Image Preview Container */}
      <div className="relative aspect-video w-full bg-gray-100 dark:bg-gray-900 overflow-hidden shrink-0">
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt={originalName} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No preview
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Container */}
      <div className="p-5 p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-3 gap-2">
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 truncate text-lg" title={originalName}>
            {originalName}
          </h4>
          {error ? (
            <AlertCircle className="text-red-500 shrink-0" size={20} />
          ) : (
            <CheckCircle2 className="text-primary-500 shrink-0" size={20} />
          )}
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex-grow mb-4 relative overflow-hidden group/text">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary-500 opacity-50" />
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4 leading-relaxed group-hover/text:line-clamp-none transition-all">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <span>{timestamp ? new Date(timestamp).toLocaleDateString() : 'Just now'}</span>
          {!error && (
            <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
              <CheckCircle2 size={12} /> AI Analyzed
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
