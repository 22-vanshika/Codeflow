import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'reorder-list',
  title: 'Reorder List',
  difficulty: 'Medium',
  category: 'Linked List',
  url: 'https://leetcode.com/problems/reorder-list/',
  description: 'You are given the head of a singly linked-list. The list can be represented as:\n`L0 → L1 → … → Ln - 1 → Ln`\n\nReorder the list to be on the following form:\n`L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …`\n\nYou may not modify the values in the list\'s nodes. Only nodes themselves may be changed.',
  examples: [
    {
      input: 'head = [1,2,3,4]',
      output: '[1,4,2,3]'
    },
    {
      input: 'head = [1,2,3,4,5]',
      output: '[1,5,2,4,3]'
    }
  ],
  constraints: [
    'The number of nodes in the list is in the range [1, 5 * 10^4].',
    '1 <= Node.val <= 1000'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val; ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    void reorderList(ListNode* head) {
        if (!head || !head->next) return;
        // Find middle
        ListNode* slow = head, *fast = head;
        while (fast->next && fast->next->next) {
            slow = slow->next; fast = fast->next->next;
        }
        // Reverse second half
        ListNode* second = slow->next;
        slow->next = nullptr;
        ListNode* prev = nullptr;
        while (second) {
            ListNode* nxt = second->next;
            second->next = prev; prev = second; second = nxt;
        }
        // Merge two halves
        ListNode* first = head; second = prev;
        while (second) {
            ListNode* tmp1 = first->next, *tmp2 = second->next;
            first->next = second; second->next = tmp1;
            first = tmp1; second = tmp2;
        }
    }
};

ListNode* makeList(vector<int> v) {
    ListNode* dummy = new ListNode(0); ListNode* cur = dummy;
    for (int x : v) { cur->next = new ListNode(x); cur = cur->next; }
    return dummy->next;
}

void printList(ListNode* h) {
    while (h) { cout << h->val; if (h->next) cout << " -> "; h = h->next; }
    cout << endl;
}

int main() {
    Solution sol;
    ListNode* list = makeList({1,2,3,4,5});
    sol.reorderList(list);
    printList(list); // 1->5->2->4->3
    return 0;
}`,
};

export default problem;
