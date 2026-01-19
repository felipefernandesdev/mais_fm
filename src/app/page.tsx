// "use client";

// import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import { Play, Pause, Volume2, VolumeX, Wifi, AlertCircle, Loader2 } from "lucide-react";

// export default function ComingSoon() {
//   const streamUrl = "https://server14.srvsh.com.br:7638/stream"; // URL corrigida (sem espaço)
//   const logoSrc = "/logo_oficial.png";

//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isMuted, setIsMuted] = useState(false); // Agora começa sem mute (mas autoplay com som pode falhar)
//   const [volume, setVolume] = useState(0.8); // Volume alto por padrão
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const audio = new Audio();
//     audio.src = streamUrl;
//     audio.preload = "auto";
//     audio.volume = 0.8; // Define volume alto antes de tocar
//     audio.muted = false; // Inicia sem mute (melhor UX, mas autoplay pode falhar)
//     audioRef.current = audio;

//     const onPlaying = () => {
//       setIsLoading(false);
//       setIsPlaying(true);
//       setError("");
//     };

//     const onPause = () => setIsPlaying(false);
//     const onWaiting = () => setIsLoading(true);
//     const onEnded = () => setIsPlaying(false);

//     const handleError = () => {
//       setIsLoading(false);
//       setError("Falha ao conectar ao stream. Verifique sua conexão.");
//     };

//     audio.addEventListener("playing", onPlaying);
//     audio.addEventListener("pause", onPause);
//     audio.addEventListener("waiting", onWaiting);
//     audio.addEventListener("ended", onEnded);
//     audio.addEventListener("error", handleError);

//     // Tenta tocar automaticamente
//     const attemptAutoPlay = async () => {
//       try {
//         await audio.play();
//         console.log("Autoplay com som iniciado com sucesso");
//       } catch (err) {
//         console.warn("Autoplay com som bloqueado. Aguarde interação do usuário.");
//         setIsLoading(false);
//         // Não trava: o usuário pode clicar no botão depois
//       }
//     };

//     attemptAutoPlay();

//     return () => {
//       audio.removeEventListener("playing", onPlaying);
//       audio.removeEventListener("pause", onPause);
//       audio.removeEventListener("waiting", onWaiting);
//       audio.removeEventListener("ended", onEnded);
//       audio.removeEventListener("error", handleError);
//       audio.pause();
//     };
//   }, [streamUrl]);

//   // Atualiza volume e mute no elemento de áudio
//   const handleVolume = (v: number) => {
//     const clamped = Math.min(1, Math.max(0, v));
//     setVolume(clamped);
//     if (audioRef.current) {
//       audioRef.current.volume = clamped;
//       if (clamped === 0) {
//         setIsMuted(true);
//         audioRef.current.muted = true;
//       } else {
//         setIsMuted(false);
//         audioRef.current.muted = false;
//       }
//     }
//   };

//   const toggleMute = () => {
//     setIsMuted((prev) => !prev);
//     if (audioRef.current) {
//       audioRef.current.muted = !isMuted;
//     }
//   };

//   const togglePlay = async () => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     if (isPlaying) {
//       audio.pause();
//       setIsPlaying(false);
//     } else {
//       try {
//         await audio.play();
//         setIsPlaying(true);
//       } catch (err) {
//         setError("Clique novamente para ativar o som.");
//       }
//     }
//   };

//   return (
//     <>
//       {/* Reset global */}
//       <style jsx global>{`
//         html,
//         body,
//         #__next {
//           margin: 0;
//           padding: 0;
//           height: 100%;
//           overflow-x: hidden;
//         }
//         body {
//           background: linear-gradient(135deg, #0c4a6e, #0891b2, #047857);
//           background-attachment: fixed;
//           min-height: 100vh;
//         }
//       `}</style>

