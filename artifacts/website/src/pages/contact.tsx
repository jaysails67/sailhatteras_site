import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitContact } from "@workspace/api-client-react";
import { events } from "@/lib/analytics";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  honeypot: z.string().optional(),
});

export default function Contact() {
  const { toast } = useToast();
  const contactMutation = useSubmitContact();

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      honeypot: "",
    },
  });

  const onSubmit = (values: z.infer<typeof contactSchema>) => {
    contactMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          events.contactFormSubmitted();
          toast({
            title: "Message Sent",
            description: "We'll get back to you as soon as possible.",
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
      <main className="flex-1">
        <section className="py-24 bg-card border-b border-border">
          <div className="container px-4 md:px-8 max-w-4xl text-center">
            <h1 className="text-5xl font-display font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              Interested in our vessels or investment opportunities? Get in touch with our team.
            </p>
          </div>
        </section>

        <section className="py-24 container px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold mb-8">Send a Message</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Honeypot field - hidden from users */}
                  <div className="hidden">
                    <FormField
                      control={form.control}
                      name="honeypot"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} tabIndex={-1} autoComplete="off" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} data-testid="input-contact-name" />
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
                            <Input type="email" placeholder="john@example.com" {...field} data-testid="input-contact-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="How can we help you?" 
                            className="min-h-[150px] resize-y" 
                            {...field} 
                            data-testid="textarea-contact-message" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto" 
                    disabled={contactMutation.isPending}
                    data-testid="button-contact-submit"
                  >
                    {contactMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>

            <div className="bg-card border border-border p-8 rounded-xl h-fit">
              <h2 className="text-2xl font-bold mb-8">Global Headquarters</h2>
              <div className="space-y-6 text-muted-foreground">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">PamliEcoConnect Inc.</p>
                    <p>100 Maritime Way, Suite 400</p>
                    <p>San Francisco, CA 94111</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <p>info@pamliecoconnect.com</p>
                    <p>investors@pamliecoconnect.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <p>252-489-8193</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
