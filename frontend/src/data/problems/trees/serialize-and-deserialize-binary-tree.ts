import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'serialize-and-deserialize-binary-tree',
  title: 'Serialize and Deserialize Binary Tree',
  difficulty: 'Hard',
  category: 'Trees',
  url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
  description: 'Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.\\n\\nDesign an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.',
  examples: [
    {
      input: 'root = [1,2,3,null,null,4,5]',
      output: '[1,2,3,null,null,4,5]'
    }
  ],
  constraints: [
    'The number of nodes in the tree is in the range [0, 10^4].',
    '-1000 <= Node.val <= 1000'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Codec {
public:
    string serialize(TreeNode* root) {
        if (!root) return "#";
        return to_string(root->val) + "," + serialize(root->left) + "," + serialize(root->right);
    }

    TreeNode* deserialize(string data) {
        stringstream ss(data);
        return decode(ss);
    }
    
    TreeNode* decode(stringstream& ss) {
        string s;
        getline(ss, s, ',');
        if (s == "#") return nullptr;
        TreeNode* root = new TreeNode(stoi(s));
        root->left = decode(ss);
        root->right = decode(ss);
        return root;
    }
};

int main() {
    TreeNode* root = new TreeNode(1);
    root->left = new TreeNode(2);
    root->right = new TreeNode(3);
    Codec ser, deser;
    string data = ser.serialize(root);
    TreeNode* ans = deser.deserialize(data);
    cout << ans->val << endl; // 1
    return 0;
}`,
};

export default problem;
