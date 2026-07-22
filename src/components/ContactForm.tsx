import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import emailjs from "@emailjs/browser";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export function ContactForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const serviceID = "service_spbokp9";
    const templateID = "template_3ypmksw";
    const publicKey = "P5zVPigm2RZR1dHXh";

    emailjs.send(serviceID, templateID, values, publicKey)
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
        toast({
          title: "Transmission Successful",
          description: "Your message has been beamed across the galaxy.",
        });
        form.reset();
      })
      .catch((err) => {
        console.error("FAILED...", err);
        toast({
          title: "Transmission Failed",
          description: "Interference detected. Please try again.",
          variant: "destructive",
        });
      });
  }

  return (
    <div className="relative p-6 md:p-8 bg-transparent overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-900/20 pointer-events-none" />
        
        {/* Tech Corner Accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 relative z-10">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-cyan-300 font-mono text-xs tracking-widest uppercase ml-1">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" className="bg-transparent border-0 border-b-2 border-cyan-700/50 focus-visible:ring-0 focus-visible:border-cyan-400 rounded-none px-1 text-cyan-50 font-mono placeholder:text-cyan-800" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400 font-mono text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-cyan-300 font-mono text-xs tracking-widest uppercase ml-1">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@email.com" className="bg-transparent border-0 border-b-2 border-cyan-700/50 focus-visible:ring-0 focus-visible:border-cyan-400 rounded-none px-1 text-cyan-50 font-mono placeholder:text-cyan-800" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400 font-mono text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-cyan-300 font-mono text-xs tracking-widest uppercase ml-1">Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Subject of your message" className="bg-transparent border-0 border-b-2 border-cyan-700/50 focus-visible:ring-0 focus-visible:border-cyan-400 rounded-none px-1 text-cyan-50 font-mono placeholder:text-cyan-800" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400 font-mono text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-cyan-300 font-mono text-xs tracking-widest uppercase ml-1">Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Your message"
                      className="bg-transparent border-0 border-b-2 border-cyan-700/50 focus-visible:ring-0 focus-visible:border-cyan-400 rounded-none px-1 text-cyan-50 font-mono placeholder:text-cyan-800 min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 font-mono text-xs" />
                </FormItem>
              )}
            />
            <div className="pt-6">
              <Button type="submit" className="w-full bg-cyan-900/50 hover:bg-cyan-800/80 border border-cyan-500 text-cyan-100 font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                Transmit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
