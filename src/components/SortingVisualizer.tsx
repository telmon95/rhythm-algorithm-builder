import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SortStep {
  array: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  pivotIndex?: number;
}

const SORTING_ALGORITHMS = {
  bubble: {
    name: "Bubble Sort",
    description: "Compares adjacent elements and swaps them if they're in wrong order",
    timeComplexity: "O(n²)"
  },
  selection: {
    name: "Selection Sort", 
    description: "Finds minimum element and places it at the beginning",
    timeComplexity: "O(n²)"
  },
  insertion: {
    name: "Insertion Sort",
    description: "Builds sorted array one element at a time", 
    timeComplexity: "O(n²)"
  },
  quick: {
    name: "Quick Sort",
    description: "Divides array around pivot and recursively sorts",
    timeComplexity: "O(n log n)"
  }
};

export const SortingVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([100]);
  const [arraySize, setArraySize] = useState([30]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubble");
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0, time: 0 });
  const intervalRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>();
  const { toast } = useToast();

  // Generate random array
  const generateArray = () => {
    const newArray = Array.from({ length: arraySize[0] }, () => 
      Math.floor(Math.random() * 300) + 10
    );
    setArray(newArray);
    setSteps([{ array: newArray }]);
    setCurrentStep(0);
    setStats({ comparisons: 0, swaps: 0, time: 0 });
    setIsPlaying(false);
  };

  // Initialize array on mount
  useEffect(() => {
    generateArray();
  }, [arraySize]);

  // Bubble Sort Implementation
  const bubbleSort = (arr: number[]): SortStep[] => {
    const steps: SortStep[] = [{ array: [...arr] }];
    const sortedArray = [...arr];
    let comparisons = 0, swaps = 0;

    for (let i = 0; i < sortedArray.length - 1; i++) {
      for (let j = 0; j < sortedArray.length - i - 1; j++) {
        comparisons++;
        steps.push({
          array: [...sortedArray],
          comparing: [j, j + 1],
          sorted: Array.from({ length: i }, (_, k) => sortedArray.length - 1 - k)
        });

        if (sortedArray[j] > sortedArray[j + 1]) {
          swaps++;
          [sortedArray[j], sortedArray[j + 1]] = [sortedArray[j + 1], sortedArray[j]];
          steps.push({
            array: [...sortedArray],
            swapping: [j, j + 1],
            sorted: Array.from({ length: i }, (_, k) => sortedArray.length - 1 - k)
          });
        }
      }
    }

    steps.push({
      array: [...sortedArray],
      sorted: Array.from({ length: sortedArray.length }, (_, i) => i)
    });

    setStats(prev => ({ ...prev, comparisons, swaps }));
    return steps;
  };

  // Selection Sort Implementation
  const selectionSort = (arr: number[]): SortStep[] => {
    const steps: SortStep[] = [{ array: [...arr] }];
    const sortedArray = [...arr];
    let comparisons = 0, swaps = 0;

    for (let i = 0; i < sortedArray.length - 1; i++) {
      let minIndex = i;
      steps.push({
        array: [...sortedArray],
        comparing: [i],
        sorted: Array.from({ length: i }, (_, k) => k)
      });

      for (let j = i + 1; j < sortedArray.length; j++) {
        comparisons++;
        steps.push({
          array: [...sortedArray],
          comparing: [minIndex, j],
          sorted: Array.from({ length: i }, (_, k) => k)
        });

        if (sortedArray[j] < sortedArray[minIndex]) {
          minIndex = j;
        }
      }

      if (minIndex !== i) {
        swaps++;
        [sortedArray[i], sortedArray[minIndex]] = [sortedArray[minIndex], sortedArray[i]];
        steps.push({
          array: [...sortedArray],
          swapping: [i, minIndex],
          sorted: Array.from({ length: i }, (_, k) => k)
        });
      }
    }

    steps.push({
      array: [...sortedArray],
      sorted: Array.from({ length: sortedArray.length }, (_, i) => i)
    });

    setStats(prev => ({ ...prev, comparisons, swaps }));
    return steps;
  };

  // Insertion Sort Implementation
  const insertionSort = (arr: number[]): SortStep[] => {
    const steps: SortStep[] = [{ array: [...arr] }];
    const sortedArray = [...arr];
    let comparisons = 0, swaps = 0;

    for (let i = 1; i < sortedArray.length; i++) {
      let current = sortedArray[i];
      let j = i - 1;

      steps.push({
        array: [...sortedArray],
        comparing: [i],
        sorted: Array.from({ length: i }, (_, k) => k)
      });

      while (j >= 0 && sortedArray[j] > current) {
        comparisons++;
        swaps++;
        sortedArray[j + 1] = sortedArray[j];
        steps.push({
          array: [...sortedArray],
          swapping: [j, j + 1],
          sorted: Array.from({ length: i }, (_, k) => k)
        });
        j--;
      }
      sortedArray[j + 1] = current;
    }

    steps.push({
      array: [...sortedArray],
      sorted: Array.from({ length: sortedArray.length }, (_, i) => i)
    });

    setStats(prev => ({ ...prev, comparisons, swaps }));
    return steps;
  };

  // Quick Sort Implementation (simplified for visualization)
  const quickSort = (arr: number[]): SortStep[] => {
    const steps: SortStep[] = [{ array: [...arr] }];
    const sortedArray = [...arr];
    let comparisons = 0, swaps = 0;

    const partition = (low: number, high: number): number => {
      const pivot = sortedArray[high];
      let i = low - 1;

      steps.push({
        array: [...sortedArray],
        pivotIndex: high,
        comparing: [high]
      });

      for (let j = low; j < high; j++) {
        comparisons++;
        steps.push({
          array: [...sortedArray],
          pivotIndex: high,
          comparing: [j, high]
        });

        if (sortedArray[j] < pivot) {
          i++;
          if (i !== j) {
            swaps++;
            [sortedArray[i], sortedArray[j]] = [sortedArray[j], sortedArray[i]];
            steps.push({
              array: [...sortedArray],
              pivotIndex: high,
              swapping: [i, j]
            });
          }
        }
      }

      if (i + 1 !== high) {
        swaps++;
        [sortedArray[i + 1], sortedArray[high]] = [sortedArray[high], sortedArray[i + 1]];
        steps.push({
          array: [...sortedArray],
          swapping: [i + 1, high]
        });
      }

      return i + 1;
    };

    const quickSortHelper = (low: number, high: number) => {
      if (low < high) {
        const pi = partition(low, high);
        quickSortHelper(low, pi - 1);
        quickSortHelper(pi + 1, high);
      }
    };

    quickSortHelper(0, sortedArray.length - 1);

    steps.push({
      array: [...sortedArray],
      sorted: Array.from({ length: sortedArray.length }, (_, i) => i)
    });

    setStats(prev => ({ ...prev, comparisons, swaps }));
    return steps;
  };

  // Start sorting
  const startSort = () => {
    const algorithms = {
      bubble: bubbleSort,
      selection: selectionSort,
      insertion: insertionSort,
      quick: quickSort
    };

    startTimeRef.current = Date.now();
    const sortSteps = algorithms[selectedAlgorithm as keyof typeof algorithms](array);
    setSteps(sortSteps);
    setCurrentStep(0);
    setIsPlaying(true);

    toast({
      title: `${SORTING_ALGORITHMS[selectedAlgorithm as keyof typeof SORTING_ALGORITHMS].name} Started`,
      description: `Sorting ${array.length} elements...`
    });
  };

  // Play/Pause animation
  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      intervalRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 500 - speed[0]);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      if (startTimeRef.current) {
        setStats(prev => ({ 
          ...prev, 
          time: Date.now() - startTimeRef.current! 
        }));
      }
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  const togglePlayPause = () => {
    if (steps.length <= 1) {
      startSort();
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setStats({ comparisons: 0, swaps: 0, time: 0 });
  };

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentStepData = steps[currentStep] || { array };
  const maxValue = Math.max(...currentStepData.array);

  const getBarColor = (index: number) => {
    if (currentStepData.sorted?.includes(index)) return "bg-accent";
    if (currentStepData.swapping?.includes(index)) return "bg-destructive";
    if (currentStepData.comparing?.includes(index)) return "bg-primary";
    if (currentStepData.pivotIndex === index) return "bg-primary-glow";
    return "bg-secondary";
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Sorting Algorithm Visualizer
            <Badge variant="outline">{SORTING_ALGORITHMS[selectedAlgorithm as keyof typeof SORTING_ALGORITHMS].name}</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {SORTING_ALGORITHMS[selectedAlgorithm as keyof typeof SORTING_ALGORITHMS].description}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Algorithm</label>
              <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SORTING_ALGORITHMS).map(([key, algo]) => (
                    <SelectItem key={key} value={key}>
                      {algo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Array Size: {arraySize[0]}</label>
              <Slider
                value={arraySize}
                onValueChange={setArraySize}
                min={10}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Speed: {speed[0]}%</label>
              <Slider
                value={speed}
                onValueChange={setSpeed}
                min={10}
                max={300}
                step={10}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Step: {currentStep}/{steps.length - 1}</label>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={stepBackward} disabled={currentStep === 0}>
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={togglePlayPause}>
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="outline" onClick={stepForward} disabled={currentStep >= steps.length - 1}>
                  <SkipForward className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={reset}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={generateArray} variant="outline">
              Generate New Array
            </Button>
            <Button onClick={startSort} disabled={isPlaying}>
              Start Sort
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Visualization */}
      <Card>
        <CardContent className="p-6">
          <div className="h-80 flex items-end justify-center gap-1 overflow-hidden">
            {currentStepData.array.map((value, index) => (
              <div
                key={index}
                className={`transition-all duration-300 ${getBarColor(index)} rounded-t-sm relative group`}
                style={{
                  height: `${(value / maxValue) * 280}px`,
                  width: `${Math.max(800 / currentStepData.array.length - 2, 2)}px`,
                  minWidth: '2px'
                }}
              >
                {currentStepData.array.length <= 50 && (
                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.comparisons}</div>
            <div className="text-sm text-muted-foreground">Comparisons</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">{stats.swaps}</div>
            <div className="text-sm text-muted-foreground">Swaps</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">
              {SORTING_ALGORITHMS[selectedAlgorithm as keyof typeof SORTING_ALGORITHMS].timeComplexity}
            </div>
            <div className="text-sm text-muted-foreground">Time Complexity</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary-glow">
              {stats.time > 0 ? `${stats.time}ms` : '-'}
            </div>
            <div className="text-sm text-muted-foreground">Execution Time</div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-secondary rounded"></div>
              <span>Unsorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span>Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-destructive rounded"></div>
              <span>Swapping</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary-glow rounded"></div>
              <span>Pivot</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-accent rounded"></div>
              <span>Sorted</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};