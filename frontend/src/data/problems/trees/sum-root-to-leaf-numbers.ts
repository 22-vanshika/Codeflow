import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'sum-root-to-leaf-numbers',
  title: 'Sum Root to Leaf Numbers',
  difficulty: 'Medium',
  category: 'Trees',
  url: 'https://leetcode.com/problems/sum-root-to-leaf-numbers/',
  description: 'You are given the `root` of a binary tree containing digits from `0` to `9` only.\\n\\nEach root-to-leaf path in the tree represents a number.\\n\\n- For example, the root-to-leaf path `1 -> 2 -> 3` represents the number `123`.\\n\\nReturn the total sum of all root-to-leaf numbers. A **leaf** node is a node with no children.',
  examples: [
    {
      input: 'root = [1,2,3]',
      output: '25',
      explanation: 'The root-to-leaf path 1->2 represents the number 12. The root-to-leaf path 1->3 represents the number 13. Therefore, sum = 12 + 13 = 25.'
    },
    {
      input: 'root = [4,9,0,5,1]',
      output: '1026',
      explanation: 'The root-to-leaf path 4->9->5 represents the number 495. The root-to-leaf path 4->9->1 represents the number 491. The root-to-leaf path 4->0 represents the number 40. Therefore, sum = 495 + 491 + 40 = 1026.'
    }
  ],
  constraints: [
    'The number of nodes in the tree is in the range [1, 1000].',
    '0 <= Node.val <= 9',
    'The depth of the tree will not exceed 10.'
  ],
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
