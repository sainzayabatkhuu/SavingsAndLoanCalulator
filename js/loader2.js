// JavaScript Document
window.onload = init;

function init(){	
	validation();
	calculator();
};

function tabs(){
	
};

function validation(){
	if(!isNaN(document.getElementById("amount").value) || 100000 > parseInt(document.getElementById("amount").value) || parseInt(document.getElementById("amount").value) > 150000000 ) {
		document.getElementById("amount").value = '300000₮';
	}
	if(!isNaN(document.getElementById("rate").value) || 1 > parseInt(document.getElementById("rate").value) || parseInt(document.getElementById("rate").value) > 25 ) {
		document.getElementById("rate").value = '3%';
	}
	
	if(!isNaN(document.getElementById("time").value) || 1 > parseInt(document.getElementById("time").value) || parseInt(document.getElementById("time").value) > 30 ) {
		document.getElementById("time").value = '6 жил';
	}
};

function calculator() {
	
	/*  */
	var init      = parseFloat(document.getElementById("amount").value);
	var rate      = parseFloat(document.getElementById("rate").value) / 100;
	var time      = parseFloat(document.getElementById("time").value.toString()); //saraar
	var ongoing   = parseFloat(document.getElementById("deposit").value);
	var ongoingT  = parseFloat(document.getElementById("depositType").value);
	var month     = 356/12;
	
	switch (ongoingT) {
		case 0:
		ongoing = (ongoing * month) / 7;
		break;
		case 1:
		ongoing = (ongoing * month) / 14;
		break;
		case 2:
		ongoing = ongoing;
		break;
		case 3:
		ongoing = (ongoing * month) / (month*3);
		break;
		case 4:
		ongoing = (ongoing * month) / (month*6);
		break;
	}
		
	var repayment = 0;
	var calcTotal = 0;
	var calcAm    = init;
	var data     = new Array();
	var totalInterest = 0;
	
	for (var i = 0;i <= time;i++) {
		if (i != 0) {
			calcAm = init + ( ( init + i * ongoing ) * ( rate / 100 ) * i );
		} else {
			
		}
		data.push({'x' : (i), 'y' : calcAm});
	}
	
	calcAm    = amount;
	
	
	for (var i = 0;i <= time;i++) {
		totalInterest = totalInterest + (calcAm * rate );
		calcAm = calcAm - (repayment-(calcAm * rate));
	}
	calcTotal = totalInterest + amount;
	calcAm    = amount;
	var hvsnegt = '';
	
	document.getElementById("loan_table").innerHTML = hvsnegt;
	
	//document.getElementById('footer').innerHTML = "";
	
	new chart({
		render:{
			renderTo : 'graphic_contant',
			type : 'savings'
		},
		xAxis:{
			title: {
				text:'Жилүүдийн явц'
			}
		},
		yAxis:{
			title: {
				text:'Хэмжээ Өр(₮)'
			}
		},
		series:[{
				color: '#0076e0',
				data: data
			}],
		calc:{
			init_amount : amount,
			rate        : rate,
			time        : time,
			ongoing     : ongoing,
			ongoingT    : ongoingT,
		}
		});
	};