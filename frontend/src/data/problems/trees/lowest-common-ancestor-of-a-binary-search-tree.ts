import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'lowest-common-ancestor-of-a-binary-search-tree',
  title: 'Lowest Common Ancestor of a BST',
  difficulty: 'Medium',
  category: 'Trees',
  url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
  description: 'Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.\\n\\nAccording to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes `p` and `q` as the lowest node in `T` that has both `p` and `q` as descendants (where we allow **a node to be a descendant of itself**).”',
  examples: [
    {
      input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8',
      output: '6'
    },
    {
      input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4',
      output: '2'
    }
  ],
  constraints: [
    'The number of nodes in the tree is in the range [2, 10^5].',
    '-10^9 <= Node.val <= 10^9',
    'All Node.val are unique.',
    'p and q will exist in the BST.',
    'p != q'
  ],
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
