import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'find-median-from-data-stream',
  title: 'Find Median from Data Stream',
  difficulty: 'Hard',
  category: 'Heap / Priority Queue',
  url: 'https://leetcode.com/problems/find-median-from-data-stream/',
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
