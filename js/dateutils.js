// utility functions that do stuff with dates
define(function(){
	
		//given a date return the day of the year
		function getDayOfYear(date){
			var firstJan = new Date(date.getFullYear(),0,1);
			return Math.ceil((date - firstJan)/86400000);
		}
		
		//given the day of the year return the date
		function dayToDate(dayOfTheYear, year){
			var d = new Date(year, 0, 1);
			var ms = d.getTime() + dayOfTheYear * 86400000
			return new Date(ms);
		}

		//given a number of minutes from mindight, return the time in hours and minutes
		function minutesToTime(minOfTheDay){
			var h = Math.floor(minOfTheDay/60);
			var m = minOfTheDay - h*60;
			return {
				hours:h,
				minutes:m
			};
		}
		
		return{
			getDayOfYear:getDayOfYear,
			dayToDate:dayToDate,
			minutesToTime:minutesToTime
		};
	});