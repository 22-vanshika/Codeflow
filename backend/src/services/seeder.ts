import { Blog } from '../models/Blog';
import { Doc } from '../models/Doc';

const initialBlogs = [
    {
        slug: 'visualizing-quicksort',
        title: 'How Visualizing QuickSort Changed My Interview Preparation',
        excerpt: "I spent weeks trying to understand in-place partitioning by reading textbooks. Three days with a proper visualizer and I finally got it. Here's what made the difference.",
        content: `### The Pivot Problem

For weeks, I tried to understand **in-place partitioning** in sorting algorithms (specifically QuickSort) by reading textbooks and staring at dry code listings. 

\`\`\`cpp
int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return (i + 1);
}
\`\`\`

No matter how many times I trace it on paper, it felt like magic and pointers jumping around randomly.

### The Breakthrough: Interactive Visualizer

Three days with a proper visualizer like CodeFlow and it clicked. Watching the \`i\` and \`j\` pointers color-coded, moving step-by-step and swapping values visually, made all the difference.

Here are the key takeaways from my visual learning experience:
1. **Pointers are visible states**: When you see \`i\` as a green bar and \`j\` as a yellow bar, the "scan and swap" dynamic is obvious.
2. **Pivot is the anchor**: Watching the pivot element stand still until the final swap makes it clear why it defines the boundary.
3. **Trace step recurrence**: Stepping backward allows you to re-examine key state changes that you missed on the first pass.

Don't just write code; watch it execute!`,
        date: 'May 28, 2026',
        readTime: '7 min read',
        author: 'Anshika Asati',
        authorInitials: 'AA',
        gradient: 'from-primary to-secondary',
        category: 'Tutorial'
    },
    {
        slug: 'bfs-vs-dfs',
        title: 'BFS vs DFS: When to Use Which (With Animations)',
        excerpt: 'Graph traversal is one of the most common interview topics — and one of the most confusing. We break down the key differences with interactive examples.',
        content: `### Breadth-First vs Depth-First Search

Graph traversal is a staple of technical interviews. Yet, choosing between **BFS** (Queue-based) and **DFS** (Stack-based) is a common point of confusion.

#### BFS (Breadth-First)
- **Data Structure**: Queue (FIFO)
- **Traversal Strategy**: Level-by-level, expanding outwards.
- **Best Used For**: Finding the shortest path in unweighted graphs, level-order tree traversal.

#### DFS (Depth-First)
- **Data Structure**: Stack / Recursion (LIFO)
- **Traversal Strategy**: Exploring as deep as possible down a path before backtracking.
- **Best Used For**: Detecting cycles, topological sorting, solving mazes, exploring all possibilities.

### Visualizing the Frontiers

Watch how they expand:
- **BFS** forms an expanding wave or circle around the starting node.
- **DFS** snakes like a lightning bolt through the graph, exploring single paths to the end.

Practice tracing graph traversals visually to build a deep intuition of boundary frontiers.`,
        date: 'May 15, 2026',
        readTime: '5 min read',
        author: 'Anshika Asati',
        authorInitials: 'AA',
        gradient: 'from-accent-cyan to-primary',
        category: 'Tutorial'
    },
    {
        slug: 'dynamic-programming-patterns',
        title: 'The 5 Dynamic Programming Patterns You Must Know',
        excerpt: 'DP problems intimidate most developers. But once you recognize the 5 core patterns, you can crack any of them in an interview setting.',
        content: `### Demystifying Dynamic Programming

Many software developers dread **Dynamic Programming (DP)**. However, 90% of interview DP problems fall into one of five well-defined patterns:

1. **Fibonacci Sequence**: Overlapping subproblems depend on preceding results (e.g., Climbing Stairs, House Robber).
2. **0/1 Knapsack**: Decide whether to include or exclude an item from a set (e.g., Partition Equal Subset Sum).
3. **Unbounded Knapsack**: Similar to 0/1 but items can be selected multiple times (e.g., Coin Change, Integer Break).
4. **Longest Common Subsequence (LCS)**: Finding matches across two strings/sequences (e.g., Edit Distance).
5. **Interval DP**: Solving subproblems defined on subarrays/subsegments (e.g., Burst Balloons).

### The DP Framework
For every problem, follow these 3 steps:
1. Define the **DP State** (what does \`dp[i]\` represent?).
2. Write the **Transition Equation** (how does \`dp[i]\` relate to previous states?).
3. Establish **Base Cases**.

Once you recognize these patterns, DP becomes a game of template matching rather than high-friction mathematical deduction.`,
        date: 'May 3, 2026',
        readTime: '9 min read',
        author: 'Anshika Asati',
        authorInitials: 'AA',
        gradient: 'from-secondary to-accent-purple',
        category: 'Tutorial'
    },
    // Cited Interview Experiences
    {
        slug: 'google-swe-onsite',
        title: 'Google SWE Onsite: Graph Algorithms & Dynamic Programming Focus',
        excerpt: 'A detailed rundown of a 3-round virtual onsite interview focusing heavily on complex Graph traversals and recursive pattern mutations.',
        content: `### Google Onsite Breakdown

* **Role**: Software Engineer (L3)
* **Format**: 3 rounds virtual onsite
* **Emphasis**: Clean, highly-scalable, edge-case resilient algorithms.

### Round 1: Graph Traversal
The problem was similar to **Reconstruct Itinerary** (finding a path that visits all edges under Lexicographical priority). 
- **Solution Strategy**: Eulerian Path via modified DFS (Hierholzer's Algorithm).
- **Key Insight**: Standard DFS is too slow; post-order reversal handles dead-ends optimally.

### Round 2: Arrays & Monotonic Queue
Asked to solve a variant of **Sliding Window Maximum**.
- **Solution Strategy**: Maintain a double-ended queue (\`deque\`) storing indices of elements in decreasing order of value.
- **Key Insight**: Amortized O(n) runtime is required; standard heap O(n log k) will not pass optimized test checks.

### Key Learnings
Always articulate your thought process out loud. At Google, the clarity of your code dry-run and pointer tracing counts just as much as writing the correct logic!`,
        date: 'June 2025',
        readTime: '6 min read',
        author: 'Cited from LeetCode (user: algorithm_chef)',
        authorInitials: 'LC',
        gradient: 'from-primary to-accent-cyan',
        category: 'Interview Experience',
        company: 'Google',
        sourceUrl: 'https://leetcode.com/discuss/interview-experience'
    },
    {
        slug: 'amazon-sde-intern',
        title: 'Amazon SDE Intern: LRU Cache & Topological Sorting Experience',
        excerpt: 'Walkthrough of the Amazon OA and subsequent technical rounds covering basic cache design and scheduling dependencies.',
        content: `### Amazon OA & Virtual Onsite Details

* **Role**: SDE Intern
* **Rounds**: Online Assessment (OA) + 1 Technical Round
* **Aesthetics**: Heavy focus on practical design combined with standard templates.

### The Technical Round
The interviewer spent 15 minutes asking about Amazon Leadership Principles (specifically *Customer Obsession* and *Ownership*), then moved to coding.

#### Problem 1: LRU Cache
- **Question**: Design an Least Recently Used cache with O(1) Get and Put operations.
- **Solution**: Pair a \`std::unordered_map\` with a doubly linked list.
- **Tip**: Practice node detachment and boundary pointer rewires visually beforehand.

#### Problem 2: Course Dependencies
- **Question**: Given course prerequisites, determine if all courses can be finished.
- **Solution**: topological sort (Kahn's Algorithm / BFS cycle detection).

Be prepared for standard LeetCode Mediums and know your behavioral stories inside out.`,
        date: 'May 2026',
        readTime: '5 min read',
        author: 'Cited from GeeksforGeeks (author: sde_aspirant_10)',
        authorInitials: 'GF',
        gradient: 'from-accent-orange to-accent-yellow',
        category: 'Interview Experience',
        company: 'Amazon',
        sourceUrl: 'https://www.geeksforgeeks.org/amazon-interview-experience'
    }
];

