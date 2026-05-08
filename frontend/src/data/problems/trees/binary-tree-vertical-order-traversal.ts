import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'binary-tree-vertical-order-traversal',
  title: 'Binary Tree Vertical Order Traversal',
  difficulty: 'Medium',
  category: 'Trees',
  url: 'https://leetcode.com/problems/binary-tree-vertical-order-traversal/',
  description: 'Given the `root` of a binary tree, return the vertical order traversal of its nodes\' values. (i.e., from top to bottom, column by column).\\n\\nIf two nodes are in the same row and column, the order should be from **left to right**.',
  examples: [
    {
      input: 'root = [3,9,20,null,null,15,7]',
      output: '[[9],[3,15],[20],[7]]'
    },
    {
      input: 'root = [3,9,8,4,0,1,7]',
      output: '[[4],[9],[3,0,1],[8],[7]]'
    }
  ],
  constraints: [
    'The number of nodes in the tree is in the range [0, 100].',
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
    vector<vector<int>> verticalOrder(TreeNode* root) {
        vector<vector<int>> res;
        if (!root) return res;
        map<int, vector<int>> m;
        queue<pair<TreeNode*, int>> q;
        q.push({root, 0});
        
        while (!q.empty()) {
            auto curr = q.front(); q.pop();
            TreeNode* node = curr.first;
            int col = curr.second;
            m[col].push_back(node->val);
            if (node->left) q.push({node->left, col - 1});
            if (node->right) q.push({node->right, col + 1});
        }
        
        for (auto& p : m) res.push_back(p.second);
        return res;
    }
};

int main() {
    TreeNode* root = new TreeNode(3);
    root->left = new TreeNode(9);
    root->right = new TreeNode(20);
    root->right->left = new TreeNode(15);
    root->right->right = new TreeNode(7);
    Solution sol;
    for (auto& v : sol.verticalOrder(root)) {
        for (int i : v) cout << i << " ";
        cout << endl;
    }
    return 0;
}`,
};

export default problem;
