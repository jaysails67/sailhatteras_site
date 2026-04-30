import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetPost } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, FileText, PlayCircle, Presentation } from "lucide-react";

export default function PressArticle() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { data: post, isLoading, isError } = useGetPost(id);

  const getIconForType = (type: string) => {
    switch (type) {
      case "video": return <PlayCircle className="h-5 w-5" />;
      case "presentation": return <Presentation className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        {isLoading ? (
          <div className="container max-w-3xl mx-auto px-4 md:px-8 py-24 text-muted-foreground">
            Loading article...
          </div>
        ) : isError || !post ? (
          <div className="container max-w-3xl mx-auto px-4 md:px-8 py-24">
            <p className="text-muted-foreground mb-4">Article not found.</p>
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
                  {getIconForType(post.type)}
                  {post.type.replace("_", " ")}
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
              {post.mediaUrl && post.type === "video" && (
                post.mediaUrl.startsWith("/api/storage") || post.mediaUrl.endsWith(".mp4") || post.mediaUrl.endsWith(".webm") ? (
                  <div className="mb-10 rounded-xl overflow-hidden bg-muted">
                    <video controls className="w-full" src={post.mediaUrl}>
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div className="mb-10 rounded-xl overflow-hidden aspect-video bg-muted">
                    <iframe
                      src={post.mediaUrl}
                      title={post.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                )
              )}
              {post.mediaUrl && post.type === "presentation" && (
                <div className="mb-10 rounded-xl bg-muted/50 border border-border p-6">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Audio Podcast</p>
                  <audio controls className="w-full" src={post.mediaUrl}>
                    Your browser does not support the audio element.
                  </audio>
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
