/**
 * @license Loancalcchart JS v0.1.3 (2013-01-27)
 *
 * (c) 2013 Sainzaya Batkhuu
 *
 * License: www.golomtbank.com/
 */
 
 
function chart(option) {
	var XmaxPoint = 0;
	var XminPoint = 0;
	var YmaxPoint = 0;
	var YminPoint = 0;
	var Xmax = 0;
	var Ymax = 0;
	var maxTicks = 10;
	for (var i=0;i <option.series.length; i++) {
		for (var a=0;a<option.series[i].data.length; a++) {
			
			if (option.series[i].data[a]['x'] < XminPoint) {
				XminPoint = option.series[i].data[a]['x'];
			}
			
			if (option.series[i].data[a]['x'] > XmaxPoint) {
				XmaxPoint = option.series[i].data[a]['x'];
			}
			
			if (option.series[i].data[a]['y'] < YminPoint) {
				YminPoint = option.series[i].data[a]['y'];
			}
			
			if (option.series[i].data[a]['y'] > YmaxPoint) {
				YmaxPoint = option.series[i].data[a]['y'];
			}
		}
	}
	Xmax = XmaxPoint;
	Ymax = YmaxPoint;
	XmaxPoint = Math.round(XmaxPoint);
	XminPoint = Math.round(XminPoint);
	YmaxPoint = Math.round(YmaxPoint);
	YminPoint = Math.round(YminPoint);
	
	var Xtickrange = niceNum(XmaxPoint - XminPoint, true);
	var XtickSpacing = niceNum((XmaxPoint - XminPoint)/(maxTicks - 1), false);
	XminPoint = Math.floor(XminPoint / XtickSpacing) * XtickSpacing;
	XmaxPoint = Math.ceil(XmaxPoint / XtickSpacing) * XtickSpacing;
	
	var Ytickrange = niceNum(YmaxPoint - YminPoint, true);
	var YtickSpacing = niceNum((YmaxPoint - YminPoint)/(maxTicks - 1), false);
	
	YminPoint = Math.floor(YminPoint / YtickSpacing) * YtickSpacing;
	YmaxPoint = Math.ceil(YmaxPoint / YtickSpacing) * YtickSpacing;

	var c = document.getElementById(option.render.renderTo);
	var height = parseInt(c.getAttribute("height"));
	var width  = parseInt(c.getAttribute("width"));
	
	var ctx=c.getContext("2d");
	
	ctx.fillStyle = "#efefef";
	ctx.fillRect(0, 0, width, height);
	
	var x = 60, y = 10,cwidth = 345,cheight =282;
	
	ctx.fillStyle = "#fff";
	ctx.strokeStyle = "#e8e8e8";
	ctx.strokeRect(x, y, cwidth, cheight);
	ctx.fillRect(x, y, cwidth, cheight);
	
	for (var i=0;i <option.series.length; i++) {
		ctx.beginPath();
		ctx.moveTo(x,y + cheight);
		
		for (var a=0;a < option.series[i].data.length; a++) {
			var tempx = (cwidth*option.series[i].data[a]['x'])/XmaxPoint+x;
			//alert(option.series[i].data[a]['y']);
			
			var tempy = (cheight*option.series[i].data[a]['y'])/YmaxPoint;
			tempy = (cheight - tempy) + y;
			ctx.lineTo(tempx, tempy);
		}
		//alert(XmaxPoint);
		ctx.lineTo(x + (Xmax*cwidth)/XmaxPoint,y + cheight);
		ctx.fillStyle = option.series[i].color;
		ctx.fill();
	}
	if (option.render.type == 'loan')
		c.onmousemove = moving;
	if (option.render.type == 'savings')
		c.onmousemove = moving1;
	c.onmouseout = function() { var infobox = document.getElementById('popup_info'); infobox.style.display = 'none'; };

	function moving1(e) {
		var offsetx = e.hasOwnProperty('offsetX') ? e.offsetX : e.layerX;
		var offsety = e.hasOwnProperty('offsetY') ? e.offsetY : e.layerY;
		var month = cwidth / XmaxPoint, hasax = 0, infobox = document.getElementById('popup_info');
		month = Math.round((offsetx - x) / month);
		
		var amount    = option.calc.init_amount, 
			rate      = option.calc.rate, 
			time      = option.calc.time, 
			ongoing   = option.calc.ongoing,
                        lang      = option.render.lang;
			
		// Энд статусийн цонхон дээр гарах зүйлсийг бодож өгнө.
		totalInterest = 0.00;
		if (month != 0) {
			var sar = parseFloat(365/12);
			days = month*sar;
			calcAm = amount*days*(rate / 365);
			var div = (((month+1) * month)/2) - month;
			calcAm = calcAm + (ongoing * div * ((rate * days) / (365 * month)) );
			totalInterest = calcAm;
			calcAm = amount + (ongoing*(month - 1)) + calcAm;
		} else { calcAm = ongoing; }
		
		if ((x <= offsetx && offsetx <= x+cwidth) && (y <= offsety && offsety <= y+cheight)) {
			if (offsetx > 200)
				hasax = 200
			infobox.style.top = (offsety - 35) +'px';
			infobox.style.left = (offsetx - hasax) +'px';
			infobox.style.display = 'block';
                        if (lang == 'mn')
                            infobox.innerHTML = '<div class="info"><h4>'+month+' Сар</h4>'+
                                '<p><span style="float:left;width:60px;color:#000;">Баланс: </span><span style="font-weight:bold;color:#505050;font-size:12px;float:left;">'+formatMoney(calcAm)+'₮</span></p>'+
				'<p><span style="float:left;width:60px;color:#000;">Хүү: </span><span style="font-weight:bold;color:#505050;font-size:12px;float:left;">'+formatMoney(totalInterest)+'₮</span></p></div>';
                        else
                            infobox.innerHTML = '<div class="info"><h4>'+month+' Month</h4>'+
                                '<p><span style="float:left;width:60px;color:#000;">Balance: </span><span style="font-weight:bold;color:#505050;font-size:12px;float:left;">'+formatMoney(calcAm)+'₮</span></p>'+
				'<p><span style="float:left;width:60px;color:#000;">Interest: </span><span style="font-weight:bold;color:#505050;font-size:12px;float:left;">'+formatMoney(totalInterest)+'₮</span></p></div>';
                            
			infobox.onmousemove = function(ev){
				var sub_offsetx = ev.hasOwnProperty('offsetX') ? ev.offsetX : ev.layerX;
				var sub_offsety = ev.hasOwnProperty('offsetY') ? ev.offsetY : ev.layerY;
				
				infobox.style.top = (offsety + sub_offsety - 35) +'px';
				infobox.style.left = (offsetx + sub_offsetx - hasax) +'px';
				infobox.style.display = 'block';
			};
		}
		else {
			infobox.style.display = 'none';
		}
	}
	
	function moving(e) {
		var offsetx = e.hasOwnProperty('offsetX') ? e.offsetX : e.layerX;
		var offsety = e.hasOwnProperty('offsetY') ? e.offsetY : e.layerY;
		var month = cwidth / XmaxPoint, hasax = 0, infobox = document.getElementById('popup_info');
		month = Math.round((offsetx - x) / month);
		
		var amount        = option.calc.loan_amount, 
			rate          = option.calc.loan_rate, 
			time          = option.calc.loan_time, 
			repayment     = 0,
			repayment_sum = 0,
			realrepayment = 0,
			totalInterest = 0,
			Interest      = 0,
			total         = 0,
			mounth        = 365/12,
			calcAm        = amount,
                        lang          = option.render.lang;
			
		for (var i = 1;i <= time;i++) {
			if (i != 1) {
				repayment = 1 / ( rate * mounth + 1 ) * repayment;
			} else {
				repayment = 1 / ( rate * mounth + 1 );
			}
			repayment_sum += repayment;
		}
		repayment = amount / repayment_sum;
		realrepayment = repayment;
		
		for (var i = 0;i <= time;i++) {
			if (i != 0) {
				totalInterest = totalInterest + (calcAm * rate * mounth);
				calcAm = calcAm - (realrepayment- (calcAm * rate * mounth));
			}
		}
		total = amount + totalInterest;
		calcAm    = amount;
		
		for (var i = 0;i <= time - month;i++) {
			if (i != 0) {
				Interest = Interest + ( calcAm * rate * mounth );
				calcAm = calcAm - ( realrepayment- ( calcAm * rate * mounth ));
			}
		}
		calcAm    = amount;
		var realInterest = 0;
		for (var i = 0;i <= month;i++) {
			if (i != 0) {
				realInterest = realInterest + ( calcAm * rate * mounth );
				calcAm = calcAm - ( realrepayment- ( calcAm * rate * mounth ));
			}
		}
		realInterest = totalInterest-realInterest;
		if ((x <= offsetx && offsetx <= x+cwidth) && (y <= offsety && offsety <= y+cheight)) {
			if (offsetx > 200)
				hasax = 200
			infobox.style.top = (offsety - 35) +'px';
			infobox.style.left = (offsetx - hasax) +'px';
			infobox.style.display = 'block';
			realInterest = Math.round(realInterest*100)/100;
                        if (lang == 'mn')
                            infobox.innerHTML = '<div class="info"><h4>'+month+' Сар</h4><p><span style="float:left;width:80px;color:#000;">Нийт төлбөр: </span><span style="font-weight:bold;color:#505050;font-size:12px;float:left;">'+ formatMoney(Math.round(total - ( totalInterest - realInterest ))) +'₮</span></p><p><span style="float:left;width:80px;color:#000;">Зээлийн хэмжээ: </span><span style="font-weight:bold;color:#505050;font-size:12px;float:left;">'+formatMoney(amount)+'₮</span></p><p><span style="float:left;width:80px;color:#000;">Зээлийн хүү: </span><span style="font-weight:bold;color:#505050;font-size:12px;float:left;">'+formatMoney(realInterest)+'₮</span></p></div>';
                        if (lang == 'en')
                            infobox.innerHTML = '<div class="info"><h4>'+month+' Month</h4><p><span style="float:left;width:80px;color:#000;">Owing: </span><span style="font-weight:bold;color:#505050;font-size:12px;float:left;">'+ formatMoney(Math.round(total - ( totalInterest - realInterest ))) +'₮</span></p><p><span style="float:left;width:80px;color:#000;">Principal: </span><span style="font-weight:bold;color:#505050;font-size:12px;float:left;">'+formatMoney(amount)+'₮</span></p><p><span style="float:left;width:80px;color:#000;">Interest: </span><span style="font-weight:bold;color:#505050;font-size:12px;float:left;">'+formatMoney(realInterest)+'₮</span></p></div>';
                        
			infobox.onmousemove = function(ev){
				var sub_offsetx = ev.hasOwnProperty('offsetX') ? ev.offsetX : ev.layerX;
				var sub_offsety = ev.hasOwnProperty('offsetY') ? ev.offsetY : ev.layerY;
				
				infobox.style.top = (offsety + sub_offsety - 35) +'px';
				infobox.style.left = (offsetx + sub_offsetx - hasax) +'px';
				infobox.style.display = 'block';
			};
		}
		else {
			infobox.style.display = 'none';
		}
	}
	
	for (var i = 0; i <= YmaxPoint / YtickSpacing; i++) {
		var line = YmaxPoint / YtickSpacing;
		
		ctx.font = '12px Arial';
		ctx.textAlign = 'right';
		ctx.textBaseline="middle";
		ctx.fillStyle = '#333333';
		ctx.fillText(nFormatter(YmaxPoint - YtickSpacing*i), x, (cheight/line)*i + y);
		if(i != 0) {
			ctx.beginPath();
			ctx.moveTo(x, (cheight/line)*i + y);
			ctx.lineTo(cwidth + x, (cheight/line)*i + y);
			ctx.strokeStyle = '#e6e6e6';
			ctx.lineWidth = 1;
			ctx.stroke();
		}
	}
	for (var i = 1; i <= XmaxPoint / XtickSpacing; i++) {
		var line = XmaxPoint / XtickSpacing;
		
		ctx.font = '12px Arial';
		ctx.textAlign = 'center';
		ctx.fillStyle = '#333333';
		ctx.textBaseline = 'bottom';
		var number = Math.round((XtickSpacing*i)*10)/10;
		ctx.fillText(number,(cwidth/line)*i + x, y + cheight +15);
		
		ctx.beginPath();
		ctx.moveTo((cwidth/line)*i + x, y);
		ctx.lineTo((cwidth/line)*i + x, y + cheight);
		ctx.strokeStyle = '#e6e6e6';
		ctx.lineWidth = 1;
		ctx.stroke();
	}
	// copyright
	ctx.font = '12px Arial';
	ctx.textAlign = 'left';
	ctx.fillStyle = '#CECECE';
	ctx.fillText("© Ghost0817",x +10, cheight);
	
  	// get text x asix
	if (option.xAxis.title.text != null) {
		ctx.font = 'bold 14px Arial';
		ctx.textAlign = 'center';
		ctx.fillStyle = '#000';
		ctx.fillText(option.xAxis.title.text,width / 2, height - 10);
	}
	// get text y asix
	if (option.yAxis.title.text != null) {
		ctx.rotate( (Math.PI / 180) * 90);
		ctx.font = 'bold 14px Arial';
		ctx.textAlign = 'center';
		ctx.fillStyle = '#000';
		ctx.fillText(option.yAxis.title.text,height / 2, -5);
	}
	ctx.rotate( (Math.PI / 180) * 270);
};

