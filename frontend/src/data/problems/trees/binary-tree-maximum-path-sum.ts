import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'binary-tree-maximum-path-sum',
  title: 'Binary Tree Maximum Path Sum',
  difficulty: 'Hard',
  category: 'Trees',
  url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
  description: 'A **path** in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence **at most once**. Note that the path does not need to pass through the root.\n\nThe **path sum** of a path is the sum of the node\'s values in the path.\n\nGiven the `root` of a binary tree, return the **maximum path sum** of any **non-empty** path.',
  examples: [
    {
      input: 'root = [1,2,3]',
      output: '6',
      explanation: 'The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.'
    },
    {
      input: 'root = [-10,9,20,null,null,15,7]',
      output: '42',
      explanation: 'The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.'
    }
  ],
  constraints: [
    'The number of nodes in the tree is in the range [1, 3 * 10^4].',
    '-1000 <= Node.val <= 1000'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode{int val;TreeNode*left,*right;TreeNode(int x):val(x),left(nullptr),right(nullptr){}};

class Solution {
    int maxSum=INT_MIN;
    int dfs(TreeNode* n){
        if(!n) return 0;
        int l=max(0,dfs(n->left)), r=max(0,dfs(n->right));
        maxSum=max(maxSum, n->val+l+r);
        return n->val+max(l,r);
    }
public:
    int maxPathSum(TreeNode* root){ 
        maxSum = INT_MIN;
        dfs(root); 
        return maxSum; 
    }
};

int main(){
    TreeNode* t=new TreeNode(-10); t->left=new TreeNode(9); t->right=new TreeNode(20);
    t->right->left=new TreeNode(15); t->right->right=new TreeNode(7);
    Solution sol; cout<<sol.maxPathSum(t)<<endl; // 42
    return 0;
}`,
};

export default problem;
