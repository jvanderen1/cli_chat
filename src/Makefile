OBJS = main.o client.o admin.o
CC = g++ -std=c++0x
DEBUG = -g
CFLAGS = -Wall -c $(DEBUG)
LFLAGS = -Wall $(DEBUG)

client_cli_chat : $(OBJS)
	$(CC) $(LFLAGS) $(OBJS) -o client_cli_chat

main.o : main.cpp
	$(CC) $(CFLAGS) main.cpp

client.o : client/client.cpp client/client.hpp
	$(CC) $(CFLAGS) client/client.cpp

admin.o : client/admin.cpp client/admin.hpp
	$(CC) $(CFLAGS) client/admin.cpp

.PHONY : clean
clean :
	-rm *.o