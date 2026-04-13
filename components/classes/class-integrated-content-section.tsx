"use client";

import { useState } from "react";
import type { DanceClass } from "@/lib/types/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Music2,
  DollarSign,
  Star,
  Tag,
  Users,
  Instagram,
  ArrowBigDown,
  MoveRight,
  MoveDown,
  CornerRightDown,
} from "lucide-react";
import { CLASS_LEVELS } from "@/constants";

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face";

interface YouTubeEmbedData {
  embedUrl: string | null;
  isShorts: boolean;
}

function getYouTubeEmbedUrl(url: string | null): YouTubeEmbedData {
  if (!url) return { embedUrl: null, isShorts: false };

  try {
    const urlObj = new URL(url);
    let videoId: string | null = null;
    let isShorts = false;

    // Handle youtube.com/watch?v=
    if (
      urlObj.hostname.includes("youtube.com") &&
      urlObj.searchParams.has("v")
    ) {
      videoId = urlObj.searchParams.get("v");
    }
    // Handle youtu.be/
    else if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.slice(1);
    }
    // Handle youtube.com/shorts/
    else if (
      urlObj.hostname.includes("youtube.com") &&
      urlObj.pathname.includes("/shorts/")
    ) {
      const match = urlObj.pathname.match(/\/shorts\/([^/?]+)/);
      if (match) {
        videoId = match[1];
        isShorts = true;
      }
    }
    // Handle youtube.com/embed/
    else if (
      urlObj.hostname.includes("youtube.com") &&
      urlObj.pathname.includes("/embed/")
    ) {
      const match = urlObj.pathname.match(/\/embed\/([^/?]+)/);
      if (match) {
        videoId = match[1];
      }
    }

    if (videoId) {
      return {
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        isShorts,
      };
    }
  } catch {
    // Invalid URL
  }

  return { embedUrl: null, isShorts: false };
}

interface ClassIntegratedContentSectionProps {
  danceClass: DanceClass;
}

