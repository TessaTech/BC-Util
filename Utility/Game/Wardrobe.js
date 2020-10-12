"use strict";

if(Utility == undefined)
{
	var Utility = {}
}
if(Utility.Game == undefined)
{
	Utility.Game = {}
}

Utility.Game.Wardrobe = class
{
	// originalSize = 0
	// functionCallHooks = {}

	constructor()
	{
		this.originalSize = this.GetSize()

		this.functionCallHooks = {}
		this.functionCallHooks.WardrobeFastLoad = new Utility.FunctionCallHook('WardrobeFastLoad')
		this.functionCallHooks.WardrobeFastSave = new Utility.FunctionCallHook('WardrobeFastSave')
	}

	RegisterEventWardrobeLoad(eventHandler)
	{
		return this.functionCallHooks.WardrobeFastLoad.RegisterEventAfter(eventHandler)
	}

	UnregisterEventWardrobeLoad(eventId)
	{
		this.functionCallHooks.WardrobeFastLoad.UnregisterEventAfter(eventId)
	}

	RegisterEventWardrobeSave(eventHandler)
	{
		return this.functionCallHooks.WardrobeFastSave.RegisterEventAfter(eventHandler)
	}

	UnregisterEventWardrobeSave(eventId)
	{
		this.functionCallHooks.WardrobeFastSave.UnregisterEventAfter(eventId)
	}

	GetOriginalSize()
	{
		return this.originalSize
	}

	GetSize()
	{
		return WardrobeSize
	}
	
	SetSize(newWardrobeSize)
	{
		WardrobeSize = newWardrobeSize
	}

	GetEntryByName(wardrobeEntryName)
	{
		let wardrobeEntryId = -1

		wardrobeEntryId = Player.WardrobeCharacterNames.findIndex(x => x == wardrobeEntryName)
		return this.GetEntry(wardrobeEntryId)
	}

	SetEntryByName(wardrobeEntryName, newEntry)
	{
		let wardrobeEntryId = -1

		wardrobeEntryId = Player.WardrobeCharacterNames.findIndex(x => x == wardrobeEntryName)
		this.SetEntry(wardrobeEntryId, newEntry)
	}

	GetEntry(wardrobeEntryId)
	{
		if(wardrobeEntryId >= Player.Wardrobe.length)
		{
			return null
		}
		return Player.Wardrobe[wardrobeEntryId]
	}

	SetEntry(wardrobeEntryId, newEntry)
	{
		if(wardrobeEntryId >= WardrobeSize)
		{
			return null
		}
		Player.Wardrobe[wardrobeEntryId] = newEntry
	}

	GetEntryName(wardrobeEntryId)
	{
		if(wardrobeEntryId >= Player.WardrobeCharacterNames.length)
		{
			return null
		}
		return Player.WardrobeCharacterNames[wardrobeEntryId]
	}

	SetEntryName(wardrobeEntryId, newName)
	{
		if(wardrobeEntryId >= WardrobeSize)
		{
			return null
		}
		Player.WardrobeCharacterNames[wardrobeEntryId] = newName
	}

	Save()
	{
		ServerSend("AccountUpdate", { Wardrobe: CharacterCompressWardrobe(Player.Wardrobe) });
	}

}
