// HARD 13: Graph — DFS Recursive
#include <iostream>
#include <vector>
using namespace std;

vector<bool> visited;
vector<vector<int>> adj;

void dfs(int node) {
  visited[node] = true;
  cout << "Visit: " << node << endl;
  for (int neighbor : adj[node]) {
    if (!visited[neighbor]) {
      cout << "  Go to: " << neighbor << endl;
      dfs(neighbor);
      cout << "  Back to: " << node << endl;
    }
  }
}

int main() {
  int n = 6;
  adj.resize(n);
  adj[0] = {1, 2};
  adj[1] = {0, 3, 4};
  adj[2] = {0, 5};
  adj[3] = {1};
  adj[4] = {1};
  adj[5] = {2};
  visited.assign(n, false);
  cout << "DFS from node 0:" << endl;
  dfs(0);
  return 0;
}
