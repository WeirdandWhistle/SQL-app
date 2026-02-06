import {Database} from "bun:sqlite";

const db = new Database("sql.db");

function redirect(req){
	let res = new Response(null, {
		status:307,
		headers: {
			'Location':'https://google.com'
		}
	});

	return res;
}

const server = Bun.serve({
	port: 2008,
	
	routes: {
		"/api/": () => new Response("OK"),
		"/api/m": req => redirect(req)
	}
});

console.log(`server at ${server.url}`);

let query = db.query("CREATE TABLE IF NOT EXISTS redirect (id int, des text, owned int, count int);");

console.log(query.get());

query = db.query("SELECT * FROM redirect;");

console.log(query.get());

db.close();
