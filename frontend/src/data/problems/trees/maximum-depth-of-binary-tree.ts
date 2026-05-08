import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'maximum-depth-of-binary-tree',
  title: 'Maximum Depth of Binary Tree',
  difficulty: 'Easy',
  category: 'Trees',
  url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
  description: 'Given the `root` of a binary tree, return its maximum depth.\n\nA binary tree\'s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
  examples: [
    {
      input: 'root = [3,9,20,null,null,15,7]',
      output: '3'
    },
    {
      input: 'root = [1,null,2]',
      output: '2'
    }
  ],
  constraints: [
    'The number of nodes in the tree is in the range [0, 10^4].',
    '-100 <= Node.val <= 100'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        return 1 + max(maxDepth(root->left), maxDepth(root->right));
    }
};

int main() {
    TreeNode* root = new TreeNode(3);
    root->left  = new TreeNode(9);
    root->right = new TreeNode(20);
    root->right->left  = new TreeNode(15);
    root->right->right = new TreeNode(7);
    Solution sol;
    cout << sol.maxDepth(root) << endl; // 3
    return 0;
}`,
};

export default problem;
