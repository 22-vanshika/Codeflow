import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'validate-binary-search-tree',
  title: 'Validate Binary Search Tree',
  difficulty: 'Medium',
  category: 'Trees',
  url: 'https://leetcode.com/problems/validate-binary-search-tree/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
    bool validate(TreeNode* node, long minVal, long maxVal) {
        if (!node) return true;
        if (node->val <= minVal || node->val >= maxVal) return false;
        return validate(node->left, minVal, node->val)
            && validate(node->right, node->val, maxVal);
    }
public:
    bool isValidBST(TreeNode* root) {
        return validate(root, LONG_MIN, LONG_MAX);
    }
};

int main() {
    Solution sol;
    cout << boolalpha;
    TreeNode* t1 = new TreeNode(2);
    t1->left = new TreeNode(1); t1->right = new TreeNode(3);
    cout << sol.isValidBST(t1) << endl; // true

    TreeNode* t2 = new TreeNode(5);
    t2->left = new TreeNode(1); t2->right = new TreeNode(4);
    t2->right->left = new TreeNode(3); t2->right->right = new TreeNode(6);
    cout << sol.isValidBST(t2) << endl; // false
    return 0;
}`,
};

export default problem;
