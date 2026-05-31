import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'path-sum',
  title: 'Path Sum',
  difficulty: 'Easy',
  category: 'Trees',
  url: 'https://leetcode.com/problems/path-sum/',
  description: 'Given the `root` of a binary tree and an integer `targetSum`, return `true` if the tree has a **root-to-leaf** path such that adding up all the values along the path equals `targetSum`.\\n\\nA **leaf** is a node with no children.',
  examples: [
    {
      input: 'root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22',
      output: 'true'
    },
    {
      input: 'root = [1,2,3], targetSum = 5',
      output: 'false'
    },
    {
      input: 'root = [], targetSum = 0',
      output: 'false'
    }
  ],
  constraints: [
    'The number of nodes in the tree is in the range [0, 5000].',
    '-1000 <= Node.val <= 1000',
    '-1000 <= targetSum <= 1000'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;
struct TreeNode{int val;TreeNode*left,*right;TreeNode(int x):val(x),left(nullptr),right(nullptr){}};
class Solution {
public:
    bool hasPathSum(TreeNode* root, int target){
        if(!root) return false;
        if(!root->left&&!root->right) return root->val==target;
        return hasPathSum(root->left,target-root->val)||hasPathSum(root->right,target-root->val);
    }
};
int main(){
    TreeNode* t=new TreeNode(5);
    t->left=new TreeNode(4); t->right=new TreeNode(8);
    t->left->left=new TreeNode(11); t->left->left->left=new TreeNode(7); t->left->left->right=new TreeNode(2);
    Solution sol; cout<<boolalpha<<sol.hasPathSum(t,22)<<endl; // true
    return 0;
}`,
};
export default problem;
