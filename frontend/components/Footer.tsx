import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="footer footer-center border-t border-base-200 bg-base-100 py-6 text-base-content/60">
      <aside>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} {siteConfig.author.name}. {siteConfig.footer.text}
        </p>
      </aside>
    </footer>
  );
}
