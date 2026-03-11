"use client";

import { useState } from "react";
import type { DanceClass } from "@/lib/types/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Music2 } from "lucide-react";

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face";

const DEFAULT_BIO =
  "Profesional de la danza con años de experiencia en formación y escenario. Apasionado por compartir el ritmo y la cultura del baile con cada alumno.";

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
  const bio = danceClass.instructor_bio || DEFAULT_BIO;
  const [expanded, setExpanded] = useState(false);
  const [vinylHovered, setVinylHovered] = useState(false);

  // Check if bio is long enough to need expansion
  const needsExpansion = bio.length > 200;

  // Video and song data
  const { embedUrl, isShorts } = getYouTubeEmbedUrl(danceClass.video_url);
  const hasSong = danceClass.song_title || danceClass.song_artist;
  const hasVideo = !!embedUrl;
  const hasLinks =
    danceClass.song_spotify_url ||
    danceClass.song_youtube_url ||
    danceClass.song_apple_music_url;

  return (
    <section className="py-16 px-6 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* LEFT: Instructor Information */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <div className="flex gap-6 items-start mb-6">
              {/* Photo with animated border */}
              <div className="relative w-32 h-32 flex-shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary via-[#DC143C] to-primary p-1 ">
                  <div className="w-full h-full rounded-2xl bg-white p-1">
                    <img
                      src={photo}
                      alt={`Foto de ${danceClass.instructor}`}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <Badge className="mb-2 bg-primary/10 text-primary border-primary/20">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Instructor Verificado
                </Badge>
                <h3 className="text-3xl font-black text-gray-900">
                  Instructor: {danceClass.instructor}
                </h3>
              </div>
            </div>

            {/* Bio with expand/collapse */}
            <p
              className={`text-gray-600 leading-relaxed text-base ${!expanded && needsExpansion ? "line-clamp-4" : ""}`}
            >
              {bio}
            </p>

            {needsExpansion && (
              <Button
                variant="ghost"
                onClick={() => setExpanded(!expanded)}
                className="mt-3 text-primary hover:text-[#DC143C] hover:bg-primary/5 font-bold"
              >
                {expanded ? "Leer menos" : "Leer más"}
              </Button>
            )}
            {hasSong && (
              <div className="bg-gray-50 rounded-2xl p-6 mt-10 border border-gray-200">
                <div className="flex gap-4 items-center mb-4">
                  {/* Vinyl icon */}
                  <div className="relative flex-shrink-0 animate-spin-slow">
                    <div
                      className={`w-14 h-14 rounded-full bg-gradient-to-br from-primary to-[#DC143C] flex items-center justify-center transition-transform `}
                    >
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

                {/* Platform links - horizontal layout */}
                {hasLinks && (
                  <div className="flex flex-col flex-wrap gap-3">
                    {danceClass.song_apple_music_url && (
                      <a
                        href={danceClass.song_apple_music_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[120px]"
                      >
                        <div className="group bg-[#fa243d37] border border-[#FA243C] hover:bg-[#d92f37] p-3 rounded-xl text-[#FA243C] hover:text-white  text-center transition-colors cursor-pointer">
                          <span className="text-sm font-bold flex flex-row items-center justify-center gap-2">
                            <svg
                              className="group-hover:fill-white fill-[#FA243C] w-5"
                              role="img"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Apple Music</title>
                              <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.295-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.045-1.773-.6-1.943-1.536a1.88 1.88 0 011.038-2.022c.323-.16.67-.25 1.018-.324.378-.082.758-.153 1.134-.24.274-.063.457-.23.51-.516a.904.904 0 00.02-.193c0-1.815 0-3.63-.002-5.443a.725.725 0 00-.026-.185c-.04-.15-.15-.243-.304-.234-.16.01-.318.035-.475.066-.76.15-1.52.303-2.28.456l-2.325.47-1.374.278c-.016.003-.032.01-.048.013-.277.077-.377.203-.39.49-.002.042 0 .086 0 .13-.002 2.602 0 5.204-.003 7.805 0 .42-.047.836-.215 1.227-.278.64-.77 1.04-1.434 1.233-.35.1-.71.16-1.075.172-.96.036-1.755-.6-1.92-1.544-.14-.812.23-1.685 1.154-2.075.357-.15.73-.232 1.108-.31.287-.06.575-.116.86-.177.383-.083.583-.323.6-.714v-.15c0-2.96 0-5.922.002-8.882 0-.123.013-.25.042-.37.07-.285.273-.448.546-.518.255-.066.515-.112.774-.165.733-.15 1.466-.296 2.2-.444l2.27-.46c.67-.134 1.34-.27 2.01-.403.22-.043.442-.088.663-.106.31-.025.523.17.554.482.008.073.012.148.012.223.002 1.91.002 3.822 0 5.732z" />
                            </svg>
                            Apple Music
                          </span>
                        </div>
                      </a>
                    )}
                    {danceClass.song_spotify_url && (
                      <a
                        href={danceClass.song_spotify_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[120px]"
                      >
                        <div className="group bg-[#1ed75f7a] border border-[#1ED760] hover:bg-[#1ED760] p-3 rounded-xl text-[#1db954] hover:text-white  text-center transition-colors cursor-pointer ">
                          <span className="text-sm font-bold flex flex-row items-center justify-center gap-2">
                            <svg
                              className="group-hover:fill-white fill-[#1db954] w-5"
                              role="img"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>Spotify</title>
                              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                            </svg>
                            Spotify
                          </span>
                        </div>
                      </a>
                    )}

                    {danceClass.song_youtube_url && (
                      <a
                        href={danceClass.song_youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[120px]"
                      >
                        <div className="group bg-[#FF0000] border border-[#FF0000] hover:bg-[#cc001c] p-3 rounded-xl text-[#FF0023]. hover:text-white text-center transition-colors cursor-pointer">
                          <span className="text-sm font-bold flex flex-row items-center justify-center gap-2">
                            <svg
                              className="group-hover:fill-white fill-[#FF0023] w-5"
                              role="img"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <title>YouTube</title>
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            YouTube
                          </span>
                        </div>
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Video & Song Information */}
          <div className="space-y-6">
            {/* Video embed */}
            {hasVideo && (
              <div
                className={`rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200 ${
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
            )}

            {/* Song info card */}
          </div>
        </div>
      </div>
    </section>
  );
}