//       <main className="min-h-screen w-full flex items-center justify-center p-4 relative">
//         {/* Fundo */}
//         <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-800"></div>
//         <div className="absolute inset-0 -z-10 opacity-30">
//           <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl bg-blue-400"></div>
//           <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full blur-3xl bg-teal-400"></div>
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//           className="max-w-3xl w-full mx-auto text-center"
//         >
//           {/* Logo com destaque */}
//           <motion.div
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
//             className="mb-6"
//           >
//             <div className="relative h-40 w-40 mx-auto shadow-2xl rounded-full bg-white p-3 transition-transform hover:scale-105">
//               <Image
//                 src={logoSrc}
//                 alt="Mais FM 104.9 Logo"
//                 fill
//                 className="object-contain drop-shadow-lg"
//                 priority
//               />
//             </div>
//           </motion.div>

//           <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
//             Breve novo site da Mais FM 104.9
//           </h1>
//           <p className="text-white/80 mb-8 text-sm sm:text-base">
//             Uma nova experiência está chegando. Enquanto isso, ouça a melhor programação de Quixeramobim.
//           </p>

//           {/* Player */}
//           <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
//             {/* Status ao vivo */}
//             <div className="flex items-center justify-center gap-2 text-cyan-200 text-sm mb-5">
//               <Wifi className="h-4 w-4 animate-pulse" />
//               <span className="font-semibold">AO VIVO</span>
//             </div>

//             {/* Botão principal */}
//             <button
//               onClick={togglePlay}
//               disabled={isLoading}
//               className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 disabled:opacity-80 rounded-xl flex items-center justify-center gap-3 text-white font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95 mb-5"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="h-5 w-5 animate-spin" />
//                   Conectando...
//                 </>
//               ) : isPlaying ? (
//                 <>
//                   <Pause className="h-5 w-5" />
//                   Pausar
//                 </>
//               ) : (
//                 <>
//                   <Play className="h-5 w-5 ml-[1px]" />
//                   Reproduzir
//                 </>
//               )}
//             </button>

//             {/* Mensagem de erro */}
//             {error && (
//               <div className="flex items-center gap-2 text-yellow-200 bg-yellow-500/20 px-4 py-2 rounded-lg text-xs mb-4">
//                 <AlertCircle className="h-4 w-4" />
//                 <span>{error}</span>
//               </div>
//             )}

//             {/* Informações do stream */}
//             <div className="text-left text-xs text-white/80 space-y-1 mb-5">
//               <p><strong>Estação:</strong> Mais FM 104.9 • Quixeramobim, CE</p>
//             </div>

//             {/* Controle de volume */}
//             <div className="flex items-center gap-3 justify-center">
//               <button
//                 onClick={toggleMute}
//                 className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
//               >
//                 {isMuted ? (
//                   <VolumeX className="h-4 w-4" />
//                 ) : (
//                   <Volume2 className="h-4 w-4" />
//                 )}
//               </button>
//               <input
//                 type="range"
//                 min="0"
//                 max="1"
//                 step="0.01"
//                 value={isMuted ? 0 : volume}
//                 onChange={(e) => handleVolume(parseFloat(e.target.value))}
//                 className="w-36 sm:w-48 h-1 accent-emerald-400"
//               />
//             </div>
//           </div>

//           {/* Rodapé */}
//           <div className="mt-8 text-center text-xs text-white/60">
//             © {new Date().getFullYear()} Mais FM 104.9 • Todos os direitos reservados.
//           </div>
//         </motion.div>
//       </main>
//     </>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Wifi,
  AlertCircle,
  Loader2,
  Radio,
  Tv,
} from "lucide-react";