const initialDocs = [
    {
        slug: 'quickstart',
        title: 'Quick Start',
        category: 'Getting Started',
        content: `### Get started with CodeFlow in under 2 minutes. No installation required.

Follow these 4 simple steps to visualize your first algorithm:

1. **Open the Workspace**: Navigate to the Visualizer from the homepage or click **Start Visualizing**.
2. **Write or Paste Code**: Enter your C++ algorithm in the code editor on the center panel. You can use the built-in starter templates as a quick base.
3. **Click Run**: Hit the **Run** (▶) button. Your code is securely compiled and executed on our backend server, generating an interactive execution trace.
4. **Step Through**: Use the floating playback controls at the bottom of the workspace to step forward, backward, pause, or auto-play the execution animations.`
    },
    {
        slug: 'workspace',
        title: 'Workspace Layout',
        category: 'Workspace Guide',
        content: `### The CodeFlow workspace is divided into three highly optimized panels:

#### 1. Problem Panel (Left)
Displays the active problem description, input/output examples, operational constraints, and basic tips. You can toggle the complete **DSA Sheet** drawer from the left edge of this panel.

#### 2. Code Editor (Center)
A powerful Monaco-based code editor equipped with C++ syntax highlighting, autocomplete suggestions, and key mappings. You can import files directly from your connected GitHub repository.

#### 3. Visualizer (Right)
Renders custom, animated canvas representations of your data structures (vectors, nodes, trees). Floating controls at the bottom allow pausing, scrubbing, and speed adjustment.`
    },
    {
        slug: 'supported',
        title: 'Supported Data Structures',
        category: 'Features',
        content: `### CodeFlow automatically detects and visualizes the following data structures:

- **Arrays & Vectors**: Rendered as sliding color-coded grids with active pointer overlays.
- **Linked Lists**: Visualized as sequential nodes with physical arrow links pointing to addresses.
- **Binary Search Trees (BST)**: Dynamically rendered branches showing recursive left/right distributions.
- **Graphs**: Node-and-link topologies highlighting traversal waves (BFS/DFS) in real-time.
- **Stacks & Queues**: Visualized as vertical/horizontal containment cells highlighting push/pop operations.
- **Hash Maps**: Renders key-value pairings alongside collision chaining grids.`
    },
    {
        slug: 'keyboard',
        title: 'Keyboard Shortcuts',
        category: 'Workspace Guide',
        content: `### Boost your coding speed with our keyboard shortcuts:

| Action | Shortcut |
|---|---|
| **Run / Execute Code** | \`Ctrl + Enter\` |
| **Save Visualization** | \`Ctrl + S\` |
| **Next execution step** | \`→\` or \`Space\` |
| **Previous execution step** | \`←\` |
| **Play / Pause Auto-step** | \`P\` |
| **Reset to Start** | \`R\` |
| **Toggle Line Comment** | \`Ctrl + /\` |
| **Undo last edit** | \`Ctrl + Z\` |`
    }
];

export const seedData = async () => {
    try {
        const blogCount = await Blog.countDocuments();
        if (blogCount === 0) {
            console.log('Seeding initial blogs and interview experiences...');
            await Blog.insertMany(initialBlogs);
            console.log('Successfully seeded blogs.');
        }

        const docCount = await Doc.countDocuments();
        if (docCount === 0) {
            console.log('Seeding initial documentation pages...');
            await Doc.insertMany(initialDocs);
            console.log('Successfully seeded docs.');
        }
    } catch (err) {
        console.error('Failed to seed database:', err);
    }
};
