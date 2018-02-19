#ifndef CLI_CHAT_ADMIN_HPP
#define CLI_CHAT_ADMIN_HPP

#include "client.hpp"

class admin : public client {
 public:
  int lockRoom();
  int delectRoom();

 private:
  int adminID;
};


#endif //CLI_CHAT_ADMIN_HPP
