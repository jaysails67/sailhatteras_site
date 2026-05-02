import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetPost } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, FileText, PlayCircle, Headphones, Download, ExternalLink } from "lucide-react";

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

  return (
    <div className="flex flex-col min-h-screen bg-background">
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
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
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
