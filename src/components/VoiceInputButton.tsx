// src/components/VoiceInputButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface VoiceInputButtonProps {
  onTranscript: (transcript: string) => void;
  onListeningChange?: (isListening: boolean) => void;
  disabled?: boolean;
}

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export function VoiceInputButton({
  onTranscript,
  onListeningChange,
  disabled = false,
}: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stop after first phrase
    recognition.interimResults = false;
    recognition.lang = "ar-SA"; // Changed to Arabic

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        // Handle cases where no speech is detected or microphone issues
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (onListeningChange) onListeningChange(false);
    };
    
    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript, onListeningChange]);

  const handlePress = () => {
    if (disabled || !recognitionRef.current) return;
    if (!isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        if (onListeningChange) onListeningChange(true);
      } catch (e) {
         console.error("Could not start recognition (already started or other error):", e);
      }
    }
  };

  const handleRelease = () => {
    if (disabled || !recognitionRef.current) return;
    if (isListening) {
       try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error("Could not stop recognition (already stopped or other error):", e);
      }
      // onend will set isListening to false
    }
  };

  if (!recognitionRef.current && typeof window !== 'undefined' && !(window.SpeechRecognition || window.webkitSpeechRecognition)) {
    return (
      <Button variant="outline" size="icon" disabled title="Speech recognition not supported">
        <MicOff className="h-5 w-5" />
      </Button>
    );
  }
  
  return (
    <Button
      variant={isListening ? "destructive" : "default"}
      size="icon"
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onTouchStart={(e) => { e.preventDefault(); handlePress(); }} // Prevent scrolling on touch
      onTouchEnd={handleRelease}
      disabled={disabled}
      className={cn(
        "transition-all duration-150 ease-in-out",
        isListening ? "bg-accent scale-110" : "bg-primary hover:bg-primary/90",
        "text-primary-foreground" 
      )}
      aria-label={isListening ? "إيقاف الاستماع" : "بدء الاستماع"}
    >
      {isListening ? <Mic className="h-5 w-5 animate-pulse" /> : <Mic className="h-5 w-5" />}
    </Button>
  );
}
