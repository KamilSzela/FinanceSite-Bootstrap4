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
	var endOfArrayExpences = expencesObj.length;
	expencesObj.splice(0,endOfArrayExpences);
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
		adjustSetupContainerheight();
		$('#setup').addClass('active');
		if($("#expenceMenuSetup").hasClass('d-flex')==true){
			$('#setupContainer').css({'height': 'auto'});
		}
		
		$('#summaryContainer').removeClass('d-flex');
		$('#summaryContainer').addClass('d-none');
		$('#summary').removeClass('active');
	}
}
function adjustSetupContainerheight(){
	let windowHeight = $(window).height() - 70;
	let stringHeight = windowHeight.toString() +"px";
	$('#setupContainer').css({'height': stringHeight});
	
}
// visibility functions
/*function resizeScreen(){
	var screenHeight = $(window).height();
	var registerHeight = parseInt(screenHeight) - 150;
	
	 $('#register').css('min-height', registerHeight);
	 $('#content').css('min-height', registerHeight);
}*/
function adjustNavBar(){
	var screenWidth = $(window).width();
	
	if(parseInt(screenWidth)< 990){
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
	var string = lastIncomeID.toString()+"/"+ loggedUserID.toString()+"/"+ changeCommasToDots(amount) +"/"+date+"/"+category+"/"+comment+"/";
	
	IncomeInArray.id = lastIncomeID;
	IncomeInArray.userId = loggedUserID;
	IncomeInArray.amount = parseFloat(changeCommasToDots(amount));
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
				let stringZWalutą = element.amount.toString()+" PLN";
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
		$('#expenceTableHeader').html("<b>Tabela twoich wydatków:</b>");
		generateTableHead(table, data);
		generateSumOfExpencesDiv(table);
    }
	function generateTableHead(table, data){
		let tHead = table.createTHead();
		let row = tHead.insertRow();
		let headerName = "";
		for(let key of data){
			if(key == "userId") continue;
			else if(key == "id") continue;
			else if(key == "amount") headerName="Kwota";
			else if(key == "date") headerName="Data";
			else if(key == "payment") headerName="Sposób płatności";
			else if(key == "source" || key == "cathegory") headerName="Kategoria";
			else if(key == "comment") headerName="Komentarz";
			let th = document.createElement("th");
			let text = document.createTextNode(headerName);
			th.appendChild(text);
			row.appendChild(th);
	}

	
}
function addSummaryRow(table, cathegory, sumOfCathegoryAmount){
		let rowCathegory = table.insertRow();
		
		let cellAmount = rowCathegory.insertCell();
		let textSum = document.createTextNode(sumOfCathegoryAmount + " PLN");
		cellAmount.appendChild(textSum);
		for(let t=0; t<3; t++){
			let pauseCell = rowCathegory.insertCell();
			let pauseText = document.createTextNode(" - ");
			pauseCell.appendChild(pauseText);
			if($(table).attr("id")=="incomeTable"&& t == 1) break;
		}
		let cellCathegory = rowCathegory.insertCell();
		let text = document.createTextNode("Suma w kategorii: " + cathegory);
		cellCathegory.appendChild(text);
	}
	function generateSumOfExpencesDiv(table){
		let sumRow = table.insertRow();
		let cellCathegory = sumRow.insertCell();
		let text = document.createTextNode("Suma twoich wydatków:");
		cellCathegory.appendChild(text);
		for(let t=0; t<3; t++){
			let pauseCell = sumRow.insertCell();
			let pauseText = document.createTextNode(" - ");
			pauseCell.appendChild(pauseText);
		}
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
				if(key == "amount") {sumOfCathegoryAmount+= parseFloat(element.amount);
					let cell = row.insertCell();
					let text = document.createTextNode(element[key] + " PLN");
				    cell.appendChild(text);
				}
				else{
				  let cell = row.insertCell();
				  let text = document.createTextNode(element[key]);
				  cell.appendChild(text);
				}
			}
			 if(element == incomesSorted[lastElement]){
				addSummaryRow(table, cathegory, sumOfCathegoryAmount);
				cathegory = temporary;
				sumOfIncomes += sumOfCathegoryAmount;
				sumOfCathegoryAmount = 0;
				}
		}	
		$('#summaryContainer').css({
				'height': 'auto'
				});
		$('#incomeTableHeader').html("<b>Tabela twoich dochodów:</b>");
		generateTableHead(table, data);
		generateSumOfIncomesDiv(table);
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
	function generateSumOfIncomesDiv(table){
		let sumRow = table.insertRow();
		let cellCathegory = sumRow.insertCell();
		let text = document.createTextNode("Suma twoich dochodów:");
		cellCathegory.appendChild(text);
		for(let t=0; t<2; t++){
			let pauseCell = sumRow.insertCell();
			let pauseText = document.createTextNode(" - ");
			pauseCell.appendChild(pauseText);
		}
		let cellAmount = sumRow.insertCell();
		let textSum = document.createTextNode(Math.round(sumOfIncomes*100)/100 + " PLN");
		cellAmount.appendChild(textSum);
	}
