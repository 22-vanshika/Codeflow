import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'balanced-binary-tree',
  title: 'Balanced Binary Tree',
  difficulty: 'Easy',
  category: 'Trees',
  url: 'https://leetcode.com/problems/balanced-binary-tree/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
struct TreeNode{int val;TreeNode*left,*right;TreeNode(int x):val(x),left(nullptr),right(nullptr){}};
class Solution {
    int height(TreeNode* n){
        if(!n) return 0;
        int l=height(n->left), r=height(n->right);
        if(l==-1||r==-1||abs(l-r)>1) return -1;
        return 1+max(l,r);
    }
public:
    bool isBalanced(TreeNode* root){return height(root)!=-1;}
};
int main(){
    TreeNode* t=new TreeNode(3);
    t->left=new TreeNode(9); t->right=new TreeNode(20);
    t->right->left=new TreeNode(15); t->right->right=new TreeNode(7);
    Solution sol; cout<<boolalpha<<sol.isBalanced(t)<<endl; // true
    return 0;
}`,
};
export default problem;
