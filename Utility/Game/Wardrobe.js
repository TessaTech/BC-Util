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
		if(typeof WardrobeCharacter != 'undefined' && WardrobeCharacter.length > wardrobeEntryId)
		{
			WardrobeFastLoad(WardrobeCharacter[wardrobeEntryId], wardrobeEntryId)
		}
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
		if(typeof WardrobeCharacter != 'undefined' && WardrobeCharacter.length > wardrobeEntryId)
		{
			WardrobeCharacter[wardrobeEntryId].Name = newName
		}
	}

	Save()
	{
		ServerSend("AccountUpdate", { Wardrobe: CharacterCompressWardrobe(Player.Wardrobe), WardrobeCharacterNames: Player.WardrobeCharacterNames });
	}

	Compress(wardrobe)
	{
		if (Array.isArray(wardrobe) == false || wardrobe.length <= 0)
		{
			return "";
		}

		let compressedWardrobe = [];
		let butProperties;
		for (let i = 0; i < wardrobe.length; i++) // For each wardrobe entry...
		{
			let compressedWardrobeEntry = [];
			if (wardrobe[i] != null)
			{
				for (let j = 0; j < wardrobe[i].length; j++) // For each element in the wardrobe entry...
				{
					butProperties = { }
					if(wardrobe[i][j].Properties != undefined)
					{
						butProperties = wardrobe[i][j].Properties
					}
					compressedWardrobeEntry.push([wardrobe[i][j].Name, wardrobe[i][j].Group, wardrobe[i][j].Color, butProperties]);
				}
			}
			compressedWardrobe.push(compressedWardrobeEntry);
		}
		return LZString.compressToUTF16(JSON.stringify(compressedWardrobe));

	}

	Decompress(wardrobe)
	{
		if (typeof Wardrobe !== "string") // if wardrobe is not a string
		{
			//Assume it's already decompressed and return it
			return wardrobe;
		}

		let compressedWardrobe = JSON.parse(LZString.decompressFromUTF16(wardrobe));
		if (compressedWardrobe == null)
		{
			return []
		}

		let decompressedWardrobe = [];
		for (let i = 0; i < compressedWardrobe.length; i++) // For each wardrobe entry...
		{
			let decompressedWardrobeEntry = [];
			for (let j = 0; j < compressedWardrobe[i].length; j++) // For each element in the wardrobe entry...
			{
				decompressedWardrobeEntry.push({ Name: compressedWardrobe[i][j][0], Group: compressedWardrobe[i][j][1], Color: compressedWardrobe[i][j][2], Properties: compressedWardrobe[i][j][3] });
			}
			decompressedWardrobe.push(decompressedWardrobeEntry);
		}
		
		return decompressedWardrobe;
		
	}

}
