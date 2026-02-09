import Link from "next/link";

function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-muted/5 via-muted/10 to-muted/5 border-t">
      <div className="container py-10 px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          {/* Brand & Mission */}
          <div className="flex-1">
            <div className="flex items-baseline gap-3 mb-3">
              <h2 className="text-2xl font-bold font-headline tracking-tight text-foreground">
                LegalSahayak
              </h2>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                Student Project
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Free legal information for everyone. Built by students, for the
              community. No affiliations, no corporate interests.
            </p>
            <p className="text-xs text-muted-foreground italic">
              Educational resource • Not a substitute for professional legal
              advice
            </p>
          </div>

          {/* Quick Links & Contact */}
          <div className="flex flex-col sm:flex-row gap-8 md:gap-12">
            <div>
              <h3 className="text-sm font-headline font-semibold tracking-tight mb-3 text-foreground">
                Resources
              </h3>
              <nav className="flex flex-col gap-2 text-sm">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Disclaimer
                </Link>
              </nav>
            </div>
            <div>
              <h3 className="text-sm font-headline font-semibold tracking-tight mb-3 text-foreground">
                Get in Touch
              </h3>
              <div className="text-sm space-y-2">
                <a
                  href="mailto:help@legalsahayak.in"
                  className="block text-primary hover:underline"
                >
                  help@legalsahayak.in
                </a>
                <p className="text-muted-foreground">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
