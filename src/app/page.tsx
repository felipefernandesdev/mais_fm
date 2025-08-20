"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Wifi, AlertCircle, Loader2 } from "lucide-react";

export default function ComingSoon() {
  const streamUrl = "/api/radio";
  const logoSrc = "/mais-fm-logo.png";

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [error, setError] = useState("");

  // Inicializa áudio
  useEffect(() => {
    const audio = new Audio();
    audio.src = streamUrl;
    audio.preload = "none";
    audio.muted = true;
    audioRef.current = audio;

    const handleError = () => {
      setIsLoading(false);
      setError("Erro ao conectar ao stream.");
    };

    audio.addEventListener("error", handleError);
    return () => {
      audio.removeEventListener("error", handleError);
      audio.pause();
    };
  }, [streamUrl]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsLoading(true);
    setError("");

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        audio.muted = isMuted;
        setIsPlaying(true);
      }
    } catch (err) {
      console.warn("Autoplay bloqueado.");
      setError("Clique novamente para ativar o som.");
      audio.muted = false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleVolume = (v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    setVolume(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    if (clamped === 0) {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.muted = true;
    } else {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.muted = false;
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  return (
    <>
      {/* Reset de estilos globais para evitar bordas e espaços */}
      <style jsx global>{`
        html,
        body,
        #__next {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow-x: hidden;
          scroll-behavior: smooth;
        }

        body {
          background: linear-gradient(135deg, #0c4a6e, #0891b2, #047857);
          background-attachment: fixed;
          min-height: 100vh;
        }

        /* Evita faixa preta no final */
        html {
          height: 100%;
          overflow-y: auto;
        }

        /* Remove margem inferior do scrollbar */
        .scrollbar-hide::-webkit-scrollbar {
          width: 0;
        }
      `}</style>

      <main className="min-h-screen w-full flex items-center justify-center p-4 relative">
        {/* Fundo com gradient e blobs */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-800"></div>
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl bg-blue-400"></div>
          <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full blur-3xl bg-teal-400"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl w-full mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-5 sm:p-8 border border-white/20">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative h-24 w-24">
                <Image
                  src={logoSrc}
                  alt="Mais FM 104.9 Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold">Breve novo site da Mais FM 104.9</h1>
                <p className="text-white/80 mt-2 text-sm">
                  Uma nova experiência está chegando. Enquanto isso, ouça a melhor programação de Quixeramobim.
                </p>
              </div>
            </div>

            <div className="mt-7">
              <div className="bg-black/20 rounded-2xl p-5 border border-white/15">
                <div className="flex items-center gap-2 text-cyan-200 text-sm mb-4 justify-center sm:justify-start">
                  <Wifi className="h-4 w-4 animate-pulse" />
                  <span className="font-medium">AO VIVO</span>
                </div>

                <button
                  onClick={togglePlay}
                  disabled={isLoading}
                  className="w-full sm:w-auto sm:px-6 py-3 bg-gradient-to-r from-coral-500 to-orange-500 hover:from-coral-400 hover:to-orange-400 disabled:opacity-70 rounded-xl flex items-center justify-center gap-3 text-white font-semibold shadow-lg transition-all transform hover:scale-105 active:scale-95 mb-5"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Conectando...
                    </>
                  ) : isPlaying ? (
                    <>
                      <Pause className="h-5 w-5" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 ml-[1px]" />
                      Reproduzir
                    </>
                  )}
                </button>

                {error && (
                  <div className="flex items-center gap-2 text-yellow-200 bg-yellow-500/20 px-4 py-2 rounded-lg text-xs mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="text-center sm:text-left text-xs text-white/70 space-y-1">
                  <p><strong>Estação:</strong> Mais FM 104.9 • Quixeramobim, CE</p>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolume(parseFloat(e.target.value))}
                    className="flex-1 h-1 accent-orange-400"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-white/60">
              © {new Date().getFullYear()} Mais FM 104.9 • Todos os direitos reservados.
              <br />
              Streaming via RadioCaster
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}