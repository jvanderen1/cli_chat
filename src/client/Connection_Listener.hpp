#ifndef CONNECTION_LISTENER_HPP
#define CONNECTION_LISTENER_HPP

#include "sio_client.h"

class connection_listener
{
private:
  sio::client &handler;
public:
  connection_listener(sio::client& h) : handler(h){};
  void on_connected();
  void on_close(sio::client::close_reason const& reason);
  void on_fail();
};

#endif // CONNECTION_LISTENER_HPP