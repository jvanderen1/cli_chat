#include <iostream>

#include "cli_client.hpp"
#include "bind_event.hpp"

using namespace std;

int main(int argc, char *argv[]) {
	
  bind_event test;
  
  cout << "Hello World!" << endl;
  cli_client c("107.170.245.203");
  
  test.new_message();
  
  return 0;
}
