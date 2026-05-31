import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'diameter-of-binary-tree',
  title: 'Diameter of Binary Tree',
  difficulty: 'Easy',
  category: 'Trees',
  url: 'https://leetcode.com/problems/diameter-of-binary-tree/',
  description: 'Given the `root` of a binary tree, return the length of the diameter of the tree.\n\nThe diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.\n\nThe length of a path between two nodes is represented by the number of edges between them.',
  examples: [
    {
      input: 'root = [1,2,3,4,5]',
      output: '3',
      explanation: '3 is the length of the path [4,2,1,3] or [5,2,1,3].'
    },
    {
      input: 'root = [1,2]',
      output: '1'
    }
  ],
  constraints: [
    'The number of nodes in the tree is in the range [1, 10^4].',
    '-100 <= Node.val <= 100'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
    int maxDiam = 0;
    int dfs(TreeNode* node) {
        if (!node) return 0;
        int l = dfs(node->left), r = dfs(node->right);
        maxDiam = max(maxDiam, l + r);
        return 1 + max(l, r);
    }
public:
    int diameterOfBinaryTree(TreeNode* root) {
        dfs(root);
        return maxDiam;
    }
};

int main() {
    TreeNode* root = new TreeNode(1);
    root->left  = new TreeNode(2); root->right = new TreeNode(3);
    root->left->left  = new TreeNode(4);
    root->left->right = new TreeNode(5);
    Solution sol;
    cout << sol.diameterOfBinaryTree(root) << endl; // 3
    return 0;
}`,
};

export default problem;
