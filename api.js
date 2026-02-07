import {SQL, sql} from "bun";

const db = new SQL("sql.db", {adapter: "sqlite"});

const chars = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`
const idLength = 10;

function makeid(lenght){
	let result = '';
	for(let i = 0; i<lenght;i++){
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}
async function redirect(req){

	const url = new URL(req.url);
	console.log(req);

	const pathArray = url.pathname.split("/");

	const id = pathArray[2];
	// const id = "1234; DROP TABLE redirect";

	console.log("get id =",id);

	// let q = db.query(`SELECT 1 FROM redirect WHERE id=${db(id)};`);

	// const obj = q.run(id);
	const obj = await db`SELECT * FROM redirect WHERE id=${id} LIMIT 1;`;
	console.log("obj", obj);
	const des = obj[0].des;

	// q = db.query(`UPDATE redirect SET count = count + 1 WHERE id=${db(id)};`);
	// q.run(id);
	await db`UPDATE redirect SET count = count + 1 WHERE id=${db(id)};`;

	let res = new Response(null, {
		status:307,
		headers: {
			'Location':des
		}
	});

	return res;
}
function make(req){
	console.log(req);
}
function login(req){
	let headers = req.headers;

	if(headers.get("cookie") != null){
		return new Response("OK");
	}
	let q;
	let loginToken;
	let inDB = true;
	while(inDB){
		loginToken = makeid(idLength);
		q = db.query(`SELECT * FROM redirect WHERE own="${loginToken}";`);
		if(q.get() == null){
			inDB = false;
		}
	}

	let res = new Response(null, {
		headers: {
			'Set-Cookie':`token=${loginToken}`
		}
	});

	return res;
}

const server = Bun.serve({
	port: 2008,
	
	routes: {
		"/api/login": req => login(req),
		"/api/make": req => make(req),
		"/r/*": req => redirect(req),
		"/api/": () => new Response("OK")
	}
});

console.log(`server at ${server.url}`);

// let query = db.query("CREATE TABLE IF NOT EXISTS redirect (id int, des text, own text, count int);");
// console.log(query.get());
// console.log('the first statment!');
await db`CREATE TABLE IF NOT EXISTS redirect (id int, des text, own text, count int);`;
// console.log('not the first statment!');

// query = db.query("SELECT * FROM redirect;");
// console.log(query.get());
console.log(await db`SELECT * FROM redirect;`);

// query = db.query("SELECT * FROM redirect WHERE id=1;");
// console.log("existes",query.get());

const firstInsert = {
	id:1234,
	des:"https://dunkirk.sh",
	own:1,
	count:0
};
// query = db.query("INSERT INTO redirect (id, des, own, count) VALUES (1234, 'https://dunkirk.sh', 1, 0);");
// console.log("insert dunkirk", query.get());

// console.log(await db`INSERT INTO redirect (id, des, own, count) VALUES (1234, 'https://dunkirk.sh', 1, 0);`);
// console.log(await db`SELECT * FROM redirect;`);

process.on('exit', (code) => {
  console.log(`Process exited with code: ${code}`);
  db.close();
});
process.on('SIGINIT', (code) => {
  console.log(`Process exited with code: ${code}`);
  db.close();
});


