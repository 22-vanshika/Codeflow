import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'intersection-of-two-linked-lists',
  title: 'Intersection of Two Linked Lists',
  difficulty: 'Easy',
  category: 'Linked List',
  url: 'https://leetcode.com/problems/intersection-of-two-linked-lists/',
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
