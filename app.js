console.log("HELLO WORKING WORLD!");

const URLforum = document.getElementById("URLforum");

function createNewLink(){
	console.log("opening URL forum");
	URLForum.style.display = "flex";

	fetch("/api/m",{
		method: `POST`,
		body: JSON.stringify({'add':'1234567', 'auth':'token'})
	});
}
function closeURLForum(){
	console.log("closing URL forum");
	URLForum.style.display = "none";
}
