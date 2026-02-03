# SQL-app
a simple SQL based link shotener/tracker




# Fast compile times with SQLite3
to get fast compile times with sqlite3 instead of compiling the enitre quater million lines of code each time compilite once into a .o (object file) and then link it when compiling eveything else

`gcc -c sqlite3.c -o sqlite3.o`
then run
`gcc -o app sqlite.o main.c`

