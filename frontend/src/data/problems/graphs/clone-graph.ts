import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'clone-graph',
  title: 'Clone Graph',
  difficulty: 'Medium',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/clone-graph/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Node {
public:
    int val; vector<Node*> neighbors;
    Node(int v):val(v){}
};
class Solution {
    unordered_map<Node*,Node*> visited;
public:
    Node* cloneGraph(Node* node){
        if(!node) return nullptr;
        if(visited.count(node)) return visited[node];
        Node* clone=new Node(node->val);
        visited[node]=clone;
        for(Node* nei:node->neighbors) clone->neighbors.push_back(cloneGraph(nei));
        return clone;
    }
};
int main(){
    Node* n1=new Node(1); Node* n2=new Node(2);
    Node* n3=new Node(3); Node* n4=new Node(4);
    n1->neighbors={n2,n4}; n2->neighbors={n1,n3};
    n3->neighbors={n2,n4}; n4->neighbors={n1,n3};
    Solution sol;
    Node* c=sol.cloneGraph(n1);
    cout<<c->val<<" neighbors: "<<c->neighbors[0]->val<<","<<c->neighbors[1]->val<<endl;
    return 0;
}`,
};
export default problem;
