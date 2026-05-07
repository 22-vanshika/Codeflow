import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'diameter-of-binary-tree',
  title: 'Diameter of Binary Tree',
  difficulty: 'Easy',
  category: 'Trees',
  url: 'https://leetcode.com/problems/diameter-of-binary-tree/',
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
