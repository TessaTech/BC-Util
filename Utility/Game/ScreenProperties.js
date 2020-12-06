"use strict";

if(Utility == undefined)
{
	var Utility = {}
}
if(Utility.Game == undefined)
{
	Utility.Game = {}
}

Utility.Game.ScreenProperties = class
{
	constructor()
	{
		this.eventAppearanceEnteredClothSelection = new Utility.Event()
		this.functionCallHooks = { }
		this.functionCallHooks.AppearanceClick = new Utility.FunctionCallHook('AppearanceClick')

		let _this = this
		this.functionCallHooks.AppearanceClick.RegisterEventAfter(function(){ _this.OnAppearanceClick(); })
	}

	OnAppearanceClick()
	{
		if(this.GetCurrentScreen() == "AppearanceCloth" && this.AppearanceFocusGroup() != "")
		{
			this.eventAppearanceEnteredClothSelection.Raise()
		}
	}

	GetCurrentScreen()
	{
		let retVar = CurrentScreen

		if(retVar == "Appearance")
		{
			retVar += CharacterAppearanceMode;
		}

		return retVar
	}

	AppearanceCharacter()
	{
		return CharacterAppearanceSelection
	}

	AppearanceFocusGroup()
	{
		if(this.AppearanceCharacter() == null || this.AppearanceCharacter().FocusGroup == null)
		{
			return ""
		}
		return this.AppearanceCharacter().FocusGroup.Name
	}

	RegisterEventAppearanceEnteredClothSelection(eventHandler)
	{
		return this.eventAppearanceEnteredClothSelection.Register(eventHandler)
	}

	UnregisterEventAppearanceEnteredClothSelection(eventId)
	{
		return this.eventAppearanceEnteredClothSelection.Unregister(eventId)
	}

}
