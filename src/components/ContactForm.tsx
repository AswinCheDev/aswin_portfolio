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
    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

    emailjs.send(serviceID, templateID, values, publicKey)
      .then((response) => {
        toast({
          title: "Transmission Successful",
          description: "Your message has been beamed across the galaxy.",
        });
        form.reset();
      })
      .catch((err) => {
        toast({
          title: "Transmission Failed",
          description: "Interference detected. Please try again.",
          variant: "destructive",
        });
      });
  }

  return (
    <div className="relative p-4 md:p-12 bg-cyan-950/[0.35] hover:bg-cyan-950/70 focus-within:bg-cyan-950/80 backdrop-blur-[2px] hover:backdrop-blur-md focus-within:backdrop-blur-md transition-all duration-500 rounded-2xl overflow-hidden border border-cyan-400/20 hover:border-cyan-400/40 focus-within:border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.1),inset_0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_30px_rgba(6,182,212,0.2),inset_0_0_30px_rgba(6,182,212,0.15)] focus-within:shadow-[0_0_30px_rgba(6,182,212,0.2),inset_0_0_30px_rgba(6,182,212,0.15)] group animate-pulse-slow focus-within:animate-none">
      {/* Holographic Scanline Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(6,182,212,0.15)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50 mix-blend-screen" />
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/10 via-transparent to-cyan-900/20 pointer-events-none" />
        


        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 md:space-y-4 relative z-10">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-cyan-300 font-mono text-xs tracking-widest uppercase ml-1">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" className="bg-transparent border-0 border-b-2 border-cyan-700/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-cyan-400 rounded-none px-1 text-cyan-50 font-mono placeholder:text-cyan-800 !outline-none !shadow-none [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:#ecfeff]" {...field} />
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
                    <Input placeholder="example@email.com" className="bg-transparent border-0 border-b-2 border-cyan-700/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-cyan-400 rounded-none px-1 text-cyan-50 font-mono placeholder:text-cyan-800 !outline-none !shadow-none [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:#ecfeff]" {...field} />
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
                    <Input placeholder="Subject of your message" className="bg-transparent border-0 border-b-2 border-cyan-700/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-cyan-400 rounded-none px-1 text-cyan-50 font-mono placeholder:text-cyan-800 !outline-none !shadow-none [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:#ecfeff]" {...field} />
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
                      className="bg-transparent border-0 border-b-2 border-cyan-700/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-cyan-400 rounded-none px-1 text-cyan-50 font-mono placeholder:text-cyan-800 min-h-[60px] md:min-h-[100px] resize-none !outline-none !shadow-none [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:#ecfeff]"
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
  );
}
