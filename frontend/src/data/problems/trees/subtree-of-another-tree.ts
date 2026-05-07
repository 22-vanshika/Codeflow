import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'subtree-of-another-tree',
  title: 'Subtree of Another Tree',
  difficulty: 'Easy',
  category: 'Trees',
  url: 'https://leetcode.com/problems/subtree-of-another-tree/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
struct TreeNode{int val;TreeNode*left,*right;TreeNode(int x):val(x),left(nullptr),right(nullptr){}};
class Solution {
    bool same(TreeNode* s, TreeNode* t){
        if(!s&&!t) return true;
        if(!s||!t||s->val!=t->val) return false;
        return same(s->left,t->left)&&same(s->right,t->right);
    }
public:
    bool isSubtree(TreeNode* root, TreeNode* subRoot){
        if(!root) return false;
        if(same(root,subRoot)) return true;
        return isSubtree(root->left,subRoot)||isSubtree(root->right,subRoot);
    }
};
int main(){
    TreeNode* s=new TreeNode(3); s->left=new TreeNode(4); s->right=new TreeNode(5);
    s->left->left=new TreeNode(1); s->left->right=new TreeNode(2);
    TreeNode* t=new TreeNode(4); t->left=new TreeNode(1); t->right=new TreeNode(2);
    Solution sol; cout<<boolalpha<<sol.isSubtree(s,t)<<endl; // true
    return 0;
}`,
};
export default problem;
