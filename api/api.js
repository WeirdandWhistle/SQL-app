import {SQL, sql} from "bun";

const db = new SQL("/app/sql/sql.db", {adapter: "sqlite"});

const chars = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`;
const tokenLength = 10;
const idLength = 24;
const bannedURLs = ["192.168.2.65/r/"];
const blockedUA = ['Slackbot','Slack-ImgProxy','Applebot','facebookexternalhit','Discordbot','facebookexternalhit','Twitterbot','LinkedInBot','WhatsApp'];

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

	for(let i = 0; i<blockedUA.length; i++){
		let UA = blockedUA[i];

		if(req.headers.get("user-agent").includes(UA)){
			console.log("user-agent blocked",req.headers.get("user-agent"));
			return new Response("user_agent_blocked");
		}
	}

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
async function make(req){
	console.log("make",req);

	// {des, token}
	let body = await req.json();
	console.log("make body",body);

	if(body.token.length != 10){
		console.log("token_wrong_length", body.token.length);
		return new Response(null, {status:400,statusText:"token_wrong_length"});
	}
	let accpeted = true;
	for(let c in body.token){
		if(!chars.includes(c)){
			accpeted = false;
			break;
		}
	}
	if(!accpeted){
		console.log("token_chars_not_allowed");
			return new Response(null,{status:401,statusText:"token_chars_not_allowed"});
	}

	let validURL = false;
	let url;

	try {
		url = new URL(body.des);
		// console.log("URL did not throw!");
		if(url.protocol === "http:" || url.protocol === "https:"){
			// console.log("http true!");
			


			let inBanned = false;
			//let debug = -1;
			for(let i = 0; i<bannedURLs.length;i++){
				const ban = bannedURLs[i];
				//console.log(ban);
				if(url.toString().includes(ban)){
					//debug = url.toString().indexOf(ban);
					inBanned = true;
					break;
				}
			}
			if(!inBanned){
				validURL = true;
			}
			else{
				console.log("des_is_banned");
				return new Response(null, {status:400, statusText:"des_is_banned"});
			}
			
		}
	} catch{console.log("NOT VALID URL! url threw!");}

	if(!validURL){
		console.log("des_not_valid");
		return new Response(null,{status:400,statusText:"des_not_valid"});
	}

	let request = await fetch(url.href);
	if(!request.ok){
		console.log("URL did not responed!");
		return  new Response(JSON.stringify({ok:false,error:"des_did_not_respond"}),{status:400});
	}

	// {id}
	let reply;

	let inDB = true;
	let id;
	while(inDB){
		id = makeid(idLength);
		const q = await db`SELECT count FROM redirect WHERE id="${id} LIMIT 1";`.values();
		if(q.length === 0){
			inDB = false;
		}
	}

	console.log(await db`INSERT INTO redirect (id, des, token, count) VALUES (${id}, ${body.des}, ${body.token}, 0);`);

	reply = {des: id};
	console.log("MAKE id",id);
	return new Response(JSON.stringify(reply));

	
}
async function login(req){
	let q;
	let loginToken;
	let inDB = true;
	console.log(req);
	while(inDB){
		loginToken = makeid(tokenLength);
		q = await db`SELECT id FROM redirect WHERE token=${loginToken} LIMIT 1;`.values();
		console.log("login stuf",q);
		if(q.length === 0){
			inDB = false;
		}
	}

	let res = new Response(null, {
		headers: {
			'Set-Cookie':`token=${loginToken}; Path=/`
		}
	});

	return res;
}
async function info(req) {

	const url = new URL(req.url);
	
	const token = url.searchParams.get("token");
	if(token == null){
		console.log("token_null");
		return new Response(JSON.stringify({ok:false,error:"token_null"}),{status:400});
	}

	if(token.length != 10){
		console.log("token_wrong_length", token.length);
		return new Response(null, {status:400,statusText:"token_wrong_length"});
	}
	let accpeted = true;
	for(let c in token){
		if(!chars.includes(c)){
			accpeted = false;
			break;
		}
	}
	if(!accpeted){
		console.log("token_chars_not_allowed");
			return new Response(null,{status:401,statusText:"token_chars_not_allowed"});
	}

	const ret = await db`SELECT id, des, count FROM redirect WHERE token=${token} LIMIT 1000;`;
	//console.log(ret);

	let reply = `{"entries":[`;

	for(let i = 0; i<ret.count;i++){
		reply += JSON.stringify(ret[i]);
		if(i+1<ret.count){
			reply +=",";
		}
	}
	reply += "]}";

	return new Response(reply);

}

const server = Bun.serve({
	port: 2008,
	
	routes: {
		"/api/info" : req => info(req), 
		"/api/login": req => login(req),
		"/api/make": req => make(req),
		"/r/*": req => redirect(req),
		"/api/": () => new Response("OK")
	}
});

console.log(`server at ${server.url}`);

// let query = db.query("CREATE TABLE IF NOT EXISTS redirect (id int, des text, token text, count int);");
// console.log(query.get());
// console.log('the first statment!');
await db`CREATE TABLE IF NOT EXISTS redirect (id text, des text, token text, count int);`;
// console.log('not the first statment!');

// query = db.query("SELECT * FROM redirect;");
// console.log(query.get());
console.log(await db`SELECT * FROM redirect;`);

// query = db.query("SELECT * FROM redirect WHERE id=1;");
// console.log("existes",query.get());

const firstInsert = {
	id:1234,
	des:"https://dunkirk.sh",
	token:1,
	count:0
};
// query = db.query("INSERT INTO redirect (id, des, token, count) VALUES (1234, 'https://dunkirk.sh', 1, 0);");
// console.log("insert dunkirk", query.get());

// console.log(await db`INSERT INTO redirect (id, des, token, count) VALUES ('1234', 'https://dunkirk.sh', '1', 0);`);
// console.log(await db`SELECT * FROM redirect;`);

process.on('exit', (code) => {
  console.log(`Process exited with code: ${code}`);
  db.close();
});
process.on('SIGINIT', (code) => {
  console.log(`Process exited with code: ${code}`);
  db.close();
	procsess.exit();
});


