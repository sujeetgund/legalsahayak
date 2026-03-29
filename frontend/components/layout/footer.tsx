"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="w-full bg-gradient-to-r from-muted/5 via-muted/10 to-muted/5 border-t">
      <div className="container py-10 px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          {/* Brand & Mission */}
          <div className="flex-1">
            <div className="flex items-baseline gap-3 mb-3">
              <h2 className="text-2xl font-bold font-headline tracking-tight text-foreground">
                {t("common", "legalSahayak")}
              </h2>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                Student Project
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {language === "hi"
                ? "सभी के लिए मुफ्त कानूनी जानकारी। छात्रों द्वारा, समुदाय के लिए।"
                : "Free legal information for everyone. Built by students, for the community."}
            </p>
            <p className="text-xs text-muted-foreground italic">
              {language === "hi"
                ? "शैक्षिक संसाधन | पेशेवर कानूनी सलाह का विकल्प नहीं"
                : "Educational resource | Not a substitute for professional legal advice"}
            </p>
          </div>

          {/* Quick Links & Contact */}
          <div className="flex flex-col sm:flex-row gap-8 md:gap-12">
            <div>
              <h3 className="text-sm font-headline font-semibold tracking-tight mb-3 text-foreground">
                {language === "hi" ? "संसाधन" : "Resources"}
              </h3>
              <nav className="flex flex-col gap-2 text-sm">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("home", "howItWorks")}
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("common", "privacyPolicy")}
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {language === "hi" ? "अस्वीकरण" : "Disclaimer"}
                </Link>
              </nav>
            </div>
            <div>
              <h3 className="text-sm font-headline font-semibold tracking-tight mb-3 text-foreground">
                {language === "hi" ? "संपर्क करें" : "Get in Touch"}
              </h3>
              <div className="text-sm space-y-2">
                <a
                  href="mailto:help@legalsahayak.in"
                  className="block text-primary hover:underline"
                >
                  help@legalsahayak.in
                </a>
                <p className="text-muted-foreground">
                  {language === "hi" ? "24/7 उपलब्ध" : "Available 24/7"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
