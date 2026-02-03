#include <stdio.h>
#include "sqlite3.h"

int main(){
	
	printf("MAIN runs!\n");

	sqlite3 *db;
	int rc;

	rc = sqlite3_open("testdb.db", &db);
	if(rc){
		printf("OPENING database failed!\n");
	}
	

	sqlite3_close(db);

	return 0;
}
