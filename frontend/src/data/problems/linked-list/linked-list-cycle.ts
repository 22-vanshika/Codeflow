import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'linked-list-cycle',
  title: 'Linked List Cycle',
  difficulty: 'Easy',
  category: 'Linked List',
  url: 'https://leetcode.com/problems/linked-list-cycle/',
  description: 'Given `head`, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer. Internally, `pos` is used to denote the index of the node that tail\'s `next` pointer is connected to. **Note that `pos` is not passed as a parameter.**\n\nReturn `true` if there is a cycle in the linked list. Otherwise, return `false`.',
  examples: [
    {
      input: 'head = [3,2,0,-4], pos = 1',
      output: 'true',
      explanation: 'There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).'
    },
    {
      input: 'head = [1,2], pos = 0',
      output: 'true',
      explanation: 'There is a cycle in the linked list, where the tail connects to the 0th node.'
    },
    {
      input: 'head = [1], pos = -1',
      output: 'false',
      explanation: 'There is no cycle in the linked list.'
    }
  ],
  constraints: [
    'The number of nodes in the list is in the range [0, 10^4].',
    '-10^5 <= Node.val <= 10^5',
    'pos is -1 or a valid index in the linked-list.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val; ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    bool hasCycle(ListNode* head) {
        ListNode* slow = head, *fast = head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) return true;
        }
        return false;
    }
};

int main() {
    Solution sol;
    // Build [3,2,0,-4] with cycle at pos 1
    ListNode* n1 = new ListNode(3);
    ListNode* n2 = new ListNode(2);
    ListNode* n3 = new ListNode(0);
    ListNode* n4 = new ListNode(-4);
    n1->next = n2; n2->next = n3; n3->next = n4; n4->next = n2; // cycle

    cout << boolalpha << sol.hasCycle(n1) << endl; // true

    ListNode* n5 = new ListNode(1);
    ListNode* n6 = new ListNode(2);
    n5->next = n6; // no cycle
    cout << sol.hasCycle(n5) << endl; // false
    return 0;
}`,
};

export default problem;
