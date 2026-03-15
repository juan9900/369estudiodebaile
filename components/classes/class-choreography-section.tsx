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

  const hasLinks = danceClass.song_youtube_url;

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
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
