#ifndef HTTP_UTIL
#define HTTP_UTIL

#define HTTP_GET 1
#define HTTP_POST 2
#define HTTP_DELETE 3
#define HTTP_PUT 4

typedef struct {
	unsigned char *key;
	int key_length;
	unsigned char *value;
	int value_length;
} http_header;


typedef struct {
	int type;
	unsigned char *path;
	int path_length;
	http_header  **headers;
	int headers_length;
	unsigned char *body;
	int body_length;	
} http_request;

typedef struct {
	int code;
	http_header **headers;
	int headers_length;
	unsigned char *body;
	int body_length;

	
} http_response;

void http_get_request(http_request *req, int fd);
void http_free_request(http_request *req);

void http_create_header(http_header *header, unsigned char *key, int key_length, unsigned char *value, int value_length);
void http_free_header(http_header *header);

void http_response_bytes(unsigned char *bytes, http_response *res);
void http_free_response(http_response *res);


#endif
