import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'clone-graph',
  title: 'Clone Graph',
  difficulty: 'Medium',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/clone-graph/',
  description: 'Given a reference of a node in a **connected** undirected graph. Return a **deep copy** (clone) of the graph.\n\nEach node in the graph contains a value (`int`) and a list (`List[Node]`) of its neighbors.',
  examples: [
    {
      input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]',
      output: '[[2,4],[1,3],[2,4],[1,3]]',
      explanation: 'There are 4 nodes in the graph.\n1st node (val = 1)\'s neighbors are 2nd node (val = 2) and 4th node (val = 4).\n2nd node (val = 2)\'s neighbors are 1st node (val = 1) and 3rd node (val = 3).\n3rd node (val = 3)\'s neighbors are 2nd node (val = 2) and 4th node (val = 4).\n4th node (val = 4)\'s neighbors are 1st node (val = 1) and 3rd node (val = 3).'
    }
  ],
  constraints: [
    'The number of nodes in the graph is in the range [0, 100].',
    '1 <= Node.val <= 100',
    'Node.val is unique for each node.',
    'There are no repeated edges and no self-loops in the graph.',
    'The Graph is connected and all nodes can be visited starting from the given node.'
  ],
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
