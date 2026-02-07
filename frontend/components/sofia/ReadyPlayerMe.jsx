import React, { useEffect, useRef } from 'react';
import { useChat } from "./hooks/useChat";

export const ReadyPlayerMe = ({ isOpen, onClose }) => {
    const { setAvatarUrl } = useChat();
    const frameRef = useRef(null);

    useEffect(() => {
        const handleMessage = (event) => {
            const url = event.data;

            // Handle the case where the data is a JSON string (sometimes happens)
            let data = url;
            try {
                if (typeof url === 'string' && url.startsWith('{')) {
                    data = JSON.parse(url);
                }
            } catch (e) { }

            // If it's the modern RPM object format
            if (data?.source === 'readyplayerme' && data?.eventName === 'v1.avatar.exported') {
                const glbUrl = `${data.data.url}?morphTargets=ARKit,Oculus+Visemes,mouthOpen,mouthSmile,eyesClosed,eyesLookUp,eyesLookDown&textureSizeLimit=1024&textureFormat=png`;
                setAvatarUrl(glbUrl);
                onClose();
                return;
            }

            // If it's the legacy string format
            if (typeof url === 'string' && url.includes('.glb')) {
                const fullUrl = `${url}?morphTargets=ARKit,Oculus+Visemes,mouthOpen,mouthSmile,eyesClosed,eyesLookUp,eyesLookDown&textureSizeLimit=1024&textureFormat=png`;
                setAvatarUrl(fullUrl);
                onClose();
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [setAvatarUrl, onClose]);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300 pointer-events-auto">
            <div className="relative w-full max-w-4xl h-[80vh] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-purple-500/30 flex flex-col">
                {/* Header */}
                <div className="p-4 bg-gray-900 border-b border-purple-500/20 flex justify-between items-center bg-gradient-to-r from-purple-900/50 to-pink-900/50">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            Customize Your Avatar
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Iframe */}
                <div className="flex-grow relative bg-[#151720]">
                    <iframe
                        ref={frameRef}
                        src="https://demo.readyplayer.me/avatar?frameApi"
                        className="w-full h-full border-none"
                        allow="camera *; microphone *; clipboard-write"
                    />
                </div>

                {/* Footer info */}
                <div className="p-3 text-center text-xs text-purple-400/60 bg-gray-950/50 backdrop-blur-md">
                    Once you're happy with your look, click "Done" or "Claim Avatar" to update your virtual girlfriend!
                </div>
            </div>
        </div>
    );
};