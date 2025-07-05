import { useState } from "react";
import { Algorithm } from "@/data/algorithms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeDisplayProps {
  algorithm: Algorithm;
}

export const CodeDisplay = ({ algorithm }: CodeDisplayProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState(algorithm.implementations[0].language);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const currentImplementation = algorithm.implementations.find(
    impl => impl.language === selectedLanguage
  ) || algorithm.implementations[0];

  const copyToClipboard = async (code: string, language: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedStates({ ...copiedStates, [language]: true });
      toast({
        title: "Code copied!",
        description: `${language} implementation copied to clipboard`,
      });
      
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [language]: false });
      }, 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy code to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Algorithm Info */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="gradient-primary bg-clip-text text-transparent">
              {algorithm.name}
            </CardTitle>
            <Badge variant="secondary">{algorithm.category}</Badge>
          </div>
          <p className="text-muted-foreground">{algorithm.description}</p>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Time Complexity</h4>
              <Badge variant="outline" className="font-mono">
                {algorithm.complexity.time}
              </Badge>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Space Complexity</h4>
              <Badge variant="outline" className="font-mono">
                {algorithm.complexity.space}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Use Case</h4>
            <p className="text-sm text-muted-foreground">{algorithm.useCase}</p>
          </div>
        </CardContent>
      </Card>

      {/* Code Implementation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Implementation</CardTitle>
            <div className="flex gap-2">
              {algorithm.implementations.map((impl) => (
                <Button
                  key={impl.language}
                  variant={selectedLanguage === impl.language ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLanguage(impl.language)}
                  className="transition-smooth"
                >
                  {impl.language}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-3 right-3 z-10"
              onClick={() => copyToClipboard(currentImplementation.code, selectedLanguage)}
            >
              {copiedStates[selectedLanguage] ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
            
            <pre className="syntax-highlight overflow-x-auto text-sm leading-relaxed pr-16">
              <code>{currentImplementation.code}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Steps */}
      <Card>
        <CardHeader>
          <CardTitle>How it Works</CardTitle>
        </CardHeader>
        
        <CardContent>
          <ol className="space-y-3">
            {algorithm.steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
                  {index + 1}
                </div>
                <p className="text-sm">{step}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};