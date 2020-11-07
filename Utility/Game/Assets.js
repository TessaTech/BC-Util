"use strict";

if(Utility == undefined)
{
	var Utility = {}
}
if(Utility.Game == undefined)
{
	Utility.Game = {}
}

Utility.Game.Assets = class
{
	constructor()
	{

	}

	GetAsset(itemName, itemGroup)
	{
		return Asset.find(x => ((x.Name == itemName) && (x.Group.Name == itemGroup)))
	}

	ItemIsOwnerOnly(item)
	{
		var lock = null
		
		lock = this.GetLockByItem(item)
		
		return ((item != null && item.OwnerOnly == true) || item.LoverOnly)
	}
	
	ItemIsLoverOnly(item)
	{
		var lock = null

		lock = this.GetLockByItem(item)
		
		return ((lock != null && lock.LoverOnly == true) || item.LoverOnly)
	}
	
	ItemIsOwnerLoverOnly(item)
	{
		return this.ItemIsOwnerOnly(item) == true || this.ItemIsLoverOnly(item) == true
	}

}
