#include <stdio.h>
#include "sqlite3.h"

int main(){
	
	printf("MAIN runs!\n");

	sqlite3 *db;
	int rc;

	char cmd[] = "CREATE TABLE IF NOT EXISTS test_table (id INTEGER PRIMARY KEY, name TEXT NOT NULL);";

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
	
	rc = sqlite3_prepare_v2(db, "INSERT INTO test_table ( name) VALUES ('Larry McPadderson');", -1, &stmt, NULL);
	
	printf("PREPARE rc: %d\n",rc);

	rc = 1;

	while(rc != SQLITE_DONE){
		printf("RUNNING sql step! rc: %d\n", rc);
		rc = sqlite3_step(stmt);		
	}
	printf("SQL exited!\n");


	sqlite3_finalize(stmt);

	
	sqlite3_prepare_v2(db, "SELECT * FROM test_table;", -1, &stmt, NULL);

	rc = 0;
	while(rc != SQLITE_DONE){
		rc = sqlite3_step(stmt);

		if(rc == SQLITE_DONE){
			break;
		}

		int col_count = sqlite3_column_count(stmt);

		int id = sqlite3_column_int(stmt, 0);
		const unsigned char *name = sqlite3_column_text(stmt, 1);

		printf("ENTRY [ID: %d| NAME: %s]\n",id,name);
			
		
	}
	

	sqlite3_close(db);

	return 0;
}
