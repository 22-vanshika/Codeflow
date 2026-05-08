import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'flatten-binary-tree-to-linked-list',
  title: 'Flatten Binary Tree to Linked List',
  difficulty: 'Medium',
  category: 'Trees',
  url: 'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/',
  description: 'Given the `root` of a binary tree, flatten the tree into a "linked list":\\n- The "linked list" should use the same `TreeNode` class where the `right` child pointer points to the next node in the list and the `left` child pointer is always `null`.\\n- The "linked list" should be in the same order as a **pre-order traversal** of the binary tree.',
  examples: [
    {
      input: 'root = [1,2,5,3,4,null,6]',
      output: '[1,null,2,null,3,null,4,null,5,null,6]'
    },
    {
      input: 'root = []',
      output: '[]'
    },
    {
      input: 'root = [0]',
      output: '[0]'
    }
  ],
  constraints: [
    'The number of nodes in the tree is in the range [0, 2000].',
    '-100 <= Node.val <= 100'
  ],
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
