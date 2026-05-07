import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'serialize-and-deserialize-binary-tree',
  title: 'Serialize and Deserialize Binary Tree',
  difficulty: 'Hard',
  category: 'Trees',
  url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
struct TreeNode{int val;TreeNode*left,*right;TreeNode(int x):val(x),left(nullptr),right(nullptr){}};
class Codec {
public:
    string serialize(TreeNode* root){
        if(!root) return "null,";
        return to_string(root->val)+","+serialize(root->left)+serialize(root->right);
    }
    TreeNode* deserialize(string data){
        queue<string> q;
        stringstream ss(data); string tok;
        while(getline(ss,tok,',')) q.push(tok);
        return build(q);
    }
    TreeNode* build(queue<string>& q){
        string tok=q.front(); q.pop();
        if(tok=="null") return nullptr;
        TreeNode* n=new TreeNode(stoi(tok));
        n->left=build(q); n->right=build(q);
        return n;
    }
};
void inorder(TreeNode*n){if(!n)return;inorder(n->left);cout<<n->val<<" ";inorder(n->right);}
int main(){
    TreeNode* t=new TreeNode(1); t->left=new TreeNode(2); t->right=new TreeNode(3);
    t->right->left=new TreeNode(4); t->right->right=new TreeNode(5);
    Codec c; string s=c.serialize(t);
    cout<<s<<endl;
    inorder(c.deserialize(s)); cout<<endl;
    return 0;
}`,
};
export default problem;
