#include <iostream>
#include <mutex>
#include <condition_variable>

std::mutex _lock;
std::condition_variable_any _cond;
bool connect_finish = false;