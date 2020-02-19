var lastUserID = 0;
var loggedUserID = 0;
var usersObj = [];
var incomesObj = [];
var expencesObj = [];
var checkedID = 0;
var lastIncomeID = 0;
var lastExpenceID = 0;
var sumOfIncomes = 0;
var sumOfExpences = 0;

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
	//location.reload();
	$("#name").val("");
	$("#password").val("");
	$("#email").val("");
});

$('#signIn').on('click', function(){
	singUserIn();
});

function signUpAUser()
{
	$('#loginFunctionMessage').removeClass("text-success");
	$('#loginFunctionMessage').addClass("text-danger");
	$('#loginFunctionMessage').html("");
	
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
		if(passwordValue == '') {$('#loginFunctionMessage').html("Proszę wpisać hasło"); return;}
		if(emailValue == '') {$('#loginFunctionMessage').html("Proszę wpisać poprawny adres email"); return;}
		lastUserID++;
		var nameOfUser = "User" + lastUserID.toString();
		var userRecord = lastUserID.toString() +'/'+loginValue+'/'+passwordValue+'/'+emailValue+'/';
		
		UserInArray.id = lastUserID;
		UserInArray.login = loginValue;
		UserInArray.password = passwordValue;
		UserInArray.email = emailValue;
		usersObj.push(UserInArray);
		
		localStorage.setItem(nameOfUser, userRecord);
		
		$('#loginFunctionMessage').removeClass("text-danger");
		$('#loginFunctionMessage').addClass("text-success");
		$('#loginFunctionMessage').html("Zostałeś zarejestrowany!");
	}
}
function checkIfLoginIsValid(loginValue){
	if(loginValue == "") {
		$('#loginFunctionMessage').html("Wpisz swój login");
		return false;
	}
	else {
			for(var i=0; i<usersObj.length; i++){
				if(checkifLoginAlreadyExist(i, loginValue)) {$('#loginFunctionMessage').html("Ten login już istnieje. Proszę wybrać inny login.");
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
	$('#loginFunctionMessage').removeClass("text-success");
	$('#loginFunctionMessage').addClass("text-danger");
	$('#loginFunctionMessage').html("");
	var loginValue = $("#name").val();
	var passwordValue = $("#password").val();
	var emailValue = $("#email").val();
	if(loginValue == "") {
		$('#loginFunctionMessage').html("Wpisz swój login"); 
		return;
	}
	else if(checkLogin(loginValue)) {
		if(passwordValue == '') {$('#loginFunctionMessage').html("Proszę wpisać hasło"); return;}
		if(emailValue == '') {$('#loginFunctionMessage').html("Proszę wpisać prawidłowy adres email"); return;}
		if(passwordValue != usersObj[checkedID-1].password) {$('#loginFunctionMessage').html("Podano błędne hasło"); return;}
		if(emailValue != usersObj[checkedID-1].email) {$('#loginFunctionMessage').html("Podano błędny adres email"); return;}
		loggedUserID = checkedID;
		$('#loginFunctionMessage').removeClass("text-danger");
		$('#loginFunctionMessage').addClass("text-success");
		$('#loginFunctionMessage').html("Zostałeś zalogowany!");
		loadExpencesOfLoggedUser();
		loadIncomesOfLoggedUser();
		showMenu();
	}
	else $('#loginFunctionMessage').html("Podany login nie istnieje!");
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
		$('#addIncomeFunctionMessage').removeClass("text-success");
		$('#addIncomeFunctionMessage').addClass("text-danger");
		$('#addIncomeFunctionMessage').html("");
	
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
		$('#addExpenceFunctionMessage').removeClass("text-success");
		$('#addExpenceFunctionMessage').addClass("text-danger");
		$('#addExpenceFunctionMessage').html("");
		
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
		prepareSummaryBoard();
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
	var IncomeInArray = {
		id: 0,
		userId: 0,
		amount: "",
		date: "",
		cathegory: "",
		comment: ""
	};
	$('#addIncomeFunctionMessage').removeClass("text-success");
	$('#addIncomeFunctionMessage').addClass("text-danger");
	$('#addIncomeFunctionMessage').html("");
	
	var amount = $('#incomeAmount').val();
	if(amount == '') {$('#addIncomeFunctionMessage').html("<p class=\"h5\"><b>Proszę podaj kwotę dochodu</b></p>"); return;}
	var date = $('#dateIncome').val();
	if(date == '') {$('#addIncomeFunctionMessage').html("<p class=\"h5\"><b>Proszę podaj datę uzyskania dochodu</b></p>"); return;}
	var category = $("input[type=radio][name=incomeCategory]:checked").val();
	var comment = $('#commentIncome').val();
	lastIncomeID++;
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
	
	$('#addIncomeFunctionMessage').removeClass("text-danger");
	$('#addIncomeFunctionMessage').addClass("text-success");
	$('#addIncomeFunctionMessage').html("<p class=\"h5\"><b>Dodałeś nowy dochód do swojego archiwum!</b></p>");
	
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
//add income functions
//add expence functions
	$('#addExpenceButton').on('click',function(){
	addNewExpence();
});
function addNewExpence()
{	
	var ExpenceInArray = {
		id: 0,
		userId: 0,
		amount: "",
		date: "",
		payment: "",
		source: "",
		comment: ""
	};
	$('#addExpenceFunctionMessage').removeClass("text-success");
	$('#addExpenceFunctionMessage').addClass("text-danger");
	$('#addExpenceFunctionMessage').html("");
	
	var amount = $('#expenceAmount').val();
	if(amount == '') {$('#addExpenceFunctionMessage').html("<p class=\"h5\"><b>Proszę podaj kwotę wydatku</b></p>"); return;}
	var date = $('#dateExpence').val();
	if(date == '') {$('#addExpenceFunctionMessage').html("<p class=\"h5\"><b>Proszę podaj datę</b></p>"); return;}
	var wayOfPayment = $("input[type=radio][name=payment]:checked").val();
	var category = $("input[type=radio][name=expenceCat]:checked").val();
	var comment = $('#commentExpence').val();
	lastExpenceID++;
	var string = lastExpenceID.toString()+"/"+ loggedUserID.toString()+"/"+ changeCommasToDots(amount) +"/"+date+"/"+wayOfPayment+"/"+category+"/"+comment+"/";
		
	ExpenceInArray.id = parseInt(lastExpenceID);
	ExpenceInArray.userId = parseInt(loggedUserID);
	ExpenceInArray.amount = parseFloat(changeCommasToDots(amount));
	ExpenceInArray.date = date;
	ExpenceInArray.payment = wayOfPayment;
	ExpenceInArray.source = category;
	ExpenceInArray.comment = comment;
	expencesObj.push(ExpenceInArray);
	
	var nameOfExpence = "Expence" + lastExpenceID.toString();
	var valueOfExpence = string;
	localStorage.setItem(nameOfExpence, valueOfExpence);
	
	$('#addExpenceFunctionMessage').removeClass("text-danger");
	$('#addExpenceFunctionMessage').addClass("text-success");
	$('#addExpenceFunctionMessage').html("<p class=\"h5\"><b>Dodałeś nowy wydatek do archiwum!</b></p>");
	
	$('#expenceAmount').val("");
	$('#dateExpence').val("");
	$('#commentExpence').val("");
	
}
function loadExpencesOfLoggedUser()
{
	for(var i=0; i<localStorage.length; i++){
		loadExpencestoArray(i);
	}

	expencesObj.sort(function(a, b){return a.id - b.id;});
	
}
function loadExpencestoArray(i)
{
	var nameOfValue = localStorage.key(i); 
	if(nameOfValue.charAt(0)=='E'){	
		var valueOfName = localStorage.getItem(nameOfValue);
		getExpenceDataFromStringWithDashes(valueOfName);
	}
}
function getExpenceDataFromStringWithDashes(valueOfName)
{
	var dashCounter = 0;
	var string = "";
	var ExpenceInArray = {
	id: 0,
	userId: 0,
	amount: "",
	date: "",
	payment: "",
	source: "",
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
				case 0: ExpenceInArray.id = parseInt(string); 
					if(lastExpenceID<ExpenceInArray.id)
						lastExpenceID = ExpenceInArray.id; 
					
					string = ""; break;
				case 1: ExpenceInArray.userId = parseInt(string); string = ""; 
					if(ExpenceInArray.userId != loggedUserID) return;
				break;
				case 2: 
					string = changeCommasToDots(string);
					var expenceValue = parseFloat(string);
					ExpenceInArray.amount = Math.round(expenceValue*100)/100; string = ""; break;
				case 3: ExpenceInArray.date = string; string = ""; break;
				case 4: ExpenceInArray.payment = string; string = ""; break;
				case 5: ExpenceInArray.source = string; string = ""; break;
				case 6: ExpenceInArray.comment = string; string = ""; break;
			}
			dashCounter++;
		}
		if (dashCounter == 7)
		{
			expencesObj.push(ExpenceInArray);
		}
	}
}
//add expence functions
// summary functions
	$('#dateSpan').on('change', function(){
	prepareSummaryBoard();
});
function prepareSummaryBoard() {
	var chosenSpan = $('#dateSpan').val();
	sumOfIncomes = 0;
	sumOfExpences = 0;
	$('#expenceTable').html("");
	$('#expenceTableHeader').html("");
	$('#incomeTable').html("");
	$('#incomeTableHeader').html("");
	$('#chartExpencesContainer').html("");
	$('#chartExpencesContainer').css('height', '0px');
	$('#showEvaluation').html("");
	$('#showEvaluation').css({'background': 'none'});
	$('#dateMessageDiv').html("");
	$('#summaryContainer').css({
				'height': '500px'
				});
	if(chosenSpan=='nonStandardSpan'){
		$('#nonStandardDateInput').removeClass("d-none");
		$('#nonStandardDateInput').addClass("d-flex");
	}
	else{
		$('#nonStandardDateInput').removeClass("d-flex");
		$('#nonStandardDateInput').addClass("d-none");
	}
}
$('#generateSummaryButton').on('click', function(){
	var choice = $('#dateSpan').val();
	createTableOfExpences(choice);
	createTableOfIncomes(choice);
	evaluateFinanceManagement();
});
function createTableOfExpences(timeSpan){
		$('#expenceTable').html("");
		let table = document.getElementById("expenceTable");
		if(expencesObj.length == 0) {
		$('#expenceTable').html("<tbody><tr>Brak wydatków w rozpatrywanym okresie</tr></tbody>");
		return;
	}
		let data = Object.keys(expencesObj[0]);
		generateExpenceTable(table, data, timeSpan);
		
	}
	function generateExpenceTable(table, data, timeSpan) {
 	  
	var expencesSorted = [];
	var expencesFromTimeSpan = [];
	var dataPoints = [];
	
	var sumOfCathegoryAmount = 0;
	
	expencesFromTimeSpan = loadInputsOfTimeSpan(timeSpan, expencesFromTimeSpan, expencesObj);
	expencesSorted = sortExpencesByCathegory(expencesSorted, expencesFromTimeSpan);
	if(expencesSorted.length == 0) {
		$('#expenceTable').html("<tbody><tr><td class=\"text-center\">Brak wydatków w rozpatrywanym okresie</td></tr></tbody>");
		return;
	}
	var cathegory = expencesSorted[0].source;
	let lastElement = expencesSorted.length - 1;
	for (let element of expencesSorted) {
		let temporary = element.source;
		if(cathegory != temporary){
			if(cathegory != temporary){
				let oneDataToChart = {
					y: 0,
					label: ""
				};
				oneDataToChart.y = sumOfCathegoryAmount;
				oneDataToChart.label = cathegory;
				dataPoints.push(oneDataToChart);
			
				addSummaryRow(table, cathegory, sumOfCathegoryAmount);
				cathegory = temporary;
				sumOfExpences += sumOfCathegoryAmount;
				sumOfCathegoryAmount = 0;
			}
		}
        let row = table.insertRow();
        for (var key in element) {
			if(key == "userId") continue;
			if(key == "id") continue;
			if(key == "amount") {sumOfCathegoryAmount += parseFloat(element.amount);
				stringZWalutą = element.amount.toString()+" PLN";
				let cell = row.insertCell();
				let text = document.createTextNode(stringZWalutą);
				cell.appendChild(text);
			}
			else{
			  let cell = row.insertCell();
			  let text = document.createTextNode(element[key]);
			  cell.appendChild(text);
			}
        }
		if(element == expencesSorted[lastElement]){
			
				let oneDataToChart = {
					y: 0,
					label: ""
				};
				oneDataToChart.y = sumOfCathegoryAmount;
				oneDataToChart.label = cathegory;
				dataPoints.push(oneDataToChart);
			
				addSummaryRow(table, cathegory, sumOfCathegoryAmount);
				cathegory = temporary;
				sumOfExpences += sumOfCathegoryAmount;
				sumOfCathegoryAmount = 0;
			
		}
	}
	  for(var k=0; k<dataPoints.length; k++){
		  dataPoints[k].y = dataPoints[k].y/sumOfExpences * 100;
	  }
		var chart = new CanvasJS.Chart("chartExpencesContainer", {
			animationEnabled: true,
			title: {
				text: "Wydatki według kategorii"
			},
			data: [{
				type: "pie",
				startAngle: 240,
				yValueFormatString: "##0.00\"%\"",
				indexLabel: "{label} {y}",
				dataPoints
			}]
		});
		chart.render();
		$('#chartExpencesContainer').css('height', '400px');
		$('#summaryContainer').css({
				'height': 'auto'
				});
		$('#expenceTableHeader').html("Tabela twoich wydatków:");
		generateTableHead(table, data);
		generateSumOfExpencesDiv(table);
    }
	function generateTableHead(table, data){
		let tHead = table.createTHead();
		let row = tHead.insertRow();
		for(let key of data){
			if(key == "userId") continue;
			else if(key == "id") continue;
			let th = document.createElement("th");
			let text = document.createTextNode(key);
			th.appendChild(text);
			row.appendChild(th);
	}

	
}
function addSummaryRow(table, cathegory, sumOfCathegoryAmount){
		let rowCathegory = table.insertRow();
		let cellCathegory = rowCathegory.insertCell();
		let text = document.createTextNode(cathegory);
		cellCathegory.appendChild(text);
		let cellAmount = rowCathegory.insertCell();
		let textSum = document.createTextNode(sumOfCathegoryAmount + " PLN");
		cellAmount.appendChild(textSum);
		
	}
	function generateSumOfExpencesDiv(table){
		let sumRow = table.insertRow();
		let cellCathegory = sumRow.insertCell();
		let text = document.createTextNode("Suma twoich wydatków:");
		cellCathegory.appendChild(text);
		let cellAmount = sumRow.insertCell();
		let textSum = document.createTextNode(Math.round(sumOfExpences*100)/100 + " PLN");
		cellAmount.appendChild(textSum);
	}
	function loadInputsOfTimeSpan(timeSpan, inputsFromTimeSpan, arrayWithInputs){
		
		var date = "";
		if(timeSpan =="lastMonth"){
			for(var i=0; i<arrayWithInputs.length; i++){
				date = arrayWithInputs[i].date;
				if(checkIfDateOfInputIsFromLastMonth(date)) {
					inputsFromTimeSpan.push(arrayWithInputs[i]);
				}
			}
		}
		else if (timeSpan == 'previousMonth'){
			for(var i=0; i<arrayWithInputs.length; i++){
				date = arrayWithInputs[i].date;
				if(checkIfDateOfInputIsFromPreviosMonth(date)) {
					inputsFromTimeSpan.push(arrayWithInputs[i]);
				}
			}
		}
		
		else if(timeSpan == 'lastYear'){
			for(var i=0; i<arrayWithInputs.length; i++){
				date = arrayWithInputs[i].date;
				if(checkIfDateOfInputIsFromPreviosYear(date)) {
					inputsFromTimeSpan.push(arrayWithInputs[i]);
				}
			}
		}
		else{
			var firstDate = $('#beginnigTimeSpan').val();
			var secondDate = $('#endingTimeSpan').val();
			$('#dateMessageDiv').html("");
			if(checkIfDateOneIsOlder(secondDate, firstDate)){
				$('#dateMessageDiv').html("<p>Podana data końca okresu jest starsza niz data początku okresu. Podaj prawidłową datę</p>");
				return;
			}
			for(var i=0; i<arrayWithInputs.length; i++){
				date = arrayWithInputs[i].date;
				if(checkIfDateOfInputIsFromTimeSpan(date)) {
					inputsFromTimeSpan.push(arrayWithInputs[i]);
				}
			}
		}
		return inputsFromTimeSpan;
	}
	
	function checkIfDateOfInputIsFromLastMonth(date){
		var d = new Date();
		var month = d.getMonth()+1;
		var year = d.getFullYear();
		var inputMonth = date.substr(5,2);
		var inputYear = date.substr(0,4);
		if(inputMonth == month && inputYear == year) return true;
		else return false;
	}
	function checkIfDateOfInputIsFromPreviosMonth(date){
		var d = new Date();
		var month = d.getMonth();
		var year = d.getFullYear();
		if (month == 0){
			month = 12;
			year-=1;
		}
		var inputMonth = date.substr(5,2);
		var inputYear = date.substr(0,4);
		if(inputMonth == month && inputYear == year) return true;
		else return false;
	}
	function checkIfDateOfInputIsFromPreviosYear(date){
		var d = new Date();
		var year = d.getFullYear();
		var inputYear = date.substr(0,4);
		if(inputYear == year) return true;
		else return false;
	}
	function checkIfDateOfInputIsFromTimeSpan(date){
		var firstDate = $('#beginnigTimeSpan').val();
		var secondDate = $('#endingTimeSpan').val();
		if(checkIfDateOneIsOlder(date, firstDate) == false && checkIfDateOneIsOlder(date, secondDate)==true) return true;
		else return false;
	}
	function checkIfDateOneIsOlder(dateOne, dateTwo){
		if(dateOne.substr(0,4) < dateTwo.substr(0,4)) return true;
		else if(dateOne.substr(0,4) > dateTwo.substr(0,4)) return false;
		else{
			if(dateOne.substr(5,2) < dateTwo.substr(5,2)) return true;
			else if(dateOne.substr(5,2) > dateTwo.substr(5,2)) return false;
			else{
				if(dateOne.substr(8,2) < dateTwo.substr(8,2)) return true;
				else return false;
			}
		}
	}
	function sortExpencesByCathegory(expencesSorted, expencesFromTimeSpan){
		var cathegory="";
		for(let i=0; i<expencesFromTimeSpan.length; i++){
			cathegory = expencesFromTimeSpan[i].source;
			if(checkIfCathegoryIsAlreadyIncluded(cathegory,expencesSorted)) continue;
			var temporary = [];
			for(let k=0; k<expencesFromTimeSpan.length; k++){
				if(cathegory==expencesFromTimeSpan[k].source){
					temporary.push(expencesFromTimeSpan[k]);
				}
			}
			temporary.sort(function(a,b){
				return new Date(b.date) - new Date(a.date);
				});
			Array.prototype.push.apply(expencesSorted,temporary);
			temporary.splice(0,temporary.length);
		}
		return expencesSorted;
	}
function checkIfCathegoryIsAlreadyIncluded(cathegory,inputsSorted){
		for (let i=0; i<inputsSorted.length; i++){
			if (cathegory == inputsSorted[i].source || cathegory == inputsSorted[i].cathegory) return true;
		}
		return false;
	}
function createTableOfIncomes(timeSpan){
	$('#incomeTable').html("");
	let table = document.getElementById("incomeTable");
	if(incomesObj.length == 0) {
		$('#incomeTable').html("<tbody><tr><td class=\"text-center\">Brak dochodów w rozpatrywanym okresie</td></tr></tbody>");
		return;
	}
	let data = Object.keys(incomesObj[0]);
	generateIncomesTable(table, data, timeSpan);
}
function generateIncomesTable(table, data, timeSpan) {
     
		var incomesSorted = [];
		var incomesFromTimeSpan = [];
		var dataPoints = [];
		var sumOfCathegoryAmount = 0;
		incomesFromTimeSpan = loadInputsOfTimeSpan(timeSpan, incomesFromTimeSpan, incomesObj);
		incomesSorted = sortIncomesByCathegory(incomesSorted, incomesFromTimeSpan);
	
		if(incomesSorted.length == 0) {
			$('#incomeTable').html("<tbody><tr><td class=\"text-center\">Brak dochodów w rozpatrywanym okresie</td></tr></tbody>");
			return;
		}
		var cathegory = incomesSorted[0].cathegory;
		let lastElement = incomesSorted.length - 1;
		for (let element of incomesSorted) {
			let temporary = element.cathegory;
			if(cathegory != temporary){	
				addSummaryRow(table, cathegory, sumOfCathegoryAmount);
				cathegory = temporary;
				sumOfIncomes += sumOfCathegoryAmount;
				sumOfCathegoryAmount = 0;
			}
			let row = table.insertRow();
			for (var key in element) {
				if(key == "userId") continue;
				if(key == "id") continue;
				if(key == "amount") {sumOfCathegoryAmount+= parseFloat(element.amount);};
			  let cell = row.insertCell();
			  let text = document.createTextNode(element[key]);
			  cell.appendChild(text);
			}
			 if(element == incomesSorted[lastElement]){
				addSummaryRow(table, cathegory, sumOfCathegoryAmount);
				cathegory = temporary;
				sumOfIncomes += sumOfCathegoryAmount;
				sumOfCathegoryAmount = 0;
				}
		}	
		$('#incomeTableHeader').html("Tabela twoich dochodów:");
		generateTableHead(table, data);
		
    }
function sortIncomesByCathegory(incomesSorted, incomesFromTimeSpan){
		var cathegory="";
		for(let i=0; i<incomesFromTimeSpan.length; i++){
			cathegory = incomesFromTimeSpan[i].cathegory;
			if(checkIfCathegoryIsAlreadyIncluded(cathegory,incomesSorted)) continue;
			var temporary =[];
			for(let k=0; k<incomesFromTimeSpan.length; k++){
				if(cathegory==incomesFromTimeSpan[k].cathegory){
					temporary.push(incomesFromTimeSpan[k]);
				}
			}
			temporary.sort(function(a,b){
				return new Date(b.date) - new Date(a.date);
				});
			Array.prototype.push.apply(incomesSorted,temporary);
			temporary.splice(0,temporary.length);
		}
		return incomesSorted;	
	}
function evaluateFinanceManagement(){
	sumOfIncomes = Math.round(sumOfIncomes*100)/100;
	sumOfExpences = Math.round(sumOfExpences*100)/100;
	var sumOfMoney = Math.round((sumOfIncomes - sumOfExpences)*100)/100;
	var sumDivContent = $('#showEvaluation').html();
	if(sumOfMoney >= 0){
		sumDivContent = "<p>Gratulacje! Świetnie sobie radzisz z zarządzaniem swoimi pieniędzmi</p><p>Twój bilans: "+sumOfIncomes.toString()+"-"+sumOfExpences.toString()+"="+sumOfMoney.toString()+"</p>";
		background = 'radial-gradient(#126110 10%,#2b8c29 50%,#529e51 80%)';
	}
	else{
		sumDivContent = "<p>Niestety! Suma twoich wydatków przekroczyła sumę przychodów</p><p>Twój bilans: "+sumOfIncomes.toString()+"-"+sumOfExpences.toString()+"="+sumOfMoney.toString()+"</p>";
		background = 'radial-gradient(#941e16 10%,#a8342c 50%,#bf524b 80%)';
	}
	$('#showEvaluation').html(sumDivContent);
	$('#showEvaluation').css({'background': background});
}
//summary functions