function niceNum(range, round) {
    var exponent; /** exponent of range */
    var fraction; /** fractional part of range */
    var niceFraction; /** nice, rounded fraction */
    
    var log10Range = Math.log(range) / Math.log(10);
    exponent = Math.floor(log10Range);
    fraction = range / Math.pow(10, exponent);
 
        if (round) {
                if (fraction < 1.5)
                    niceFraction = 1;
                else if (fraction < 3)
                    niceFraction = 2;
                else if (fraction < 7)
                    niceFraction = 5;
                else
                    niceFraction = 10;
        } else {
                if (fraction <= 1)
                    niceFraction = 1;
                else if (fraction <= 2)
                    niceFraction = 2;
                else if (fraction <= 5)
                    niceFraction = 5;
                else
                    niceFraction = 10;
        }
        return niceFraction * Math.pow(10, exponent);
}
function formatMoney(num){
	var p = num.toFixed(2).split(".");
    return (p[0].split("").reverse().reduce(function(acc, num, i, orig) {
        return  num + (i && !(i % 3) ? "," : "") + acc;
    }, "") + "." + p[1]).replace('.00','');
}

function splitString(stringToSplit, separator) {
  var arrayOfStrings = stringToSplit.split(separator);
  if (arrayOfStrings.length == 1)
	arrayOfStrings[1] = '00₮';
  return arrayOfStrings;
}
//Энэ урт хэмжээний тоог байгасгаж үсгээр орлуулж байгаа хэсэг
function nFormatter(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'G';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num;
}