import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'same-tree',
  title: 'Same Tree',
  difficulty: 'Easy',
  category: 'Trees',
  url: 'https://leetcode.com/problems/same-tree/',
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
