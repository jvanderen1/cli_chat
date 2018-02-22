#ifndef BIND_EVENT_HPP
#define BIND_EVENT_HPP

#include "sio_client.h"

class bind_event {
private:
  int participants;
  sio::socket::ptr current_socket;
public:
  bind_event(){participants = -1;};
  void new_message();
  void user_joined(sio::client::close_reason const& reason);
  void user_left();
};

#endif // BIND_EVENT_HPP