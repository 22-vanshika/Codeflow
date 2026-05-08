import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'asteroid-collision',
  title: 'Asteroid Collision',
  difficulty: 'Medium',
  category: 'Stack',
  url: 'https://leetcode.com/problems/asteroid-collision/',
  description: 'We are given an array `asteroids` of integers representing asteroids in a row.\n\nFor each asteroid, the absolute value represents its size, and the sign represents its direction (positive meaning right, negative meaning left). Each asteroid moves at the same speed.\n\nFind out the state of the asteroids after all collisions. If two asteroids meet, the smaller one will explode. If both are the same size, both will explode. Two asteroids moving in the same direction will never meet.',
  examples: [
    {
      input: 'asteroids = [5,10,-5]',
      output: '[5,10]',
      explanation: 'The 10 and -5 collide resulting in 10. The 5 and 10 never collide.'
    },
    {
      input: 'asteroids = [8,-8]',
      output: '[]',
      explanation: 'The 8 and -8 collide exploding each other.'
    },
    {
      input: 'asteroids = [10,2,-5]',
      output: '[10]',
      explanation: 'The 2 and -5 collide resulting in -5. The 10 and -5 collide resulting in 10.'
    }
  ],
  constraints: [
    '2 <= asteroids.length <= 10^4',
    '-1000 <= asteroids[i] <= 1000',
    'asteroids[i] != 0'
  ],
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
