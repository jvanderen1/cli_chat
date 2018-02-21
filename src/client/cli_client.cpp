#include <iostream>

#include <mutex>
#include <condition_variable>

#include "cli_client.hpp"
#include "sio_client.h"

using namespace sio;

std::mutex _lock;
std::condition_variable_any _cond;
bool connect_finish = false;

class connection_listener
{
private:
    sio::client &handler;

public:
    connection_listener(sio::client& h) : handler(h) 
    { 
    }
    

    void on_connected()
    {
        std::cout << " I have connected " << std::endl;
        _lock.lock();
        _cond.notify_all();
        connect_finish = true;
        _lock.unlock();
    }
    void on_close(client::close_reason const& reason)
    {
        std::cout << "sio closed " << std::endl;
        exit(0);
    }
    
    void on_fail()
    {
        std::cout<<"sio failed "<<std::endl;
        exit(0);
    }
};

cli_client::cli_client(std::string IP) {
  sio::client h;
  connection_listener l(h);
  h.connect("http://" + IP);
}

int cli_client::createRoom() {
  return 0;
}

int cli_client::selectRoom() {
  return 0;
}

int cli_client::leaveRoom() {
  return 0;
}
