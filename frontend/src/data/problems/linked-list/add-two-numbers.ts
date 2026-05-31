import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'add-two-numbers',
  title: 'Add Two Numbers',
  difficulty: 'Medium',
  category: 'Linked List',
  url: 'https://leetcode.com/problems/add-two-numbers/',
  description: 'You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.',
  examples: [
    {
      input: 'l1 = [2,4,3], l2 = [5,6,4]',
      output: '[7,0,8]',
      explanation: '342 + 465 = 807.'
    },
    {
      input: 'l1 = [0], l2 = [0]',
      output: '[0]'
    },
    {
      input: 'l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]',
      output: '[8,9,9,9,0,0,0,1]'
    }
  ],
  constraints: [
    'The number of nodes in each linked list is in the range [1, 100].',
    '0 <= Node.val <= 9',
    'It is guaranteed that the list represents a number that does not have leading zeros.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

struct ListNode{int val;ListNode*next;ListNode(int x):val(x),next(nullptr){}};

class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode dummy(0); ListNode* cur=&dummy; int carry=0;
        while(l1||l2||carry){
            int sum=carry+(l1?l1->val:0)+(l2?l2->val:0);
            cur->next=new ListNode(sum%10); cur=cur->next;
            carry=sum/10;
            if(l1)l1=l1->next; if(l2)l2=l2->next;
        }
        return dummy.next;
    }
};

ListNode* make(vector<int>v){ListNode*d=new ListNode(0);ListNode*c=d;for(int x:v){c->next=new ListNode(x);c=c->next;}return d->next;}
void print(ListNode*h){while(h){cout<<h->val;if(h->next)cout<<"->";h=h->next;}cout<<endl;}

int main(){
    Solution sol;
    print(sol.addTwoNumbers(make({2,4,3}),make({5,6,4}))); // 7->0->8
    return 0;
}`,
};

export default problem;
