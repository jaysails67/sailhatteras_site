import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useJoinWaitlist } from "@workspace/api-client-react";
import { events } from "@/lib/analytics";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Zap } from "lucide-react";

const waitlistSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(5, "Phone is required"),
});

export default function Reservations() {
  const { toast } = useToast();
  const waitlistMutation = useJoinWaitlist();

  const form = useForm<z.infer<typeof waitlistSchema>>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = (values: z.infer<typeof waitlistSchema>) => {
    waitlistMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          events.waitlistJoined();
          toast({
            title: "Added to Waitlist",
            description: "We'll notify you when reservations open.",
          });
          form.reset();
        },
        onError: (error) => {
          toast({
            title: "Submission failed",
            description: (error.data as { error?: string })?.error || error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border bg-card min-h-[50vh]">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-6">
            <Zap className="h-6 w-6" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Coming Soon</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Passenger reservations will open when our first vessels launch.
          </p>
          <p className="text-muted-foreground">
            Be among the first to experience silent flight over water. Join the waitlist to receive priority booking access and exclusive updates.
          </p>
        </div>
        
        <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex justify-center">
          <div className="max-w-md w-full bg-background border border-border rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Join the Waitlist</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} data-testid="input-waitlist-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jane@example.com" {...field} data-testid="input-waitlist-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 000-0000" {...field} data-testid="input-waitlist-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full mt-6" 
                  disabled={waitlistMutation.isPending}
                  data-testid="button-waitlist-submit"
                >
                  {waitlistMutation.isPending ? "Joining..." : "Join Waitlist"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
