// HARD 14: Trie — Insert & Search
#include <iostream>
#include <string>
using namespace std;

struct TrieNode {
  TrieNode* children[26];
  bool isEnd;
  TrieNode() : isEnd(false) {
    for (int i = 0; i < 26; i++) children[i] = nullptr;
  }
};

void insert(TrieNode* root, string word) {
  TrieNode* curr = root;
  cout << "Inserting: " << word << endl;
  for (char c : word) {
    int idx = c - 'a';
    if (!curr->children[idx]) {
      curr->children[idx] = new TrieNode();
      cout << "  New node for: " << c << endl;
    }
    curr = curr->children[idx];
  }
  curr->isEnd = true;
  cout << "  Marked end" << endl;
}

bool search(TrieNode* root, string word) {
  TrieNode* curr = root;
  for (char c : word) {
    int idx = c - 'a';
    if (!curr->children[idx]) return false;
    curr = curr->children[idx];
  }
  return curr->isEnd;
}

int main() {
  TrieNode* root = new TrieNode();
  insert(root, "apple");
  insert(root, "app");
  insert(root, "apt");

  cout << "Search apple: " << (search(root, "apple") ? "FOUND" : "NOT FOUND") << endl;
  cout << "Search app:   " << (search(root, "app")   ? "FOUND" : "NOT FOUND") << endl;
  cout << "Search ap:    " << (search(root, "ap")    ? "FOUND" : "NOT FOUND") << endl;
  cout << "Search apply: " << (search(root, "apply") ? "FOUND" : "NOT FOUND") << endl;
  return 0;
}
