"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";

// If you're using App Router, save this as `app/page.tsx`.
// If using Pages Router, save as `pages/index.tsx`.

export default function ComingSoon() {
  /**
   * ======== SETUP ========
   * 1) Put the station logo file in `/public/mais-fm-logo.png`.
   *    (You can use the image you sent here; just download and rename.)
   * 2) Replace `streamUrl` with your real streaming URL (e.g., Icecast/Shoutcast).
   */
  const streamUrl = process.env.NEXT_PUBLIC_STREAM_URL || "https://example.com/stream.aac"; // TODO: replace with your stream URL

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.9);
  const [duration, setDuration] = useState(0); // for on-demand files; streams may report 0
  const [currentTime, setCurrentTime] = useState(0);

  const formattedTime = (sec: number) => {
    if (!isFinite(sec) || sec < 0) return "--:--";
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Play / Pause with error handling (autoplay restrictions etc.)
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    try {
      setIsLoading(true);
      await audio.play();
      setIsPlaying(true);
    } catch (e) {
      console.error("Playback failed:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVolume = (v: number) => {
    const audio = audioRef.current;
    const clamped = Math.min(1, Math.max(0, v));
    setVolume(clamped);
    if (audio) audio.volume = clamped;
    if (clamped === 0 && !isMuted) setIsMuted(true);
    if (clamped > 0 && isMuted) setIsMuted(false);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    setIsMuted((prev) => {
      const next = !prev;
      if (audio) audio.muted = next;
      return next;
    });
  };

  // Progress updater (useful for files; harmless for live streams)
  const step = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime || 0);
    }
    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMeta = () => setDuration(audio.duration || 0);
    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onEnded = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);
    const onError = (e: Event) => {
      console.error("Audio error:", e);
      setIsLoading(false);
    };

    audio.addEventListener("loadedmetadata", onLoadedMeta);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("error", onError);

    rafRef.current = requestAnimationFrame(step);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMeta);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("error", onError);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Ensure element exists & keep settings in sync
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;
  }, [volume, isMuted]);

  // Progress percentage (for VOD; stream often 0)
  const progress = useMemo(() => {
    if (!duration || !isFinite(duration)) return 0;
    return Math.min(100, Math.max(0, (currentTime / duration) * 100));
  }, [currentTime, duration]);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-fuchsia-600 via-purple-700 to-violet-800 text-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-10 border border-white/15"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative h-28 w-28 shrink-0">
              <Image
                src="/mais-fm-logo.png"
                alt="Mais FM 104.9 Logo"
                fill
                className="object-contain drop-shadow-md"
                priority
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Em breve: novo site da Mais FM 104.9</h1>
              <p className="text-white/80 mt-2">
                Estamos preparando uma experiência moderna para você. Enquanto isso, ouça a nossa programação ao vivo no player abaixo.
              </p>
            </div>
          </div>

          {/* Player */}
          <div className="mt-8">
            <div className="bg-black/30 rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-4">
                {/* Play/Pause */}
                <button
                  aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                  onClick={togglePlay}
                  className="h-14 w-14 rounded-full bg-white text-purple-700 grid place-content-center disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-7 w-7 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-7 w-7" />
                  ) : (
                    <Play className="h-7 w-7 translate-x-[1px]" />
                  )}
                </button>

                {/* Track info (editable) */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm uppercase tracking-widest text-white/70">Ao vivo</p>
                  <p className="truncate text-lg font-semibold">Mais FM 104.9 • Quixadá, CE</p>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-3 w-40">
                  <button
                    aria-label={isMuted ? "Ativar som" : "Silenciar"}
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolume(parseFloat(e.target.value))}
                    className="w-full accent-white"
                  />
                </div>
              </div>

              {/* Progress */}
              <div className="mt-5">
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>{formattedTime(currentTime)}</span>
                  <span>{duration ? formattedTime(duration) : "AO VIVO"}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/80 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Hidden native audio element */}
              <audio
                ref={audioRef}
                src={streamUrl}
                preload="none"
                crossOrigin="anonymous"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-white/70">
            © {new Date().getFullYear()} Mais FM 104.9 – Todos os direitos reservados.
          </div>
        </motion.div>
      </div>

      {/* Background deco blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1.2 }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full blur-3xl bg-fuchsia-400/40" />
        <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full blur-3xl bg-cyan-400/40" />
      </motion.div>
    </main>
  );
}
