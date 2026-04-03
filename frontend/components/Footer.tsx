import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-center px-4 text-sm text-muted-foreground sm:px-6">
        <p>
          &copy; {new Date().getFullYear()} {siteConfig.author.name}.{" "}
          {siteConfig.footer.text}
        </p>
      </div>
    </footer>
  );
}
