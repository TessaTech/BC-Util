"use strice";

if(WardrobeUtilities == undefined)
{
	var WardrobeUtilities = {}
}

WardrobeUtilities.WardrobeUtilities = class
{
	// gameWardrobe = null
	// storageEntryKey = ""

	constructor(initGameWardrobe, initGameCharacters, initNewWardrobeSize)
	{
		this.gameWardrobe = initGameWardrobe
		this.gameCharacters = initGameCharacters
		this.storageEntryKey = ""

		this.gameWardrobe.SetSize(initNewWardrobeSize)

		let _this = this
		this.gameWardrobe.RegisterEventWardrobeLoad(function(character, wardrobeSlot, pushedToServer){ _this.OnWardrobeLoad(character, wardrobeSlot, pushedToServer); })
		this.gameWardrobe.RegisterEventWardrobeSave(function(character, wardrobeSlot, pushedToServer){ _this.OnWardrobeSave(character, wardrobeSlot, pushedToServer); })
	}

	GetStorageEntryKey()
	{
		if(this.storageEntryKey == "")
		{
			this.storageEntryKey = "WardrobeUtilities.MemberNumber_" + this.gameCharacters.GetPlayer().MemberNumber + ".EntryPackages"
		}
		return this.storageEntryKey
	}

	Save()
	{
		let entryPackages
		entryPackages = this.PackAll()
		localStorage.setItem(this.GetStorageEntryKey(), JSON.stringify(entryPackages))
		this.gameWardrobe.Save()
	}

	Load()
	{
		let entryPackList
		let originalWardrobeSize

		entryPackList = JSON.parse(localStorage.getItem(this.GetStorageEntryKey()))
		originalWardrobeSize = this.gameWardrobe.GetOriginalSize()

		if(entryPackList != null && Array.isArray(entryPackList))
		{
			for(let i=0; i<entryPackList.length; i++)
			{
				if(this.gameWardrobe.GetEntry(i) == null)
				{
					this.UnpackEntry(i, entryPackList[i])
				}
			}
		}
	}

	PackEntry(wardrobeEntryId)
	{
		let entryName
		let entryData

		entryName = this.gameWardrobe.GetEntryName(wardrobeEntryId)
		entryData = this.gameWardrobe.GetEntry(wardrobeEntryId)

		return new WardrobeUtilities.EntryPack(entryName, entryData)

	}

	UnpackEntry(wardrobeEntryId, entryPack)
	{
		this.gameWardrobe.SetEntryName(wardrobeEntryId, entryPack.name)
		this.gameWardrobe.SetEntry(wardrobeEntryId, entryPack.data)

	}

	PackAll()
	{
		let retVar
		let size;

		retVar = []
		size = this.gameWardrobe.GetSize()

		for(let i=0; i<size; i++)
		{
			retVar.push(this.PackEntry(i))
		}

		return retVar

	}

	UnpackAll(entryPackList)
	{
		for(let i=0; i<entryPackList.length; i++)
		{
			this.UnpackEntry(i, entryPackList[i])
		}
		this.gameWardrobe.Save()

	}

	OnWardrobeLoad(character, wardrobeSlot, pushedToServer)
	{
		this.Load()
	}

	OnWardrobeSave(character, wardrobeSlot, pushedToServer)
	{
		this.Save()
	}

}

WardrobeUtilities.EntryPack = class
{
	// name = ""
	// data = null

	constructor(initName, initData)
	{
		this.name = initName
		this.data = initData
	}
}
