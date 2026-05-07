import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'asteroid-collision',
  title: 'Asteroid Collision',
  difficulty: 'Medium',
  category: 'Stack',
  url: 'https://leetcode.com/problems/asteroid-collision/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> asteroidCollision(vector<int>& asteroids) {
        stack<int> st;
        for (int a : asteroids) {
            bool alive = true;
            while (alive && a < 0 && !st.empty() && st.top() > 0) {
                if (st.top() < -a) st.pop();
                else { alive = (st.top() == -a); if (alive) st.pop(); alive = false; }
            }
            if (alive) st.push(a);
        }
        vector<int> res(st.size());
        for (int i=res.size()-1;i>=0;i--) { res[i]=st.top(); st.pop(); }
        return res;
    }
};
int main() {
    Solution sol;
    vector<int> a={5,10,-5};
    for (int v:sol.asteroidCollision(a)) cout<<v<<" "; // 5 10
    cout<<endl;
    return 0;
}`,
};
export default problem;
