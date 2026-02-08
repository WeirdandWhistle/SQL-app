console.log("HELLO WORKING WORLD!");

const URLforum = document.getElementById("URLforum");
const urlInput = document.getElementById("url");
const confirmForum = document.getElementById("confirm");
const mainBox = document.getElementsByClassName("main-box")[0];

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
	console.log("logging in...");
	if(getCookie("token") != null){
		return;
	}

	document.cookie = '';
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
async function makeURL(){
	const url = urlInput.value;
	await login();

	const send = {des:url, token: getCookie("token")};

	console.log(await fetch("/api/make",{
		method: 'POST',
		body: JSON.stringify(send)
	}));
}
function closeConfirm(){
	confirmForum.style.display = 'none';
}
function openConfirm(){
	confirmForum.style.display = 'flex';
}

async function init(){
	await login();
	const token = getCookie("token");
	const prom = await fetch(`/api/info?token=${token}`);

	const data = await prom.json();
	for(let i = 0; i<data.entries.length; i++){
		const entry = data.entries[i];

		mainBox.insertAdjacentHTML("afterbegin", `
			<div class="info-container">
				<div class="link-counter">
					<span class="header-2">${entry.count}</span>
					<p class="info-desc">people clicked your link!</p>
				</div>
				<div class="pannel-1">
					Where you redirect to:
					<br>
					<p>${entry.des}</p>
				</div>	
				<div class="pannel-2">
					You're redirection link:
					<br>
					<p>${window.location.origin}/r/${entry.id}</p>
				</div>	

				<div class="info-footer">FOORTER!</div>			

			</div>`);	
	}
}

init();
