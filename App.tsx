import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Clock from './components/Clock';
import SearchBar from './components/SearchBar';
import LinkCard from './components/LinkCard';
import LinkModal from './components/AddLinkModal'; // Note: Using the updated component content
import AnimatedBackground from './components/AnimatedBackground';
import { LinkItem, SearchEngine } from './types';
import { INITIAL_LINKS } from './constants';

const App: React.FC = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [currentEngine, setCurrentEngine] = useState<SearchEngine>(SearchEngine.Google);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  // Load data from local storage on mount
  useEffect(() => {
    const savedLinks = localStorage.getItem('theysh_links');
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    } else {
      setLinks(INITIAL_LINKS);
    }

    const savedEngine = localStorage.getItem('theysh_engine');
    if (savedEngine) {
      setCurrentEngine(savedEngine as SearchEngine);
    }
  }, []);

  // Save links whenever they change
  useEffect(() => {
    localStorage.setItem('theysh_links', JSON.stringify(links));
  }, [links]);

  // Save engine whenever it changes
  useEffect(() => {
    localStorage.setItem('theysh_engine', currentEngine);
  }, [currentEngine]);

  const handleSaveLink = (linkData: LinkItem) => {
    if (editingLink) {
        // Edit mode: update existing
        setLinks(links.map(l => l.id === linkData.id ? linkData : l));
    } else {
        // Add mode: append new
        setLinks([...links, linkData]);
    }
    closeModal();
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const openAddModal = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };

  const openEditModal = (link: LinkItem) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center overflow-hidden font-sans text-white selection:bg-purple-500/30">
      
      {/* Dynamic Animated Background */}
      <AnimatedBackground />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col min-h-screen">
        
        {/* Main Section: Clock & Search */}
        <div className="flex-1 flex flex-col items-center justify-center mb-12 mt-20">
          <Clock />
          <div className="w-full mt-8">
            <SearchBar 
              currentEngine={currentEngine} 
              onEngineChange={setCurrentEngine} 
            />
          </div>
        </div>

        {/* Links Grid Section */}
        <div className="w-full max-w-4xl mx-auto pb-20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {links.map((link) => (
              <LinkCard 
                key={link.id} 
                link={link} 
                onDelete={handleDeleteLink}
                onEdit={openEditModal}
              />
            ))}
            
            {/* Add Button */}
            <button
              onClick={openAddModal}
              className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 border-dashed hover:bg-white/10 hover:border-white/30 transition-all duration-300 h-[100px] group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all">
                <Plus className="text-white/70 group-hover:text-white" />
              </div>
              <span className="text-sm font-medium text-white/50 group-hover:text-white/80 transition-colors">添加</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-xs text-white/30 font-light tracking-widest uppercase hover:text-white/50 transition-colors">
                Theysh.cn &copy; {new Date().getFullYear()}
            </p>
        </div>
      </div>

      <LinkModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSave={handleSaveLink}
        initialData={editingLink}
      />
    </div>
  );
};

export default App;