import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'same-tree',
  title: 'Same Tree',
  difficulty: 'Easy',
  category: 'Trees',
  url: 'https://leetcode.com/problems/same-tree/',
  description: 'Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not.\n\nTwo binary trees are considered the same if they are structurally identical, and the nodes have the same value.',
  examples: [
    {
      input: 'p = [1,2,3], q = [1,2,3]',
      output: 'true'
    },
    {
      input: 'p = [1,2], q = [1,null,2]',
      output: 'false'
    }
  ],
  constraints: [
    'The number of nodes in both trees is in the range [0, 100].',
    '-10^4 <= Node.val <= 10^4'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode{int val;TreeNode*left,*right;TreeNode(int x):val(x),left(nullptr),right(nullptr){}};

class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q){
        if(!p&&!q) return true;
        if(!p||!q||p->val!=q->val) return false;
        return isSameTree(p->left,q->left)&&isSameTree(p->right,q->right);
    }
};

int main(){
    TreeNode* t1=new TreeNode(1); t1->left=new TreeNode(2); t1->right=new TreeNode(3);
    TreeNode* t2=new TreeNode(1); t2->left=new TreeNode(2); t2->right=new TreeNode(3);
    Solution sol; cout<<boolalpha<<sol.isSameTree(t1,t2)<<endl; // true
    return 0;
}`,
};

export default problem;
