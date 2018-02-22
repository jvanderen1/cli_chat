#ifndef SHARED_VARIABLES_H
#define SHARED_VARIABLES_H

#include <iostream>
#include <mutex>
#include <condition_variable>

extern std::mutex _lock;
extern std::condition_variable_any _cond;
extern bool connect_finish;

#endif //SHARED_VARIABLES_H
