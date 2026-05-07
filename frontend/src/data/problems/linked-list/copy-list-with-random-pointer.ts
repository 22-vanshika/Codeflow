import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'copy-list-with-random-pointer',
  title: 'Copy List with Random Pointer',
  difficulty: 'Medium',
  category: 'Linked List',
  url: 'https://leetcode.com/problems/copy-list-with-random-pointer/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
struct Node{int val;Node*next,*random;Node(int x):val(x),next(nullptr),random(nullptr){}};
class Solution {
public:
    Node* copyRandomList(Node* head) {
        if(!head) return nullptr;
        unordered_map<Node*,Node*> mp;
        Node* cur=head;
        while(cur){mp[cur]=new Node(cur->val);cur=cur->next;}
        cur=head;
        while(cur){mp[cur]->next=mp[cur->next];mp[cur]->random=mp[cur->random];cur=cur->next;}
        return mp[head];
    }
};
int main(){
    Node* n1=new Node(7); Node* n2=new Node(13); Node* n3=new Node(11);
    n1->next=n2; n2->next=n3;
    n1->random=nullptr; n2->random=n1; n3->random=n3;
    Solution sol;
    Node* copy=sol.copyRandomList(n1);
    while(copy){cout<<copy->val;if(copy->next)cout<<" -> ";copy=copy->next;}
    cout<<endl;
    return 0;
}`,
};
export default problem;
