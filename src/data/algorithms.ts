export interface Algorithm {
  id: string;
  name: string;
  category: string;
  description: string;
  complexity: {
    time: string;
    space: string;
  };
  implementations: {
    language: string;
    code: string;
  }[];
  steps: string[];
  useCase: string;
}

export const algorithmCategories = [
  "Sorting",
  "Searching", 
  "Graph",
  "Dynamic Programming",
  "String Manipulation"
];

export const algorithms: Algorithm[] = [
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    category: "Sorting",
    description: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
    complexity: {
      time: "O(n²)",
      space: "O(1)"
    },
    implementations: [
      {
        language: "JavaScript",
        code: `function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
}`
      },
      {
        language: "Python",
        code: `def bubble_sort(arr):
    n = len(arr)
    
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    
    return arr`
      },
      {
        language: "Java",
        code: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`
      }
    ],
    steps: [
      "Compare adjacent elements in the array",
      "If the first element is greater than the second, swap them",
      "Continue through the entire array",
      "Repeat the process until no more swaps are needed",
      "The largest element 'bubbles' to the end after each pass"
    ],
    useCase: "Educational purposes and small datasets where simplicity is preferred over efficiency."
  },
  {
    id: "quick-sort",
    name: "Quick Sort",
    category: "Sorting", 
    description: "An efficient divide-and-conquer sorting algorithm that works by selecting a 'pivot' element and partitioning the array around it.",
    complexity: {
      time: "O(n log n) average, O(n²) worst",
      space: "O(log n)"
    },
    implementations: [
      {
        language: "JavaScript",
        code: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Partition the array and get pivot index
    const pivotIndex = partition(arr, low, high);
    
    // Recursively sort elements before and after partition
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high]; // Choose rightmost element as pivot
  let i = low - 1; // Index of smaller element
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; // Place pivot
  return i + 1;
}`
      },
      {
        language: "Python",
        code: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        # Partition the array and get pivot index
        pivot_index = partition(arr, low, high)
        
        # Recursively sort elements before and after partition
        quick_sort(arr, low, pivot_index - 1)
        quick_sort(arr, pivot_index + 1, high)
    
    return arr

def partition(arr, low, high):
    pivot = arr[high]  # Choose rightmost element as pivot
    i = low - 1  # Index of smaller element
    
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]  # Swap
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]  # Place pivot
    return i + 1`
      }
    ],
    steps: [
      "Choose a pivot element from the array",
      "Partition the array so elements smaller than pivot go left, larger go right",
      "Recursively apply quicksort to the left and right subarrays",
      "Combine the results to get the final sorted array"
    ],
    useCase: "General-purpose sorting with good average performance, widely used in practice."
  },
  {
    id: "binary-search",
    name: "Binary Search",
    category: "Searching",
    description: "An efficient algorithm for finding an item from a sorted list by repeatedly dividing the search interval in half.",
    complexity: {
      time: "O(log n)",
      space: "O(1) iterative, O(log n) recursive"
    },
    implementations: [
      {
        language: "JavaScript",
        code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // Found the target
    } else if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  
  return -1; // Target not found
}`
      },
      {
        language: "Python",
        code: `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid  # Found the target
        elif arr[mid] < target:
            left = mid + 1  # Search right half
        else:
            right = mid - 1  # Search left half
    
    return -1  # Target not found`
      }
    ],
    steps: [
      "Start with the entire sorted array",
      "Find the middle element",
      "If middle element equals target, return its index",
      "If target is less than middle, search the left half",
      "If target is greater than middle, search the right half",
      "Repeat until target is found or search space is empty"
    ],
    useCase: "Searching in sorted arrays, databases, and any scenario requiring efficient lookups."
  },
  {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    category: "Graph",
    description: "Finds the shortest path between nodes in a weighted graph with non-negative edge weights.",
    complexity: {
      time: "O((V + E) log V)",
      space: "O(V)"
    },
    implementations: [
      {
        language: "JavaScript",
        code: `function dijkstra(graph, start) {
  const distances = {};
  const previous = {};
  const unvisited = new Set();
  
  // Initialize distances
  for (let vertex in graph) {
    distances[vertex] = vertex === start ? 0 : Infinity;
    previous[vertex] = null;
    unvisited.add(vertex);
  }
  
  while (unvisited.size > 0) {
    // Find unvisited vertex with minimum distance
    let current = null;
    for (let vertex of unvisited) {
      if (!current || distances[vertex] < distances[current]) {
        current = vertex;
      }
    }
    
    unvisited.delete(current);
    
    // Update distances to neighbors
    for (let neighbor in graph[current]) {
      const distance = distances[current] + graph[current][neighbor];
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        previous[neighbor] = current;
      }
    }
  }
  
  return { distances, previous };
}`
      }
    ],
    steps: [
      "Initialize distances to all vertices as infinite, except start vertex (0)",
      "Mark all vertices as unvisited",
      "Select unvisited vertex with minimum distance as current",
      "Update distances to all neighbors of current vertex",
      "Mark current vertex as visited",
      "Repeat until all vertices are visited or shortest path is found"
    ],
    useCase: "GPS navigation, network routing protocols, and finding optimal paths in weighted graphs."
  },
  {
    id: "fibonacci-dp",
    name: "Fibonacci (Dynamic Programming)", 
    category: "Dynamic Programming",
    description: "Efficiently calculates Fibonacci numbers using dynamic programming to avoid redundant calculations.",
    complexity: {
      time: "O(n)",
      space: "O(n) or O(1) optimized"
    },
    implementations: [
      {
        language: "JavaScript",
        code: `// Bottom-up approach with memoization
function fibonacci(n) {
  if (n <= 1) return n;
  
  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}

// Space-optimized version
function fibonacciOptimized(n) {
  if (n <= 1) return n;
  
  let prev2 = 0, prev1 = 1;
  
  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  
  return prev1;
}`
      }
    ],
    steps: [
      "Handle base cases: F(0) = 0, F(1) = 1",
      "Create array to store previously calculated values",
      "Build up solution from bottom (F(2)) to top (F(n))",
      "Each value is sum of two previous values",
      "Return the final result F(n)"
    ],
    useCase: "Mathematical calculations, algorithm optimization examples, and teaching dynamic programming concepts."
  }
];