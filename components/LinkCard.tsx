import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Pencil } from 'lucide-react';
import { LinkItem } from '../types';

interface LinkCardProps {
  link: LinkItem;
  onDelete: (id: string) => void;
  onEdit: (link: LinkItem) => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onDelete, onEdit }) => {
  // Use custom icon if provided, otherwise fallback to Google's favicon service
  const displayIconUrl = link.iconUrl || `https://www.google.com/s2/favicons?domain=${link.url}&sz=128`;
  const [imgError, setImgError] = useState(false);

  // Reset error state when icon URL changes
  useEffect(() => {
    setImgError(false);
  }, [displayIconUrl]);

  return (
    <div className="group relative flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
      <a 
        href={link.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute inset-0 z-0 rounded-2xl"
        aria-label={link.title}
      />
      
      {/* Action Buttons Container */}
      <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        
        {/* Edit Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onEdit(link);
          }}
          className="p-1.5 rounded-full text-white/50 hover:text-white bg-black/20 hover:bg-blue-500/80 transition-all duration-200 hover:scale-110 backdrop-blur-md"
          title="Edit shortcut"
        >
          <Pencil size={12} strokeWidth={2.5} />
        </button>

        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete(link.id);
          }}
          className="p-1.5 rounded-full text-white/50 hover:text-white bg-black/20 hover:bg-red-500/80 transition-all duration-200 hover:scale-110 backdrop-blur-md"
          title="Delete shortcut"
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      </div>

      {/* Icon Area */}
      <div className="relative w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden shadow-inner p-2 group-hover:bg-white/20 transition-colors pointer-events-none">
        {!imgError ? (
            <img 
                src={displayIconUrl} 
                alt={link.title} 
                className="w-full h-full object-contain filter drop-shadow-sm transition-opacity duration-300"
                onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    // If using custom URL and it fails, try fallback once
                    if (link.iconUrl && img.src === link.iconUrl) {
                         img.src = `https://www.google.com/s2/favicons?domain=${link.url}&sz=128`;
                    } else {
                        // If fallback also fails (or no custom url), show internal fallback icon
                        setImgError(true);
                    }
                }}
            />
        ) : (
            <div className="absolute inset-0 flex items-center justify-center">
                 <ExternalLink className="text-white/20" />
            </div>
        )}
      </div>
      
      <span className="text-sm font-medium text-white/80 group-hover:text-white truncate w-full text-center transition-colors pointer-events-none">
        {link.title}
      </span>
    </div>
  );
};

export default LinkCard;