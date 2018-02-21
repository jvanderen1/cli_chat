OBJS = main.o cli_client.o sio_client_impl.o  sio_client.o  sio_packet.o  sio_socket.o
CC = g++ -std=c++0x
DEBUG = -g
CFLAGS = -Wall -c $(DEBUG)
LFLAGS = -Wall -L /usr/include/boost $(DEBUG)
BOOSTFLAGS = -lboost_system -lpthread

client_cli_chat: $(OBJS)
	$(CC) $(OBJS) $(LFLAGS) -o client_cli_chat $(BOOSTFLAGS)

MAIN_INCLUDE = \
	-I client \
	-I client/socket.io-client-cpp/src

main.o: main.cpp
	$(CC) $(MAIN_INCLUDE) $(CFLAGS) main.cpp

CLIENT_INCLUDE = \
	-I client/socket.io-client-cpp/src

cli_client.o: client/cli_client.cpp client/cli_client.hpp
	$(CC) $(CLIENT_INCLUDE) $(CFLAGS) client/cli_client.cpp

SOCKET_CLIENT_INCLUDE = \
	-I client/socket.io-client-cpp/lib/rapidjson/include \
	-I client/socket.io-client-cpp/lib/websocketpp \
	-I /usr/include/boost

sio_client_impl.o: client/socket.io-client-cpp/src/internal/sio_client_impl.cpp client/socket.io-client-cpp/src/internal/sio_client_impl.h
	$(CC) $(SOCKET_CLIENT_INCLUDE) $(CFLAGS) client/socket.io-client-cpp/src/internal/sio_client_impl.cpp

sio_client.o: client/socket.io-client-cpp/src/sio_client.cpp client/socket.io-client-cpp/src/sio_client.h
	$(CC) $(SOCKET_CLIENT_INCLUDE) $(CFLAGS) client/socket.io-client-cpp/src/sio_client.cpp

sio_packet.o: client/socket.io-client-cpp/src/internal/sio_packet.cpp client/socket.io-client-cpp/src/internal/sio_packet.h
	$(CC) $(SOCKET_CLIENT_INCLUDE) $(CFLAGS) client/socket.io-client-cpp/src/internal/sio_packet.cpp

sio_socket.o: client/socket.io-client-cpp/src/sio_socket.cpp client/socket.io-client-cpp/src/sio_socket.h
	$(CC) $(SOCKET_CLIENT_INCLUDE) $(CFLAGS) client/socket.io-client-cpp/src/sio_socket.cpp

.PHONY : clean
clean :
	rm -f *.o client_cli_chat
