OBJS = main.o cli_client.o sio_client_impl.o  sio_client.o  sio_packet.o  sio_socket.o Connection_Listener.o shared_variables.o
CC = g++ -std=c++0x
DEBUG = -g
CFLAGS = -Wall -c $(DEBUG)
LFLAGS = -Wall -L /usr/include/boost $(DEBUG)
BOOSTFLAGS = -lboost_system -lpthread

client_cli_chat: $(OBJS)
	$(CC) $(OBJS) $(LFLAGS) -o client_cli_chat $(BOOSTFLAGS)

MAIN_INCLUDE = \
	-I socket.io-client-cpp/src

main.o: main.cpp
	$(CC) $(MAIN_INCLUDE) $(CFLAGS) main.cpp

CLIENT_INCLUDE = \
	-I socket.io-client-cpp/src

cli_client.o: cli_client.cpp cli_client.hpp
	$(CC) $(CLIENT_INCLUDE) $(CFLAGS) cli_client.cpp

CONNECTION_LISTENER_INCLUDE = \
	-I socket.io-client-cpp/src

Connection_Listener.o: Connection_Listener.cpp Connection_Listener.hpp shared_variables.h
	$(CC) $(CONNECTION_LISTENER_INCLUDE) $(CFLAGS) Connection_Listener.cpp

shared_variables.o: shared_variables.c shared_variables.h
	$(CC) $(CFLAGS) shared_variables.c

SOCKET_CLIENT_INCLUDE = \
	-I socket.io-client-cpp/lib/rapidjson/include \
	-I socket.io-client-cpp/lib/websocketpp \
	-I /usr/include/boost

sio_client_impl.o: socket.io-client-cpp/src/internal/sio_client_impl.cpp socket.io-client-cpp/src/internal/sio_client_impl.h
	$(CC) $(SOCKET_CLIENT_INCLUDE) $(CFLAGS) socket.io-client-cpp/src/internal/sio_client_impl.cpp

sio_client.o: socket.io-client-cpp/src/sio_client.cpp socket.io-client-cpp/src/sio_client.h
	$(CC) $(SOCKET_CLIENT_INCLUDE) $(CFLAGS) socket.io-client-cpp/src/sio_client.cpp

sio_packet.o: socket.io-client-cpp/src/internal/sio_packet.cpp socket.io-client-cpp/src/internal/sio_packet.h
	$(CC) $(SOCKET_CLIENT_INCLUDE) $(CFLAGS) socket.io-client-cpp/src/internal/sio_packet.cpp

sio_socket.o: socket.io-client-cpp/src/sio_socket.cpp socket.io-client-cpp/src/sio_socket.h
	$(CC) $(SOCKET_CLIENT_INCLUDE) $(CFLAGS) socket.io-client-cpp/src/sio_socket.cpp

.PHONY : clean
clean :
	rm -f *.o client_cli_chat
