#include <stdio.h>
#include "sqlite3.h"

int main(){
	
	printf("MAIN runs!\n");

	sqlite3 *db;
	int rc;

	char cmd[] = "CREATE TABLE IF NOT EXISTS test_table (id int, name text);";

	rc = sqlite3_open_v2("testdb.db", &db, SQLITE_OPEN_READWRITE, NULL);
	if(rc){
		printf("OPENING database failed!\n");
		return 1;
	}
	
	sqlite3_stmt *stmt;

	sqlite3_prepare_v2(db, cmd, -1, &stmt, NULL);

	rc = 1;

	while(rc != SQLITE_DONE){
		printf("RUNNING sql step! rc: %d\n", rc);
		rc = sqlite3_step(stmt);		
	}
	printf("SQL exited!\n");


	sqlite3_finalize(stmt);

	//sqlite3_reset(stmt);
	
	rc = sqlite3_prepare_v2(db, "INSERT INTO test_table (id, name) VALUES (1, 'Larry McPadderson');", -1, &stmt, NULL);
	
	printf("PREPARE rc: %d\n",rc);

	rc = 1;

	while(rc != SQLITE_DONE){
		printf("RUNNING sql step! rc: %d\n", rc);
		rc = sqlite3_step(stmt);		
	}
	printf("SQL exited!\n");


	sqlite3_finalize(stmt);

	

	sqlite3_close(db);

	return 0;
}
