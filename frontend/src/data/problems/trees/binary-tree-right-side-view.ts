import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'binary-tree-right-side-view',
  title: 'Binary Tree Right Side View',
  difficulty: 'Medium',
  category: 'Trees',
  url: 'https://leetcode.com/problems/binary-tree-right-side-view/',
  description: 'Given the `root` of a binary tree, imagine yourself standing on the **right side** of it, return the values of the nodes you can see ordered from top to bottom.',
  examples: [
    {
      input: 'root = [1,2,3,null,5,null,4]',
      output: '[1,3,4]'
    },
    {
      input: 'root = [1,null,3]',
      output: '[1,3]'
    },
    {
      input: 'root = []',
      output: '[]'
    }
  ],
  constraints: [
    'The number of nodes in the tree is in the range [0, 100].',
    '-100 <= Node.val <= 100'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode{int val;TreeNode*left,*right;TreeNode(int x):val(x),left(nullptr),right(nullptr){}};

class Solution {
public:
    vector<int> rightSideView(TreeNode* root){
        vector<int> res;
        if(!root) return res;
        queue<TreeNode*> q; q.push(root);
        while(!q.empty()){
            int sz=q.size();
            for(int i=0;i<sz;i++){
                auto n=q.front();q.pop();
                if(i==sz-1) res.push_back(n->val);
                if(n->left) q.push(n->left);
                if(n->right) q.push(n->right);
            }
        }
        return res;
    }
};

int main(){
    TreeNode* t=new TreeNode(1); t->left=new TreeNode(2); t->right=new TreeNode(3);
    t->left->right=new TreeNode(5); t->right->right=new TreeNode(4);
    Solution sol;
    for(int v:sol.rightSideView(t)) cout<<v<<" "; // 1 3 4
    cout<<endl; return 0;
}`,
};

export default problem;
