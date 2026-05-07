import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'path-sum',
  title: 'Path Sum',
  difficulty: 'Easy',
  category: 'Trees',
  url: 'https://leetcode.com/problems/path-sum/',
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
