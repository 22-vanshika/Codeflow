// EASY 2: Stack — Push & Pop
#include <iostream>
#include <stack>
using namespace std;

int main() {
  stack<int> st;
  st.push(10);
  st.push(20);
  st.push(30);
  cout << "Top: " << st.top() << endl;
  st.pop();
  cout << "After pop, top: " << st.top() << endl;
  st.pop();
  cout << "After pop, top: " << st.top() << endl;
  return 0;
}
