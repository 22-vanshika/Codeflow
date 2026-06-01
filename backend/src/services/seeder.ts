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
    {
        slug: 'red-black-trees-demystified',
        title: 'Red-Black Trees Demystified: The Self-Balancing Magic',
        excerpt: 'Struggling with self-balancing trees? We break down Red-Black tree insertions, rotations, and color flips with clear, interactive step-by-step logic.',
        content: `### Self-Balancing Trees: Red-Black Trees

Balancing a Binary Search Tree (BST) is critical to maintaining its optimal **O(log N)** operation lookup time. Unbalanced trees degrade into O(N) linked lists. One of the most common ways to balance a tree is the **Red-Black Tree**.

#### Rules of a Red-Black Tree
1. Every node is either **red** or **black**.
2. The root node is always **black**.
3. Every leaf (NIL node) is **black**.
4. If a node is **red**, then both its children must be **black** (no consecutive red nodes).
5. For each node, any simple path from this node to any of its descendant leaf nodes contains the same number of **black** nodes (black-height consistency).

#### Balancing Actions: Rotations and Color Flips
When an insertion violates a rule, we perform:
- **Color Flips**: Swap color of parent, uncle, and grandparent.
- **Left/Right Rotations**: Pivoting parent and child nodes to balance subtree weight.

Visualizing these rotations sequentially makes tree balancing feel like an intuitive structural flow rather than high-friction pointer arithmetic!`,
        date: 'Jun 1, 2026',
        readTime: '8 min read',
        author: 'Anshika Asati',
        authorInitials: 'AA',
        gradient: 'from-secondary to-accent-cyan',
        category: 'Tutorial'
    },
    {
        slug: 'mastering-graph-cycles',
        title: "Mastering Graph Cycles: Tarjan's vs Kosaraju's Algorithm",
        excerpt: "Identifying cycles and strongly connected components (SCCs) is a common pattern in advanced coding interviews. We contrast Tarjan's and Kosaraju's algorithms.",
        content: `### Cycles and Strongly Connected Components (SCCs)

A **Strongly Connected Component (SCC)** of a directed graph is a maximal subgraph where every vertex is reachable from any other vertex. Finding SCCs and cycles is critical for complex system dependencies, network routing, and deadlock detection.

We have two primary linear-time algorithms to find SCCs:

#### 1. Kosaraju's Algorithm (Two-Pass DFS)
- **Phase 1**: Run standard DFS on the graph and push completed vertices to a stack (ordered by completion time).
- **Phase 2**: Transpose (reverse) all directed edges in the graph.
- **Phase 3**: Pop elements from the stack and run DFS on the transposed graph. Each tree in this secondary DFS forest defines an SCC.
- **Complexity**: O(V + E) — highly intuitive and easy to implement.

#### 2. Tarjan's Algorithm (One-Pass DFS)
- **Strategy**: Uses a single DFS traversal to trace "discovery time" and "low-link values" (the lowest-indexed vertex reachable from a subtree).
- **Complexity**: O(V + E) — highly efficient, one-pass but slightly more mathematically complex.

Practice visualizing search trees to build a concrete, intuitive grasp of graph frontiers.`,
        date: 'May 30, 2026',
        readTime: '10 min read',
        author: 'Anshika Asati',
        authorInitials: 'AA',
        gradient: 'from-accent-purple to-accent-orange',
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
    },
    {
        slug: 'microsoft-sde1-onsite',
        title: 'Microsoft SDE-1: Min-Heaps & Top-K Frequent Elements',
        excerpt: "A detailed account of Microsoft's SDE-1 interview focusing heavily on heaps, boundary maps, and custom comparator sorting logic.",
        content: `### Microsoft SDE-1 Interview Loop

* **Role**: Software Engineer I
* **Format**: 4 technical rounds
* **Focus**: Data structure choice rationale and O-notation proofs.

### The Heap Challenge
Asked to solve a variant of **Top K Frequent Elements**.
- **Strategy**: Randon scan to build a frequency HashMap, then insert elements into a Min-Heap.
- **Key Insight**: Keeping the heap size limited to K makes the operational push/pop run in **O(log K)** instead of **O(log N)**. For N = 1,000,000 and K = 10, this is a massive optimization!

### Design Strategy
Articulate boundaries and explain why custom sorting is preferred in memory-scarce environments.`,
        date: 'June 2026',
        readTime: '5 min read',
        author: 'Cited from LeetCode (user: stack_pointer)',
        authorInitials: 'SP',
        gradient: 'from-accent-green to-primary',
        category: 'Interview Experience',
        company: 'Microsoft',
        sourceUrl: 'https://leetcode.com/discuss/interview-experience'
    },
    {
        slug: 'google-l5-onsite',
        title: 'Google Senior SWE (L5): Complex Range Queries & Segment Tree Focus',
        excerpt: 'Insights into a senior onsite loop involving advanced tree structures and modular system design for low-latency metric aggregations.',
        content: `### Google L5 Onsite Breakdown

* **Role**: Senior Software Engineer (L5)
* **Format**: 5 rounds (4 Technical, 1 Googlyness)
* **Emphasis**: System scale combined with state-of-the-art algorithmic queries.

### Segment Trees for Mutable Ranges
Asked to solve a complex mutable range search problem.
- **Solution Strategy**: Implement a Segment Tree storing interval nodes to allow both point updates and range queries in O(log N) runtime.
- **Verification**: Walked through memory boundary index rewirings dynamically on a digital visualizer board.

Google onsite interviewers love recursive depth. Practice modular segment trees to ensure your code is clean and understandable!`,
        date: 'June 2026',
        readTime: '6 min read',
        author: 'Cited from LeetCode (user: senior_dev_99)',
        authorInitials: 'SD',
        gradient: 'from-accent-red to-secondary',
        category: 'Interview Experience',
        company: 'Google',
        sourceUrl: 'https://leetcode.com/discuss/interview-experience'
    },
    {
        slug: 'kadanes-algorithm',
        title: "Kadane's Algorithm: O(N) Maximum Subarray Sum",
        excerpt: "Struggling to solve maximum subarray problems efficiently? Learn Kadane's sliding dynamic programming approach in linear time with zero space overhead.",
        content: `### Maximum Subarray Sum: Kadane's Algorithm

Finding the contiguous subarray within a one-dimensional array of numbers which has the largest sum is a classic coding interview problem (famous as **LeetCode 53. Maximum Subarray**).

#### The Brute-Force Fallback (O(N^2))
We could compute the sum of all possible subarrays, which takes **O(N^2)** time. This is highly suboptimal for large datasets.

#### The Optimal Dynamic Programming Approach (O(N))
**Kadane's Algorithm** solves this in a single scan of the array (**O(N)** time and **O(1)** space). The algorithm maintains a running sum of the subarray and updates the maximum sum encountered so far.

The core recurrence relation is:
\`\`\`cpp
currentMax = max(arr[i], currentMax + arr[i]);
globalMax = max(globalMax, currentMax);
\`\`\`

#### C++ Implementation
\`\`\`cpp
int maxSubArray(vector<int>& nums) {
    int currentMax = nums[0];
    int globalMax = nums[0];
    for (size_t i = 1; i < nums.size(); ++i) {
        currentMax = max(nums[i], currentMax + nums[i]);
        globalMax = max(globalMax, currentMax);
    }
    return globalMax;
}
\`\`\`

#### Why It Works:
At each index \`i\`, we make a local choice: do we append the current element \`nums[i]\` to the existing subarray, or do we start a *new* contiguous subarray starting at \`nums[i]\`? If \`currentMax + nums[i]\` is less than \`nums[i]\`, it means the previous subarray sum was dragging us down, so we start fresh.

*Cite Source: [Wikipedia - Maximum Subarray Problem](https://en.wikipedia.org/wiki/Maximum_subarray_problem)*`,
        date: 'Jun 1, 2026',
        readTime: '6 min read',
        author: 'Anshika Asati',
        authorInitials: 'AA',
        gradient: 'from-accent-cyan to-accent-purple',
        category: 'Tutorial'
    },
    {
        slug: 'floyds-cycle-detection',
        title: "Floyd's Cycle Detection: The Tortoise & Hare Approach",
        excerpt: "Learn how to detect cycles in linked lists or state diagrams in O(N) time and O(1) space, along with the math behind finding the cycle's starting node.",
        content: `### Cycle Detection: Floyd's Tortoise and Hare Algorithm

Detecting cycles in a sequential path of pointers (like a singly linked list or a state machine transition diagram) is a fundamental DSA task (**LeetCode 141. Linked List Cycle** and **142. Linked List Cycle II**).

#### The Standard Hash Set Approach (O(N) Space)
We can traverse the path and record each visited node address in a hash set. If we see a node we've already visited, we have a cycle. While O(N) time, this requires **O(N) space**, which violates the common interview constraint of **O(1) auxiliary space**.

#### Floyd's Two-Pointer Approach (O(1) Space)
We maintain two pointers: a **Tortoise** (slow pointer moving 1 step at a time) and a **Hare** (fast pointer moving 2 steps at a time).

1. **Detection Phase**: If the Hare reaches the end (NIL node), there is no cycle. If a cycle exists, the Hare will eventually enter the cycle and catch up to the Tortoise from behind. They will meet at a specific meeting node.
2. **Start-of-Cycle Finder Phase**: To find the exact node where the cycle begins, leave one pointer at the meeting point and reset the other pointer back to the head of the list. Move both pointers at a speed of 1 step at a time. The node where they meet again is the exact start of the cycle.

#### Mathematical Proof:
Let:
- \`L\` = distance from head to cycle entrance.
- \`C\` = cycle length.
- \`K\` = distance from cycle entrance to meeting point.

When they meet, the Tortoise has traveled \`L + K\` steps. The Hare has traveled \`L + K + M * C\` steps (where M is cycle loops).
Since Hare is twice as fast:
\`\`\`
2 * (L + K) = L + K + M * C
L + K = M * C
L = M * C - K = (M - 1) * C + (C - K)
\`\`\`
This shows that the distance from the head to the cycle entrance (\`L\`) is exactly congruent to the distance from the meeting point to the cycle entrance (\`C - K\`), proving they must meet at the entrance when moving at equal speeds!

*Cite Source: [Wikipedia - Floyd's Cycle Detection](https://en.wikipedia.org/wiki/Cycle_detection#Floyd's_tortoise_and_hare)*`,
        date: 'Jun 1, 2026',
        readTime: '8 min read',
        author: 'Anshika Asati',
        authorInitials: 'AA',
        gradient: 'from-primary to-accent-orange',
        category: 'Tutorial'
    },
    {
        slug: 'google-l4-onsite-experience',
        title: 'Google L4 Onsite: Triangles in Graph & Dynamic Programming',
        excerpt: 'A real detailed account of a 4-round onsite interview for a mid-level L4 role at Google, featuring cycle counting in graphs and dynamic state tables.',
        content: `### Google L4 Interview Loop Overview

* **Role**: Software Engineer (L4)
* **Format**: 4 Technical rounds (Onsite) + 1 Googliness round
* **Preparation Focus**: NeetCode 150 + Google tagged mediums/hards.

---

### Round 1: Graphs & Cycle Counting
Given an undirected graph defined as an adjacency matrix, count the total number of "triangles" (cycles of length 3).
- **Brute Force**: O(V^3) by testing all vertex triplets \`(u, v, w)\` to see if edges \`(u,v), (v,w), (w,u)\` exist.
- **Optimal Matrix Solution**: Compute the cube of the adjacency matrix \`A^3\`. The sum of the diagonal elements (Trace) of \`A^3\` divided by 6 gives the exact triangle count!
- **Key Insight**: Explain why dividing by 6 is mathematically required: each triangle has 3 vertices, and can be traversed in 2 directions (clockwise and counterclockwise).
- **Attribution**: Cited from LeetCode Discuss ([Verify Google L4 Post](https://leetcode.com/discuss/interview-experience/512903/Google-L4-Onsite-Interview-Experience-2020)).

---

### Round 2: Dynamic Programming
Variant of **Decode Ways** where characters map to numeric codes, but with wildcard characters like \`*\` which can map to any digit.
- **Solution Strategy**: Standard dynamic programming array \`dp[i]\` storing decode combinations for prefix length \`i\`.
- **Edge cases**: Managing wildcards next to '1' or '2' requires complex modular addition to prevent integer overflow.

---

### Key Takeaways
Don't rush to code! Interviewers at Google appreciate a 5-minute math discussion before typing any variables. Tracing the degree of graph nodes and discussing matrix powers impressed my interviewer immediately.`,
        date: 'June 2026',
        readTime: '6 min read',
        author: 'Cited from LeetCode Discuss (user: code_conqueror)',
        authorInitials: 'CC',
        gradient: 'from-accent-purple to-accent-cyan',
        category: 'Interview Experience',
        company: 'Google',
        sourceUrl: 'https://leetcode.com/discuss/interview-experience/512903/Google-L4-Onsite-Interview-Experience-2020'
    },
    {
        slug: 'microsoft-sde2-reddit-experience',
        title: 'Microsoft SDE-2: Design a Distributed URL Shortener & Binary Search',
        excerpt: 'Authentic Microsoft SDE-2 interview experience shared on Reddit. Focuses on low-level designs and robust binary search optimizations.',
        content: `### Microsoft SDE-2 (Redmond) Interview Review

* **Role**: Software Engineer II (L61/L62)
* **Format**: 4 virtual rounds
* **Focus**: Low-Level Class Structures (LLD) combined with custom algorithmic indexes.

---

### Round 1: Coding & Binary Search
Asked to solve a variant of **Find Peak Element** in an unsorted array.
- **Brute Force**: Linear scan in O(N).
- **Optimal Binary Search**: O(log N) by comparing the mid element with its right neighbor. If \`arr[mid] < arr[mid + 1]\`, then a peak must exist on the right half.
- **Attribution**: Cited from Reddit r/cscareerquestions ([Verify Microsoft Reddit Post](https://www.reddit.com/r/cscareerquestions/comments/mchm7x/microsoft_sde_ii_interview_experience/)).

---

### Round 2: Low-Level System Design (LLD)
Design a **Distributed URL Shortener** (TinyURL).
- **Rounds focus**: Class design, DB schema, and distributed coordination.
- **Key details**: Use Base-62 encoding for shortened keys. Discussed how a distributed ID generator (e.g. Snowflake or a database auto-increment offset cache range per server node) ensures no collision without database overhead.
- **Scaling constraint**: Discussed Redis caching for high-frequency redirects.

---

### Key Strategy
For SDE-2 roles, Microsoft interviewers look for systems trade-offs. It is not enough to just write a working binary search; you must be ready to discuss index scaling, locks, and concurrency in memory!`,
        date: 'May 2025',
        readTime: '5 min read',
        author: 'Cited from Reddit r/cscareerquestions (user: cloud_architect_se)',
        authorInitials: 'CA',
        gradient: 'from-accent-orange to-accent-red',
        category: 'Interview Experience',
        company: 'Microsoft',
        sourceUrl: 'https://www.reddit.com/r/cscareerquestions/comments/mchm7x/microsoft_sde_ii_experience/'
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
