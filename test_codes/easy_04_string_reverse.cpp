// EASY 4: String — Reverse using Two Pointers
#include <iostream>
#include <string>
using namespace std;

int main() {
  string s = "hello";
  int left = 0, right = s.size() - 1;
  while (left < right) {
    char temp = s[left];
    s[left] = s[right];
    s[right] = temp;
    left++;
    right--;
  }
  cout << "Reversed: " << s << endl;
  return 0;
}
