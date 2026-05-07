import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'linked-list-cycle',
  title: 'Linked List Cycle',
  difficulty: 'Easy',
  category: 'Linked List',
  url: 'https://leetcode.com/problems/linked-list-cycle/',
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
