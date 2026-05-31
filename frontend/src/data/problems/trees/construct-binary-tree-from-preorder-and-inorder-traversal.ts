import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'construct-binary-tree-from-preorder-and-inorder-traversal',
  title: 'Construct Binary Tree from Preorder and Inorder Traversal',
  difficulty: 'Medium',
  category: 'Trees',
  url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/',
  description: 'Given two integer arrays `preorder` and `inorder` where `preorder` is the preorder traversal of a binary tree and `inorder` is the inorder traversal of the same tree, construct and return the binary tree.',
  examples: [
    {
      input: 'preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]',
      output: '[3,9,20,null,null,15,7]'
    },
    {
      input: 'preorder = [-1], inorder = [-1]',
      output: '[-1]'
    }
  ],
  constraints: [
    '1 <= preorder.length <= 3000',
    'inorder.length == preorder.length',
    '-3000 <= preorder[i], inorder[i] <= 3000',
    'preorder and inorder consist of unique values.',
    'Each value of inorder also appears in preorder.',
    'preorder is guaranteed to be the preorder traversal of the tree.',
    'inorder is guaranteed to be the inorder traversal of the tree.'
  ],
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
        inIdx.clear();
        for(int i=0;i<(int)inorder.size();i++) inIdx[inorder[i]]=i;
        return build(preorder,0,preorder.size()-1,0);
    }
};

void inorderPrint(TreeNode*n){if(!n)return;inorderPrint(n->left);cout<<n->val<<" ";inorderPrint(n->right);}

int main(){
    Solution sol;
    vector<int> pre={3,9,20,15,7}, in={9,3,15,20,7};
    inorderPrint(sol.buildTree(pre,in)); cout<<endl; // 9 3 15 20 7
    return 0;
}`,
};

export default problem;
