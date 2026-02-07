import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

const backendUrl = "http://127.0.0.1:5000/chat";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("https://models.readyplayer.me/675f06a460c6e591da95393d.glb?morphTargets=ARKit,Oculus+Visemes,mouthOpen,mouthSmile,eyesClosed,eyesLookUp,eyesLookDown&textureSizeLimit=1024&textureFormat=png");
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [cursorFollow, setCursorFollow] = useState(false);
  const [headSensitivity, setHeadSensitivity] = useState(0.8);
  const [eyeSensitivity, setEyeSensitivity] = useState(0.4);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [captionTextColor, setCaptionTextColor] = useState("#ffffff");
  const [captionBgColor, setCaptionBgColor] = useState("rgba(0, 0, 0, 0.45)");
  const [captionHighlightColor, setCaptionHighlightColor] = useState("#a855f7");
  const [groqApiKey, setGroqApiKey] = useState("");
  const [isCaptionMoveMode, setIsCaptionMoveMode] = useState(false);
  const [captionPosition, setCaptionPosition] = useState({ x: 0, y: 0 });
  const [captionWidth, setCaptionWidth] = useState(540);
  const [visualAssets, setVisualAssets] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const processingRef = useRef(false);

  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedAvatar = localStorage.getItem('avatarUrl');
    if (storedAvatar) setAvatarUrl(storedAvatar);

    const storedBg = localStorage.getItem('backgroundUrl');
    if (storedBg) setBackgroundUrl(storedBg);

    const storedCursor = localStorage.getItem('cursorFollow');
    if (storedCursor) setCursorFollow(storedCursor === 'true');

    const storedHead = localStorage.getItem('headSensitivity');
    if (storedHead) setHeadSensitivity(parseFloat(storedHead));

    const storedEye = localStorage.getItem('eyeSensitivity');
    if (storedEye) setEyeSensitivity(parseFloat(storedEye));

    const storedCapText = localStorage.getItem('captionTextColor');
    if (storedCapText) setCaptionTextColor(storedCapText);

    const storedCapBg = localStorage.getItem('captionBgColor');
    if (storedCapBg) setCaptionBgColor(storedCapBg);

    const storedCapHigh = localStorage.getItem('captionHighlightColor');
    if (storedCapHigh) setCaptionHighlightColor(storedCapHigh);

    const storedGroq = localStorage.getItem('groqApiKey');
    if (storedGroq) setGroqApiKey(storedGroq);

    const storedConversationId = localStorage.getItem('currentConversationId');
    if (storedConversationId) {
      setConversationId(storedConversationId);
    } else {
      const newId = uuidv4();
      setConversationId(newId);
      localStorage.setItem('currentConversationId', newId);
    }

    setHasLoadedFromStorage(true);
  }, []);

  // Save sensitivities and keys to localStorage ONLY after initial load
  useEffect(() => {
    if (!hasLoadedFromStorage || typeof window === 'undefined') return;

    localStorage.setItem('cursorFollow', cursorFollow);
    localStorage.setItem('headSensitivity', headSensitivity);
    localStorage.setItem('eyeSensitivity', eyeSensitivity);
    localStorage.setItem('captionTextColor', captionTextColor);
    localStorage.setItem('captionBgColor', captionBgColor);
    localStorage.setItem('captionHighlightColor', captionHighlightColor);
    localStorage.setItem('groqApiKey', groqApiKey);
    localStorage.setItem('backgroundUrl', backgroundUrl);

    if (avatarUrl) {
      localStorage.setItem('avatarUrl', avatarUrl);
    }

    if (conversationId) {
      localStorage.setItem('currentConversationId', conversationId);
    }
  }, [cursorFollow, headSensitivity, eyeSensitivity, captionTextColor, captionBgColor, captionHighlightColor, groqApiKey, backgroundUrl, avatarUrl, conversationId, hasLoadedFromStorage]);

  // Load existing chat history from localStorage - already safe inside useEffect
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedChatHistory = localStorage.getItem('chatHistory');
    if (storedChatHistory) {
      try {
        console.log("Found stored chat history:", JSON.parse(storedChatHistory));
      } catch (e) {
        console.error("Error parsing stored chat history:", e);
      }
    }
  }, []);

  const chat = useCallback(async (message) => {
    setLoading(true);
    setVisualAssets([]);
    setSuggestions([]);

    // First, add the user message to the chat history in localStorage
    const userMessage = {
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString()
    };

    // Add to the chat history in localStorage
    const storedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    storedChatHistory.push(userMessage);
    localStorage.setItem('chatHistory', JSON.stringify(storedChatHistory));

    // Store user query in localStorage
    localStorage.setItem('lastUserQuery', message);

    // Store all user queries in localStorage as an array
    const userQueries = JSON.parse(localStorage.getItem('userQueries') || '[]');
    userQueries.push({
      query: message,
      conversationId: conversationId,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('userQueries', JSON.stringify(userQueries));

    try {
      // Convert request to GET with query parameters
      const url = new URL(backendUrl);
      url.searchParams.append('query', message);
      url.searchParams.append('conversation_id', conversationId);
      url.searchParams.append('api_key', groqApiKey);

      const data = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Data:", data);

      const textResponse = await data.text(); // Get response as text first

      console.log("Text response:", textResponse);

      // Store raw API response for debugging/access
      localStorage.setItem('lastRawApiResponse', textResponse);

      let parsedMessages = [];
      let htmlResponse = null;

      try {
        // Try to parse the response as JSON
        const resp = JSON.parse(textResponse);
        console.log("Parsed response:", resp);

        // Process assets and suggestions
        if (resp.assets && Array.isArray(resp.assets)) {
          setVisualAssets(resp.assets);
        }
        if (resp.suggestions && Array.isArray(resp.suggestions)) {
          setSuggestions(resp.suggestions);
        }

        // Extract HTML response if available
        if (resp.html_response) {
          htmlResponse = resp.html_response;
          localStorage.setItem('lastHtmlResponse', htmlResponse);

          // Store all html responses as an array
          const htmlResponses = JSON.parse(localStorage.getItem('htmlResponses') || '[]');
          htmlResponses.push({
            html_response: htmlResponse,
            conversationId: conversationId,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('htmlResponses', JSON.stringify(htmlResponses));
        }

        // Check if resp.messages exists and is an array
        if (resp.messages && Array.isArray(resp.messages)) {
          parsedMessages = resp.messages;
          setMessages(prev => [...prev, ...resp.messages]);

          // Store the AI messages
          localStorage.setItem('lastAiMessages', JSON.stringify(parsedMessages));

          // Add formatted messages to chat history in localStorage
          const formattedAiMessages = parsedMessages.map((msg, index) => ({
            sender: 'bot',
            text: msg.text,
            facialExpression: msg.facialExpression,
            animation: msg.animation,
            timestamp: new Date().toISOString(),
            assets: msg.assets || [] // Use per-segment assets
          }));

          // Update localStorage chat history with each AI message
          const updatedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
          updatedChatHistory.push(...formattedAiMessages);
          localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));

          // Store all AI message arrays
          const allAiMessages = JSON.parse(localStorage.getItem('aiMessages') || '[]');
          allAiMessages.push({
            messages: parsedMessages,
            conversationId: conversationId,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('aiMessages', JSON.stringify(allAiMessages));
        } else if (resp.error && resp.raw_response) {
          // Handle the case where the server returns an error with raw_response
          console.error("API Error:", resp.error);

          // Clean up the raw_response by removing the dashes and any other non-JSON prefix
          try {
            const cleanedResponse = resp.raw_response.replace(/^[^{]*/, '');
            const parsedRawResponse = JSON.parse(cleanedResponse);

            // Extract HTML response if available in the raw response
            if (parsedRawResponse.html_response) {
              htmlResponse = parsedRawResponse.html_response;
              localStorage.setItem('lastHtmlResponse', htmlResponse);

              // Store all html responses
              const htmlResponses = JSON.parse(localStorage.getItem('htmlResponses') || '[]');
              htmlResponses.push({
                html_response: htmlResponse,
                conversationId: conversationId,
                timestamp: new Date().toISOString()
              });
              localStorage.setItem('htmlResponses', JSON.stringify(htmlResponses));
            }

            // Process assets and suggestions from raw response
            if (parsedRawResponse.assets && Array.isArray(parsedRawResponse.assets)) {
              setVisualAssets(parsedRawResponse.assets);
            }
            if (parsedRawResponse.suggestions && Array.isArray(parsedRawResponse.suggestions)) {
              setSuggestions(parsedRawResponse.suggestions);
            }

            if (parsedRawResponse.messages && Array.isArray(parsedRawResponse.messages)) {
              parsedMessages = parsedRawResponse.messages;
              setMessages(prev => [...prev, ...parsedRawResponse.messages]);

              // Store the AI messages
              localStorage.setItem('lastAiMessages', JSON.stringify(parsedMessages));

              // Add formatted messages to chat history in localStorage
              const formattedAiMessages = parsedMessages.map((msg, index) => ({
                sender: 'bot',
                text: msg.text,
                facialExpression: msg.facialExpression,
                animation: msg.animation,
                timestamp: new Date().toISOString(),
                assets: msg.assets || []
              }));

              // Update localStorage chat history with each AI message
              const updatedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
              updatedChatHistory.push(...formattedAiMessages);
              localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));

              // Store all AI message arrays
              const allAiMessages = JSON.parse(localStorage.getItem('aiMessages') || '[]');
              allAiMessages.push({
                messages: parsedMessages,
                conversationId: conversationId,
                timestamp: new Date().toISOString()
              });
              localStorage.setItem('aiMessages', JSON.stringify(allAiMessages));
            } else {
              console.error("No valid messages in cleaned response:", parsedRawResponse);
              const errorMessage = {
                text: "Sorry, I couldn't process your message correctly.",
                facialExpression: "sad",
                animation: "Talking_0"
              };
              setMessages(prev => [...prev, errorMessage]);

              // Add error message to chat history
              const updatedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
              updatedChatHistory.push({
                sender: 'bot',
                text: errorMessage.text,
                facialExpression: errorMessage.facialExpression,
                animation: errorMessage.animation,
                timestamp: new Date().toISOString()
              });
              localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
            }
          } catch (rawParseError) {
            console.error("Error parsing cleaned raw_response:", rawParseError);
            console.log("Cleaned response attempt failed, raw content:", resp.raw_response);
            const errorMessage = {
              text: "I encountered an error processing your message. Please try again.",
              facialExpression: "sad",
              animation: "Talking_0"
            };
            setMessages(prev => [...prev, errorMessage]);

            // Add error message to chat history
            const updatedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
            updatedChatHistory.push({
              sender: 'bot',
              text: errorMessage.text,
              facialExpression: errorMessage.facialExpression,
              animation: errorMessage.animation,
              timestamp: new Date().toISOString()
            });
            localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
          }
        } else {
          console.error("Unexpected response format:", resp);
          const errorMessage = {
            text: "I received an unexpected response format. Please try again.",
            facialExpression: "confused",
            animation: "Talking_0"
          };
          setMessages(prev => [...prev, errorMessage]);

          // Add error message to chat history
          const updatedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
          updatedChatHistory.push({
            sender: 'bot',
            text: errorMessage.text,
            facialExpression: errorMessage.facialExpression,
            animation: errorMessage.animation,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
        }
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        console.log("Raw response:", textResponse);

        // Try to directly extract and parse the response if initial parsing fails
        try {
          // Remove any non-JSON prefix (like dashes)
          const cleanedResponse = textResponse.replace(/^[^{]*/, '');
          const parsedResponse = JSON.parse(cleanedResponse);

          // Extract HTML response if available
          if (parsedResponse.html_response) {
            htmlResponse = parsedResponse.html_response;
            localStorage.setItem('lastHtmlResponse', htmlResponse);

            // Store all html responses
            const htmlResponses = JSON.parse(localStorage.getItem('htmlResponses') || '[]');
            htmlResponses.push({
              html_response: htmlResponse,
              conversationId: conversationId,
              timestamp: new Date().toISOString()
            });
            localStorage.setItem('htmlResponses', JSON.stringify(htmlResponses));
          }

          // Process assets and suggestions from cleaned response
          if (parsedResponse.assets && Array.isArray(parsedResponse.assets)) {
            setVisualAssets(parsedResponse.assets);
          }
          if (parsedResponse.suggestions && Array.isArray(parsedResponse.suggestions)) {
            setSuggestions(parsedResponse.suggestions);
          }

          if (parsedResponse.messages && Array.isArray(parsedResponse.messages)) {
            parsedMessages = parsedResponse.messages;
            setMessages(prev => [...prev, ...parsedResponse.messages]);

            // Store the AI messages
            localStorage.setItem('lastAiMessages', JSON.stringify(parsedMessages));

            // Add formatted messages to chat history in localStorage
            const formattedAiMessages = parsedMessages.map((msg, index) => ({
              sender: 'bot',
              text: msg.text,
              facialExpression: msg.facialExpression,
              animation: msg.animation,
              timestamp: new Date().toISOString(),
              assets: msg.assets || []
            }));

            // Update localStorage chat history with each AI message
            const updatedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
            updatedChatHistory.push(...formattedAiMessages);
            localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));

            // Store all AI message arrays
            const allAiMessages = JSON.parse(localStorage.getItem('aiMessages') || '[]');
            allAiMessages.push({
              messages: parsedMessages,
              conversationId: conversationId,
              timestamp: new Date().toISOString()
            });
            localStorage.setItem('aiMessages', JSON.stringify(allAiMessages));
          } else {
            const errorMessage = {
              text: "I had trouble understanding the response. Please try again.",
              facialExpression: "confused",
              animation: "Talking_0"
            };
            setMessages(prev => [...prev, errorMessage]);

            // Add error message to chat history
            const updatedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
            updatedChatHistory.push({
              sender: 'bot',
              text: errorMessage.text,
              facialExpression: errorMessage.facialExpression,
              animation: errorMessage.animation,
              timestamp: new Date().toISOString()
            });
            localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
          }
        } catch (secondaryParseError) {
          console.error("Secondary parse attempt failed:", secondaryParseError);
          const errorMessage = {
            text: "I couldn't process the response correctly. Please try again.",
            facialExpression: "sad",
            animation: "Talking_0"
          };
          setMessages(prev => [...prev, errorMessage]);

          // Add error message to chat history
          const updatedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
          updatedChatHistory.push({
            sender: 'bot',
            text: errorMessage.text,
            facialExpression: errorMessage.facialExpression,
            animation: errorMessage.animation,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        text: "Sorry, there was an error connecting to the server. Please check your connection and try again.",
        facialExpression: "sad",
        animation: "Talking_0"
      };
      setMessages(prev => [...prev, errorMessage]);

      // Add error message to chat history
      const updatedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      updatedChatHistory.push({
        sender: 'bot',
        text: errorMessage.text,
        facialExpression: errorMessage.facialExpression,
        animation: errorMessage.animation,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
    } finally {
      setLoading(false);
    }
  }, [conversationId, groqApiKey]);

  // Process messages queue
  useEffect(() => {
    if (!isPlaying && messages.length > 0 && !processingRef.current) {
      processingRef.current = true;
      const nextMessage = messages[0];

      // Append assets from this segment to the visualAssets list as it starts
      if (nextMessage.assets && Array.isArray(nextMessage.assets)) {
        setVisualAssets(prev => [...prev, ...nextMessage.assets]);
      }

      setMessage(nextMessage);
      setIsPlaying(true);
    }
  }, [messages, isPlaying]);

  const onMessagePlayed = useCallback(() => {
    setIsPlaying(false);
    processingRef.current = false;
    setMessages(prev => {
      const remaining = prev.slice(1);
      // Only clear assets if no more segments are coming
      if (remaining.length === 0) {
        setVisualAssets([]);
      }
      return remaining;
    });
    setMessage(null);
  }, []);

  // Stop Response Function - cancels speech and clears queue
  const stopResponse = useCallback(() => {
    // Cancel any ongoing speech synthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    // Reset all playing states
    setIsPlaying(false);
    processingRef.current = false;
    setMessages([]);
    setMessage(null);
    setCurrentWordIndex(-1);
    setVisualAssets([]);
    setLoading(false);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        stopResponse,
        loading,
        isPlaying,
        cameraZoomed,
        setCameraZoomed,
        conversationId,
        avatarUrl,
        setAvatarUrl,
        backgroundUrl,
        setBackgroundUrl,
        cursorFollow,
        setCursorFollow,
        headSensitivity,
        setHeadSensitivity,
        eyeSensitivity,
        setEyeSensitivity,
        currentWordIndex,
        setCurrentWordIndex,
        captionTextColor,
        setCaptionTextColor,
        captionBgColor,
        setCaptionBgColor,
        captionHighlightColor,
        setCaptionHighlightColor,
        groqApiKey,
        setGroqApiKey,
        isCaptionMoveMode,
        setIsCaptionMoveMode,
        captionPosition,
        setCaptionPosition,
        captionWidth,
        setCaptionWidth,
        visualAssets,
        suggestions
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};