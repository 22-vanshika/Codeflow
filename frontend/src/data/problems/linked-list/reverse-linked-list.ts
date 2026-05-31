import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'reverse-linked-list',
  title: 'Reverse Linked List',
  difficulty: 'Easy',
  category: 'Linked List',
  url: 'https://leetcode.com/problems/reverse-linked-list/',
  description: 'Given the `head` of a singly linked list, reverse the list, and return the reversed list.',
  examples: [
    {
      input: 'head = [1,2,3,4,5]',
      output: '[5,4,3,2,1]'
    },
    {
      input: 'head = [1,2]',
      output: '[2,1]'
    },
    {
      input: 'head = []',
      output: '[]'
    }
  ],
  constraints: [
    'The number of nodes in the list is the range [0, 5000].',
    '-5000 <= Node.val <= 5000'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr) {
            ListNode* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
};

ListNode* makeList(vector<int> v) {
    ListNode* dummy = new ListNode(0);
    ListNode* cur = dummy;
    for (int x : v) { cur->next = new ListNode(x); cur = cur->next; }
    return dummy->next;
}

void printList(ListNode* head) {
    while (head) { cout << head->val; if (head->next) cout << " -> "; head = head->next; }
    cout << endl;
}

int main() {
    Solution sol;
    ListNode* list = makeList({1,2,3,4,5});
    printList(sol.reverseList(list)); // 5 -> 4 -> 3 -> 2 -> 1
    return 0;
}`,
};

export default problem;
