import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'intersection-of-two-linked-lists',
  title: 'Intersection of Two Linked Lists',
  difficulty: 'Easy',
  category: 'Linked List',
  url: 'https://leetcode.com/problems/intersection-of-two-linked-lists/',
  description: 'Given the heads of two singly linked-lists `headA` and `headB`, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return `null`.',
  examples: [
    {
      input: 'intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3',
      output: 'Intersected at \'8\''
    }
  ],
  constraints: [
    'The number of nodes of listA is in the m.',
    'The number of nodes of listB is in the n.',
    '1 <= m, n <= 3 * 10^4',
    '1 <= Node.val <= 10^5',
    'skipA, skipB are in the ranges [0, m] and [0, n] respectively.',
    'intersectVal is 0 if listA and listB do not intersect.',
    'intersectVal == listA[skipA] == listB[skipB] if listA and listB intersect.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

struct ListNode{int val;ListNode*next;ListNode(int x):val(x),next(nullptr){}};

class Solution {
public:
    ListNode* getIntersectionNode(ListNode* headA, ListNode* headB) {
        ListNode* a=headA, *b=headB;
        while(a!=b){
            a = a ? a->next : headB;
            b = b ? b->next : headA;
        }
        return a;
    }
};

int main(){
    // Build intersecting lists
    ListNode* shared=new ListNode(8);
    shared->next=new ListNode(4); shared->next->next=new ListNode(5);
    ListNode* A=new ListNode(4); A->next=new ListNode(1); A->next->next=shared;
    ListNode* B=new ListNode(5); B->next=new ListNode(6); B->next->next=new ListNode(1); B->next->next->next=shared;
    Solution sol;
    cout<<sol.getIntersectionNode(A,B)->val<<endl; // 8
    return 0;
}`,
};

export default problem;
