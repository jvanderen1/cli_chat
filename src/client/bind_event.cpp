#include "bind_event.hpp"

#include <iostream>
#include <mutex>
#include <condition_variable>

#include "sio_client.h"

#include "shared_variables.h"

using namespace sio;
using namespace std;

std::mutex _lock;
std::condition_variable_any _cond;
bool connect_finish;

void bind_event::new_message() {
	current_socket->on("new message", sio::socket::event_listener_aux([&](string const& name, message::ptr const& data, bool isAck,message::list &ack_resp)
                       {
                           _lock.lock();
                           string user = data->get_map()["username"]->get_string();
                           string message = data->get_map()["message"]->get_string();
                           EM(user<<":"<<message);
                           _lock.unlock();
                       }));
}

void bind_event::user_joined(sio::client::close_reason const& reason) {
    current_socket->on("user joined",sio::socket::event_listener_aux([&](string const& name, message::ptr const& data, bool isAck,message::list &ack_resp)
                       {
                           _lock.lock();
                           string user = data->get_map()["username"]->get_string();
                           participants  = data->get_map()["numUsers"]->get_int();
                           bool plural = participants !=1;
                           
                           //     abc "
                           HIGHLIGHT(user<<" joined"<<"\nthere"<<(plural?" are ":"'s ")<< participants<<(plural?" participants":" participant"));
                           _lock.unlock();
                       }));
}

void bind_event::user_left() {
    current_socket->on("user left", sio::socket::event_listener_aux([&](string const& name, message::ptr const& data, bool isAck,message::list &ack_resp)
                       {
                           _lock.lock();
                           string user = data->get_map()["username"]->get_string();
                           participants  = data->get_map()["numUsers"]->get_int();
                           bool plural = participants !=1;
                           HIGHLIGHT(user<<" left"<<"\nthere"<<(plural?" are ":"'s ")<< participants<<(plural?" participants":" participant"));
                           _lock.unlock();
                       }));
}
