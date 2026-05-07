import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'count-good-nodes-in-binary-tree',
  title: 'Count Good Nodes in Binary Tree',
  difficulty: 'Medium',
  category: 'Trees',
  url: 'https://leetcode.com/problems/count-good-nodes-in-binary-tree/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
struct TreeNode{int val;TreeNode*left,*right;TreeNode(int x):val(x),left(nullptr),right(nullptr){}};
class Solution {
    int dfs(TreeNode* n, int maxSoFar){
        if(!n) return 0;
        int good=(n->val>=maxSoFar)?1:0;
        maxSoFar=max(maxSoFar,n->val);
        return good+dfs(n->left,maxSoFar)+dfs(n->right,maxSoFar);
    }
public:
    int goodNodes(TreeNode* root){ return dfs(root,INT_MIN); }
};
int main(){
    TreeNode* t=new TreeNode(3); t->left=new TreeNode(1); t->right=new TreeNode(4);
    t->left->left=new TreeNode(3); t->right->left=new TreeNode(1); t->right->right=new TreeNode(5);
    Solution sol; cout<<sol.goodNodes(t)<<endl; // 4
    return 0;
}`,
};
export default problem;
