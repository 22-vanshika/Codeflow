// MEDIUM 11: Graph — BFS (Adjacency List)
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

int main() {
  int n = 6;
  vector<vector<int>> adj(n);
  adj[0] = {1, 2};
  adj[1] = {0, 3, 4};
  adj[2] = {0, 5};
  adj[3] = {1};
  adj[4] = {1};
  adj[5] = {2};

  vector<bool> visited(n, false);
  queue<int> q;
  q.push(0);
  visited[0] = true;

  cout << "BFS from node 0:" << endl;
  while (!q.empty()) {
    int node = q.front(); q.pop();
    cout << "Visit: " << node << endl;
    for (int nb : adj[node]) {
      if (!visited[nb]) {
        visited[nb] = true;
        q.push(nb);
        cout << "  Enqueue: " << nb << endl;
      }
    }
  }
  return 0;
}
