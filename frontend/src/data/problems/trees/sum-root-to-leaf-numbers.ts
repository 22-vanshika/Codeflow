import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'sum-root-to-leaf-numbers',
  title: 'Sum Root to Leaf Numbers',
  difficulty: 'Medium',
  category: 'Trees',
  url: 'https://leetcode.com/problems/sum-root-to-leaf-numbers/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
struct TreeNode{int val;TreeNode*left,*right;TreeNode(int x):val(x),left(nullptr),right(nullptr){}};
class Solution {
    int dfs(TreeNode* n, int curr){
        if(!n) return 0;
        curr=curr*10+n->val;
        if(!n->left&&!n->right) return curr;
        return dfs(n->left,curr)+dfs(n->right,curr);
    }
public:
    int sumNumbers(TreeNode* root){ return dfs(root,0); }
};
int main(){
    TreeNode* t=new TreeNode(1); t->left=new TreeNode(2); t->right=new TreeNode(3);
    Solution sol; cout<<sol.sumNumbers(t)<<endl; // 25 (12+13)
    return 0;
}`,
};
export default problem;
