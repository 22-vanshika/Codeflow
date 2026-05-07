import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'binary-tree-maximum-path-sum',
  title: 'Binary Tree Maximum Path Sum',
  difficulty: 'Hard',
  category: 'Trees',
  url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
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
    int maxPathSum(TreeNode* root){ dfs(root); return maxSum; }
};
int main(){
    TreeNode* t=new TreeNode(-10); t->left=new TreeNode(9); t->right=new TreeNode(20);
    t->right->left=new TreeNode(15); t->right->right=new TreeNode(7);
    Solution sol; cout<<sol.maxPathSum(t)<<endl; // 42
    return 0;
}`,
};
export default problem;
