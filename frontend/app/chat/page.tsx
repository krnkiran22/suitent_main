"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Canvas } from '@react-three/fiber';
import { motion, useDragControls, useMotionValue, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { FaTrash, FaChevronDown, FaArrowsAlt, FaUndo, FaExternalLinkAlt, FaTimes, FaImages, FaSearch, FaThLarge } from 'react-icons/fa';

// Import Sofia components
import { Experience } from "@/components/sofia/Experience";
import { UI as SofiaUI } from "@/components/sofia/UI";
import { ChatProvider, useChat as useSofiaChat } from "@/components/sofia/hooks/useChat";

// Modern ChatViewer Component with draggable link previews
function StoredChatViewer() {
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState('');
  const [previewLink, setPreviewLink] = useState<any>(null);
  const chatViewerRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  // Motion values for window position
  const chatX = useMotionValue(0);
  const chatY = useMotionValue(0);

  const {
    isCaptionMoveMode, setIsCaptionMoveMode,
    setCaptionPosition, setCaptionWidth
  } = useSofiaChat();

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Show/hide the chat widget
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Function to load data from localStorage
  const loadStoredData = useCallback(() => {
    try {
      const currentId = localStorage.getItem('currentConversationId') || '';
      setConversationId(currentId);

      // Prefer the unified chatHistory which contains assets and richer data
      const unifiedHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      if (unifiedHistory.length > 0) {
        const mappedHistory = unifiedHistory.map((msg: any) => ({
          type: msg.sender || (msg.type === 'bot' ? 'bot' : 'user'),
          content: msg.text || msg.content,
          timestamp: msg.timestamp,
          assets: msg.assets || []
        }));
        setChatHistory(mappedHistory);
        return;
      }

      // Fallback to legacy storage
      const userQueries = JSON.parse(localStorage.getItem('userQueries') || '[]');
      const storedHtmlResponses = JSON.parse(localStorage.getItem('htmlResponses') || '[]');

      const combinedChat = [];
      userQueries.forEach(query => {
        combinedChat.push({
          type: 'user',
          content: query.query,
          timestamp: query.timestamp
        });
      });
      storedHtmlResponses.forEach(response => {
        combinedChat.push({
          type: 'bot',
          content: response.html_response,
          timestamp: response.timestamp
        });
      });

      combinedChat.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setChatHistory(combinedChat);
    } catch (error) {
      console.error("Error loading chat data from localStorage:", error);
    }
  }, []);

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      localStorage.removeItem('userQueries');
      localStorage.removeItem('htmlResponses');
      localStorage.removeItem('chatHistory');
      localStorage.removeItem('lastHtmlResponse');
      localStorage.removeItem('lastUserQuery');
      localStorage.removeItem('lastAiMessages');
      localStorage.removeItem('aiMessages');

      const newConversationId = uuidv4();
      localStorage.setItem('currentConversationId', newConversationId);
      setConversationId(newConversationId);
      setChatHistory([]);
    }
  };

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [gallerySearch, setGallerySearch] = useState('');
  const prevHistoryLen = useRef(0);

  useEffect(() => {
    loadStoredData();
    const intervalId = setInterval(loadStoredData, 2000);
    return () => clearInterval(intervalId);
  }, [loadStoredData]);

  // Smart Auto-scroll: Only scroll to bottom if new messages arrive AND user is near bottom
  useEffect(() => {
    if (chatViewerRef.current) {
      const container = chatViewerRef.current;
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;

      // If a new message was added (history length increased)
      if (chatHistory.length > prevHistoryLen.current) {
        if (isAtBottom) {
          container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        }
      } else if (prevHistoryLen.current === 0 && chatHistory.length > 0) {
        // Initial load
        container.scrollTop = container.scrollHeight;
      }

      prevHistoryLen.current = chatHistory.length;
    }
  }, [chatHistory, isCollapsed]);

  useEffect(() => {
    if (!previewLink) return;
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPreviewLink(prev => ({
          ...prev,
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        }));
      }
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, previewLink]);

  const processHtmlContent = (htmlContent) => {
    if (typeof document === 'undefined') return htmlContent;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const links = tempDiv.querySelectorAll('a');
    links.forEach((link) => {
      const url = link.getAttribute('href');
      const text = link.textContent;
      const replacementSpan = document.createElement('span');
      replacementSpan.className = "inline-flex items-center space-x-1 text-purple-400 hover:text-purple-300 underline cursor-pointer transition-colors font-medium decoration-purple-500/30 underline-offset-4";
      replacementSpan.dataset.url = url;
      replacementSpan.innerHTML = `<span>${text}</span><svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>`;
      link.parentNode.replaceChild(replacementSpan, link);
    });
    return tempDiv.innerHTML;
  };

  const handleInteraction = (e) => {
    const linkEl = e.target.closest('[data-url]');
    if (linkEl) {
      const url = linkEl.dataset.url;
      if (e.type === 'mouseover') {
        if (!previewLink || previewLink.url !== url) {
          setPreviewLink({
            url,
            x: e.clientX + 20,
            y: e.clientY - 100
          });
        }
      } else if (e.type === 'click') {
        window.open(url, '_blank');
      }
    }
  };

  return (
    <>
      <motion.div
        drag={isCaptionMoveMode}
        dragListener={false}
        dragControls={dragControls}
        dragMomentum={false}
        style={{ x: chatX, y: chatY }}
        className={`fixed bottom-6 left-6 z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isCollapsed ? 'w-14 h-14' : 'w-[380px] h-[550px]'}`}
      >
        {/* Toggle Button / Header */}
        <div
          onPointerDown={(e) => isCaptionMoveMode && dragControls.start(e)}
          className={`
          relative overflow-hidden group
          bg-black/60 backdrop-blur-2xl border border-white/10
          ${isCollapsed ? 'rounded-2xl w-14 h-14 flex items-center justify-center cursor-pointer hover:bg-purple-600/40 hover:border-purple-500/40' : `rounded-t-3xl p-4 flex justify-between items-center ${isCaptionMoveMode ? 'cursor-move' : 'cursor-default'}`}
          shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300
        `}
          onClick={() => {
            if (isCollapsed) setIsCollapsed(false);
          }}
        >
          {isCollapsed ? (
            <div className="relative z-10 text-white flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              {chatHistory.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-[10px] flex items-center justify-center font-bold">{chatHistory.length}</span>}
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-3 pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-sm font-bold text-white tracking-tight">Chat History</h2>
                  <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest leading-none">
                    {isCaptionMoveMode ? 'Move Mode Active' : 'Activity Log'}
                  </p>
                </div>
              </div>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCollapsed(true);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer pointer-events-auto"
              >
                <FaChevronDown className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Chat body */}
        {!isCollapsed && (
          <div className="bg-black/60 backdrop-blur-2xl border-x border-b border-white/10 rounded-b-3xl p-5 flex flex-col h-[calc(100%-64px)] shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              {conversationId && (
                <span className="text-[10px] text-white/40 font-mono py-1 px-2 bg-white/5 rounded-md border border-white/5">
                  SID: {conversationId.substring(0, 8).toUpperCase()}
                </span>
              )}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsCaptionMoveMode(!isCaptionMoveMode)}
                  className={`p-1.5 rounded-lg transition-all ${isCaptionMoveMode ? 'bg-purple-500 text-white' : 'bg-white/5 text-white/40 hover:text-white'}`}
                  title={isCaptionMoveMode ? "Disable Move Mode" : "Enable Move Mode"}
                >
                  <FaArrowsAlt className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    setCaptionPosition({ x: 0, y: 0 });
                    setCaptionWidth(600);
                    chatX.set(0);
                    chatY.set(0);
                    setIsCaptionMoveMode(false);
                  }}
                  className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white transition-all"
                  title="Reset Layout"
                >
                  <FaUndo className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setIsGalleryOpen(true)}
                  className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white transition-all hover:bg-white/10"
                  title="Asset Gallery"
                >
                  <FaImages className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-3 bg-white/10 mx-1"></div>
                <button
                  onClick={clearChat}
                  className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-colors"
                  title="Clear Chat History"
                >
                  <FaTrash className="w-2.5 h-2.5" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            <div
              ref={chatViewerRef}
              className="flex-grow overflow-y-auto scrollbar-none mb-4 space-y-4"
              onMouseOver={handleInteraction}
              onClick={handleInteraction}
            >
              {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/20 space-y-3 opacity-50">
                  <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-3.586a1 1 0 00-.707.293l-1.414 1.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 009.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest">No messages yet</p>
                </div>
              ) : (
                chatHistory.map((msg: any, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`
                    max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm
                    ${msg.type === 'user'
                        ? 'bg-gradient-to-tr from-blue-600/40 to-indigo-600/40 border border-blue-500/20 text-white rounded-tr-none'
                        : 'bg-white/5 backdrop-blur-md border border-white/10 text-white/90 rounded-tl-none'}
                  `}>
                      <div
                        className="break-words"
                        dangerouslySetInnerHTML={{ __html: msg.type === 'bot' ? processHtmlContent(msg.content) : msg.content }}
                      />

                      {/* Render Assets in History */}
                      {msg.assets && msg.assets.length > 0 && (
                        <div className="mt-4 grid grid-cols-1 gap-2 border-t border-white/10 pt-4">
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Attached Assets</p>
                          {msg.assets.map((asset: any, aIdx: number) => (
                            <div
                              key={aIdx}
                              onClick={() => {
                                if (asset.url) {
                                  window.open(asset.url, '_blank');
                                  return;
                                }
                                const query = encodeURIComponent(asset.query || asset.caption || "");
                                const searchUrl = asset.type === 'youtube'
                                  ? `https://www.youtube.com/results?search_query=${query}`
                                  : `https://www.google.com/search?q=${query}`;
                                window.open(searchUrl, '_blank');
                              }}
                              className="flex items-center space-x-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all"
                            >
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                                {asset.type === 'youtube' ? (
                                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                                ) : asset.type === 'blog' ? (
                                  <FaExternalLinkAlt className="w-3 h-3 text-blue-400" />
                                ) : asset.type === 'docs' ? (
                                  <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                ) : (
                                  <FaArrowsAlt className="w-3 h-3 text-purple-400" />
                                )}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <p className="text-[9px] font-bold text-white truncate">{asset.caption || asset.query}</p>
                                <p className="text-[8px] text-white/40 uppercase tracking-tight">{asset.type || 'insight'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] mt-1.5 font-bold uppercase tracking-widest text-white/20 px-2 leading-none">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="text-[10px] text-center text-white/10 font-bold uppercase tracking-[0.2em]">
              Immutable Knowledge Base
            </div>
          </div>
        )}

        {/* Preview Popup */}
        {previewLink && (
          <div
            className="fixed z-[100] bg-gray-950/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] border border-white/10 overflow-hidden w-[450px] flex flex-col"
            style={{
              left: `${Math.max(20, Math.min(previewLink.x, (typeof window !== 'undefined' ? window.innerWidth : 1000) - 470))}px`,
              top: `${Math.max(20, Math.min(previewLink.y, (typeof window !== 'undefined' ? window.innerHeight : 1000) - 320))}px`,
              height: '300px'
            }}
          >
            <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center space-x-2 flex-grow truncate mr-4">
                <FaExternalLinkAlt className="w-3 h-3 text-purple-400" />
                <span className="text-[10px] text-white/60 font-mono truncate">{previewLink.url}</span>
              </div>
              <button
                className="p-1 px-2 hover:bg-white/10 text-white/40 hover:text-white transition-all rounded-lg"
                onClick={() => setPreviewLink(null)}
              >
                <FaTimes className="w-3 h-3" />
              </button>
            </div>
            <iframe
              src={previewLink.url}
              className="w-full flex-grow bg-white"
              title="Link Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        )}
      </motion.div>

      {/* Asset Gallery Modal */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-5xl h-[85vh] bg-zinc-900/90 border border-white/10 rounded-[40px] shadow-[0_0_100px_rgba(168,85,247,0.2)] overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    <FaThLarge className="text-purple-500" />
                    Asset Library
                  </h2>
                  <p className="text-sm text-white/40 mt-1 font-medium italic">All resources generated by Sofia in this session</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="text"
                      placeholder="Search assets..."
                      value={gallerySearch}
                      onChange={(e) => setGallerySearch(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-purple-500/50 w-64 transition-all"
                    />
                  </div>
                  <button
                    onClick={() => setIsGalleryOpen(false)}
                    className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all border border-white/5"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              <div className="flex-grow overflow-y-auto p-8 scrollbar-none space-y-16">
                {(function () {
                  // Advanced Grouping Logic: Aggregate assets by the User Query that triggered the turn
                  const aggregatedGroups: { triggerText: string; assets: any[] }[] = [];
                  let currentTrigger = "Initial Exploration";

                  chatHistory.forEach((msg: any) => {
                    if (msg.type === 'user') {
                      currentTrigger = msg.content || "User Request";
                    } else if (msg.assets && msg.assets.length > 0) {
                      // Filter by search if necessary
                      const matchedAssets = msg.assets.filter((a: any) =>
                        (a.caption || "").toLowerCase().includes(gallerySearch.toLowerCase()) ||
                        (a.query || "").toLowerCase().includes(gallerySearch.toLowerCase()) ||
                        (a.type || "").toLowerCase().includes(gallerySearch.toLowerCase())
                      );

                      if (matchedAssets.length > 0) {
                        // Find or create the group for this user trigger
                        let group = aggregatedGroups.find(g => g.triggerText === currentTrigger);
                        if (!group) {
                          group = { triggerText: currentTrigger, assets: [] };
                          aggregatedGroups.push(group);
                        }

                        // Avoid duplicates if segments are appended multiple times
                        matchedAssets.forEach((newAsset: any) => {
                          const exists = group!.assets.find(a => (a.url === newAsset.url && a.url) || (a.query === newAsset.query && a.caption === newAsset.caption));
                          if (!exists) group!.assets.push(newAsset);
                        });
                      }
                    }
                  });

                  if (aggregatedGroups.length === 0) {
                    return (
                      <div className="h-full flex flex-col items-center justify-center text-white/20">
                        <FaThLarge className="text-6xl mb-4 opacity-10" />
                        <p className="text-xl font-bold italic">No matching assets found</p>
                      </div>
                    );
                  }

                  return aggregatedGroups.map((group, gIdx) => (
                    <div key={gIdx} className="animate-fade-in">
                      <div className="flex items-center gap-6 mb-10 group/hr">
                        <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap group-hover/hr:text-purple-400 transition-colors max-w-[500px] truncate leading-none">
                          {group.triggerText}
                        </span>
                        <div className="h-px bg-white/10 flex-grow group-hover/hr:bg-purple-500/30 transition-colors" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {group.assets.map((asset: any, idx: number) => (
                          <motion.div
                            key={`${gIdx}-${idx}`}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group bg-white/5 border border-white/10 rounded-[32px] overflow-hidden hover:border-purple-500/40 transition-all shadow-2xl flex flex-col h-full"
                          >
                            <div className="aspect-video relative overflow-hidden bg-black/60">
                              {asset.type === 'youtube' ? (
                                <div className="w-full h-full relative">
                                  <img
                                    src={asset.thumbnail || `https://tse2.mm.bing.net/th?q=${encodeURIComponent((asset.query || asset.caption || "") + ' youtube preview')}&w=800&c=7&rs=1&p=0`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                                    onError={(e: any) => {
                                      e.target.onerror = null;
                                      e.target.src = `https://tse2.mm.bing.net/th?q=${encodeURIComponent((asset.query || asset.caption || "") + ' youtube thumbnail')}&w=800&c=7&rs=1&p=0`;
                                    }}
                                    alt={asset.caption}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300">
                                      <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                  </div>
                                </div>
                              ) : asset.type === 'image' || !asset.type ? (
                                <img
                                  src={asset.thumbnail || asset.url || `https://tse2.mm.bing.net/th?q=${encodeURIComponent(asset.query || asset.caption || "visual")}&w=800&c=7&rs=1&p=0`}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                  onError={(e: any) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://tse2.mm.bing.net/th?q=${encodeURIComponent(asset.query || asset.caption || "visual")}&w=800&c=7&rs=1&p=0`;
                                  }}
                                  alt={asset.caption}
                                />
                              ) : asset.type === 'docs' ? (
                                <div className="w-full h-full flex items-center justify-center bg-emerald-500/10">
                                  <svg className="text-4xl text-emerald-400 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.247 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                </div>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-500/10">
                                  <FaExternalLinkAlt className="text-4xl text-indigo-400 opacity-20" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />
                              <div className="absolute top-4 left-4">
                                <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                                  {asset.type || 'insight'}
                                </span>
                              </div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col justify-between">
                              <h3 className="text-white font-bold leading-snug line-clamp-2 mb-4 group-hover:text-purple-400 transition-colors text-sm">
                                {asset.caption || asset.query || "Sofia Deep Research"}
                              </h3>
                              <button
                                onClick={() => {
                                  if (asset.url) {
                                    window.open(asset.url, '_blank');
                                    return;
                                  }
                                  const query = encodeURIComponent(asset.query || asset.caption || "");
                                  const url = asset.type === 'youtube' ? `https://www.youtube.com/results?search_query=${query}` : `https://www.google.com/search?q=${query}`;
                                  window.open(url, '_blank');
                                }}
                                className="w-full py-3 bg-white/5 hover:bg-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/10 hover:border-transparent"
                              >
                                Explore Resource
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ChatPageContent() {
  const { backgroundUrl } = useSofiaChat();

  useEffect(() => {
    const urlParts = window.location.pathname.split('/');
    const userid = urlParts[1];
    if (userid && userid !== "") {
      localStorage.setItem('gfuserid', userid);
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050505]">
      {/* Simple loading indicator */}
      <div className="absolute top-4 right-4 z-50">
        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>

      {/* Background Layer */}
      {backgroundUrl && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />
      )}
      {!backgroundUrl && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-950 via-black to-purple-950" />
      )}
      <div className="absolute inset-0 z-[1] bg-black/10 pointer-events-none" />

      <div className="relative w-full h-full z-10">
        <Canvas
          shadows
          camera={{ position: [0, 0, 1], fov: 30 }}
          className="w-full h-full"
          gl={{ alpha: true }}
        >
          <Experience />
        </Canvas>

        <SofiaUI />

        <StoredChatViewer />
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .greenScreen canvas {
          background: #00ff00 !important;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default function ChatPage() {
  return (
    <ChatProvider>
      <Header />
      <main className="h-screen overflow-hidden">
        <ChatPageContent />
      </main>
    </ChatProvider>
  );
}
