// EASY 5: Linked List — Build & Traverse
#include <iostream>
using namespace std;

struct Node {
  int val;
  Node* next;
  Node(int v) : val(v), next(nullptr) {}
};

int main() {
  Node* head = new Node(1);
  head->next = new Node(2);
  head->next->next = new Node(3);
  head->next->next->next = new Node(4);

  Node* curr = head;
  while (curr != nullptr) {
    cout << curr->val;
    if (curr->next) cout << " -> ";
    curr = curr->next;
  }
  cout << " -> NULL" << endl;
  return 0;
}
