import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'reconstruct-itinerary',
  title: 'Reconstruct Itinerary',
  difficulty: 'Hard',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/reconstruct-itinerary/',
  description: 'You are given a list of airline tickets where `tickets[i] = [fromi, toi]` represent the departure and the arrival airports of one flight. Reconstruct the itinerary in order and return it.\\n\\nAll of the tickets belong to a man who departs from **"JFK"**, thus, the itinerary must begin with "JFK". If there are multiple valid itineraries, you should return the itinerary that has the smallest lexical order when read as a single string.\\n\\n- For example, the itinerary `["JFK", "LGA"]` has a smaller lexical order than `["JFK", "LGB"]`.\\n\\nYou may assume all tickets form at least one valid itinerary. You must use all the tickets once and only once.',
  examples: [
    {
      input: 'tickets = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]',
      output: '["JFK","MUC","LHR","SFO","SJC"]'
    },
    {
      input: 'tickets = [["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]',
      output: '["JFK","ATL","JFK","SFO","ATL","SFO"]',
      explanation: 'Another possible reconstruction is ["JFK","SFO","ATL","JFK","ATL","SFO"]. But it is larger in lexical order.'
    }
  ],
  constraints: [
    '1 <= tickets.length <= 300',
    'tickets[i].length == 2',
    'fromi.length == 3',
    'toi.length == 3',
    'fromi and toi consist of uppercase English letters.',
    'fromi != toi'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
    unordered_map<string, multiset<string>> adj;
    vector<string> res;
    void dfs(string s) {
        while (!adj[s].empty()) {
            string next = *adj[s].begin();
            adj[s].erase(adj[s].begin());
            dfs(next);
        }
        res.push_back(s);
    }
public:
    vector<string> findItinerary(vector<vector<string>>& tickets) {
        for (auto& t : tickets) adj[t[0]].insert(t[1]);
        dfs("JFK");
        reverse(res.begin(), res.end());
        return res;
    }
};

int main() {
    Solution sol;
    vector<vector<string>> t = {{"MUC","LHR"},{"JFK","MUC"},{"SFO","SJC"},{"LHR","SFO"}};
    for (string s : sol.findItinerary(t)) cout << s << " ";
    cout << endl; // JFK MUC LHR SFO SJC
    return 0;
}`,
};

export default problem;
