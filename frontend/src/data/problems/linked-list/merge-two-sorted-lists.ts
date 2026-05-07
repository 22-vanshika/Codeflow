import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'merge-two-sorted-lists',
  title: 'Merge Two Sorted Lists',
  difficulty: 'Easy',
  category: 'Linked List',
  url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val; ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* cur = &dummy;
        while (l1 && l2) {
            if (l1->val <= l2->val) { cur->next = l1; l1 = l1->next; }
            else                    { cur->next = l2; l2 = l2->next; }
            cur = cur->next;
        }
        cur->next = l1 ? l1 : l2;
        return dummy.next;
    }
};

ListNode* makeList(vector<int> v) {
    ListNode* dummy = new ListNode(0); ListNode* cur = dummy;
    for (int x : v) { cur->next = new ListNode(x); cur = cur->next; }
    return dummy->next;
}

void printList(ListNode* head) {
    while (head) { cout << head->val; if (head->next) cout << " -> "; head = head->next; }
    cout << endl;
}

int main() {
    Solution sol;
    printList(sol.mergeTwoLists(makeList({1,2,4}), makeList({1,3,4}))); // 1->1->2->3->4->4
    return 0;
}`,
};

export default problem;
