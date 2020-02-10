var lastUserID = 0;
var loggedUserID = 0;
var usersObj = [];
var checkedID = 0;

$(document).ready(function(){	
	loadUsersFromLocalStorage();
	resizeScreen();
});
$( window ).resize(function() {
  resizeScreen();
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
// sign user up and in
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
	var loginValue = $("#name").val();
	var passwordValue = $("#password").val();
	var emailValue = $("#email").val();
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
// sign user up and in
// visibility functions
$('#incomes').on('click',function(){	
	showIncomesManager();
});
$('#expences').on('click',function(){	
	showExpenceManager();
});
$('#summary').on('click',function(){
	showSummaryManager();
});
$('#setup').on('click',function(){
	showSetupManager();
});
$('#log-out').on('click', function(){
	loggedUserID = 0;
	//var endOfArrayExpences = expencesObj.length;
	//expencesObj.splice(0,endOfArrayExpences);
	//var endOfArrayIncomes = incomesObj.length;
	//incomesObj.splice(0,endOfArrayIncomes);
	location.reload();
	$("#name").val("");
	$("#password").val("");
	$("#email").val("");
});
function showMenu(){
	$('#register').addClass('d-none');
	$('#content').removeClass('d-none');
	$('#content').addClass('d-flex');
	$('#initialContent').removeClass('d-none');
	$('#initialContent').addClass('d-flex');
}
function showIncomesManager(){
	
	$('#initialContent').removeClass('d-flex');
	$('#initialContent').addClass('d-none');
	
	$('#incomesContainer').removeClass('d-none');
	$('#incomesContainer').addClass('d-flex');
	$('#incomes').addClass('active');
	
	$('#expenceContainer').removeClass('d-flex');
	$('#expenceContainer').addClass('d-none');
	$('#expences').removeClass('active');
	
	$('#setupContainer').removeClass('d-flex');
	$('#setupContainer').addClass('d-none');
	$('#setup').removeClass('active');
	
	$('#summaryContainer').removeClass('d-flex');
	$('#summaryContainer').addClass('d-none');
	$('#summary').removeClass('active');
	
}
function showExpenceManager(){
	
	$('#initialContent').removeClass('d-flex');
	$('#initialContent').addClass('d-none');
	
	$('#incomesContainer').removeClass('d-flex');
	$('#incomesContainer').addClass('d-none');
	$('#incomes').removeClass('active');
	
	$('#expenceContainer').removeClass('d-none');
	$('#expenceContainer').addClass('d-flex');
	$('#expences').addClass('active');
	
	$('#setupContainer').removeClass('d-flex');
	$('#setupContainer').addClass('d-none');
	$('#setup').removeClass('active');
	
	$('#summaryContainer').removeClass('d-flex');
	$('#summaryContainer').addClass('d-none');
	$('#summary').removeClass('active');
}
function showSetupManager(){
	$('#initialContent').removeClass('d-flex');
	$('#initialContent').addClass('d-none');
	
	$('#incomesContainer').removeClass('d-flex');
	$('#incomesContainer').addClass('d-none');
	$('#incomes').removeClass('active');
	
	$('#expenceContainer').removeClass('d-flex');
	$('#expenceContainer').addClass('d-none');
	$('#expences').removeClass('active');
	
	$('#setupContainer').removeClass('d-none');
	$('#setupContainer').addClass('d-flex');
	$('#setup').addClass('active');
	
	$('#summaryContainer').removeClass('d-flex');
	$('#summaryContainer').addClass('d-none');
	$('#summary').removeClass('active');
}
function showSummaryManager()
{
	$('#initialContent').removeClass('d-flex');
	$('#initialContent').addClass('d-none');
	
	$('#incomesContainer').removeClass('d-flex');
	$('#incomesContainer').addClass('d-none');
	$('#incomes').removeClass('active');
	
	$('#expenceContainer').removeClass('d-flex');
	$('#expenceContainer').addClass('d-none');
	$('#expences').removeClass('active');
	
	$('#setupContainer').removeClass('d-flex');
	$('#setupContainer').addClass('d-none');
	$('#setup').removeClass('active');
	
	$('#summaryContainer').removeClass('d-none');
	$('#summaryContainer').addClass('d-flex');
	$('#summary').addClass('active');
}
// visibility functions
/*function resizeScreen(){
	var screenHeight = screen.height;
	var registerHeight = parseInt(screenHeight) - 150;
	
	 $('#register').css('min-height', registerHeight);
	 $('#content').css('min-height', registerHeight);
}*/