var lastUserID = 0;
var loggedUserID = 0;
var usersObj = [];
var checkedID = 0;

$(document).ready(function(){	
	loadUsersFromLocalStorage();
});
// load users data and auxillary functions
function loadUsersFromLocalStorage()
{
	if(localStorage.length>=1){
		
		for(var i=0; i<localStorage.length; i++){
			loadUserstoArray(i);
		}
	
		usersObj.sort(function(a, b){return a.id - b.id;});
		var lastPosition = usersObj.length;
		if(lastPosition>0)
			lastUserID = usersObj[lastPosition-1].id;
	}
}

function loadUserstoArray(i)
{
	var nameOfValue = localStorage.key(i); 	
	if(nameOfValue.charAt(0)=='U'){
		var valueOfName = localStorage.getItem(nameOfValue);
		getDataFromStringWithDashes(valueOfName);
	}
	else return;
}

function getDataFromStringWithDashes(valueOfName)
{
	var dashCounter = 0;
	var string = "";
	var UserInArray = {
	id: 0,
	login: "",
	password: "",
	email: ""
};
	for(var i=0; i<valueOfName.length; i++)
	{
		if(valueOfName.charAt(i) != "/"){
			string = string + valueOfName.substr(i,1);
		}
		if(valueOfName.charAt(i) == '/')
		{
	
			switch(dashCounter)
			{
				case 0: UserInArray.id = parseInt(string); string = ""; break;
				case 1: UserInArray.login = string; string = ""; break;
				case 2: UserInArray.password = string; string = ""; break;
				case 3: UserInArray.email = string; string = ""; break;
			}
			dashCounter++;
		}
		if (dashCounter == 4)
		{
			usersObj.push(UserInArray);
		}
	}
}
// load users data and auxillary functions
$('#signUp').on('click', function(){
	signUpAUser();
	location.reload();
	$("#name").val("");
	$("#password").val("");
	$("#email").val("");
});

$('#signIn').on('click', function(){
	singUserIn();
});

function signUpAUser()
{
	var loginValue = $("#name").val();
	var passwordValue = $("#password").val();
	var emailValue = $("#email").val();
	var UserInArray = {
		id: 0,
		login: "",
		password: "",
		email: ""
	};
	if(checkIfLoginIsValid(loginValue)){
		if(passwordValue == '') {alert("Proszę wpisać hasło"); return;}
		if(emailValue == '') {alert("Proszę wpisać poprawny adres email"); return;}
		lastUserID++;
		var nameOfUser = "User" + lastUserID.toString();
		var userRecord = lastUserID.toString() +'/'+loginValue+'/'+passwordValue+'/'+emailValue+'/';
		
		
		UserInArray.id = lastUserID;
		UserInArray.login = loginValue;
		UserInArray.password = passwordValue;
		UserInArray.email = emailValue;
		usersObj.push(UserInArray);
		
		localStorage.setItem(nameOfUser, userRecord);
		alert("Zostałeś zarejestrowany!");
	}
}
function checkIfLoginIsValid(loginValue){
	if(loginValue == "") {
		alert("Wpisz swój login");
		return false;
	}
	else {
			for(var i=0; i<usersObj.length; i++){
				if(checkifLoginAlreadyExist(i, loginValue)) {alert("Ten login już istnieje. Proszę wybrać inny login.");
					return false;
				}
		}
		return true;
	}
}
function checkifLoginAlreadyExist(i, loginValue)
{
	if(loginValue == usersObj[i].login) return true;
	else return false;
}
function singUserIn()
{
	var loginValue = document.getElementById("name").value;
	var passwordValue = document.getElementById("password").value;
	var emailValue = document.getElementById("email").value;
	if(loginValue == "") {
		alert("Wpisz swój login"); 
		return;
	}
	else if(checkLogin(loginValue)) {
		if(passwordValue == '') {alert("Proszę wpisać hasło"); return;}
		if(emailValue == '') {alert("Proszę wpisać prawidłowy adres email"); return;}
		if(passwordValue != usersObj[checkedID-1].password) {alert("Podano błędne hasło"); return;}
		if(emailValue != usersObj[checkedID-1].email) {alert("Podano błędny adres email"); return;}
		loggedUserID = checkedID;
		alert("Zostałeś zalogowany!");
		//loadExpencesOfLoggedUser();
		//loadIncomesOfLoggedUser();
		showMenu();
	}
	else alert("Podany login nie istnieje!");
}
function checkLogin(loginValue)
{
	for(var i=0; i<usersObj.length; i++){
		if(checkifLoginAlreadyExist(i, loginValue)) {
			checkedID = usersObj[i].id;
			return true;
		}
	}
	return false;
}
function showMenu(){
	$('.register').css('display','none');
	//$('#logOutDiv').css('display','block');
	$('.menu').removeClass('d-none');
	//$('.setupContainer').css('display', 'none');
	//$('.incomesContainer').css('display','none');
	//$('.expenceContainer').css('display','none');
	//$('.summaryContainer').css('display','none');
	
}