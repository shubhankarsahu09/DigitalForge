import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-12 px-8 md:px-28 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border/30 bg-background relative z-10">
      <p className="text-muted-foreground text-sm">
        © 2026 DigitalForge. All rights reserved.
      </p>
      <div className="flex items-center gap-6">
        <Link
          to="/about?tab=privacy"
          className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-200"
        >
          Privacy
        </Link>
        <Link
          to="/about?tab=tos"
          className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-200"
        >
          Terms
        </Link>
        <a
          href="mailto:support@digitalforge.com"
          className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-200"
        >
          Contact
        </a>
      </div>
    </footer>
  );
}
