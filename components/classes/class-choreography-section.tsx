"use client";

import { useState } from "react";
import { DanceClass } from "@/lib/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Music2 } from "lucide-react";

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

interface Props {
  danceClass: DanceClass;
}

export default function ClassChoreographySection({ danceClass }: Props) {
  const { embedUrl, isShorts } = getYouTubeEmbedUrl(danceClass.video_url);
  const [vinylHovered, setVinylHovered] = useState(false);

  const hasSong = danceClass.song_title || danceClass.song_artist;
  const hasVideo = !!embedUrl;

  // Don't render section if no video and no song
  if (!hasVideo && !hasSong) return null;

  const hasLinks =
    danceClass.song_spotify_url ||
    danceClass.song_youtube_url ||
    danceClass.song_apple_music_url;

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm font-bold tracking-widest text-[#DC143C] uppercase mb-10">
            Coreografía
          </h2>

          {/* Video full-width */}
          {hasVideo && (
            <div className="mb-8">
              <div
                className={`rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 ${
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
          )}

          {/* Song + Platform Links Grid */}
          {hasSong && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Song card with vinyl aesthetic */}
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Rotating vinyl icon */}
                    <div
                      className="relative flex-shrink-0"
                      onMouseEnter={() => setVinylHovered(true)}
                      onMouseLeave={() => setVinylHovered(false)}
                    >
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br from-primary to-black flex items-center justify-center transition-transform ${
                          vinylHovered
                            ? "animate-[spin_3s_linear_infinite]"
                            : "animate-[spin_20s_linear_infinite]"
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-gray-800" />
                      </div>
                      <Music2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white pointer-events-none" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {danceClass.song_title && (
                        <h3 className="font-black text-xl text-white mb-1 truncate">
                          {danceClass.song_title}
                        </h3>
                      )}
                      {danceClass.song_artist && (
                        <p className="text-sm text-gray-400 truncate">
                          {danceClass.song_artist}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Platform cards */}
              {hasLinks && (
                <div className="grid grid-cols-1 gap-3">
                  {danceClass.song_spotify_url && (
                    <a
                      href={danceClass.song_spotify_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Card className="bg-[#1DB954] hover:bg-[#1ed760] border-0 group hover:scale-105 transition-transform cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <svg
                              className="w-6 h-6 text-white flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                            </svg>
                            <span className="text-white font-bold">
                              Escuchar en Spotify
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  )}

                  {danceClass.song_youtube_url && (
                    <a
                      href={danceClass.song_youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Card className="bg-[#FF0023] hover:bg-[#cc001c] border-0 group hover:scale-105 transition-transform cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <svg
                              className="w-6 h-6 text-white flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            <span className="text-white font-bold">
                              Ver en YouTube
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  )}

                  {danceClass.song_apple_music_url && (
                    <a
                      href={danceClass.song_apple_music_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Card className="bg-[#FC3C44] hover:bg-[#e6323a] border-0 group hover:scale-105 transition-transform cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <svg
                              className="w-6 h-6 text-white flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 0 0-1.877-.726 10.496 10.496 0 0 0-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.383.023-.768.053-1.15.1-.466.054-.926.126-1.37.259-.971.29-1.782.8-2.42 1.575-.474.575-.79 1.23-.964 1.94a6.364 6.364 0 0 0-.15 1.31c-.01.143-.01.286-.015.429V18.26c.005.123.005.246.015.37.02.404.056.808.128 1.206.12.663.362 1.283.753 1.844.623.893 1.46 1.515 2.5 1.845.36.115.734.186 1.116.24.26.037.522.063.784.08.152.01.303.017.455.026h12.04c.152-.01.303-.017.455-.026.405-.025.813-.06 1.213-.125.577-.095 1.136-.254 1.664-.519.973-.49 1.732-1.19 2.265-2.15.354-.637.574-1.325.677-2.048.05-.353.082-.708.104-1.064.01-.152.01-.305.015-.458V6.124zM12.15 19.738c-2.314 0-4.19-1.88-4.19-4.193 0-2.314 1.876-4.19 4.19-4.19 2.313 0 4.19 1.876 4.19 4.19 0 2.313-1.877 4.193-4.19 4.193zm4.19-9.546V5.125c0-.254.196-.454.45-.454.063 0 .124.013.183.038.362.15.72.305 1.075.47.558.257 1.11.524 1.664.79.555.266 1.11.533 1.663.798.235.113.47.226.706.338.075.036.15.07.226.105a.448.448 0 0 1 .015.825l-3.39 1.615a.45.45 0 0 1-.592-.21.443.443 0 0 1-.04-.176z" />
                            </svg>
                            <span className="text-white font-bold">
                              Escuchar en Apple Music
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
