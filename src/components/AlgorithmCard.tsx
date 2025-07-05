import { Algorithm } from "@/data/algorithms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap } from "lucide-react";

interface AlgorithmCardProps {
  algorithm: Algorithm;
  onClick: () => void;
}

export const AlgorithmCard = ({ algorithm, onClick }: AlgorithmCardProps) => {
  return (
    <Card 
      className="cursor-pointer transition-smooth hover:card-shadow hover:scale-105 hover:border-primary/50 group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg group-hover:text-primary transition-smooth">
            {algorithm.name}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {algorithm.category}
          </Badge>
        </div>
        <CardDescription className="text-sm">
          {algorithm.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{algorithm.complexity.time}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            <span>{algorithm.complexity.space}</span>
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {algorithm.implementations.map((impl) => (
            <Badge 
              key={impl.language} 
              variant="outline" 
              className="text-xs group-hover:border-primary/50 transition-smooth"
            >
              {impl.language}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};