import { Button } from "@/components/ui/button";
import {
  Twitter,
  Github,
  Instagram,
  Mail,
  MapPin,
  Gamepad2,
  ArrowUp,
} from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Download", href: "#download" },
    { label: "Changelog", href: "#changelog" },
  ],
  company: [
    { label: "About", href: "#about" },
    { label: "Blog", href: "#blog" },
    { label: "Careers", href: "#careers" },
    { label: "Contact", href: "#contact" },
  ],
  support: [
    { label: "Help Center", href: "#help" },
    { label: "Community", href: "#community" },
    { label: "Guild Guide", href: "#guide" },
    { label: "API Docs", href: "#api" },
  ],
  legal: [
    { label: "Privacy", href: "#privacy" },
    { label: "Terms", href: "#terms" },
    { label: "Cookies", href: "#cookies" },
    { label: "GDPR", href: "#gdpr" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#twitter", label: "Twitter" },
  { icon: Github, href: "#github", label: "GitHub" },
  { icon: Instagram, href: "#instagram", label: "Instagram" },
  { icon: Mail, href: "#email", label: "Email" },
];

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-secondary/50 border-t border-border/50">
      <div className="container mx-auto px-6">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-quest rounded-xl">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold">Questly</span>
            </div>
            <p className="text-muted-foreground max-w-sm">
              Transform your life into an epic quest. Level up daily with the
              ultimate gamified productivity platform.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Made with ❤️ for questers worldwide</span>
            </div>
          </div>

          {/* Links sections */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter signup */}
        {/* <div className="py-8 border-t border-border/50">
          <div className="max-w-md mx-auto lg:mx-0 text-center lg:text-left">
            <h3 className="font-semibold mb-4">Stay Updated on Your Quest</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Get the latest features, tips, and exclusive quest content
              delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
              <Button variant="default" className="shadow-glow">
                Subscribe
              </Button>
            </div>
          </div>
        </div> */}

        {/* Bottom section */}
        <div className="py-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2025 Questly. All rights reserved. Made for the ambitious.
          </div>

          {/* Social links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>

          {/* Back to top */}
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToTop}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowUp className="w-4 h-4 mr-2" />
            Back to Top
          </Button>
        </div>
      </div>
    </footer>
  );
};
