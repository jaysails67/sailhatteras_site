import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useListTeamMembers } from "@workspace/api-client-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Team() {
  const { data: team, isLoading } = useListTeamMembers();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <section className="py-24 bg-card border-b border-border">
          <div className="container px-4 md:px-8 max-w-4xl text-center">
            <h1 className="text-5xl font-display font-bold mb-6">Our Leadership</h1>
            <p className="text-xl text-muted-foreground">
              Aerospace engineers, maritime experts, and visionaries building the future of zero-emission waterborne transport.
            </p>
          </div>
        </section>

        <section className="py-24 container px-4 md:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-accent mb-6"></div>
                  <div className="h-6 bg-accent w-48 mb-2"></div>
                  <div className="h-4 bg-accent w-32 mb-4"></div>
                  <div className="h-20 bg-accent w-full"></div>
                </div>
              ))}
            </div>
          ) : team && team.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {team.map(member => (
                <div key={member.id} className="flex flex-col items-center text-center p-6 border border-transparent hover:border-border rounded-xl transition-all hover:bg-card/50">
                  <Avatar className="w-32 h-32 mb-6 border-4 border-background shadow-xl">
                    <AvatarImage src={member.headshotUrl || undefined} alt={member.name} />
                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-2xl font-display font-bold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-4">{member.title}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Team information is currently being updated.
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