function evaluateFinanceManagement(){
	sumOfIncomes = Math.round(sumOfIncomes*100)/100;
	sumOfExpences = Math.round(sumOfExpences*100)/100;
	var sumOfMoney = Math.round((sumOfIncomes - sumOfExpences)*100)/100;
	var sumDivContent = $('#showEvaluation').html();
	if(sumOfMoney >= 0){
		sumDivContent = "<p>Gratulacje! Świetnie sobie radzisz z zarządzaniem swoimi pieniędzmi</p><p>Twój bilans: "+sumOfIncomes.toString()+" PLN - "+sumOfExpences.toString()+" PLN = "+sumOfMoney.toString()+" PLN</p>";
		background = 'radial-gradient(#126110 10%,#2b8c29 50%,#529e51 80%)';
	}
	else{
		sumDivContent = "<p>Niestety! Suma twoich wydatków przekroczyła sumę dochodów</p><p>Twój bilans: "+sumOfIncomes.toString()+" PLN - "+sumOfExpences.toString()+" PLN = "+sumOfMoney.toString()+" PLN</p>";
		background = 'radial-gradient(#941e16 10%,#a8342c 50%,#bf524b 80%)';
	}
	$('#showEvaluation').html(sumDivContent);
	$('#showEvaluation').css({'background': background});
}
//summary functions
// setup functions
$('#listLoginChange').on('click', function(){
	
	$('#loginSetup').removeClass('d-none');
	$('#loginSetup').addClass('d-flex');
	adjustSetupContainerheight()
	
	$('#expenceMenuSetup').removeClass('d-flex');
	$('#expenceMenuSetup').addClass('d-none');
	
	$('#incomeMenuSetup').removeClass('d-flex');
	$('#incomeMenuSetup').addClass('d-none');
	
	$('#lastInputsMenuSetup').removeClass('d-flex');
	$('#lastInputsMenuSetup').addClass('d-none');
	
	$("#functionMessage-loginSetup").html("");
});
$('#listExpenceChange').on('click', function(){
	$('#loginSetup').removeClass('d-flex');
	$('#loginSetup').addClass('d-none');
	
	$('#expenceMenuSetup').removeClass('d-none');
	$('#expenceMenuSetup').addClass('d-flex');
	
	$('#incomeMenuSetup').removeClass('d-flex');
	$('#incomeMenuSetup').addClass('d-none');
	
	$('#lastInputsMenuSetup').removeClass('d-flex');
	$('#lastInputsMenuSetup').addClass('d-none');
	
	$("#functionMessage-loginSetup").html("");
	loadPaymentWaysToDiv();
	loadCathegoriesToDiv();
});
$('#listIncomeChange').on('click', function(){
	$('#loginSetup').removeClass('d-flex');
	$('#loginSetup').addClass('d-none');
	
	$('#expenceMenuSetup').removeClass('d-flex');
	$('#expenceMenuSetup').addClass('d-none');
	
	$('#incomeMenuSetup').removeClass('d-none');
	$('#incomeMenuSetup').addClass('d-flex');
	
	$('#lastInputsMenuSetup').removeClass('d-flex');
	$('#lastInputsMenuSetup').addClass('d-none');
	
	$("#functionMessage-loginSetup").html("");
	adjustSetupContainerheight();
	loadIncomeCathegoriesToDiv();
});
$('#listLastInputsDelete').on('click', function(){
	$('#loginSetup').removeClass('d-flex');
	$('#loginSetup').addClass('d-none');
	
	$('#expenceMenuSetup').removeClass('d-flex');
	$('#expenceMenuSetup').addClass('d-none');
	
	$('#incomeMenuSetup').removeClass('d-flex');
	$('#incomeMenuSetup').addClass('d-none');
	
	$('#lastInputsMenuSetup').removeClass('d-none');
	$('#lastInputsMenuSetup').addClass('d-flex');
	
	$("#functionMessage-loginSetup").html("");
	
	adjustSetupContainerheight();
	loadIncomesFromArrayToDiv();
	loadExpencesFromArrayToDiv();	
});
$('#changeLoginButton').on('click', function(){
	changeLoginOfLoggedUser();
});
$('#changePasswordButton').on('click', function(){
	changePasswordOfLoggedUser();
});
$('#changeEmailButton').on('click', function(){
	changeEmailOfLoggedUser();
});
function changeLoginOfLoggedUser(){
	if($('#loginChange').val()=="") {
		$("#functionMessage-loginSetup").html("<b>Nie podałeś loginu do zmiany! </b>"); 
		$("#functionMessage-loginSetup").removeClass('text-primary');
		$("#functionMessage-loginSetup").addClass('text-danger');
		return;
	}
	for(var i=0; i<localStorage.length; i++){
		var nameOfValue = localStorage.key(i); 	
		if(nameOfValue.charAt(0)=='U'){
			var lastChar = nameOfValue.length - 1;
			if(nameOfValue.charAt(lastChar)==loggedUserID){
				var valueOfName = localStorage.getItem(nameOfValue);
				changeLoginInLocalStorage(valueOfName, nameOfValue);
				return;
			}
		}
	}
}

