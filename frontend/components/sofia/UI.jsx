import { useRef, useState, useEffect } from "react";
import { useChat } from "./hooks/useChat";
import {
  FaMicrophone, FaUserEdit, FaCamera, FaSync, FaTv, FaImage,
  FaPlus, FaEye, FaSlidersH, FaUndo, FaPalette, FaKey,
  FaCog, FaPaintBrush, FaChevronRight, FaChevronDown,
  FaArrowsAlt, FaExpandAlt, FaTimes, FaExternalLinkAlt
} from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { ReadyPlayerMe } from "./ReadyPlayerMe";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_BACKGROUNDS = [
  { id: 'cyber', name: 'Cyberpunk', url: '/src/assets/cyberpunk_bg_1770198228206.png' },
  { id: 'luxury', name: 'Luxury', url: '/src/assets/luxury_apartment_bg_1770198247119.png' },
  { id: 'scifi', name: 'Sci-Fi', url: '/src/assets/sci_fi_lab_bg_1770198263878.png' },
  { id: 'nature', name: 'Nature', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80' },
];

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const fileInput = useRef();
  const chatRef = useRef();

  // Navigation Menus
  const [activeMenu, setActiveMenu] = useState(null); // 'appearance', 'settings'

  const [isListening, setIsListening] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isBgSelectorOpen, setIsBgSelectorOpen] = useState(false);
  const [isTrackingSettingsOpen, setIsTrackingSettingsOpen] = useState(false);
  const [isCaptionSettingsOpen, setIsCaptionSettingsOpen] = useState(false);
  const [isApiKeySettingsOpen, setIsApiKeySettingsOpen] = useState(false);

  const {
    chat, loading, cameraZoomed, setCameraZoomed, message,
    backgroundUrl, setBackgroundUrl, cursorFollow, setCursorFollow,
    headSensitivity, setHeadSensitivity, eyeSensitivity, setEyeSensitivity,
    currentWordIndex, captionTextColor, setCaptionTextColor,
    captionBgColor, setCaptionBgColor, captionHighlightColor, setCaptionHighlightColor,
    groqApiKey, setGroqApiKey,
    isCaptionMoveMode, setIsCaptionMoveMode,
    captionPosition, setCaptionPosition,
    captionWidth, setCaptionWidth,
    visualAssets, suggestions,
    stopResponse, isPlaying
  } = useChat();

  const sendMessage = (text) => {
    if (!groqApiKey) {
      setIsApiKeySettingsOpen(true);
      return;
    }
    if (!loading && !message && text && text.trim()) {
      chat(text);
      if (input.current) {
        input.current.value = "";
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim()) {
          if (input.current) {
            input.current.value = transcript;
          }
          setTimeout(() => {
            sendMessage(transcript);
          }, 1500);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  if (hidden) return null;

  return (
    <div className="fixed inset-0 z-10 flex flex-col justify-between p-6 pointer-events-none select-none">
      <ReadyPlayerMe isOpen={isCustomizerOpen} onClose={() => setIsCustomizerOpen(false)} />

      {/* Top Section: Branding & Status */}
      <div className="flex justify-between items-start w-full">
        <div className="flex flex-col space-y-2 pointer-events-auto">
          <div className="backdrop-blur-xl bg-black/40 border border-white/10 p-5 rounded-3xl shadow-2xl flex flex-col max-w-xs animate-in slide-in-from-top-4 duration-700">
            <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent leading-tight">
              Sofia.AI
            </h1>
            <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase">Companion V2.0</p>
            <div className="mt-3 flex items-center space-x-2">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[9px] text-green-400 font-bold uppercase tracking-widest">Neural Link Active</span>
            </div>
          </div>
        </div>

        {/* Grouped Sidebar Menu */}
        <div className="flex flex-col space-y-3 pointer-events-auto animate-in slide-in-from-right-4 duration-700">
          {/* Appearance Menu Group */}
          <div className="relative group/menu flex flex-col items-end">
            <button
              onClick={() => setActiveMenu(activeMenu === 'appearance' ? null : 'appearance')}
              className={`w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl transition-all duration-300 shadow-lg ${activeMenu === 'appearance' ? 'text-pink-400 border-pink-500/30' : 'text-white/80'}`}
              title="Appearance"
            >
              <FaPaintBrush className="w-5 h-5" />
            </button>
            <AnimatePresence>
              {activeMenu === 'appearance' && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: -60, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  className="absolute top-0 flex flex-col space-y-2"
                >
                  <button onClick={() => setIsCustomizerOpen(true)} className="w-10 h-10 flex items-center justify-center bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl text-white/60 hover:text-white" title="Avatar"><FaUserEdit /></button>
                  <button onClick={() => setIsBgSelectorOpen(true)} className="w-10 h-10 flex items-center justify-center bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl text-white/60 hover:text-white" title="Background"><FaImage /></button>
                  <button onClick={() => setCameraZoomed(!cameraZoomed)} className={`w-10 h-10 flex items-center justify-center bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl ${cameraZoomed ? 'text-purple-400' : 'text-white/60 hover:text-white'}`} title="Zoom"><FaCamera /></button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings Menu Group */}
          <div className="relative group/menu flex flex-col items-end">
            <button
              onClick={() => setActiveMenu(activeMenu === 'settings' ? null : 'settings')}
              className={`w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl transition-all duration-300 shadow-lg ${activeMenu === 'settings' ? 'text-blue-400 border-blue-500/30' : 'text-white/80'}`}
              title="Settings"
            >
              <FaCog className="w-5 h-5" />
            </button>
            <AnimatePresence>
              {activeMenu === 'settings' && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: -60, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  className="absolute top-0 flex flex-col space-y-2"
                >
                  <button onClick={() => setCursorFollow(!cursorFollow)} className={`w-10 h-10 flex items-center justify-center bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl ${cursorFollow ? 'text-green-400' : 'text-white/60 hover:text-white'}`} title="Follow Cursor"><FaEye /></button>
                  <button onClick={() => setIsTrackingSettingsOpen(true)} className="w-10 h-10 flex items-center justify-center bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl text-white/60 hover:text-white" title="Sensitivity"><FaSlidersH /></button>
                  <button onClick={() => setIsCaptionSettingsOpen(true)} className="w-10 h-10 flex items-center justify-center bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl text-white/60 hover:text-white" title="Caption Style"><FaPalette /></button>
                  <button onClick={() => setIsApiKeySettingsOpen(true)} className="w-10 h-10 flex items-center justify-center bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl text-white/60 hover:text-white" title="API Key"><FaKey /></button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* System Utils */}
          <div className="flex flex-col space-y-2 pt-2 border-t border-white/5">
            <button
              onClick={() => document.body.classList.toggle("greenScreen")}
              className="w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl text-white/60 hover:text-green-400 transition-all shadow-lg"
              title="Green Screen"
            >
              <FaTv />
            </button>
          </div>
        </div>
      </div>

      {/* DRAGGABLE Subtitles Overlay */}
      <div className="absolute inset-x-0 top-20 bottom-40 flex flex-col items-center justify-end pointer-events-none z-40">
        {(message?.text || isCaptionSettingsOpen) && (
          <motion.div
            drag={isCaptionMoveMode}
            dragMomentum={false}
            initial={false}
            animate={isCaptionMoveMode ? undefined : { x: captionPosition.x, y: captionPosition.y }}
            onDragEnd={(e, info) => {
              setCaptionPosition(prev => ({
                x: prev.x + info.offset.x,
                y: prev.y + info.offset.y
              }));
            }}
            style={{
              width: captionWidth,
              maxWidth: '90vw',
              backgroundColor: captionBgColor,
              // Removed x and y from style to prevent conflicts with animate
            }}
            className={`relative backdrop-blur-xl border ${isCaptionMoveMode ? 'border-purple-500/50 cursor-grab active:cursor-grabbing shadow-[0_0_30px_rgba(168,85,247,0.3)]' : 'border-white/5'} py-4 px-10 rounded-[28px] shadow-2xl pointer-events-auto transition-all duration-500 mx-auto`}
          >
            {/* Resize Handle for Captions */}
            {isCaptionMoveMode && (
              <>
                <div className="absolute -top-6 left-0 right-0 text-center">
                  <span className="text-[10px] font-bold text-purple-400 bg-black/60 px-2 py-1 rounded-full uppercase tracking-widest">Caption Move Mode</span>
                </div>
                <div
                  className="absolute -right-3 top-0 bottom-0 w-6 cursor-ew-resize flex items-center justify-center group"
                  onMouseDown={(e) => {
                    const startX = e.clientX;
                    const startWidth = captionWidth;
                    const handleMouseMove = (moveEvent) => {
                      const newWidth = Math.max(300, Math.min(800, startWidth + (moveEvent.clientX - startX) * 2));
                      setCaptionWidth(newWidth);
                    };
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                >
                  <div className="h-10 w-1 bg-purple-400/30 rounded-full group-hover:bg-purple-400/80 transition-colors" />
                </div>
              </>
            )}

            <p className="text-lg md:text-xl font-bold leading-snug text-center flex flex-wrap justify-center overflow-hidden min-h-[2.4em] items-center" style={{ color: captionTextColor }}>
              {(message?.text || "Captions appear here. Drag to move, or resize.").split(" ").map((word, i) => {
                const isActive = !!message;
                const activeIdx = currentWordIndex >= 0 ? currentWordIndex : 0;

                // --- STATIC PAGING LOGIC ---
                const chunkSize = 7;
                const currentChunkIndex = Math.floor(activeIdx / chunkSize);
                const chunkStart = currentChunkIndex * chunkSize;
                const chunkEnd = chunkStart + chunkSize;

                if (isActive && (i < chunkStart || i >= chunkEnd)) {
                  return null;
                }

                return (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: isActive && i > activeIdx ? 0.3 : 1,
                      scale: i === currentWordIndex ? 1.1 : 1,
                      y: i === currentWordIndex ? -2 : 0
                    }}
                    style={{
                      color: i === currentWordIndex ? captionHighlightColor : 'inherit',
                      fontWeight: i === currentWordIndex ? '900' : '600',
                      textShadow: i === currentWordIndex ? `0 0 20px ${captionHighlightColor}70` : 'none',
                      transition: 'all 0.15s ease-out',
                      display: 'inline-block',
                      marginRight: '10px'
                    }}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </p>
          </motion.div>
        )}
      </div>

      {/* Visual Assets Side Panel - Left Side (Fixed 2xGrid) */}
      <div className="fixed left-6 top-48 bottom-48 w-[500px] pointer-events-none z-40 overflow-y-auto scrollbar-none">
        <div className="grid grid-cols-2 gap-4">
          <AnimatePresence>
            {visualAssets.map((asset, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -100, scale: 0.9, rotate: -5 }}
                animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, x: -100, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.1 }}
                className="pointer-events-auto w-full group"
              >
                <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:border-purple-500/60 hover:-translate-y-1 hover:shadow-purple-500/20 h-40 flex flex-col">
                  {asset.type === 'youtube' ? (
                    <div className="relative flex-grow bg-black/50 cursor-pointer overflow-hidden"
                      onClick={() => {
                        const url = asset.url || `https://www.youtube.com/results?search_query=${encodeURIComponent(asset.query || asset.caption || "")}`;
                        window.open(url, '_blank');
                      }}
                    >
                      <img
                        src={asset.thumbnail || asset.url || `https://tse2.mm.bing.net/th?q=${encodeURIComponent((asset.query || asset.caption || "") + ' youtube')}&w=800&c=7&rs=1&p=0`}
                        alt={asset.caption}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://tse2.mm.bing.net/th?q=${encodeURIComponent((asset.query || asset.caption || "") + ' youtube')}&w=800&c=7&rs=1&p=0`;
                        }}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300">
                          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                        <p className="text-[10px] font-black text-white line-clamp-2 leading-tight drop-shadow-lg uppercase tracking-tight">{asset.caption || "YouTube Video"}</p>
                      </div>
                    </div>
                  ) : asset.type === 'blog' ? (
                    <div className="relative flex-grow p-4 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-black cursor-pointer flex flex-col justify-center space-y-3"
                      onClick={() => {
                        const url = asset.url || `https://www.google.com/search?q=${encodeURIComponent(asset.query || asset.caption || "")}`;
                        window.open(url, '_blank');
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 group-hover:bg-purple-500/40 transition-colors">
                          <FaExternalLinkAlt className="text-purple-400 w-5 h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="text-[9px] font-black text-purple-400 uppercase tracking-[0.2em]">Resource</p>
                          <p className="text-xs font-bold text-white/90 line-clamp-2 mt-0.5 leading-snug">{asset.caption || "View Article"}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 pt-1">
                        <span className="w-1 h-1 rounded-full bg-purple-500 animate-pulse"></span>
                        <span className="text-[8px] text-white/40 font-bold uppercase tracking-widest">Click to Read More</span>
                      </div>
                    </div>
                  ) : asset.type === 'docs' ? (
                    <div className="relative flex-grow p-4 bg-gradient-to-br from-green-900/40 via-emerald-900/40 to-black cursor-pointer flex flex-col justify-center space-y-3"
                      onClick={() => {
                        const url = asset.url || `https://www.google.com/search?q=${encodeURIComponent(asset.query || asset.caption || "")}+documentation`;
                        window.open(url, '_blank');
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/30 group-hover:bg-green-500/40 transition-colors">
                          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="text-[9px] font-black text-green-400 uppercase tracking-[0.2em]">Documentation</p>
                          <p className="text-xs font-bold text-white/90 line-clamp-2 mt-0.5 leading-snug">{asset.caption || "View Docs"}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 pt-1">
                        <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[8px] text-white/40 font-bold uppercase tracking-widest">Official Reference</span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex-grow bg-black/80 overflow-hidden cursor-pointer"
                      onClick={() => {
                        const url = asset.url || `https://www.google.com/search?q=${encodeURIComponent(asset.query || asset.caption || "")}`;
                        window.open(url, '_blank');
                      }}
                    >
                      <img
                        src={asset.thumbnail || asset.url || `https://tse2.mm.bing.net/th?q=${encodeURIComponent(asset.query || asset.caption || "")}&w=800&c=7&rs=1&p=0`}
                        alt={asset.caption}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://tse2.mm.bing.net/th?q=${encodeURIComponent(asset.query || asset.caption || "visual")}&w=800&c=7&rs=1&p=0`;
                        }}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent group-hover:from-purple-900/60 transition-colors" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          <p className="text-[8px] font-black text-purple-400 uppercase tracking-widest">{asset.type || 'visual'}</p>
                        </div>
                        <p className="text-[10px] font-bold text-white line-clamp-2 leading-tight drop-shadow-md">{asset.caption || "Sofia Insight"}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Static Bottom Chat Input */}
      <div className="flex-grow"></div> {/* Spacer to push chat to bottom */}

      {/* Suggestion Pills */}
      {!loading && !message && suggestions.length > 0 && (
        <div className="w-full max-w-3xl mx-auto flex flex-wrap justify-center gap-2 mb-4 px-4 z-50 pointer-events-auto animate-in slide-in-from-bottom-4 duration-500">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              className="px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 hover:border-purple-500/50 hover:bg-purple-900/20 rounded-full text-xs font-medium text-white/80 hover:text-white transition-all shadow-lg hover:shadow-purple-500/20 active:scale-95"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Voice Input Visualizer */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center mb-4 z-50 pointer-events-none"
          >
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.2)]">
              {/* Pulsing Orb */}
              <div className="relative flex items-center justify-center mr-2">
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute w-8 h-8 bg-purple-500 rounded-full blur-md"
                />
                <div className="w-2.5 h-2.5 bg-purple-400 rounded-full shadow-[0_0_10px_#a855f7]" />
              </div>

              {/* Waveform Lines */}
              <div className="flex items-center gap-1 h-8">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [10, 24, 10],
                      backgroundColor: ['#a855f7', '#ec4899', '#a855f7']
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                    className="w-1 rounded-full"
                  />
                ))}
              </div>

              <span className="text-white/80 text-xs font-bold uppercase tracking-widest ml-2">Listening...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-3xl mx-auto pointer-events-auto z-50 mb-6">
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 p-2 rounded-[32px] shadow-2xl flex items-center gap-2 group focus-within:border-purple-500/40 transition-all duration-300">
          {/* Enhanced Voice Interface */}
          <div className="relative">
            <AnimatePresence>
              {isListening && (
                <>
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 bg-red-500 rounded-full"
                  />
                  <motion.div
                    initial={{ scale: 1, opacity: 0.3 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.75 }}
                    className="absolute inset-0 bg-red-500 rounded-full"
                  />
                </>
              )}
            </AnimatePresence>
            <button
              onClick={startVoiceInput}
              className={`relative z-10 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${isListening ? "bg-red-500 text-white" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"}`}
            >
              <FaMicrophone className={`w-5 h-5 ${isListening ? 'animate-bounce' : ''}`} />
            </button>
          </div>

          <input
            className="flex-grow bg-transparent border-none outline-none text-white placeholder:text-white/30 px-2 py-3 text-base font-medium"
            placeholder="Whisper something to Sofia..."
            ref={input}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage(e.target.value);
            }}
          />

          {/* Stop Button - appears when speaking */}
          {(isPlaying || message) && (
            <button
              onClick={stopResponse}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-all duration-300 shadow-lg hover:shadow-red-500/30 hover:scale-105 active:scale-95"
              title="Stop Response"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </button>
          )}

          <button
            disabled={loading || message}
            onClick={() => sendMessage(input.current.value)}
            className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${loading || message
              ? "bg-white/5 text-white/20"
              : "bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-purple-500/30 hover:scale-105 active:scale-95"
              }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <IoSend className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="mt-4 text-center text-[10px] text-white/20 font-bold uppercase tracking-widest">
          Powered by Sofia Core Engine & Ready Player Me
        </p>
      </div>

      {/* Floating Panels */}
      <AnimatePresence>
        {isBgSelectorOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className="fixed right-[88px] top-6 w-72 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[32px] p-5 shadow-2xl pointer-events-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Environments</h3>
              <button onClick={() => setIsBgSelectorOpen(false)} className="text-white/20 hover:text-white"><FaTimes /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {DEFAULT_BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setBackgroundUrl(bg.url)}
                  className={`group relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${backgroundUrl === bg.url ? 'border-purple-500' : 'border-transparent hover:border-white/20'}`}
                >
                  <img src={bg.url} alt={bg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white drop-shadow-md">{bg.name}</span>
                </button>
              ))}
              <button onClick={() => fileInput.current?.click()} className="flex flex-col items-center justify-center aspect-video rounded-xl bg-white/5 border-2 border-dashed border-white/10 hover:border-white/30 hover:bg-white/10 transition-all group">
                <FaPlus className="text-white/40 group-hover:text-white" />
              </button>
            </div>
            <input type="file" ref={fileInput} onChange={handleFileUpload} className="hidden" accept="image/*" />
            <button onClick={() => setBackgroundUrl("")} className="w-full mt-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all">Reset to Default</button>
          </motion.div>
        )}

        {isTrackingSettingsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className="fixed right-[88px] top-6 w-72 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 shadow-2xl pointer-events-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Sensitivity</h3>
              <button onClick={() => setIsTrackingSettingsOpen(false)} className="text-white/20 hover:text-white"><FaTimes /></button>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-[10px] font-bold text-white/40 uppercase">Head</span><span className="text-[10px] font-mono text-purple-400">{headSensitivity.toFixed(1)}</span></div>
                <input type="range" min="0.1" max="2.0" step="0.1" value={headSensitivity} onChange={(e) => setHeadSensitivity(parseFloat(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-[10px] font-bold text-white/40 uppercase">Eyes</span><span className="text-[10px] font-mono text-blue-400">{eyeSensitivity.toFixed(1)}</span></div>
                <input type="range" min="0.1" max="1.5" step="0.1" value={eyeSensitivity} onChange={(e) => setEyeSensitivity(parseFloat(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500" />
              </div>
            </div>
            <button onClick={() => { setHeadSensitivity(0.8); setEyeSensitivity(0.4); }} className="w-full mt-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white bg-white/5 rounded-xl transition-all"><FaUndo className="inline mr-2" /> Reset Values</button>
          </motion.div>
        )}

        {isCaptionSettingsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className="fixed right-[88px] top-6 w-80 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 shadow-2xl pointer-events-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Caption Style</h3>
              <button onClick={() => setIsCaptionSettingsOpen(false)} className="text-white/20 hover:text-white"><FaTimes /></button>
            </div>

            {/* Layout Controls */}
            <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-white/60 uppercase">Enable Dragging</span>
                <button
                  onClick={() => setIsCaptionMoveMode(!isCaptionMoveMode)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${isCaptionMoveMode ? 'bg-purple-500' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${isCaptionMoveMode ? 'translate-x-4' : ''}`} />
                </button>
              </div>
              <button
                onClick={() => { setCaptionPosition({ x: 0, y: 0 }); setCaptionWidth(600); }}
                className="w-full py-2 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/10"
              >
                <FaUndo className="mr-2 w-3 h-3" /> Reset Position
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between"><span className="text-[10px] font-bold text-white/40 uppercase">Text</span><input type="color" value={captionTextColor} onChange={(e) => setCaptionTextColor(e.target.value)} className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer" /></div>
              <div className="flex items-center justify-between"><span className="text-[10px] font-bold text-white/40 uppercase">Background</span><input type="color" value={captionBgColor.startsWith('rgba') ? '#000000' : captionBgColor} onChange={(e) => setCaptionBgColor(e.target.value)} className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer" /></div>
              <div className="flex items-center justify-between"><span className="text-[10px] font-bold text-white/40 uppercase">Highlight</span><input type="color" value={captionHighlightColor} onChange={(e) => setCaptionHighlightColor(e.target.value)} className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer" /></div>
            </div>
            <button onClick={() => { setCaptionTextColor("#ffffff"); setCaptionBgColor("rgba(0,0,0,0.6)"); setCaptionHighlightColor("#a855f7"); }} className="w-full mt-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white bg-white/5 rounded-xl transition-all"><FaUndo className="inline mr-2" /> Reset Styles</button>
          </motion.div>
        )}

        {isApiKeySettingsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className="fixed right-[88px] top-6 w-80 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 shadow-2xl pointer-events-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">API Configuration</h3>
              <button onClick={() => setIsApiKeySettingsOpen(false)} className="text-white/20 hover:text-white"><FaTimes /></button>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-white/40 uppercase">Groq Key</label>
              <input type="password" placeholder="gsk_..." value={groqApiKey} onChange={(e) => setGroqApiKey(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-yellow-500/50 transition-colors" />
              <p className="text-[9px] text-white/20">Stored locally in your browser.</p>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[10px] text-white/50 leading-relaxed italic">
                Get your key at console.groq.com
              </div>
            </div>
            <button onClick={() => setIsApiKeySettingsOpen(false)} className="w-full mt-6 py-3 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase rounded-xl transition-all">Done</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};