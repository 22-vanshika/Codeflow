import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'palindrome-linked-list',
  title: 'Palindrome Linked List',
  difficulty: 'Easy',
  category: 'Linked List',
  url: 'https://leetcode.com/problems/palindrome-linked-list/',
  description: 'Given the `head` of a singly linked list, return `true` if it is a palindrome or `false` otherwise.',
  examples: [
    {
      input: 'head = [1,2,2,1]',
      output: 'true'
    },
    {
      input: 'head = [1,2]',
      output: 'false'
    }
  ],
  constraints: [
    'The number of nodes in the list is in the range [1, 10^5].',
    '0 <= Node.val <= 9'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

struct ListNode { int val; ListNode* next; ListNode(int x):val(x),next(nullptr){} };

class Solution {
    ListNode* reverse(ListNode* h) {
        ListNode* p=nullptr;
        while(h){auto n=h->next;h->next=p;p=h;h=n;}
        return p;
    }
public:
    bool isPalindrome(ListNode* head) {
        if (!head || !head->next) return true;
        ListNode* slow=head,*fast=head;
        while(fast&&fast->next){slow=slow->next;fast=fast->next->next;}
        ListNode* second=reverse(slow);
        while(second){
            if(head->val!=second->val) return false;
            head=head->next;
            second=second->next;
        }
        return true;
    }
};

ListNode* make(vector<int> v){ListNode* d=new ListNode(0);ListNode* c=d;for(int x:v){c->next=new ListNode(x);c=c->next;}return d->next;}

int main(){
    Solution sol;
    cout<<boolalpha<<sol.isPalindrome(make({1,2,2,1}))<<endl; // true
    cout<<sol.isPalindrome(make({1,2}))<<endl; // false
    return 0;
}`,
};

export default problem;
