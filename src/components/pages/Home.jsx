import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome Home</h1>
        <p className="text-lg mb-6">This is the home page of your React application.</p>
        <div className="flex flex-col gap-4 items-center">
          <Button>Default Button</Button>
          <Button className="bg-warning text-warning-foreground hover:bg-warning/80">
            Warning Button
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

export default Home;