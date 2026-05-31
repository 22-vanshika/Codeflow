import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'binary-tree-zigzag-level-order-traversal',
  title: 'Binary Tree Zigzag Level Order Traversal',
  difficulty: 'Medium',
  category: 'Trees',
  url: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/',
  description: 'Given the `root` of a binary tree, return the zigzag level order traversal of its nodes\' values. (i.e., from left to right, then right to left for the next level and alternate between).',
  examples: [
    {
      input: 'root = [3,9,20,null,null,15,7]',
      output: '[[3],[20,9],[15,7]]'
    },
    {
      input: 'root = [1]',
      output: '[[1]]'
    },
    {
      input: 'root = []',
      output: '[]'
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
    vector<vector<int>> zigzagLevelOrder(TreeNode* root){
        vector<vector<int>> res;
        if(!root) return res;
        queue<TreeNode*> q; q.push(root); bool leftToRight=true;
        while(!q.empty()){
            int sz=q.size(); deque<int> level;
            for(int i=0;i<sz;i++){
                auto n=q.front();q.pop();
                if(leftToRight) level.push_back(n->val);
                else level.push_front(n->val);
                if(n->left) q.push(n->left);
                if(n->right) q.push(n->right);
            }
            res.push_back(vector<int>(level.begin(),level.end()));
            leftToRight=!leftToRight;
        }
        return res;
    }
};
int main(){
    TreeNode* t=new TreeNode(3); t->left=new TreeNode(9); t->right=new TreeNode(20);
    t->right->left=new TreeNode(15); t->right->right=new TreeNode(7);
    Solution sol;
    for(auto&l:sol.zigzagLevelOrder(t)){for(int v:l)cout<<v<<" ";cout<<endl;}
    return 0;
}`,
};
export default problem;
