// MEDIUM 8: Stack — Valid Parentheses
#include <iostream>
#include <stack>
#include <string>
using namespace std;

int main() {
  string s = "({[]})";
  stack<char> st;

  for (int i = 0; i < (int)s.size(); i++) {
    char c = s[i];
    if (c == '(' || c == '{' || c == '[') {
      st.push(c);
      cout << "Push: " << c << endl;
    } else {
      if (st.empty()) {
        cout << "Invalid: stack empty on closing " << c << endl;
        return 0;
      }
      char top = st.top();
      st.pop();
      bool match = (c == ')' && top == '(') ||
                   (c == '}' && top == '{') ||
                   (c == ']' && top == '[');
      cout << "Pop: " << top << (match ? " matches " : " MISMATCH ") << c << endl;
      if (!match) {
        cout << "Invalid" << endl;
        return 0;
      }
    }
  }
  cout << (st.empty() ? "Valid" : "Invalid") << endl;
  return 0;
}
