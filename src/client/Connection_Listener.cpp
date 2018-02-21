#include "Connection_Listener.hpp"

#include <iostream>
#include <mutex>
#include <condition_variable>

#include "sio_client.h"

#include "shared_variables.h"
std::mutex _lock;
std::condition_variable_any _cond;
bool connect_finish;

void connection_listener::on_connected() {
    _lock.lock();
    _cond.notify_all();
    connect_finish = true;
    _lock.unlock();
}

void connection_listener::on_close(sio::client::close_reason const& reason) {
    std::cout << "sio closed " << std::endl;
    exit(0);
}

void connection_listener::on_fail() {
    std::cout << "sio failed " << std::endl;
    exit(0);
}