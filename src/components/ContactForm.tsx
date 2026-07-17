// src/components/ContactForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import emailjs from "@emailjs/browser"; // Import emailjs

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
    // Replace these with your actual EmailJS credentials
    const serviceID = "service_spbokp9";
    const templateID = "template_3ypmksw";
    const publicKey = "P5zVPigm2RZR1dHXh";

    emailjs.send(serviceID, templateID, values, publicKey)
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
        toast({
          title: "Message Sent!",
          description: "Thank you for reaching out. I will get back to you shortly.",
        });
        form.reset(); // Clears the form after successful submission
      })
      .catch((err) => {
        console.error("FAILED...", err);
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem sending your message. Please try again.",
          variant: "destructive",
        });
      });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Send a Message</DialogTitle>
        <DialogDescription>
          Fill out the form below to get in touch.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80 ml-1">Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" className="bg-secondary/30 border-border/50 focus-visible:ring-primary/50 rounded-xl" {...field} />
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
                <FormLabel className="text-foreground/80 ml-1">Email address</FormLabel>
                <FormControl>
                  <Input placeholder="example@email.com" className="bg-secondary/30 border-border/50 focus-visible:ring-primary/50 rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80 ml-1">Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Subject of your message" className="bg-secondary/30 border-border/50 focus-visible:ring-primary/50 rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80 ml-1">Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Your message"
                    className="resize-none bg-secondary/30 border-border/50 focus-visible:ring-primary/50 rounded-xl min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="pt-4">
            <DialogClose asChild>
                <Button type="button" variant="ghost" className="rounded-xl hover:bg-secondary/50">
                Cancel
                </Button>
            </DialogClose>
            <Button type="submit" className="glass rounded-xl hover:bg-secondary/20 border-border">Send Message</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
