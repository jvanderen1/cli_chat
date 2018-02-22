#include "Connection_Listener.hpp"

#include <iostream>

#include "sio_client.h"

#include "shared_variables.h"

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
