/////
//Day
/////
(function(window) {

//constructor
	function CalendarDay(date, dim, colour, stroke) {
		this.stroke = '#000';
		this.colour = '#FFF';
		this.initialize(date, dim, colour, stroke);
	}
	var p = CalendarDay.prototype = new Shape();
	p.Shape_initialize = p.initialize;	//save "super" initialise

	p.initialize = function(date, dim, colour, stroke){
		this.Shape_initialize(); // super call
		this.dim = dim;
		this.date = new Date(date.getTime());
		if(colour){this.colour = colour;}
		if(stroke){this.stroke = stroke;}
		this.name = this.date;
		this.setColour();
	}
	
//handle drawing a day
	p.setColour = function(fillCol, strokeCol) {
		if(fillCol){
			this.colour = fillCol;
			if(strokeCol){
				this.stroke = strokeCol;
			}
		}
		this.graphics.clear();
		this.graphics.beginStroke(this.stroke).beginFill(this.colour).drawRect(0, 0, this.dim, this.dim);
	}

	window["CalendarDay"] = CalendarDay;
}(window));

//////
//year
//////
(function(window) {

//constructor
	function Calendar(date, style) {
		this.style = {
			dayDimensions:10,
			daySpacing:2,
			monthSpacing:5,
			normal:{
				stroke:'#000',
				fill:'#FFF'
			},
			highlight:{
				stroke:'#000',
				fill:'#000'
			},
			columns:4
		};
		this.initialize(date, style);
	}

	var p = Calendar.prototype = new Container();

	p.Container_initialize = p.initialize;	//save "super" initialise

	p.initialize = function(date, style){
		this.Container_initialize(); // super call
		this.updated = new signals.Signal();
		this.selected_day = "";
		this.days = {}; //this will contain all the day graphic objects for ease of access
		if(style){
			this.style = this.setOpts(style, this.style);
		}
		this.date = date;
		this.drawYear();
	}

	p.setOpts = function (source, target){ //set features if they don't exist, don't if they do
		for(opt in target){
			if(source[opt]){
				target[opt] = source[opt];
			}
		}
		return target;
	}

	p.drawYear = function(){
		//starting from january step through the year
		var column = 0;
		var row = 0;
		var monthHeight = (this.style.daySpacing + this.style.dayDimensions) * 6;
		var monthWidth = (this.style.daySpacing + this.style.dayDimensions) * 7;

		for (var month = 0; month < 12; month++) {
			var d = new Date(this.date.getFullYear(), month);
			var m = this.drawMonth(d);
			this.addChild(m);
			m.x = column * (monthWidth + this.style.monthSpacing) + 0.5;
			m.y = row * (monthHeight + this.style.monthSpacing) + 0.5;
			column ++;
			if(column == this.style.columns){
				column = 0;
				row++;
			}
		}
		if (this.date){
			this.updateDisplayDate();
		}
	}

	p.drawMonth = function(d){
		var month_view = new Container();
		
		var month = d.getMonth(); 
		var year = d.getFullYear();
		//get the first and last days of the month
		var lastDay = new Date(year, month + 1, 0);
		var currentDay = new Date(year, month, 1); //start at the first day
		//for each day of the month create and attach a new day object
		var currentDay = new Date(year, month, 1);
		var dayNumber = 1;
		var yPos = 0;
		var xPos = 0;

		while(currentDay.getTime() <= lastDay.getTime()){
				//make the day object
				xPos = (this.style.dayDimensions + this.style.daySpacing) * currentDay.getDay();
				this.width = Math.max(this.width, xPos + this.style.dayDimensions);
				if(dayNumber >= 1 && currentDay.getDay() == 0){
					yPos += (this.style.dayDimensions + this.style.daySpacing);
					this.height = yPos + this.style.dayDimensions;
				}
				var day_id = month + '_' + dayNumber;
				var new_day = new CalendarDay(currentDay, this.style.dayDimensions, this.style.fill, this.style.stroke);
				this.days[day_id] = new_day;
				month_view.addChild(new_day);

				this.days[day_id].setTransform(xPos,yPos);
				this.days[day_id].onMouseOver = this.mouseOverDay;
				this.days[day_id].onClick = this.mouseClickDay;
				dayNumber ++;
				currentDay.setDate(currentDay.getDate() + 1);
		}
		return month_view;
	}

	p.updateDisplayDate = function(){
		console.log("updateDisplayDate");
		console.log(this.date);
		var day_id = this.date.getMonth() + '_' + this.date.getDate();
		console.log(this.date + ' > ' + day_id);
		//set currently highlited to normal
		if(this.selected_day != ""){
			this.days[this.selected_day].setColour(this.style.normal.stroke, this.style.normal.fill);
		}
		//set new to highlighted //colour new day
		this.selected_day = day_id;
		this.days[this.selected_day].setColour(this.style.highlight.stroke, this.style.highlight.fill);
	}

	p.mouseOverDay = function(e){
		console.log("mouse over day");
	}

	p.mouseClickDay = function(e){
		console.log("mouse click day");
		console.log(new Date(e.target.date.getTime()));

	}

	p.update = function (d,t){
		t.updated.dispatch(d);
	}
	


	window["Calendar"] = Calendar;
}(window));