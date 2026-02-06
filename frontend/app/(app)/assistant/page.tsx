"use client";

// import { askLegalQuestion } from "@/ai/flows/ai-legal-assistance";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  BookOpen,
  Send,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
// import { useChatHistory } from "@/hooks/use-chat-history";
// import { LoadingModal } from "./components/loading-modal";

// function LegalDictionary() {
//   const [term, setTerm] = useState("");
//     const [definition, setDefinition] = useState<DefineLegalTermOutput | null>(
//       null,
//     );
//   const [isPending] = useTransition();
//   const [isOpen, setIsOpen] = useState(false);

//     const handleSearch = (e: FormEvent) => {
//       e.preventDefault();
//       if (!term.trim()) return;

//       startTransition(async () => {
//         try {
//           const result = await defineLegalTerm({ term });
//           setDefinition(result);
//           setIsOpen(true);
//         } catch (error) {
//           console.error(error);
//           setDefinition({
//             definition: "Could not find a definition for this term.",
//             example: "",
//             relatedTerms: [],
//           });
//           setIsOpen(true);
//         }
//       });
//     };

//   return (
//     <Card className="p-8 shadow-medium hover:shadow-heavy transition-shadow duration-300 flex flex-col justify-between h-full">
//       <div>
//         <div className="p-4 rounded-full bg-gradient-to-br from-accent/20 to-amber-500/20 w-fit mb-4">
//           <LifeBuoy className="h-10 w-10 text-accent" />
//         </div>
//         <CardTitle className="text-2xl font-bold mb-2">
//           Legal Dictionary
//         </CardTitle>
//         <CardDescription className="mb-4">
//           Get plain-language definitions for complex legal terms.
//         </CardDescription>
//       </div>
//       <div className="mt-4">
//         <Popover open={isOpen} onOpenChange={setIsOpen}>
//           <PopoverTrigger asChild>
//             <form onSubmit={handleSearch} className="relative">
//               <Input
//                 placeholder="Search legal terms..."
//                 className="pr-10"
//                 value={term}
//                 onChange={(e) => setTerm(e.target.value)}
//               />
//               <Button
//                 type="submit"
//                 variant="ghost"
//                 size="icon"
//                 className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8"
//                 disabled={isPending}
//               >
//                 {isPending ? (
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                 ) : (
//                   <Search className="w-4 h-4 text-muted-foreground" />
//                 )}
//               </Button>
//             </form>
//           </PopoverTrigger>
//           <PopoverContent className="w-80" side="bottom" align="start">
//             {definition && (
//               <div className="space-y-4">
//                 <div>
//                   <h4 className="font-bold text-lg">{term}</h4>
//                   <p className="text-sm text-muted-foreground">
//                     {definition.definition}
//                   </p>
//                 </div>
//                 {definition.example && (
//                   <div>
//                     <h5 className="font-semibold flex items-center gap-2">
//                       <Lightbulb className="w-4 h-4 text-yellow-500" />
//                       Example
//                     </h5>
//                     <p className="text-sm text-muted-foreground italic">
//                       &quot;{definition.example}&quot;
//                     </p>
//                   </div>
//                 )}
//                 {definition.relatedTerms.length > 0 && (
//                   <div>
//                     <h5 className="font-semibold flex items-center gap-2">
//                       <HelpCircle className="w-4 h-4 text-blue-500" />
//                       Related Terms
//                     </h5>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {definition.relatedTerms.map((relatedTerm) => (
//                         <Badge variant="secondary" key={relatedTerm}>
//                           {relatedTerm}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </PopoverContent>
//         </Popover>
//       </div>
//     </Card>
//   );
// }

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [isPending] = useTransition();
  //   const router = useRouter();
  //   const { setHistory } = useChatHistory();

  //   const handleSubmit = (e: FormEvent) => {
  //     e.preventDefault();
  //     if (!input.trim() && files.length === 0) return;

  //     const userMessage = {
  //       role: "user" as const,
  //       content: input,
  //       files: files.map((f) => ({ name: f.name, type: f.type })),
  //     };

  //     startTransition(async () => {
  //       let assistantMessage;
  //       try {
  //         const result = await askLegalQuestion({
  //           question: input,
  //         });
  //         assistantMessage = {
  //           role: "assistant" as const,
  //           content: result.summary,
  //           assistantResponse: result,
  //         };
  //         setHistory([userMessage, assistantMessage]);
  //         router.push("/assistant/chat");
  //       } catch (error) {
  //         console.error(error);
  //         assistantMessage = {
  //           role: "assistant" as const,
  //           content: "An error occurred. Please try again.",
  //         };
  //         setHistory([userMessage, assistantMessage]);
  //         router.push("/assistant/chat");
  //       }
  //     });
  //   };

  return (
    <div className="space-y-12">
      {/* <LoadingModal open={isPending} /> */}
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 text-center">
        <div className="container px-4 md:px-6 z-10">
          <div className="flex flex-col items-center justify-center space-y-6">
            <h1 className="text-5xl font-bold tracking-headings sm:text-6xl xl:text-7xl/none">
              <span className="gradient-text">AI Legal Assistant</span>
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Your confidential, AI-powered guide to understanding your rights.
              Ask any legal question and get clear, actionable answers.
            </p>
          </div>
          <div className="max-w-3xl mx-auto mt-12">
            <form>
              <div className="relative bg-background rounded-xl shadow-heavy border border-transparent transition-all">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="My landlord won't return my security deposit..."
                  disabled={isPending}
                  className="pr-36 min-h-[80px] text-lg p-6 rounded-xl shadow-none border-0 focus-visible:ring-0 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      //   handleSubmit(e);
                    }
                  }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isPending || input.trim() === ""}
                    className="w-12 h-12 rounded-full btn-primary-gradient"
                  >
                    <Send className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Action Cards */}
      <section className="w-full py-16 md:py-24 bg-card">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-headings sm:text-4xl">
              Or, Explore Other Resources
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-lg/relaxed">
              Dive deeper into legal topics, learn from others, or browse
              official documents.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* <LegalDictionary /> */}
            <Card className="p-8 shadow-medium hover:shadow-heavy transition-shadow duration-300 flex flex-col justify-between h-full">
              <div>
                <div className="p-4 rounded-full bg-gradient-to-br from-accent/20 to-amber-500/20 w-fit mb-4">
                  <Users className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="text-2xl font-bold mb-2">
                  Community Stories
                </CardTitle>
                <CardDescription className="mb-4 flex-1">
                  Read real-life experiences from people who have faced similar
                  legal issues.
                </CardDescription>
              </div>
              <Button asChild className="w-full mt-4 rounded-button">
                <Link href="/forum">
                  Browse Stories <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>
            <Card className="p-8 shadow-medium hover:shadow-heavy transition-shadow duration-300 flex flex-col justify-between h-full">
              <div>
                <div className="p-4 rounded-full bg-gradient-to-br from-accent/20 to-amber-500/20 w-fit mb-4">
                  <BookOpen className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="text-2xl font-bold mb-2">
                  Explore Legal Topics
                </CardTitle>
                <CardDescription className="mb-4 flex-1">
                  Browse our library of simplified legal acts, codes, and
                  regulations.
                </CardDescription>
              </div>
              <Button asChild className="w-full mt-4 rounded-button">
                <Link href="/legal-library">
                  Go to Library <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
