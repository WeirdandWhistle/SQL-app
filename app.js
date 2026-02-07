console.log("HELLO WORKING WORLD!");

const URLforum = document.getElementById("URLforum");
const urlInput = document.getElementById("url");

function getCookie(name){
	let cookie = document.cookie.split(";");
	console.log("cookie",cookie);
	
	for(let i = 0; i<cookie.length;i++){
	
		let arr = cookie[i].split("=",2);
		console.log('lol',arr[0]);
		if(arr[0] === name){
			return arr[1].trim();
		}
	}
	return null;
}
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
async function login(){
	if(getCookie("token") != null){
		return;
	}

	console.log("logging in...");
	await fetch("/api/login");
}
function createNewLink(){
	console.log("opening URL forum");
	URLForum.style.display = "flex";
}
function closeURLForum(){
	console.log("closing URL forum");
	URLForum.style.display = "none";
}
function makeURL(){
	const url = urlInput.value;
	login();

	//const
}
