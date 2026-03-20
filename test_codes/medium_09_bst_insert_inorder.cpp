// MEDIUM 9: Binary Search Tree — Insert & Inorder
#include <iostream>
using namespace std;

struct Node {
  int val;
  Node* left;
  Node* right;
  Node(int v) : val(v), left(nullptr), right(nullptr) {}
};

Node* insert(Node* root, int val) {
  if (!root) return new Node(val);
  if (val < root->val) root->left  = insert(root->left,  val);
  else                 root->right = insert(root->right, val);
  return root;
}

void inorder(Node* root) {
  if (!root) return;
  inorder(root->left);
  cout << root->val << " ";
  inorder(root->right);
}

int main() {
  Node* root = nullptr;
  int values[] = {10, 5, 15, 3, 7, 12, 20};
  for (int v : values) {
    root = insert(root, v);
    cout << "Inserted: " << v << endl;
  }
  cout << "Inorder (sorted): ";
  inorder(root);
  cout << endl;
  return 0;
}
