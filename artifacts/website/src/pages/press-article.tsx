import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetPost } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, FileText, PlayCircle, Headphones, Download, ExternalLink, Link2, Check, Share2 } from "lucide-react";

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

const TYPE_LABELS: Record<string, string> = {
  video: "Video Presentation",
  presentation: "Audio Blog",
  press_release: "Written Research",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  video: <PlayCircle className="h-5 w-5" />,
  presentation: <Headphones className="h-5 w-5" />,
  press_release: <FileText className="h-5 w-5" />,
};

function isStoredAudio(url: string) {
  return url.startsWith("/api/storage") || /\.(mp3|m4a|wav|ogg|aac)$/i.test(url);
}

function isStoredVideo(url: string) {
  return url.startsWith("/api/storage") || /\.(mp4|webm|mov)$/i.test(url);
}

function isPdf(url: string) {
  return /\.pdf$/i.test(url);
}

export default function PressArticle() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data: post, isLoading, isError } = useGetPost(id);
  const [copied, setCopied] = useState(false);

  const pageUrl = typeof window !== "undefined"
    ? `${window.location.origin}/press/${id}`
    : `https://pamliecoconnect.com/press/${id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const shareLinkedIn = () =>
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`, "_blank");

  const shareTwitter = () =>
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(post?.title ?? "")}`, "_blank");

  const shareFacebook = () =>
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, "_blank");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {post && (
        <Helmet>
          <title>{post.title} — PamliEcoConnect</title>
          <meta name="description" content={post.excerpt} />
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={post.excerpt} />
          <meta property="og:url" content={pageUrl} />
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content="PamliEcoConnect" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={post.title} />
          <meta name="twitter:description" content={post.excerpt} />
        </Helmet>
      )}
      <Navbar />
      <main className="flex-1">
        {isLoading ? (
          <div className="container max-w-3xl mx-auto px-4 md:px-8 py-24 text-muted-foreground">
            Loading…
          </div>
        ) : isError || !post ? (
          <div className="container max-w-3xl mx-auto px-4 md:px-8 py-24">
            <p className="text-muted-foreground mb-4">Entry not found.</p>
            <Link href="/press" className="text-primary hover:underline text-sm flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to Press
            </Link>
          </div>
        ) : (
          <>
            <section className="py-16 bg-card border-b border-border">
              <div className="container max-w-3xl mx-auto px-4 md:px-8">
                <Link href="/press" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
                  <ArrowLeft className="h-4 w-4" /> Back to Press & Multimedia
                </Link>
                <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-4">
                  {TYPE_ICONS[post.type] ?? <FileText className="h-5 w-5" />}
                  {TYPE_LABELS[post.type] ?? post.type.replace("_", " ")}
                  <span className="text-muted-foreground font-normal normal-case tracking-normal ml-2">
                    {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight mb-4">
                  {post.title}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {post.excerpt}
                </p>

                {/* Share bar */}
                <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-border">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider mr-1">
                    <Share2 className="h-3.5 w-3.5" /> Share
                  </span>
                  <button
                    onClick={copyLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-accent hover:text-primary transition-colors"
                  >
                    {copied
                      ? <><Check className="h-3.5 w-3.5 text-green-400" /><span className="text-green-400">Copied!</span></>
                      : <><Link2 className="h-3.5 w-3.5" />Copy Link</>
                    }
                  </button>
                  <button
                    onClick={shareLinkedIn}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-accent hover:text-[#0077B5] transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </button>
                  <button
                    onClick={shareTwitter}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-accent hover:text-foreground transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    X / Twitter
                  </button>
                  <button
                    onClick={shareFacebook}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-accent hover:text-[#1877F2] transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </button>
                </div>
              </div>
            </section>

            <article className="container max-w-3xl mx-auto px-4 md:px-8 py-12">

              {/* Video */}
              {post.mediaUrl && post.type === "video" && (() => {
                const embedUrl = isStoredVideo(post.mediaUrl) ? null : getEmbedUrl(post.mediaUrl);
                return isStoredVideo(post.mediaUrl) ? (
                  <div className="mb-10 rounded-xl overflow-hidden bg-muted">
                    <video controls className="w-full" src={post.mediaUrl}>
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : embedUrl ? (
                  <div className="mb-10 rounded-xl overflow-hidden aspect-video bg-muted">
                    <iframe
                      src={embedUrl}
                      title={post.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="mb-10 rounded-xl overflow-hidden bg-muted border border-border">
                    <a
                      href={post.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center gap-4 py-16 hover:bg-accent transition-colors"
                    >
                      <div className="rounded-full bg-primary/10 border border-primary/30 p-5">
                        <PlayCircle className="h-12 w-12 text-primary" />
                      </div>
                      <span className="text-base font-semibold text-primary flex items-center gap-2">
                        Watch Video <ExternalLink className="h-4 w-4" />
                      </span>
                      <span className="text-xs text-muted-foreground">Opens in a new tab</span>
                    </a>
                  </div>
                );
              })()}

              {/* Audio */}
              {post.mediaUrl && post.type === "presentation" && (
                <div className="mb-10 rounded-xl bg-muted/50 border border-border p-6">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Audio Blog</p>
                  {isStoredAudio(post.mediaUrl) ? (
                    <audio controls className="w-full" src={post.mediaUrl}>
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <a href={post.mediaUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                      <Headphones className="h-4 w-4" /> Listen externally
                    </a>
                  )}
                </div>
              )}

              {/* Written Research / PDF */}
              {post.mediaUrl && post.type === "press_release" && (
                <div className="mb-10 rounded-xl bg-muted/50 border border-border p-6">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Document</p>
                  {isPdf(post.mediaUrl) ? (
                    <div className="space-y-3">
                      <a href={post.mediaUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                        <Download className="h-4 w-4" /> Download PDF
                      </a>
                      <iframe
                        src={post.mediaUrl}
                        title={post.title}
                        className="w-full h-[600px] rounded-lg border border-border mt-3"
                      />
                    </div>
                  ) : (
                    <a href={post.mediaUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                      <Download className="h-4 w-4" /> Open document
                    </a>
                  )}
                </div>
              )}

              <div
                className="prose prose-invert prose-p:text-muted-foreground prose-headings:text-foreground prose-headings:font-display prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-ul:text-muted-foreground prose-li:my-1 prose-strong:text-foreground max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
