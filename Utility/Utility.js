"use strict";

if(Utility == undefined)
{
	var Utility = {}
}

Utility.Utility = class
{
	constructor()
	{

	}

	static Sleep(milliseconds) {
		return new Promise(resolve => (setTimeout(resolve, milliseconds)));
	}
	 
	static GetRandomNumber(a_Min, a_Max)
	{
		let retVar
		let r = 0
		let min = 0
		let max = 0
		
		//Increas interval for first and last number to give them the  same chance as numbers between
		min = a_Min - 0.5
		max = a_Max + 0.49
		
		if(min > max)
		{
			return 0
		}
		r = Math.random()
		
		retVar = Math.round((r * (max - min)) + min)
		
		if(retVar == -0) // If we got -0
		{
			//Replace it with +0
			retVar = 0
		}
		
		return retVar
	}
	
	static TestGetRandomNumber(min, max)
	{
		var r = 0
		var list = []
		
		list.length = (max-min)+1
		
		var i
		for(i=0; i<list.length; i++)
		{
			//console.log("Init element "+i+"/"+(list.length-1))
			list[i] = 0
		}
		for(i=0; i<10000; i++)
		{
			r = this.GetRandomNumber(min, max)
			list[r-min] = list[r-min] + 1
		}
		console.log(list)
	}
	
	static ShuffleArray(array)
	{
		var retVar = []
		if(array === null || Array.isArray(array) === false || array.length <= 0)
		{
			return []
		}
	
		retVar = [...array]
		for (let i = retVar.length - 1; i > 0; i--)
		{
			const j = Math.floor(Math.random() * (i + 1));
			[retVar[i], retVar[j]] = [retVar[j], retVar[i]];
		}
		return retVar
	}
	
	static GetTime()
	{
		var d = new Date()
		return d.getTime()
	}

}

Number.prototype.zeroPadding = function(size)
{
	var s = ""
	
	s = String(this);
	while (s.length < (size || 2))
	{
		s = "0" + s;
	}
	
	return s;
}
