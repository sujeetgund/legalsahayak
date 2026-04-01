import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LanguageToggle } from "@/components/language-toggle";
import {
  getTranslation,
  type Language,
  type TranslationKey,
  type TranslationSection,
} from "@/lib/i18n/translations";
import { cookies } from "next/headers";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  MessageSquare,
  Users,
  Scale,
  Phone,
  Brain,
  Lightbulb,
  CheckCircle,
  Home as HomeIcon,
  ShoppingCart,
  Building,
  BriefcaseBusiness,
  UserCheck,
  Search,
  Users2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/layout/footer";

const categoryCards = [
  {
    value: "Property & Real Estate",
    labelKey: "categoryProperty",
    icon: HomeIcon,
  },
  {
    value: "Consumer Complaints",
    labelKey: "categoryConsumer",
    icon: ShoppingCart,
  },
  {
    value: "Family Law",
    labelKey: "categoryFamily",
    icon: Users,
  },
  {
    value: "Business & Contracts",
    labelKey: "categoryBusiness",
    icon: Building,
  },
  {
    value: "Labor & Employment",
    labelKey: "categoryLabor",
    icon: BriefcaseBusiness,
  },
  {
    value: "Other Legal Issues",
    labelKey: "categoryOther",
    icon: Scale,
  },
] as const;

const FeatureCard = ({
  feature,
  title,
  description,
}: {
  feature: {
    titleKey:
      | "personalizedTitle"
      | "ragTitle"
      | "transparentTitle"
      | "broaderTitle";
    icon: React.ComponentType<{ className?: string }>;
    descriptionKey:
      | "personalizedDescription"
      | "ragDescription"
      | "transparentDescription"
      | "broaderDescription";
    span: string;
  };
  title: string;
  description: string;
}) => (
  <Card
    key={feature.titleKey}
    className={`p-4 shadow-medium hover:shadow-heavy transition-all duration-300 hover:scale-105 hover:-translate-y-2 flex flex-col ${feature.span}`}
  >
    <div className="p-3 rounded-full bg-gradient-to-br from-accent/20 to-amber-500/20 w-fit mb-2">
      <feature.icon className="h-10 w-10 text-accent" />
    </div>
    <h3 className="text-2xl font-bold mb-1">{title}</h3>
    <p className="text-muted-foreground flex-1">{description}</p>
  </Card>
);

const featureCards = [
  {
    titleKey: "personalizedTitle",
    icon: UserCheck,
    descriptionKey: "personalizedDescription",
    span: "md:col-span-1",
  },
  {
    titleKey: "ragTitle",
    icon: Zap,
    descriptionKey: "ragDescription",
    span: "md:col-span-1",
  },
  {
    titleKey: "transparentTitle",
    icon: Search,
    descriptionKey: "transparentDescription",
    span: "md:col-span-1",
  },
  {
    titleKey: "broaderTitle",
    icon: Users2,
    descriptionKey: "broaderDescription",
    span: "md:col-span-1",
  },
] as const;

