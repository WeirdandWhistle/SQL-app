import {Database} from "bun:sqlite";

const db = new Database("sql.db");

const server = Bun.serve({
	port: 2008,
	fetch(req){

	

	return new Response();
	}
});

console.log(`server at ${server.url}`);

let query = db.query("CREATE TABLE IF NOT EXISTS redirect (id int, des text, owned int, count int);");

console.log(query.get());

query = db.query("SELECT * FROM redirect;");

console.log(query.get());

db.close();
