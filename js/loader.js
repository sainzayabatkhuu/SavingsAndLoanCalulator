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
	var amount    = parseFloat(document.getElementById("amount").value);
	var rate      = parseFloat(document.getElementById("rate").value) / 100;
	var time      = parseFloat(document.getElementById("time").value) * 12;
	var repayment = Math.pow(1 + rate,time);
	repayment     = 1 - 1/repayment;
	repayment     = repayment/rate;
	repayment     = amount/repayment;
	var calcTotal = repayment * time;
	var calcAm    = amount;
	var data1     = new Array();
	var data2     = new Array();
	var totalInterest = 0;
	
	if (document.getElementById("type1").checked)
		for (var i = 0;i <= time;i++) {
			if (i != 0) {
				calcAm = calcAm - (repayment-(calcAm * rate));
			}
			data1.push({'x' : (i/12), 'y' : calcAm});
		}
	
	if (document.getElementById("type2").checked)
		for (var i = 0;i <= time;i++) {
			data1.push({'x' : (i/12), 'y' : amount});
		}
	calcAm    = amount;
	for (var i = 0;i <= time;i++) {
		totalInterest = totalInterest + (calcAm * rate );
		calcAm = calcAm - (repayment-(calcAm * rate));
	}
	calcTotal = totalInterest + amount;
	calcAm    = amount;
	var hvsnegt = '';
	
	if (document.getElementById("type1").checked)
		for (var i = 0;i <= time;i++) {
			hvsnegt += '<tr><td>'+i+'</td>'+
			'<td>'+formatMoney(calcAm)+'</td>'+
			'<td>'+formatMoney(repayment-(calcAm * rate))+'</td>'+
			'<td>'+formatMoney(calcAm * rate )+'</td>'+
			'<td>'+formatMoney(repayment)+'</td></tr>';
	
			var money = 0;
			if (i != 0) {
				money = calcTotal - repayment;
				calcTotal = calcTotal - repayment;
				calcAm = calcAm - (repayment-(calcAm * rate));
			}
			else
				money = calcTotal;
			data2.push({'x' : i/12, 'y' : money});
		}
	
	if (document.getElementById("type2").checked)
		for (var i = 0;i <= time;i++) {
			hvsnegt += '<tr><td>'+i+'</td>'+
			'<td>'+formatMoney(calcAm)+'</td>'+
			'<td>'+formatMoney(repayment-(calcAm * rate))+'</td>'+
			'<td>'+formatMoney(calcAm * rate )+'</td>'+
			'<td>'+formatMoney(repayment)+'</td></tr>';
	
			var money = 0;
			if (i != 0) {
				money = calcTotal - (calcAm * rate );
				calcTotal = calcTotal - (calcAm * rate );
				calcAm = calcAm - (repayment-(calcAm * rate));
			}
			else
				money = calcTotal;
			data2.push({'x' : i/12, 'y' : money});
		}
	
	document.getElementById("loan_table").innerHTML = hvsnegt;
	
	var payType = document.getElementById('payType');

	if (payType.value.toString() == '0') {
	document.getElementById('footer').innerHTML = "<span style=\"font-size:14px;color:#333;width:100px;font-weight:bold;display:block;float:left;font-family:Arial, Helvetica, sans-serif;\">Сарын Төлөлтүүд:</span><span style=\"display:block;float:left;font-family:Arial, Helvetica, sans-serif;margin-right:10px;\"><span style=\"font-size:20px;color:#000;font-weight:bold;line-height:32px;\">"+ formatMoney(repayment) +"₮</span></span><span style=\"font-size:14px;color:#333;width:100px;font-weight:bold;display:block;float:left;font-family:Arial, Helvetica, sans-serif;\">Нийт Хүүгийн Төлөлт:</span><span style=\"display:block;float:left;font-family:Arial, Helvetica, sans-serif;\"><span style=\"font-size:20px;color:#000;font-weight:bold;line-height:32px;\">"+ formatMoney(totalInterest) +"₮</span></span>";
	}
	if (payType.value.toString() == '1') {
		var pay = 365/12;
		pay = repayment/pay;
	document.getElementById('footer').innerHTML = "<span style=\"font-size:14px;color:#333;width:100px;font-weight:bold;display:block;float:left;font-family:Arial, Helvetica, sans-serif;\">Хоёр Долоо/Төлөлтүүд:</span><span style=\"display:block;float:left;font-family:Arial, Helvetica, sans-serif;margin-right:10px;\"><span style=\"font-size:26px;color:#000;font-weight:bold;line-height:32px;\">"+ formatMoney(pay*14) +"₮</span></span><span style=\"font-size:14px;color:#333;width:100px;font-weight:bold;display:block;float:left;font-family:Arial, Helvetica, sans-serif;\">Нийт Хүүгийн Төлөлт:</span><span style=\"display:block;float:left;font-family:Arial, Helvetica, sans-serif;\"><span style=\"font-size:26px;color:#000;font-weight:bold;line-height:32px;\">"+ formatMoney(totalInterest) +"₮</span></span>";
	}
	if (payType.value.toString() == '2') {
		var pay = 365/12;
		pay = repayment/pay;
	document.getElementById('footer').innerHTML = "<span style=\"font-size:14px;color:#333;width:100px;font-weight:bold;display:block;float:left;font-family:Arial, Helvetica, sans-serif;\">Долоо/Төлөлтүүд:</span><span style=\"display:block;float:left;font-family:Arial, Helvetica, sans-serif;margin-right:10px;\"><span style=\"font-size:26px;color:#000;font-weight:bold;line-height:32px;\">"+ formatMoney(pay*7) +"₮</span></span><span style=\"font-size:14px;color:#333;width:100px;font-weight:bold;display:block;float:left;font-family:Arial, Helvetica, sans-serif;\">Нийт Хүүгийн Төлөлт:</span><span style=\"display:block;float:left;font-family:Arial, Helvetica, sans-serif;\"><span style=\"font-size:26px;color:#000;font-weight:bold;line-height:32px;\">"+ formatMoney(totalInterest) +"₮</span></span>";
	}
	new chart({
		render:{
			renderTo : 'graphic_contant',
			type : 'loan'
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
		series:[
			{
				color: '#61465e',
				data: data2
			},{
				color: '#ccc',
				data: data1
			}
			],
		calc:{
			loan_amount : amount,
			loan_rate : rate,
			loan_time : time
		}
		});
	};