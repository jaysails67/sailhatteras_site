import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetFeaturedPosts, useListPosts, Post } from "@workspace/api-client-react";
import { format } from "date-fns";
import { PlayCircle, FileText, Presentation } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Press() {
  const { data: featuredPosts, isLoading: featuredLoading } = useGetFeaturedPosts();
  const { data: allPosts, isLoading: allLoading } = useListPosts();

  const getIconForType = (type: string) => {
    switch(type) {
      case 'video': return <PlayCircle className="h-5 w-5 text-primary" />;
      case 'presentation': return <Presentation className="h-5 w-5 text-primary" />;
      default: return <FileText className="h-5 w-5 text-primary" />;
    }
  };

  const renderPostCard = (post: Post) => (
    <Card key={post.id} className="overflow-hidden border-border bg-card/50 hover:bg-card transition-colors">
      {post.mediaUrl && (
        <div className="w-full h-48 bg-muted overflow-hidden">
          <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider">
            {getIconForType(post.type)}
            {post.type.replace('_', ' ')}
          </span>
          <span className="text-xs text-muted-foreground">{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
        </div>
        <CardTitle className="text-xl leading-tight">{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground text-sm line-clamp-3">
          {post.excerpt}
        </CardDescription>
        <button className="mt-4 text-sm font-semibold text-primary hover:underline" data-testid={`link-post-${post.id}`}>
          Read more
        </button>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <section className="py-24 bg-card border-b border-border">
          <div className="container px-4 md:px-8 max-w-4xl">
            <h1 className="text-5xl font-display font-bold mb-6">Press & Multimedia</h1>
            <p className="text-xl text-muted-foreground">
              Latest news, press releases, and media assets from PamliEcoConnect.
            </p>
          </div>
        </section>

        <section className="py-16 container px-4 md:px-8">
          {(featuredLoading || allLoading) ? (
            <div className="grid md:grid-cols-3 gap-8 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-accent rounded-xl"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-16">
              {featuredPosts?.pressReleases?.length ? (
                <div>
                  <h2 className="text-2xl font-display font-bold mb-8 border-b border-border pb-4">Press Releases</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredPosts.pressReleases.map(renderPostCard)}
                    {allPosts?.filter(p => p.type === 'press_release' && !p.featured).map(renderPostCard)}
                  </div>
                </div>
              ) : null}

              {featuredPosts?.videos?.length ? (
                <div>
                  <h2 className="text-2xl font-display font-bold mb-8 border-b border-border pb-4">Videos</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredPosts.videos.map(renderPostCard)}
                    {allPosts?.filter(p => p.type === 'video' && !p.featured).map(renderPostCard)}
                  </div>
                </div>
              ) : null}
              
              {featuredPosts?.presentations?.length ? (
                <div>
                  <h2 className="text-2xl font-display font-bold mb-8 border-b border-border pb-4">Presentations</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredPosts.presentations.map(renderPostCard)}
                    {allPosts?.filter(p => p.type === 'presentation' && !p.featured).map(renderPostCard)}
                  </div>
                </div>
              ) : null}
              
              {(!allPosts || allPosts.length === 0) && (
                <div className="text-center py-12 text-muted-foreground">
                  No press releases available at this time.
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
