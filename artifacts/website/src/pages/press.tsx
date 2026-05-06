import { useState, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetFeaturedPosts, useListPosts, Post } from "@workspace/api-client-react";
import { format } from "date-fns";
import { PlayCircle, FileText, Headphones, ExternalLink, Download, Link2, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      const id = u.hostname.includes("youtu.be")
        ? u.pathname.slice(1)
        : u.searchParams.get("v") ?? u.pathname.split("/").pop();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

function CopyLinkButton({ postId }: { postId: number }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `https://pamliecoconnect.com/press/${postId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [postId]);

  return (
    <button
      onClick={copy}
      title={copied ? "Copied!" : "Copy shareable link"}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors ml-auto"
    >
      {copied
        ? <><Check className="h-3.5 w-3.5 text-green-400" /><span className="text-green-400">Copied!</span></>
        : <><Link2 className="h-3.5 w-3.5" />Copy link</>
      }
    </button>
  );
}

export default function Press() {
  const { data: featuredPosts, isLoading: featuredLoading } = useGetFeaturedPosts();
  const { data: allPosts, isLoading: allLoading } = useListPosts();

  const isStoredAudio = (url: string) =>
    url.startsWith("/api/storage") || /\.(mp3|m4a|wav|ogg|aac)$/i.test(url);

  const isStoredVideo = (url: string) =>
    url.startsWith("/api/storage") || /\.(mp4|webm|mov)$/i.test(url);

  const isPdf = (url: string) =>
    url.startsWith("/api/storage") || /\.pdf$/i.test(url);

  const renderAudioCard = (post: Post) => (
    <Card key={post.id} className="overflow-hidden border-border bg-card/50 hover:bg-card transition-colors flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider">
            <Headphones className="h-4 w-4" />
            Audio Blog
          </span>
          <span className="text-xs text-muted-foreground">{format(new Date(post.publishedAt), "MMM d, yyyy")}</span>
        </div>
        <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        <CardDescription className="text-sm line-clamp-2">{post.excerpt}</CardDescription>
        {post.mediaUrl && isStoredAudio(post.mediaUrl) ? (
          <audio controls className="w-full mt-1" src={post.mediaUrl} preload="metadata">
            Your browser does not support the audio element.
          </audio>
        ) : null}
        <div className="mt-auto flex items-center">
          {post.mediaUrl ? (
            <a
              href={post.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              <Headphones className="h-3.5 w-3.5" /> Listen now →
            </a>
          ) : (
            <Link href={`/press/${post.id}`} className="text-sm font-semibold text-primary hover:underline">
              View details →
            </Link>
          )}
          <CopyLinkButton postId={post.id} />
        </div>
      </CardContent>
    </Card>
  );

  const renderVideoCard = (post: Post) => {
    const embedUrl = post.mediaUrl && !isStoredVideo(post.mediaUrl)
      ? getEmbedUrl(post.mediaUrl)
      : null;

    return (
      <Card key={post.id} className="overflow-hidden border-border bg-card/50 hover:bg-card transition-colors flex flex-col">
        {post.mediaUrl && (
          <div className="w-full bg-muted overflow-hidden">
            {isStoredVideo(post.mediaUrl) ? (
              <video controls className="w-full max-h-52 object-cover" src={post.mediaUrl} preload="metadata">
                Your browser does not support video.
              </video>
            ) : embedUrl ? (
              <div className="aspect-video">
                <iframe
                  src={embedUrl}
                  title={post.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ) : (
              <a
                href={post.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-3 aspect-video bg-muted hover:bg-accent transition-colors"
              >
                <div className="rounded-full bg-primary/10 border border-primary/30 p-4">
                  <PlayCircle className="h-10 w-10 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary flex items-center gap-1.5">
                  Watch Video <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </a>
            )}
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider">
              <PlayCircle className="h-4 w-4" />
              Video Presentation
            </span>
            <span className="text-xs text-muted-foreground">{format(new Date(post.publishedAt), "MMM d, yyyy")}</span>
          </div>
          <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm line-clamp-2">{post.excerpt}</CardDescription>
          <div className="mt-3 flex items-center">
            {post.mediaUrl ? (
              <a
                href={post.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                <PlayCircle className="h-3.5 w-3.5" /> Watch now →
              </a>
            ) : (
              <Link href={`/press/${post.id}`} className="text-sm font-semibold text-primary hover:underline">
                View details →
              </Link>
            )}
            <CopyLinkButton postId={post.id} />
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderResearchCard = (post: Post) => (
    <Card key={post.id} className="overflow-hidden border-border bg-card/50 hover:bg-card transition-colors flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider">
            <FileText className="h-4 w-4" />
            Written Research
          </span>
          <span className="text-xs text-muted-foreground">{format(new Date(post.publishedAt), "MMM d, yyyy")}</span>
        </div>
        <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        <CardDescription className="text-sm line-clamp-3">{post.excerpt}</CardDescription>
        {post.mediaUrl && (
          <a
            href={post.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <Download className="h-4 w-4" />
            {isPdf(post.mediaUrl) ? "Download PDF" : "Open document"}
          </a>
        )}
        <div className="mt-auto flex items-center">
          {post.mediaUrl ? (
            <a
              href={post.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              <FileText className="h-3.5 w-3.5" /> {isPdf(post.mediaUrl) ? "Open PDF →" : "Read now →"}
            </a>
          ) : (
            <Link href={`/press/${post.id}`} className="text-sm font-semibold text-primary hover:underline">
              Read more →
            </Link>
          )}
          <CopyLinkButton postId={post.id} />
        </div>
      </CardContent>
    </Card>
  );

  const videos = [
    ...(featuredPosts?.videos ?? []),
    ...(allPosts?.filter(p => p.type === "video" && !featuredPosts?.videos?.some(f => f.id === p.id)) ?? []),
  ];
  const audioPosts = [
    ...(featuredPosts?.presentations ?? []),
    ...(allPosts?.filter(p => p.type === "presentation" && !featuredPosts?.presentations?.some(f => f.id === p.id)) ?? []),
  ];
  const research = [
    ...(featuredPosts?.pressReleases ?? []),
    ...(allPosts?.filter(p => p.type === "press_release" && !featuredPosts?.pressReleases?.some(f => f.id === p.id)) ?? []),
  ];

  const isEmpty = !videos.length && !audioPosts.length && !research.length;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <section className="py-24 bg-card border-b border-border">
          <div className="container px-4 md:px-8 max-w-4xl">
            <h1 className="text-5xl font-display font-bold mb-6">Press & Multimedia</h1>
            <p className="text-xl text-muted-foreground">
              Audio blogs, video presentations, and written research from Phillips Boatworks.
            </p>
          </div>
        </section>

        <section className="py-16 container px-4 md:px-8">
          {(featuredLoading || allLoading) ? (
            <div className="grid md:grid-cols-3 gap-8 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-accent rounded-xl" />
              ))}
            </div>
          ) : isEmpty ? (
            <div className="text-center py-12 text-muted-foreground">
              No media available yet — check back soon.
            </div>
          ) : (
            <div className="space-y-16">
              {videos.length > 0 && (
                <div>
                  <h2 className="text-2xl font-display font-bold mb-8 border-b border-border pb-4">Video Presentations</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map(renderVideoCard)}
                  </div>
                </div>
              )}

              {audioPosts.length > 0 && (
                <div>
                  <h2 className="text-2xl font-display font-bold mb-8 border-b border-border pb-4">Audio Blogs</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {audioPosts.map(renderAudioCard)}
                  </div>
                </div>
              )}

              {research.length > 0 && (
                <div>
                  <h2 className="text-2xl font-display font-bold mb-8 border-b border-border pb-4">Written Research</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {research.map(renderResearchCard)}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
