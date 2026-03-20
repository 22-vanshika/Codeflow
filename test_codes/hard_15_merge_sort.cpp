// HARD 15: Merge Sort
#include <iostream>
using namespace std;

void printArr(int arr[], int l, int r, string label) {
  cout << label << ": [";
  for (int i = l; i <= r; i++) {
    cout << arr[i];
    if (i < r) cout << ", ";
  }
  cout << "]" << endl;
}

void merge(int arr[], int l, int m, int r) {
  int n1 = m - l + 1, n2 = r - m;
  int L[n1], R[n2];
  for (int i = 0; i < n1; i++) L[i] = arr[l + i];
  for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

  int i = 0, j = 0, k = l;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) arr[k++] = L[i++];
    else              arr[k++] = R[j++];
  }
  while (i < n1) arr[k++] = L[i++];
  while (j < n2) arr[k++] = R[j++];
  printArr(arr, l, r, "Merged");
}

void mergeSort(int arr[], int l, int r) {
  if (l < r) {
    int m = l + (r - l) / 2;
    cout << "Split [" << l << ".." << r << "] at mid=" << m << endl;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
  }
}

int main() {
  int arr[] = {5, 3, 8, 1, 9, 2, 7};
  int n = 7;
  cout << "Input: [5, 3, 8, 1, 9, 2, 7]" << endl;
  mergeSort(arr, 0, n - 1);
  cout << "Sorted: ";
  for (int i = 0; i < n; i++) cout << arr[i] << " ";
  cout << endl;
  return 0;
}
