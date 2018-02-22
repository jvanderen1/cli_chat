#include <iostream>

#include "cli_client.hpp"
#include "sio_client.h"
#include "shared_variables.h"
#include "Connection_Listener.hpp"

cli_client::cli_client(std::string IP) { 

  connection_listener listener(h);
  
  h.set_open_listener(std::bind(&connection_listener::on_connected, &listener));
  h.set_close_listener(std::bind(&connection_listener::on_close, &listener, std::placeholders::_1));
  h.set_fail_listener(std::bind(&connection_listener::on_fail, &listener));
  
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