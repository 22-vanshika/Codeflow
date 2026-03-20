// EASY 3: Queue — Enqueue & Dequeue
#include <iostream>
#include <queue>
using namespace std;

int main() {
  queue<int> q;
  q.push(1);
  q.push(2);
  q.push(3);
  cout << "Front: " << q.front() << endl;
  q.pop();
  cout << "After dequeue, front: " << q.front() << endl;
  q.pop();
  cout << "After dequeue, front: " << q.front() << endl;
  return 0;
}