function changeLoginInLocalStorage(valueOfName,nameOfValue){
	var dashCounter = 0;
	var string = "";
	var stringAfterChange = "";
	for(var i=0; i<valueOfName.length; i++){
		if(valueOfName.charAt(i) != '/'){
			string = string + valueOfName.substr(i,1);
		}
		if(valueOfName.charAt(i) == '/')
		{
	
				if(dashCounter == 1){
				string = ""; 
				stringAfterChange = stringAfterChange + $('#loginChange').val() +'/';
				}
				else{ 
				stringAfterChange = stringAfterChange + string +'/';
				string = ""; 
				}
			
			dashCounter++;
		}
		if(dashCounter==4){
			localStorage.setItem(nameOfValue,stringAfterChange);
			$("#functionMessage-loginSetup").html("<b>Login został zmieniony!</b>");
			$("#functionMessage-loginSetup").removeClass('text-danger');
			$("#functionMessage-loginSetup").addClass('text-primary');
			$('#loginChange').val("");
		}
	}
}
function changePasswordOfLoggedUser(){
	if($('#passwordChange').val()=="") {
			$("#functionMessage-loginSetup").html("<b>Nie podałeś hasła do zmiany</b>"); 
			$("#functionMessage-loginSetup").removeClass('text-primary');
			$("#functionMessage-loginSetup").addClass('text-danger'); 
			return;
		}
	for(var i=0; i<localStorage.length; i++){
		var nameOfValue = localStorage.key(i); 	
		if(nameOfValue.charAt(0)=='U'){
			var lastChar = nameOfValue.length - 1;
			if(nameOfValue.charAt(lastChar)==loggedUserID){
				var valueOfName = localStorage.getItem(nameOfValue);
				changePasswordInLocalStorage(valueOfName, nameOfValue);
				return;
			}
		}
	}
}
function changePasswordInLocalStorage(valueOfName,nameOfValue){
	var dashCounter = 0;
	var string = "";
	var stringAfterChange = "";
	for(var i=0; i<valueOfName.length; i++){
		if(valueOfName.charAt(i) != '/'){
			string = string + valueOfName.substr(i,1);
		}
		if(valueOfName.charAt(i) == '/')
		{
	
				if(dashCounter == 2){
				string = ""; 
				stringAfterChange = stringAfterChange + $('#passwordChange').val() +'/';
				}
				else{ 
				stringAfterChange = stringAfterChange + string +'/';
				string = ""; 
				}
			
			dashCounter++;
		}
		if(dashCounter==4){
			localStorage.setItem(nameOfValue,stringAfterChange);
			$("#functionMessage-loginSetup").html("<b>Hasło zostało zmienione!</b>");
			$("#functionMessage-loginSetup").removeClass('text-danger');
			$("#functionMessage-loginSetup").addClass('text-primary');
			$('#passwordChange').val("");
		}
	}
}
function changeEmailOfLoggedUser(){
	if($('#emailChange').val()=="") {
			$("#functionMessage-loginSetup").html("<b>Nie podałeś konta email do zmiany</b>"); 
			$("#functionMessage-loginSetup").removeClass('text-primary');
			$("#functionMessage-loginSetup").addClass('text-danger');  
			return;
		}
	for(var i=0; i<localStorage.length; i++){
		var nameOfValue = localStorage.key(i); 	
		if(nameOfValue.charAt(0)=='U'){
			var lastChar = nameOfValue.length - 1;
			if(nameOfValue.charAt(lastChar)==loggedUserID){
				var valueOfName = localStorage.getItem(nameOfValue);
				changeEmailInLocalStorage(valueOfName, nameOfValue);
				return;
			}
		}
	}
}

