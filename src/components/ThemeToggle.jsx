import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded bg-secondary text-secondary-foreground border border-border"
    >
      Toggle {theme === "dark" ? "Light" : "Dark"} Mode
    </button>
  );
}