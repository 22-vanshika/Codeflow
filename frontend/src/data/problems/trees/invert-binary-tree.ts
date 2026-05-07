import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'invert-binary-tree',
  title: 'Invert Binary Tree',
  difficulty: 'Easy',
  category: 'Trees',
  url: 'https://leetcode.com/problems/invert-binary-tree/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (!root) return nullptr;
        swap(root->left, root->right);
        invertTree(root->left);
        invertTree(root->right);
        return root;
    }
};

void printLevel(TreeNode* root) {
    if (!root) return;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        auto node = q.front(); q.pop();
        cout << node->val << " ";
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
    cout << endl;
}

int main() {
    TreeNode* root = new TreeNode(4);
    root->left  = new TreeNode(2); root->right = new TreeNode(7);
    root->left->left  = new TreeNode(1); root->left->right  = new TreeNode(3);
    root->right->left = new TreeNode(6); root->right->right = new TreeNode(9);
    Solution sol;
    printLevel(sol.invertTree(root)); // 4 7 2 9 6 3 1
    return 0;
}`,
};

export default problem;