function changeEmailInLocalStorage(valueOfName,nameOfValue){
	var dashCounter = 0;
	var string = "";
	var stringAfterChange = "";
	for(var i=0; i<valueOfName.length; i++){
		if(valueOfName.charAt(i) != '/'){
			string = string + valueOfName.substr(i,1);
		}
		if(valueOfName.charAt(i) == '/')
		{
	
				if(dashCounter == 3){
				string = ""; 
				stringAfterChange = stringAfterChange + $('#emailChange').val() +'/';
				}
				else{ 
				stringAfterChange = stringAfterChange + string +'/';
				string = ""; 
				}
			
			dashCounter++;
		}
		if(dashCounter==4){
			localStorage.setItem(nameOfValue,stringAfterChange);
			$("#functionMessage-loginSetup").html("<b>Twój adres emial został zmieniony!</b>");
			$("#functionMessage-loginSetup").removeClass('text-danger');
			$("#functionMessage-loginSetup").addClass('text-success');
			$('#emailChange').val("");
		}
	}
}

function loadPaymentWaysToDiv(){
	
		var methods = $('#expencePaymentWay').html();
		$('#expenceMethodDelete').html("");
		var string = "";
		var quotMarks = false;
		var methodsString = "<form id=\"deletePaymentWay\" class=\"form-group\">";
		for(var i=0; i<methods.length; i++){
			
			if(methods.charAt(i)==" " && quotMarks == false) 
			{
				var beginnigString = methods.substr(i+1 ,5);
				if(beginnigString == "value"){
					quotMarks = true;
					i=i+8;
				
				}
			}
			if(quotMarks == true){
				
				if(methods.charAt(i) == "\"") {
					methodsString += "<div class=\"form-control bg-light\"><input type=\"radio\" name=\"expenceDelete\" value=\""+string+"\"> "+string+"</div>";
					quotMarks = false;
					string = "";
					continue;
				}
				string = string + methods.substr(i,1);
			}
		}
		methodsString += "</form>";
		$('#expenceMethodDelete').html(methodsString);
		$('#setupContainer').css({'height': 'auto'});	
}
$('#deleteMethodButton').on('click', function(){
	deleteMethodOfPayment();
});
function deleteMethodOfPayment(){
	var wayOfPayment = $("input[type=radio][name=expenceDelete]:checked").val();
	$('input[type=radio][name=expenceDelete]:checked').parent().remove();
	wayOfPayment = deleteSpaces(wayOfPayment);
	var stringIdName = "#" + wayOfPayment;
	$(stringIdName).remove();
	alert("Usunięto wybraną metodę płatności");
}
function deleteSpaces(wayOfPayment){
	var string = "";
	for(var i=0; i<wayOfPayment.length; i++){
		if(wayOfPayment.charAt(i)==" "||wayOfPayment.charAt(i)==",") continue;
		string = string + wayOfPayment.substr(i,1);
	}
	return string;
}
$('#addPaymentWayButton').on('click', function(){
	addNewMethodOfPayment();
});
function addNewMethodOfPayment(){
	var addedMethod = $('#addPayment').val();
	if(addedMethod == "") {alert("Nie wprowadzono nowej metody!"); return;};
	
	 $('#expencePaymentWay').append("<div class=\"custom-control custom-radio\" id=\""+ deleteSpaces(addedMethod) +"\"><input type='radio' class='custom-control-input' id=\""+deleteSpaces(addedMethod)+"input\" value=\""+ addedMethod +"\" name='payment'><label class='custom-control-label' for=\""+deleteSpaces(addedMethod)+"input\">"+addedMethod+"</label></div>");	
	alert("Dodano nową metodę płatności");
	$('#addPayment').val("");
	loadPaymentWaysToDiv();
}
function loadCathegoriesToDiv(){
	var methods = $('#expenceCategory').html();
		$('#expenceCathegoryDelete').html("");
		var string = "";
		var quotMarks = false;
		var methodsString = "<fieldset id=\"deleteCathegoryWay\"></fieldset>";
		$('#expenceCathegoryDelete').append(methodsString);
		for(var i=0; i<methods.length; i++){
			
			if(methods.charAt(i)==" " && quotMarks == false) 
			{
				var beginnigString = methods.substr(i+1 ,5);
				if(beginnigString == "value"){
					quotMarks = true;
					i=i+8;
				}
			}
			if(quotMarks == true){
				
				if(methods.charAt(i) == "\"") {
						methodsString += "<div class=\"form-control bg-light\"><input type=\"radio\" name=\"expenceMethodDelete\" value=\""+string+"\"> "+ string+"</div>";
						quotMarks = false;
						string = "";
						
						$('#deleteCathegoryWay').append(methodsString);
						methodsString = "";
						continue;						
				}
				string = string + methods.substr(i,1);
			}
		}
}
$('#deleteExpenceCathegoryButton').on('click', function(){
	deleteCathegoryOfPayment();
});
function deleteCathegoryOfPayment(){
	var cathegoryOfPayment = $("input[type=radio][name=expenceMethodDelete]:checked").val();
	$('input[type=radio][name=expenceMethodDelete]:checked').parent().remove();
	cathegoryOfPayment = deleteSpaces(cathegoryOfPayment);
	var stringIdName = "#" + cathegoryOfPayment;
    $(stringIdName).remove();
	
	alert("Usunięto wybraną kategorię płatności");
}
$('#addExpenceCathegoryButton').on('click', function(){
	addNewCathegoryOfPayment();
});
function addNewCathegoryOfPayment(){
	var addedCathegory = $('#addExpenceCathegory').val();
	if(addedCathegory == "") {alert("Nie wprowadzono nowej kategorii!"); return;};
	
	 $('#expenceCategory').append("<div class=\"custom-control custom-radio\" id=\""+ deleteSpaces(addedCathegory)+"\"><input type='radio' class=\"custom-control-input\" id=\""+deleteSpaces(addedCathegory)+"input\" value=\""+ addedCathegory +"\" name='expenceCat'><label class='custom-control-label' for=\""+deleteSpaces(addedCathegory)+"input\">"+ addedCathegory +"</label></div>");
	 
	 alert("Dodano nową kategorię wydatku");
	 loadCathegoriesToDiv();
	 $('#addExpenceCathegory').val("");
}
function loadIncomeCathegoriesToDiv(){
	var methods = $('#incomeCategory').html();
		$('#incomeCathegoryDelete').html("");
		var string = "";
		var quotMarks = false;
		var methodsString = "<form class='form-group' id=\"deleteIncomeCathegoryFieldset\">";
		
		for(var i=0; i<methods.length; i++){
			
			if(methods.charAt(i)==" " && quotMarks == false) 
			{
				var beginnigString = methods.substr(i+1 ,5);
				if(beginnigString == "value"){
					quotMarks = true;
					i=i+8;
				
				}
			}
			if(quotMarks == true){
				
				if(methods.charAt(i) == "\"") {
					methodsString += "<div class=\"form-control bg-light\"><input type=\"radio\" name=\"incomeDeleteCathegoryInput\" value=\""+string+"\"> "+string+"</div>";
					quotMarks = false;
					string = "";
					continue;
				}
				string = string + methods.substr(i,1);
			}
		}
		methodsString += "</form>";
		$('#incomeCathegoryDelete').append(methodsString);
}
$('#addIncomeCathegoryButton').on('click', function(){
	addNewCathegoryOfIncome();
});
$('#deleteIncomeCathegoryButton').on('click', function(){
	deleteCathegoryOfIncome();
});
function addNewCathegoryOfIncome(){
	var addedCathegory = $('#addIncomeCathegoryTextInput').val();
	if(addedCathegory == "") {alert("Nie wprowadzono nowej kategorii!"); return;};
	
	 $('#incomeCategory').append("<div class=\"custom-control custom-radio\" id=\""+deleteSpaces(addedCathegory)+"\"><input type='radio' class='custom-control-input' id=\""+deleteSpaces(addedCathegory)+"input\" value=\""+ addedCathegory +"\" name='incomeCategory'><label class='custom-control-label' for=\""+deleteSpaces(addedCathegory)+"input\" >"+ addedCathegory +"</label></div>");
	 
	 alert("Dodano nową kategorię przychodu");
	 loadIncomeCathegoriesToDiv();
	 $('#addIncomeCathegoryTextInput').val("");
}
function deleteCathegoryOfIncome(){
	var cathegoryOfPayment = $("input[type=radio][name=incomeDeleteCathegoryInput]:checked").val();
	$('input[type=radio][name=incomeDeleteCathegoryInput]:checked').parent().remove();
	cathegoryOfPayment = deleteSpaces(cathegoryOfPayment);
	var stringIdName = "#" + cathegoryOfPayment;
    $(stringIdName).remove();
	
	alert("Usunięto wybraną kategorię płatności");
}
function addIncomeData(i){
	var string = "";

	string = string +"<b> Rozmiar dochodu: </b>"+ incomesObj[i].amount;
	string = string +",<b> data dochodu: </b>"+ incomesObj[i].date;
	string = string +",<b> kategoria dochodu: </b>"+ incomesObj[i].cathegory;
	string = string +",<b> komentarz: </b>"+ incomesObj[i].comment;
	return string;
}
function addExpenceData(i)
{
	var string = "";

	string = string +"<b> Rozmiar wydatku: </b>"+ expencesObj[i].amount;
	string = string +",<b>  data wydatku: </b>"+ expencesObj[i].date;
	string = string +",<b>  metoda zapłaty: wydatku: </b>"+ expencesObj[i].payment;
	string = string +",<b>  źródło wydatku: </b>"+ expencesObj[i].source;
	string = string +",<b> komentarz: </b>"+ expencesObj[i].comment;
	return string;
}
function loadIncomesFromArrayToDiv(){
	$('#lastIncomesLoaded').html("");
	if(incomesObj.length == 0){
		$('#lastIncomesLoaded').html("<p class=\"font-2rem text-danger\">Brak dodanych dochodów</p>");
		return;
	}
	var endOfArray = incomesObj.length-1;
	var string = "";
	var methodsString = "<fieldset id=\"deleteLastIncomesInLocalStorageFieldset\">";
	for (var i=endOfArray; i>endOfArray-3; i--){
		string=addIncomeData(i);
		methodsString += "<div class=\"form-control bg-light height-auto\"><input type=\"radio\" class=\"control-input\" name=\"incomeDeleteLocalStorageInput\" value=\"Income"+incomesObj[i].id + "\">"+ string +"</div>";
		if(i==0) break;
	}
	methodsString += "</fieldset>";
	$('#lastIncomesLoaded').append(methodsString);
}
function loadExpencesFromArrayToDiv(){
	$('#lastExpencesLoaded').html("");
	if(expencesObj.length == 0){
		$('#lastExpencesLoaded').html("<p class='font-2rem text-danger'>Brak dodanych wydatków</p>");
		$('#lastInputsMenuSetup h4').last().css('margin-top','30px');
		return;
	}
	var endOfArray = expencesObj.length-1;
	var string = "";
	var methodsString = "<fieldset id=\"deleteLastExpencesInLocalStorageFieldset\">";
	for (var i=endOfArray; i>endOfArray-3; i--){
		string=addExpenceData(i);
		methodsString += "<div class=\"form-control bg-light height-auto\"><input type=\"radio\" class=\"control-input\" name=\"expenceDeleteLocalStorageInput\" value=\"Expence"+expencesObj[i].id + "\">"+ string +"</div>";
		if(i==0) break;
	}
	methodsString += "</fieldset>";
	$('#lastExpencesLoaded').append(methodsString);
	let windowHeight = $(window).height();
	if(windowHeight>450){
		$('#setupContainer').css({'height': 'auto'});
		return;
	}
}
$('#deleteIncomeInLocalStorageButton').on('click', function(){
	deleteIncomeInLocalStorage();
});
$('#deleteExpenceInLocalStorageButton').on('click', function(){
	deleteExpenceInLocalStorage();
});
function deleteIncomeInLocalStorage(){
	var incomeToDelete = $("input[type=radio][name=incomeDeleteLocalStorageInput]:checked").val();
	localStorage.removeItem(incomeToDelete);
	$("input[type=radio][name=incomeDeleteLocalStorageInput]:checked").parent().remove();
	incomesObj.splice(0,incomesObj.length);
	loadIncomesOfLoggedUser();
	alert("Usunięto wskazany dochód");
	loadIncomesFromArrayToDiv();
}
function deleteExpenceInLocalStorage(){
	var expenceToDelete = $("input[type=radio][name=expenceDeleteLocalStorageInput]:checked").val();
	localStorage.removeItem(expenceToDelete);
	$("input[type=radio][name=expenceDeleteLocalStorageInput]:checked").parent().remove();
	expencesObj.splice(0,expencesObj.length);
	loadExpencesOfLoggedUser();
	alert("Usunięto wskazany wydatek");
	loadExpencesFromArrayToDiv();
}
//setup functions/