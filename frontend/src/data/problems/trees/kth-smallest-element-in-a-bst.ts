import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'kth-smallest-element-in-a-bst',
  title: 'Kth Smallest Element in a BST',
  difficulty: 'Medium',
  category: 'Trees',
  url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/',
  description: 'Given the `root` of a binary search tree, and an integer `k`, return the `kth` smallest value (**1-indexed**) of all the values of the nodes in the tree.',
  examples: [
    {
      input: 'root = [3,1,4,null,2], k = 1',
      output: '1'
    },
    {
      input: 'root = [5,3,6,2,4,null,null,1], k = 3',
      output: '3'
    }
  ],
  constraints: [
    'The number of nodes in the tree is n.',
    '1 <= k <= n <= 10^4',
    '0 <= Node.val <= 10^4'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
    int count = 0, result = 0;
    void inorder(TreeNode* node, int k) {
        if (!node) return;
        inorder(node->left, k);
        if (++count == k) { result = node->val; return; }
        inorder(node->right, k);
    }
public:
    int kthSmallest(TreeNode* root, int k) {
        count = 0;
        inorder(root, k);
        return result;
    }
};

int main() {
    TreeNode* root = new TreeNode(3);
    root->left  = new TreeNode(1); root->right = new TreeNode(4);
    root->left->right = new TreeNode(2);
    Solution sol;
    cout << sol.kthSmallest(root, 1) << endl; // 1
    return 0;
}`,
};

export default problem;
