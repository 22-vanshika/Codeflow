import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'flatten-binary-tree-to-linked-list',
  title: 'Flatten Binary Tree to Linked List',
  difficulty: 'Medium',
  category: 'Trees',
  url: 'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
struct TreeNode{int val;TreeNode*left,*right;TreeNode(int x):val(x),left(nullptr),right(nullptr){}};
class Solution {
public:
    void flatten(TreeNode* root){
        while(root){
            if(root->left){
                TreeNode* tail=root->left;
                while(tail->right) tail=tail->right;
                tail->right=root->right;
                root->right=root->left;
                root->left=nullptr;
            }
            root=root->right;
        }
    }
};
int main(){
    TreeNode* t=new TreeNode(1); t->left=new TreeNode(2); t->right=new TreeNode(5);
    t->left->left=new TreeNode(3); t->left->right=new TreeNode(4); t->right->right=new TreeNode(6);
    Solution sol; sol.flatten(t);
    while(t){cout<<t->val;if(t->right)cout<<"->";t=t->right;} cout<<endl; // 1->2->3->4->5->6
    return 0;
}`,
};
export default problem;
