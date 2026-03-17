// EASY 1: Find Maximum Element in Array
#include <iostream>
using namespace std;

int main() {
  int arr[] = {3, 7, 1, 9, 4, 6};
  int n = 6;
  int maxVal = arr[0];
  for (int i = 1; i < n; i++) {
    if (arr[i] > maxVal) {
      maxVal = arr[i];
    }
  }
  cout << "Max: " << maxVal << endl;
  return 0;
}
