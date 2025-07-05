import { useState } from "react";
import { algorithms, algorithmCategories, Algorithm } from "@/data/algorithms";
import { AlgorithmCard } from "./AlgorithmCard";
import { CodeDisplay } from "./CodeDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Code2, Zap } from "lucide-react";

export const AlgorithmGenerator = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAlgorithms = algorithms.filter(algorithm => {
    const matchesCategory = !selectedCategory || algorithm.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      algorithm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      algorithm.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const resetView = () => {
    setSelectedAlgorithm(null);
    setSelectedCategory(null);
    setSearchTerm("");
  };

  if (selectedAlgorithm) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="outline" 
            onClick={() => setSelectedAlgorithm(null)}
            className="mb-6 transition-smooth hover:bg-primary hover:text-primary-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Algorithms
          </Button>
          
          <CodeDisplay algorithm={selectedAlgorithm} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Code2 className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold gradient-primary bg-clip-text text-transparent">
              Algorithm Generator
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover, understand, and implement algorithms across multiple programming languages. 
            Perfect for learning, interviews, and reference.
          </p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <span>{algorithms.length} Algorithms</span>
            </div>
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-accent" />
              <span>Multiple Languages</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search algorithms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 transition-smooth focus:ring-primary/50"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="transition-smooth"
            >
              All Categories
            </Button>
            {algorithmCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="transition-smooth"
              >
                {category}
              </Button>
            ))}
          </div>
          
          {selectedCategory && (
            <div className="text-center">
              <Badge variant="secondary" className="text-sm">
                {filteredAlgorithms.length} algorithms in {selectedCategory}
              </Badge>
            </div>
          )}
        </div>

        {/* Algorithm Grid */}
        {filteredAlgorithms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlgorithms.map((algorithm) => (
              <AlgorithmCard
                key={algorithm.id}
                algorithm={algorithm}
                onClick={() => setSelectedAlgorithm(algorithm)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Code2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No algorithms found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or category filter
            </p>
            <Button onClick={resetView} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};