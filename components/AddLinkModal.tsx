import React, { useState, useEffect } from 'react';
import { X, Globe, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { LinkItem } from '../types';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: LinkItem) => void;
  initialData?: LinkItem | null;
}

const LinkModal: React.FC<LinkModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [iconUrl, setIconUrl] = useState('');

  // Reset or populate form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setUrl(initialData.url);
        setIconUrl(initialData.iconUrl || '');
      } else {
        setTitle('');
        setUrl('');
        setIconUrl('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && url) {
        let formattedUrl = url;
        if (!/^https?:\/\//i.test(url)) {
            formattedUrl = 'https://' + url;
        }
        
        onSave({
            id: initialData ? initialData.id : Date.now().toString(),
            title,
            url: formattedUrl,
            iconUrl: iconUrl.trim() || undefined
        });
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl p-6 animate-fade-in text-white overflow-hidden">
        {/* Header Background Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            {initialData ? '编辑快捷方式' : '添加快捷方式'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-white/60 font-medium ml-1">名称</label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                    <Globe size={16} />
                </div>
                <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如: GitHub"
                className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-black/40 transition-all text-sm"
                autoFocus
                />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-white/60 font-medium ml-1">网址</label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                    <LinkIcon size={16} />
                </div>
                <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="例如: github.com"
                className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-black/40 transition-all text-sm"
                />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-white/60 font-medium ml-1 flex justify-between">
                <span>图标链接 (可选)</span>
            </label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                    <ImageIcon size={16} />
                </div>
                <input
                type="text"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-black/40 transition-all text-sm"
                />
            </div>
            <p className="text-[10px] text-white/30 ml-1">如果不填写，将自动获取网站图标。</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={!title || !url}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 active:scale-[0.98]"
            >
              {initialData ? '保存修改' : '立即添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkModal;