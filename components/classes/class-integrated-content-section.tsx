"use client";

import { useState } from "react";
import type { DanceClass } from "@/lib/types/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Music2 } from "lucide-react";

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

  // Video and song data
  const { embedUrl, isShorts } = getYouTubeEmbedUrl(danceClass.video_url);
  const hasSong = danceClass.song_title || danceClass.song_artist;
  const hasVideo = !!embedUrl;
  const hasLinks = danceClass.song_spotify_url;

  return (
    <section className="py-16 px-6 bg-white">
      <div className="container mx-auto max-w-7xl ">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* LEFT: Instructor Information */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 ">
            <div className="flex flex-col items-center  lg:flex-row  gap-6 lg:items-start mb-6">
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

              <div className="flex-1 min-w-0 w-full text-center ">
                <Badge className="mb-2 bg-primary/10 text-primary border-primary/20">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Instructor Verificado
                </Badge>
                <h3 className="lg:text-3xl font-black text-gray-900 text-2xl">
                  {danceClass.instructor}
                </h3>
              </div>
            </div>

            {/* Bio with expand/collapse */}

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
