import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'lowest-common-ancestor-of-a-binary-search-tree',
  title: 'Lowest Common Ancestor of a BST',
  difficulty: 'Medium',
  category: 'Trees',
  url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        while (root) {
            if (p->val < root->val && q->val < root->val)
                root = root->left;
            else if (p->val > root->val && q->val > root->val)
                root = root->right;
            else
                return root;
        }
        return nullptr;
    }
};

int main() {
    TreeNode* root = new TreeNode(6);
    root->left  = new TreeNode(2); root->right = new TreeNode(8);
    root->left->left  = new TreeNode(0); root->left->right  = new TreeNode(4);
    root->right->left = new TreeNode(7); root->right->right = new TreeNode(9);
    root->left->right->left = new TreeNode(3); root->left->right->right = new TreeNode(5);

    Solution sol;
    auto lca = sol.lowestCommonAncestor(root, root->left, root->right);
    cout << lca->val << endl; // 6
    lca = sol.lowestCommonAncestor(root, root->left, root->left->right);
    cout << lca->val << endl; // 2
    return 0;
}`,
};

export default problem;
