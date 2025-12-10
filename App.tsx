import React, { useState, useEffect } from 'react';
import { Plus, Settings, Sliders } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import Clock from './components/Clock';
import SearchBar from './components/SearchBar';
import LinkCard from './components/LinkCard';
import LinkModal from './components/AddLinkModal';
import AnimatedBackground from './components/AnimatedBackground';
import { LinkItem, SearchEngine } from './types';
import { INITIAL_LINKS } from './constants';

const App: React.FC = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [currentEngine, setCurrentEngine] = useState<SearchEngine>(SearchEngine.Google);
  
  // Background Settings
  const [particleSpeed, setParticleSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

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

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const newLinks = Array.from(links);
    const [reorderedItem] = newLinks.splice(result.source.index, 1);
    newLinks.splice(result.destination.index, 0, reorderedItem);

    setLinks(newLinks);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center overflow-hidden font-sans text-white selection:bg-purple-500/30">
      
      {/* Dynamic Animated Background */}
      <AnimatedBackground pulseSpeedMultiplier={particleSpeed} />

      {/* Settings Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full transition-all duration-300 ${showSettings ? 'bg-white/20 text-white' : 'text-white/30 hover:text-white hover:bg-white/10'}`}
        >
            <Settings size={20} />
        </button>
        
        {/* Settings Panel */}
        <div className={`absolute top-12 right-0 w-64 bg-[#1e293b]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl transition-all duration-300 origin-top-right ${showSettings ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-white/80">
                <Sliders size={16} />
                <span>Background Effect</span>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/50">
                    <span>Speed</span>
                    <span>{particleSpeed}x</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="5" 
                    step="0.1" 
                    value={particleSpeed} 
                    onChange={(e) => setParticleSpeed(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer hover:bg-white/20 accent-blue-500"
                />
            </div>
        </div>
      </div>

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
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="links" direction="horizontal">
                {(provided) => (
                    <div 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                    >
                        {links.map((link, index) => (
                            <Draggable key={link.id} draggableId={link.id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={provided.draggableProps.style}
                                        className={`transition-shadow duration-200 ${snapshot.isDragging ? 'z-50 scale-105 opacity-90' : ''}`}
                                    >
                                        <LinkCard 
                                            link={link} 
                                            onDelete={handleDeleteLink}
                                            onEdit={openEditModal}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {/* Add Button - Kept as the last item in the grid visually */}
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
                )}
            </Droppable>
          </DragDropContext>
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