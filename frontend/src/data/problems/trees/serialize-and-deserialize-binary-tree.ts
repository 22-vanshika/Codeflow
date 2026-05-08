import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'serialize-and-deserialize-binary-tree',
  title: 'Serialize and Deserialize Binary Tree',
  difficulty: 'Hard',
  category: 'Trees',
  url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
  description: 'Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.\n\nDesign an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.',
  examples: [
    {
      input: 'root = [1,2,3,null,null,4,5]',
      output: '[1,2,3,null,null,4,5]'
    },
    {
      input: 'root = []',
      output: '[]'
    }
  ],
  constraints: [
    'The number of nodes in the tree is in the range [0, 10^4].',
    '-1000 <= Node.val <= 1000'
  ],
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
        if(q.empty()) return nullptr;
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
