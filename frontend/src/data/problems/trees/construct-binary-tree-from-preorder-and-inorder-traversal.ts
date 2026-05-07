import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'construct-binary-tree-from-preorder-and-inorder-traversal',
  title: 'Construct Binary Tree from Preorder and Inorder Traversal',
  difficulty: 'Medium',
  category: 'Trees',
  url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
struct TreeNode{int val;TreeNode*left,*right;TreeNode(int x):val(x),left(nullptr),right(nullptr){}};
class Solution {
    unordered_map<int,int> inIdx;
    TreeNode* build(vector<int>& pre, int preL, int preR, int inL){
        if(preL>preR) return nullptr;
        int rootVal=pre[preL];
        int mid=inIdx[rootVal];
        int leftSize=mid-inL;
        TreeNode* node=new TreeNode(rootVal);
        node->left=build(pre,preL+1,preL+leftSize,inL);
        node->right=build(pre,preL+leftSize+1,preR,mid+1);
        return node;
    }
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder){
        for(int i=0;i<(int)inorder.size();i++) inIdx[inorder[i]]=i;
        return build(preorder,0,preorder.size()-1,0);
    }
};
void inorder(TreeNode*n){if(!n)return;inorder(n->left);cout<<n->val<<" ";inorder(n->right);}
int main(){
    Solution sol;
    vector<int> pre={3,9,20,15,7}, in={9,3,15,20,7};
    inorder(sol.buildTree(pre,in)); cout<<endl; // 9 3 15 20 7
    return 0;
}`,
};
export default problem;
