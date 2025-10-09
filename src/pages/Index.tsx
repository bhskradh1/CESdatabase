import { Calculator } from "@/components/Calculator";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20 p-4">
      <div className="text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Modern Calculator
          </h1>
          <p className="text-muted-foreground">Clean, simple, and beautiful</p>
        </div>
        <Calculator />
      </div>
    </div>
  );
};

export default Index;
