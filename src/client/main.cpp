#include <iostream>

#include "cli_client.hpp"

using namespace std;

int main(int argc, char *argv[]) {
  cout << "Hello World!" << endl;
  cli_client c("107.170.245.203");
  return 0;
}
