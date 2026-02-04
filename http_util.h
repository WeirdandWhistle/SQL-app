#ifndef HTTP_UTIL
#define HTTP_UTIL

#define HTTP_GET 1
#define HTTP_POST 2
#define HTTP_DELETE 3
#define HTTP_PUT 4



typedef struct {
	int type;
	unsigned char *path;
	int path_length;
} http_request;



#endif
