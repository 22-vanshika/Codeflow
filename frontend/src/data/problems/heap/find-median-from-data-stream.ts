import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'find-median-from-data-stream',
  title: 'Find Median from Data Stream',
  difficulty: 'Hard',
  category: 'Heap / Priority Queue',
  url: 'https://leetcode.com/problems/find-median-from-data-stream/',
  description: 'The **median** is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.\n\nFor example, for `arr = [2,3,4]`, the median is `3`.\nFor example, for `arr = [2,3]`, the median is `(2 + 3) / 2 = 2.5`.\n\nImplement the MedianFinder class:\n- `MedianFinder()` initializes the MedianFinder object.\n- `void addNum(int num)` adds the integer `num` from the data stream to the data structure.\n- `double findMedian()` returns the median of all elements so far. Answers within `10^-5` of the actual answer will be accepted.',
  examples: [
    {
      input: '["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]\n[[], [1], [2], [], [3], []]',
      output: '[null, null, null, 1.5, null, 2.0]'
    }
  ],
  constraints: [
    '-10^5 <= num <= 10^5',
    'There will be at least one element in the data structure before calling findMedian.',
    'At most 5 * 10^4 calls will be made to addNum and findMedian.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class MedianFinder {
    priority_queue<int> lo;                          // max-heap (left half)
    priority_queue<int,vector<int>,greater<int>> hi; // min-heap (right half)
public:
    void addNum(int num){
        lo.push(num);
        hi.push(lo.top()); lo.pop();
        if(hi.size()>lo.size()){lo.push(hi.top());hi.pop();}
    }
    double findMedian(){
        if(lo.size()>hi.size()) return lo.top();
        return (lo.top()+hi.top())/2.0;
    }
};

int main(){
    MedianFinder mf;
    mf.addNum(1); mf.addNum(2);
    cout<<mf.findMedian()<<endl; // 1.5
    mf.addNum(3);
    cout<<mf.findMedian()<<endl; // 2
    return 0;
}`,
};

export default problem;