export default function ComingSoon() {
  const streamUrl = "https://server14.srvsh.com.br:7638/stream";
  const logoSrc = "/logo_oficial.png";
  const twitchChannel = "maisfm104";

  // ⚠️ ⚠️ ⚠️ IMPORTANTE: Substitua "seu-dominio.com" pelo seu domínio REAL (ex: maisfm104.com.br)
  // O Twitch exige que este domínio esteja cadastrado em: https://dev.twitch.tv/console/apps
  const twitchParentDomain = "seu-dominio.com"; // ← ALTERE ISSO ANTES DE PUBLICAR!

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeTab, setActiveTab] = useState<"radio" | "tv">("radio");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [error, setError] = useState("");

  // Lógica do player de rádio
  useEffect(() => {
    if (activeTab !== "radio") return;

    const audio = new Audio();
    audio.src = streamUrl;
    audio.preload = "auto";
    audio.volume = 0.8;
    audio.muted = false;
    audioRef.current = audio;

    const onPlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
      setError("");
    };
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onEnded = () => setIsPlaying(false);
    const handleError = () => {
      setIsLoading(false);
      setError("Falha ao conectar ao stream. Verifique sua conexão.");
    };

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", handleError);

    const attemptAutoPlay = async () => {
      try {
        await audio.play();
        console.log("Autoplay com som iniciado com sucesso");
      } catch (err) {
        console.warn("Autoplay com som bloqueado. Aguarde interação do usuário.");
        setIsLoading(false);
      }
    };

    attemptAutoPlay();

    return () => {
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
    };
  }, [streamUrl, activeTab]);

  const handleVolume = (v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    setVolume(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
      if (clamped === 0) {
        setIsMuted(true);
        audioRef.current.muted = true;
      } else {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        setError("Clique novamente para ativar o som.");
      }
    }
  };

  return (
    <>
      <style jsx global>{`
        html,
        body,
        #__next {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow-x: hidden;
        }
        body {
          background: linear-gradient(135deg, #0c4a6e, #0891b2, #047857);
          background-attachment: fixed;
          min-height: 100vh;
        }
      `}</style>

      <main className="min-h-screen w-full flex items-center justify-center p-4 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-800"></div>
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl bg-blue-400"></div>
          <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full blur-3xl bg-teal-400"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl w-full mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="relative h-40 w-40 mx-auto shadow-2xl rounded-full bg-white p-3 transition-transform hover:scale-105">
              <Image
                src={logoSrc}
                alt="Mais FM 104.9 Logo"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Breve novo site da Mais FM 104.9
          </h1>
          <p className="text-white/80 mb-6 text-sm sm:text-base">
            Uma nova experiência está chegando. Enquanto isso, acompanhe nossa programação:
          </p>

          {/* Toggle entre Rádio e TV */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setActiveTab("radio")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${
                activeTab === "radio"
                  ? "bg-emerald-500 text-white shadow-md"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              <Radio className="h-4 w-4" />
              Webrádio
            </button>
            <button
              onClick={() => setActiveTab("tv")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${
                activeTab === "tv"
                  ? "bg-cyan-500 text-white shadow-md"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              <Tv className="h-4 w-4" />
              Streaming TV
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            {activeTab === "radio" ? (
              <>
                <div className="flex items-center justify-center gap-2 text-cyan-200 text-sm mb-5">
                  <Wifi className="h-4 w-4 animate-pulse" />
                  <span className="font-semibold">AO VIVO</span>
                </div>

                <button
                  onClick={togglePlay}
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 disabled:opacity-80 rounded-xl flex items-center justify-center gap-3 text-white font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95 mb-5"
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

                <div className="text-left text-xs text-white/80 space-y-1 mb-5">
                  <p>
                    <strong>Estação:</strong> Mais FM 104.9 • Quixeramobim, CE
                  </p>
                </div>

                <div className="flex items-center gap-3 justify-center">
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                  >
                    {isMuted ? (
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
                    className="w-36 sm:w-48 h-1 accent-emerald-400"
                  />
                </div>
              </>
            ) : (
              // ✅ Embed CORRIGIDO do Twitch
              <div className="flex flex-col items-center">
                <h2 className="text-white font-bold mb-4">Transmissão ao Vivo</h2>
                <div className="w-full max-w-[620px] aspect-video bg-black rounded-lg overflow-hidden border border-white/20">
                  <iframe
                    src={`https://player.twitch.tv/?channel=${twitchChannel}&parent=${twitchParentDomain}`}
                    height="100%"
                    width="100%"
                    frameBorder="0"
                    allowFullScreen
                    title="Mais FM 104.9 TV"
                  ></iframe>
                </div>
                <p className="text-white/80 text-xs mt-3">
                  Assista à programação da Mais FM 104.9 em tempo real.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 text-center text-xs text-white/60">
            © {new Date().getFullYear()} Mais FM 104.9 • Todos os direitos reservados.
          </div>
        </motion.div>
      </main>
    </>
  );
}