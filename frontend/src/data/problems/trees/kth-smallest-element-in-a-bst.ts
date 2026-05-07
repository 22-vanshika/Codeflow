import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'kth-smallest-element-in-a-bst',
  title: 'Kth Smallest Element in a BST',
  difficulty: 'Medium',
  category: 'Trees',
  url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/',
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
