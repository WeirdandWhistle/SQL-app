console.log("HELLO WORKING WORLD!");

function createNewLink(){
	alert("YEA!");

	fetch("/api/m",{
		method: `POST`,
		body: JSON.stringify({'add':'1234567', 'auth':'token'})
	});
}
