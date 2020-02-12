var lastUserID = 0;
var loggedUserID = 0;
var usersObj = [];
var incomesObj = [];
var checkedID = 0;
var lastIncomeID = 0;

$(document).ready(function(){	
	loadUsersFromLocalStorage();
	//resizeScreen();
	adjustNavBar();
	
});
$( window ).resize(function() {
  //resizeScreen();
    adjustNavBar();
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
		loadIncomesOfLoggedUser();
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
$('#home').on('click',function(){	
	var id = $('#home').attr('id')
	showContent(id);
});
$('#incomes').on('click',function(){	
	var id = $('#incomes').attr('id')
	showContent(id);
});
$('#expences').on('click',function(){	
	var id = $('#expences').attr('id')
	showContent(id);
});
$('#summary').on('click',function(){
	var id = $('#summary').attr('id')
	showContent(id);
});
$('#setup').on('click',function(){
	var id = $('#setup').attr('id')
	showContent(id);
});
$('#log-out').on('click', function(){
	loggedUserID = 0;
	//var endOfArrayExpences = expencesObj.length;
	//expencesObj.splice(0,endOfArrayExpences);
	var endOfArrayIncomes = incomesObj.length;
	incomesObj.splice(0,endOfArrayIncomes);
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
function showContent(id){
	if(id=="home"){
		$('#initialContent').removeClass('d-none');
		$('#initialContent').addClass('d-flex');
		
		$('#incomesContainer').removeClass('d-flex');
		$('#incomesContainer').addClass('d-none');
		$('#incomes').removeClass('active');
		
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
	else if(id=="incomes"){
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
	else if(id=="expences"){
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
	else if(id=="summary"){
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
	else if(id=="setup"){
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
}
// visibility functions
/*function resizeScreen(){
	var screenHeight = screen.height;
	var registerHeight = parseInt(screenHeight) - 150;
	
	 $('#register').css('min-height', registerHeight);
	 $('#content').css('min-height', registerHeight);
}*/
function adjustNavBar(){
	var screenWidth = screen.width;
	
	if(parseInt(screenWidth)< 992){
		$('#navList li').removeClass('w-20');
	}
	else{
		$('#navList li').addClass('w-20');
	}
}
//add incomes functions
$('#addIncomeButton').on('click',function(){
	addNewIncome();
});
function addNewIncome(){
	
	lastIncomeID++;
	var IncomeInArray = {
		id: 0,
		userId: 0,
		amount: "",
		date: "",
		cathegory: "",
		comment: ""
	};
	var amount;
	amount = $('#incomeAmount').val();
	if(amount == '') {alert("Proszę podaj rozmiar przychodu"); return;}
	var date;
	date = $('#dateIncome').val();
	if(date == '') {alert("Proszę podaj datę przychodu"); return;}
	var category;
	category = $("input[type=radio][name=incomeCategory]:checked").val();
	var comment;
	comment = $('#commentIncome').val();
	var string = lastIncomeID.toString()+"/"+ loggedUserID.toString()+"/"+ amount +"/"+date+"/"+category+"/"+comment+"/";
	
	
	IncomeInArray.id = lastIncomeID;
	IncomeInArray.userId = loggedUserID;
	IncomeInArray.amount = amount;
	IncomeInArray.date = date;
	IncomeInArray.cathegory = category;
	IncomeInArray.comment = comment;
	incomesObj.push(IncomeInArray);
	
	var nameOfIncome = "Income" + lastIncomeID.toString();
	var valueOfIncome = string;
	localStorage.setItem(nameOfIncome, valueOfIncome);
	
	alert("Dodałeś nowy przychód!");
	
	$('#incomeAmount').val("");
	$('#dateIncome').val("");
	$('#commentIncome').val("");
	
} 
function loadIncomesOfLoggedUser(){
	for(var i=0; i<localStorage.length; i++){
		loadIncomestoArray(i);
	}

	incomesObj.sort(function(a, b){return a.id - b.id;});
	
}
function loadIncomestoArray(i){
	var nameOfValue = localStorage.key(i); 
	if(nameOfValue.charAt(0)=='I'){	
		var valueOfName = localStorage.getItem(nameOfValue);
		getIncomeDataFromStringWithDashes(valueOfName);
	}
}
function getIncomeDataFromStringWithDashes(valueOfName){
	var dashCounter = 0;
	var string = "";
	var IncomeInArray = {
		id: 0,
		userId: 0,
		amount: "",
		date: "",
		cathegory: "",
		comment: ""
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
				case 0: IncomeInArray.id = parseInt(string); 
					if(lastIncomeID<IncomeInArray.id)
						lastIncomeID = IncomeInArray.id; 
					
					string = ""; break;
				case 1: IncomeInArray.userId = parseInt(string); string = ""; 
					if(IncomeInArray.userId != loggedUserID) return;
				break;
				case 2: 
					string = changeCommasToDots(string);
					var incomeValue = parseFloat(string);
					IncomeInArray.amount = Math.round(incomeValue*100)/100; string = ""; break;
				case 3: IncomeInArray.date = string; string = ""; break;
				case 4: IncomeInArray.cathegory = string; string = ""; break;
				case 5: IncomeInArray.comment = string; string = ""; break;
			}
			dashCounter++;
		}
		if (dashCounter == 6)
		{
			incomesObj.push(IncomeInArray);
		}
	}
}
function changeCommasToDots(string){
	var newString = "";
	for(var i=0; i<string.length; i++)
	{
		if(string.charAt(i)==',')
		{
			newString += '.';
			i++;
		}
		newString = newString + string.substr(i,1);
	}
	return newString;
}