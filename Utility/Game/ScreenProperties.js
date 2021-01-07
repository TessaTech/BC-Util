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
		this.onlineProfileAttributes = { }

		this.eventAppearanceEnteredClothSelection = new Utility.Event()
		this.eventScreenChanged = new Utility.Event()
		this.eventDescriptionChangeClicked = new Utility.Event()

		this.functionCallHooks = { }
		this.functionCallHooks.AppearanceClick = new Utility.FunctionCallHook('AppearanceClick')
		this.functionCallHooks.CommonSetScreen = new Utility.FunctionCallHook('CommonSetScreen')
		this.functionCallHooks.OnlineProfileExit = new Utility.FunctionCallHook('OnlineProfileExit')


		let _this = this
		this.functionCallHooks.AppearanceClick.RegisterEventAfter(function(){ _this.OnAppearanceClick(); })
		this.functionCallHooks.CommonSetScreen.RegisterEventAfter(function(){ _this.OnScreenChanged(); })
		this.functionCallHooks.OnlineProfileExit.RegisterEventBefore(function(save){ _this.OnHookOnlineProfileExitBefore(save); })
		this.functionCallHooks.OnlineProfileExit.RegisterEventAfter(function(save){ _this.OnHookOnlineProfileExitAfter(save); })
	}

	OnAppearanceClick()
	{
		if(this.GetCurrentScreen() == "AppearanceCloth" && this.AppearanceFocusGroup() != "")
		{
			this.eventAppearanceEnteredClothSelection.Raise()
		}
	}

	OnScreenChanged()
	{
		this.eventScreenChanged.Raise(CurrentScreen)
	}

	OnHookOnlineProfileExitBefore(save)
	{
		let infoSheetSelection = { }
		this.onlineProfileAttributes = { }

		if(InformationSheetSelection != null)
		{
			infoSheetSelection = InformationSheetSelection
		}
		else
		{
			infoSheetSelection = { ID: -1, Name: "Unknown", MemberNumber: -1}
		}

		let description = ElementValue("DescriptionInput")
		if(description == null)
		{
			description = ""
		}

		this.onlineProfileAttributes.id = infoSheetSelection.ID
		this.onlineProfileAttributes.memberNumber = infoSheetSelection.MemberNumber
		this.onlineProfileAttributes.name = infoSheetSelection.Name
		this.onlineProfileAttributes.save = save
		this.onlineProfileAttributes.description = description

	}

	OnHookOnlineProfileExitAfter(save)
	{
		this.eventDescriptionChangeClicked.Raise(this.onlineProfileAttributes)

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

	GetDescriptionCharacter()
	{
		return InformationSheetSelection;
	}

	RegisterEventAppearanceEnteredClothSelection(eventHandler)
	{
		return this.eventAppearanceEnteredClothSelection.Register(eventHandler)
	}

	UnregisterEventAppearanceEnteredClothSelection(eventId)
	{
		return this.eventAppearanceEnteredClothSelection.Unregister(eventId)
	}

	RegisterEventScreenChanged(eventHandler)
	{
		return this.eventScreenChanged.Register(eventHandler)
	}

	UnregisterEventScreenChanged(eventId)
	{
		return this.eventScreenChanged.Unregister(eventId)
	}

	RegisterEventDescriptionChangeClicked(eventHandler)
	{
		return this.eventDescriptionChangeClicked.Register(eventHandler)
	}

	UnregisterEventDescriptionChangeClicked(eventId)
	{
		this.eventDescriptionChangeClicked.Unregister(eventId)
	}

}
