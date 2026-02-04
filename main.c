#include <sys/socket.h>
#include <stdlib.h>
#include <netinet/in.h>
#include <stdio.h>
#include <unistd.h>
#include "sqlite3.h"

int main(){
	
	printf("MAIN runs!\n");

	int soc = socket(AF_INET, SOCK_STREAM, 0);

	int opt = 1;
	setsockopt(soc, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
	
	struct sockaddr_in my_addr;
	my_addr.sin_family = AF_INET;
	my_addr.sin_port = htons(2008);
	my_addr.sin_addr.s_addr = htonl(INADDR_ANY);

	int binded = bind(soc, (struct sockaddr *)&my_addr, sizeof(my_addr));
	if(binded<0){printf("bind error!\n"); return 1;}

	listen(soc, 1);

	struct sockaddr accept_addr;
	socklen_t addrlen = sizeof(accept_addr);

	printf("setup socket on port 2008 and ready read on acc\n");

	int acc = accept(soc, &accept_addr, &addrlen);
	if(acc<0){printf("accept error!\n"); return 1;}

	
	unsigned char *http_request = malloc(1000);
	int http_request_length;

	http_request_length = read(acc, http_request, 1000);

	if(http_request_length < 0){
		printf("OH SHIT! read failed!\n");
		return 1;
	}

	for(int i = 0; i<http_request_length;i++){
		printf("%c",http_request[i]);
	}

	unsigned char out[] = "HTTP/1.1 200 OK\r\nContent-Length: 0\r\n\r\n";

	//write(acc, http_request, http_request_length);
	write(acc, out, sizeof(out));

	unsigned char *endpoint = malloc(100);
	int endpoint_length;

	unsigned char buf = http_request[0];
	int recording = 0;
	int out_index = 0;
	int endpoint_index = 0;

	while(buf != '\n'){

		//printf("up dated buf to ' %c'\n",buf);
		if(recording && buf == ' '){
			//printf("exited at out=%d and endpoint=%d\n",out_index,endpoint_index);
			break;
		}
		if(recording){
			//printf("adding %c at %d\n",http_request[out_index],endpoint_index);
			endpoint[endpoint_index] = http_request[out_index];
			endpoint_index++;
		}

		if(!recording && buf == ' '){
			//printf("started recording at %d\n",out_index);
			recording = 1;
		}

		out_index++;
		buf = http_request[out_index];

	}
	endpoint_length = endpoint_index;

	printf("endpoint lenght %d\n",endpoint_length);
	printf("ENDPOINT: '%s'\n",endpoint);


	free(http_request);

	return 0;
}