export default async function Home() {
  const cookieStore = await cookies();
  const language: Language =
    cookieStore.get("legalsahayak_language")?.value === "hi" ? "hi" : "en";

  const t = <S extends TranslationSection>(
    section: S,
    key: TranslationKey<S>,
  ): string => getTranslation(language, section, key);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-8 h-20 flex items-center justify-between bg-background/80 backdrop-blur-sm">
        <Link
          href="/"
          className="flex items-center justify-center"
          prefetch={false}
        >
          <Scale className="h-8 w-8 text-primary" />
          <span className="ml-3 text-2xl font-semibold tracking-tight text-primary font-headline">
            LegalSahayak
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <Button
            variant="outline"
            size="sm"
            className="rounded-button hidden sm:flex items-center gap-2 border-primary text-primary"
          >
            <Phone className="h-4 w-4" />
            {t("home", "legalHelpline")}
          </Button>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative w-full min-h-[calc(100vh-5rem)] flex items-center justify-center text-center overflow-hidden">
          <div
            className="absolute inset-0 bg-repeat bg-center"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF9933' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="container px-4 md:px-6 z-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="flex flex-col justify-center space-y-6 text-left">
                <div className="space-y-4">
                  <h1 className="text-5xl font-bold tracking-headings sm:text-6xl xl:text-7xl/none">
                    <span className="gradient-text">
                      {t("home", "heroTitle")}
                    </span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    {t("home", "heroDescription")}
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-button tracking-buttons text-lg px-8 py-6 transition-transform hover:scale-105 btn-primary-gradient text-primary-foreground font-semibold"
                  >
                    <Link href="/assistant" prefetch={false}>
                      {t("home", "getHelpNow")}
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="rounded-button tracking-buttons text-lg px-8 py-6 border-2 border-primary text-primary transition-transform hover:scale-105 hover:bg-primary/5"
                  >
                    <Link href="#how-it-works" prefetch={false}>
                      {t("home", "howItWorks")}
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <Image
                  src="https://picsum.photos/600/500"
                  data-ai-hint="diverse indians justice"
                  alt="Diverse people of India"
                  width={600}
                  height={500}
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className="rounded-xl shadow-heavy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="w-full py-12 bg-card">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
              <div className="space-y-1">
                <p className="text-4xl font-bold gradient-text">1,000+</p>
                <p className="text-muted-foreground font-medium">
                  {t("home", "legalResourcesIndexed")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-bold gradient-text">&lt;5 min</p>
                <p className="text-muted-foreground font-medium">
                  {t("home", "avgResponseTime")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-bold gradient-text">12+</p>
                <p className="text-muted-foreground font-medium">
                  {t("home", "languagesSupported")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-bold gradient-text">24/7</p>
                <p className="text-muted-foreground font-medium">
                  {t("home", "alwaysAvailable")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="w-full py-16 md:py-28 lg:py-36">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="inline-block rounded-lg bg-secondary px-4 py-1.5 text-sm font-medium">
                {t("home", "howItWorks")}
              </div>
              <h2 className="text-3xl font-bold tracking-headings sm:text-4xl">
                {t("home", "justiceInSteps")}
              </h2>
            </div>
            <div className="max-w-2xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-xl font-semibold">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-accent/10">
                        <MessageSquare className="h-6 w-6 text-accent" />
                      </div>
                      <span>{t("home", "step1Title")}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground pl-16">
                    {t("home", "step1Text")}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-xl font-semibold">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-accent/10">
                        <Brain className="h-6 w-6 text-accent" />
                      </div>
                      <span>{t("home", "step2Title")}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground pl-16">
                    {t("home", "step2Text")}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-xl font-semibold">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-accent/10">
                        <Lightbulb className="h-6 w-6 text-accent" />
                      </div>
                      <span>{t("home", "step3Title")}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground pl-16">
                    {t("home", "step3Text")}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-xl font-semibold">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-accent/10">
                        <CheckCircle className="h-6 w-6 text-accent" />
                      </div>
                      <span>{t("home", "step4Title")}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground pl-16">
                    {t("home", "step4Text")}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* What Makes Us Different Section */}
        <section className="w-full py-16 md:py-28 lg:py-36 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-3xl font-bold tracking-headings sm:text-4xl">
                {t("home", "whatMakesDifferent")}
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-lg/relaxed">
                {t("home", "differentDescription")}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
              {featureCards.map((feature, index) => (
                <FeatureCard
                  key={index}
                  feature={feature}
                  title={t("home", feature.titleKey)}
                  description={t("home", feature.descriptionKey)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="w-full py-16 md:py-28">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-3xl font-bold tracking-headings sm:text-4xl">
                {t("home", "findHelpTitle")}
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-lg/relaxed">
                {t("home", "findHelpDescription")}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryCards.map((category) => (
                <Card
                  key={category.value}
                  className="p-6 text-center flex flex-col items-center shadow-light hover:shadow-medium transition-shadow"
                >
                  <div className="p-4 rounded-full bg-gradient-to-br from-accent/20 to-amber-500/20 w-fit mb-4">
                    <category.icon className="h-10 w-10 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {t("home", category.labelKey)}
                  </h3>
                  <p className="text-muted-foreground flex-1 mb-4">
                    {t("home", "categorySupport")}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-button w-full"
                  >
                    <Link
                      href={`/assistant?category=${encodeURIComponent(category.value)}`}
                    >
                      {t("home", "startHere")}
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-20 md:py-32">
          <div className="container text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-headings sm:text-4xl">
                {t("home", "joinThousands")}
              </h2>
              <p className="text-muted-foreground md:text-lg mt-4 mb-8">
                {t("home", "joinDescription")}
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-button tracking-buttons text-lg px-10 py-7 transition-transform hover:scale-105 btn-primary-gradient text-primary-foreground font-semibold"
              >
                <Link href="/onboarding">{t("home", "startJourney")}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
