import React, { useState } from 'react';
import { Search, Globe, ChevronDown } from 'lucide-react';
import { SearchEngine } from '../types';
import { SEARCH_ENGINES } from '../constants';

interface SearchBarProps {
  currentEngine: SearchEngine;
  onEngineChange: (engine: SearchEngine) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ currentEngine, onEngineChange }) => {
  const [query, setQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const config = SEARCH_ENGINES[currentEngine];
    window.location.href = `${config.url}?${config.queryParam}=${encodeURIComponent(query)}`;
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="w-full max-w-2xl mx-auto relative z-20 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-0 bg-white/20 rounded-full blur-md group-hover:bg-white/30 transition-all duration-300"></div>
        <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl overflow-visible transition-all duration-300 hover:border-white/40 focus-within:bg-white/20 focus-within:border-white/50">
          
          {/* Engine Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={toggleMenu}
              className="flex items-center gap-2 pl-5 pr-3 py-4 text-white/90 hover:text-white transition-colors border-r border-white/10"
            >
              <span className="font-medium text-sm w-12 text-center">
                {SEARCH_ENGINES[currentEngine].name}
              </span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute top-full left-4 mt-2 w-32 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-xl py-1 animate-fade-in">
                {(Object.values(SearchEngine) as SearchEngine[]).map((engine) => (
                  <button
                    key={engine}
                    type="button"
                    onClick={() => {
                      onEngineChange(engine);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      currentEngine === engine
                        ? 'bg-white/20 text-white'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {SEARCH_ENGINES[engine].name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={SEARCH_ENGINES[currentEngine].placeholder}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/50 px-4 text-lg h-14"
            autoFocus
          />

          {/* Search Button */}
          <button
            type="submit"
            className="pr-5 text-white/70 hover:text-white transition-colors"
          >
            <Search size={22} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;