export function ClassIntegratedContentSection({
  danceClass,
}: ClassIntegratedContentSectionProps) {
  const photo = danceClass.instructor_photo_url || FALLBACK_PHOTO;
  const [expanded, setExpanded] = useState(false);
  const [vinylHovered, setVinylHovered] = useState(false);
  const spotsLeft = danceClass.max_capacity - danceClass.current_enrollment;
  const levelText = CLASS_LEVELS.find(
    (l) => l.levelNumber == danceClass.level,
  )?.levelText;

  // Video and song data
  const { embedUrl, isShorts } = getYouTubeEmbedUrl(danceClass.video_url);
  const hasSong = danceClass.song_title || danceClass.song_artist;
  const hasVideo = !!embedUrl;
  const hasLinks = danceClass.song_youtube_url;

  return (
    <section className="py-16 px-6 bg-white">
      <div className="container mx-auto max-w-7xl ">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch ">
          {/* LEFT: Instructor Information */}
          <div className="w-full lg:w-3/5  flex flex-col justify-between rounded-2xl  transition-transform  gap-5">
            <div className="flex flex-col items-center lg:flex-row gap-6 lg:items-center mb-6 p-6 rounded-2xl shadow-[0px_0px_5px_rgba(0,0,0,0.10)]  bg-white">
              {/* Photo with animated border */}
              <div className="flex flex-col items-center  w-44 gap-3 flex-shrink-0 ">
                <div className="w-44 h-44      rounded-3xl p-2 bg-primary">
                  <div className="w-full h-full    ">
                    <img
                      src={photo}
                      alt={`Foto de ${danceClass.instructor}`}
                      className="w-full h-full rounded-2xl  object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0 w-full text-center lg:text-left ">
                <Badge className="mb-2 bg-primary/10 text-primary  uppercase rounded-full">
                  Instructor
                </Badge>
                <h3 className="lg:text-5xl font-black text-gray-900 text-2xl mb-3">
                  {danceClass.instructor}
                </h3>
                <div>
                  {danceClass.instructor_instagram_url && (
                    <a
                      href={danceClass.instructor_instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-xs  text-white rounded-full px-4 py-3  bg-primary   hover:bg-primary-dark mb-3 transition-colors "
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Class info boxes */}
            <div className=" ">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                Detalles de la Clase
              </p>
              <div className="grid lg:grid-cols-4 gap-3">
                {danceClass.price !== null && (
                  <div className="  rounded-2xl p-4 flex flex-col gap-1  items-center justify-between shadow-[0px_0px_5px_rgba(0,0,0,0.10)]  bg-white">
                    <DollarSign
                      strokeWidth={3}
                      className="w-6 h-6 text-primary mb-1"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Precio
                    </span>
                    <span className="text-2xl font-black text-gray-900">
                      ${danceClass.price.toFixed(0)}
                    </span>
                  </div>
                )}
                {levelText && (
                  <div className="bg-white   rounded-2xl p-4 flex flex-col gap-1 items-center justify-between shadow-[0px_0px_5px_rgba(0,0,0,0.10)]">
                    <Star
                      strokeWidth={3}
                      className="w-6 h-6 text-primary mb-1"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Nivel
                    </span>
                    <span className="text-lg font-black text-gray-900 leading-tight">
                      {levelText}
                    </span>
                  </div>
                )}
                {danceClass.genre && (
                  <div className="bg-white   rounded-2xl p-4 flex flex-col gap-1  items-center justify-between shadow-[0px_0px_5px_rgba(0,0,0,0.10)]">
                    <Tag
                      strokeWidth={3}
                      className="w-6 h-6 text-primary mb-1"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Género
                    </span>
                    <span className="text-lg font-black text-gray-900 capitalize leading-tight">
                      {danceClass.genre}
                    </span>
                  </div>
                )}
                <div
                  className={` rounded-2xl p-4 flex flex-col gap-1 shadow-[0px_0px_5px_rgba(0,0,0,0.10)] items-center justify-between ${spotsLeft > 0 ? "bg-white " : "bg-red-50 border-red-200"}`}
                >
                  <Users
                    strokeWidth={3}
                    className={`w-6 h-6 mb-1 ${spotsLeft > 0 ? "text-primary" : "text-red-400"}`}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Lugares
                  </span>
                  {spotsLeft > 0 ? (
                    <span className="text-sm font-black text-gray-900 ">
                      {spotsLeft}{" "}
                      <span className="text-sm font-bold text-gray-900">
                        disponibles
                      </span>
                    </span>
                  ) : (
                    <span className="text-lg font-black text-red-500">
                      Clase llena
                    </span>
                  )}
                </div>
              </div>
            </div>

            {hasSong && (
              <div className="bg-white rounded-2xl p-6 shadow-[0px_0px_5px_rgba(0,0,0,0.10)] ">
                <h4 className="text-xs font-bold  tracking-widest  mb-4 uppercase text-primary">
                  Bailando al ritmo de
                </h4>
                <div className="flex gap-4 items-center mb-4 ">
                  <div className="relative flex-shrink-0 animate-spin-slow">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-[#DC143C] flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-gray-900" />
                    </div>
                    <Music2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white pointer-events-none" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {danceClass.song_title && (
                      <h4 className="font-black uppercase text-lg text-gray-900 truncate">
                        {danceClass.song_title}
                      </h4>
                    )}
                    {danceClass.song_artist && (
                      <p className="text-gray-600 text-sm truncate">
                        {danceClass.song_artist}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Video */}
          <div className="lg:w-2/5  rounded-2xl p-6 shadow-[0px_0px_5px_rgba(0,0,0,0.10)] transition-transform ">
            {hasVideo ? (
              <div>
                <div className="mb-4">
                  <h3 className="inline-flex items-center gap-2 text-2xl font-black text-gray-900 uppercase">
                    Coreografía{" "}
                    <CornerRightDown
                      size={18}
                      className="text-gray-900 translate-y-[40%]"
                    />
                  </h3>
                  <p className=" text-sm text-gray-500 mt-0.5">
                    Chequea la coreografía antes de la clase{" "}
                  </p>
                </div>
                <div
                  className={`rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200 h-[450px] ${
                    isShorts ? "aspect-[9/16] max-w-sm mx-auto" : "aspect-video"
                  }`}
                >
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Coreografía"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h3 className="inline-flex items-center gap-2 text-2xl font-black text-gray-900 uppercase">
                  Coreografía
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  No hay video de coreografía disponible aún
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

{
  /* Song box */
}
{
  /* {hasSong && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                  Canción de la Clase
                </h4>
                <div className="flex gap-4 items-center mb-4">
                  <div className="relative flex-shrink-0 animate-spin-slow">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-[#DC143C] flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-gray-900" />
                    </div>
                    <Music2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white pointer-events-none" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {danceClass.song_title && (
                      <h4 className="font-black text-lg text-gray-900 truncate">
                        {danceClass.song_title}
                      </h4>
                    )}
                    {danceClass.song_artist && (
                      <p className="text-gray-600 text-sm truncate">
                        {danceClass.song_artist}
                      </p>
                    )}
                  </div>
                </div>

                {hasLinks && (
                  <div className="flex flex-col flex-wrap gap-3">
                    {danceClass.song_youtube_url && (
                      <a
                        href={danceClass.song_youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[120px]"
                      >
                        <div className="group bg-[#FF0000] border border-[#FF0000] hover:bg-[#cc001c] p-3 rounded-xl text-white text-center transition-colors cursor-pointer">
                          <span className="text-sm font-bold flex flex-row items-center justify-center gap-2">
                            <svg
                              className="group-hover:fill-white fill-white w-5"
                              role="img"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>YouTube</title>
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            Escuchar Canción
                          </span>
                        </div>
                      </a>
                    )}
                  </div>
                )}
              </div>
            )} */
}
