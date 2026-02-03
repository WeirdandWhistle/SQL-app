# SQL-app
a simple SQL based link shotener/tracker




# Fast compile times with SQLite3
to get fast compile times with sqlite3 instead of compiling the enitre quater million lines of code each time compilite once into a .o (object file) and then link it when compiling eveything else

`gcc -c sqlite3.c -o sqlite3.o`
then run
`gcc -o app sqlite.o main.c`


# How to make a group and have that group own a folder

```
   sudo mkdir /SQL-app
   sudo groupadd SQL-app
   getent group
   sudo usermod -aG SQL-app wnj
   sudo usermod -aG SQL-app caddy
   sudo chown wnj:SQL-app /SQL-app
   chmod g+s /SQL-app
```

