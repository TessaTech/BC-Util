"use strict";

if(Utility == undefined)
{
	var Utility = {}
}
if(Utility.Game == undefined)
{
	Utility.Game = {}
}

Utility.Game.Characters = class
{
	// assets = null
	// appearance = null

	constructor(initAssets)
	{
		this.gameAssets = initAssets
		
		this.loginAttributes = { }

		this.functionCallHooks = {}
		this.functionCallHooks.LoginResponse = new Utility.FunctionCallHook('LoginResponse')

		this.eventLogin = new Utility.Event()

		let _this = this
		this.functionCallHooks.LoginResponse.RegisterEventBefore(function(characterData){ _this.OnHookLoginResponseBefore(characterData); })
		this.functionCallHooks.LoginResponse.RegisterEventAfter(function(characterData){ _this.OnHookLoginResponseAfter(characterData); })

	}

	RegisterEventLogin(eventHandler)
	{
		return this.eventLogin.Register(eventHandler)
	}

	UnregisterEventAfterLogin(eventId)
	{
		this.eventLogin.Unregister(eventId)
	}

	//EngineUtility
	GetCharacters()
	{
		return Character
	}

	GetChatroomCharacters()
	{
		return ChatRoomCharacter
	}

	GetPlayer()
	{
		return Player
	}

	GetCharacterByMNr(memberNumber)
	{
		return this.GetCharacters().find(x => (x.MemberNumber === memberNumber))
	}

	GetChatroomCharacterByMNr(memberNumber)
	{
		return this.GetChatroomCharacters().find(x => (x.MemberNumber === memberNumber))
	}

	//Appearance
	ChangeAppearance(player, itemGroup, itemAsset, properties, newColor, difficulty, refresh)
	{
		// Sets the difficulty factor
		if (newColor == null) { newColor = itemAsset.Group.ColorSchema[0]; }
		if (difficulty == null) { difficulty = 0; }
		if (refresh == null) { refresh = true; }
	
		// Removes the previous if we need to
		var itemPositionId = CharacterAppearanceGetCurrentValue(player, itemGroup, "ID");
		if (itemPositionId != "None")
		{
			player.Appearance.splice(itemPositionId, 1);
		}
	
		// Add the new item to the character appearance
		if (itemAsset !== null)
		{
			var newItem = null
			var newDifficulty = 0
			
			if(itemAsset.Difficulty != null)
			{
				newDifficulty = parseInt(itemAsset.Difficulty, 10)
			}
			newDifficulty = newDifficulty  + difficulty
	
			newItem = {
				Asset: itemAsset,
				Difficulty: newDifficulty,
				Color: newColor
			}
			if (properties !== null) // If properties are passed...
			{
				//Add them
				newItem.Property = properties;
			}
			player.Appearance.push(newItem);
		}
	
		// Draw the character canvas and calculate the effects on the character
		if (refresh === true) { CharacterRefresh(player); }
	
	}

	SetLayerPriority(player, assetGroup, priority, chatRoomUpdate)
	{
		if (player == null) { return false; }
		if (assetGroup == null) { return false; }
		if (priority == null) { return false; }
		if(chatRoomUpdate == null) { chatRoomUpdate = false; }

		let item = this.GetItem(player, assetGroup)
		if(item == null) { return false; }

		if (item.Property == null) 
		{
			item.Property = { }
		}
	 
		item.Property.OverridePriority = priority
		CharacterRefresh(player)
		if(chatRoomUpdate == true)
		{
			ChatRoomCharacterUpdate(player)
		}

		return true;

	}

	SetLayerPrioritySelf(assetGroup, priority)
	{
		return this.SetLayerPriority(Player, assetGroup, priority)
	}

	SetLayerPriorityByMNr(memberNumber, assetGroup, priority)
	{
		var bufPlayer = null
	
		bufPlayer = this.GetCharacterByMNr(memberNumber)
		return this.SetLayerPriority(bufPlayer, assetGroup, priority)
	}

	GetLayerPriority(player, assetGroup)
	{
		let retVar = 0

		if (player == null) { return 0; }
		if (assetGroup == null) { return 0; }

		let item = this.GetItem(player, assetGroup)
		if(item == null) { return 0; }

		if (item.Property != null && item.Property.OverridePriority != null) 
		{
			retVar = item.Property.OverridePriority
		}
		else
		{
			let item = this.GetItem(player, assetGroup)
			if(item == null)
			{
				retVar = 0
			}
			if(item.Asset != null && item.Asset.DrawingPriority != null)
			{
				retVar = item.Asset.DrawingPriority
			}
			else
			{
				retVar = this.gameAssets.GetAssetGroupPriority(assetGroup)
			}
		}

		return retVar

	}

	GetLayerPrioritySelf(assetGroup)
	{
		return this.GetLayerPriority(Player, assetGroup)
	}

	GetLayerPriorityByMNr(memberNumber, assetGroup)
	{
		var bufPlayer = null
	
		bufPlayer = this.GetCharacterByMNr(memberNumber)
		return this.GetLayerPriority(bufPlayer, assetGroup)
	}

	//Tie
	TiePlayerIfPossible(player, item, properties, itemGroup, itemColor, difficulty)
	{
		let retVar;
		let currentItem1;
		let currentItem2;
		let currentItem3;

		retVar = false
		if(retVar == false && itemGroup == "ItemMouth")
		{
			currentItem1 = this.GetItem(player, "ItemMouth")
			currentItem2 = this.GetItem(player, "ItemMouth2")
			currentItem3 = this.GetItem(player, "ItemMouth3")

			if(currentItem1 == null && currentItem2 == null && currentItem3 == null)
			{
				retVar = true
			}
			else
			{
				itemGroup = "ItemMouth2"
			}
		}
		if(retVar == false && itemGroup == "ItemMouth2")
		{
			currentItem1 = this.GetItem(player, "ItemMouth2")
			currentItem2 = this.GetItem(player, "ItemMouth3")

			if(currentItem1 == null && currentItem2 == null)
			{
				retVar = true
			}
			else
			{
				itemGroup = "ItemMouth3"
			}
		}
		if(retVar == false)
		{
			currentItem1 = this.GetItem(player, itemGroup)

			if(currentItem1 == null)
			{
				retVar = true
			}
		}
		
		if(retVar == true)
		{
			this.TiePlayer(player, item, properties, itemGroup, itemColor, difficulty)
		}

		return retVar;

	}

	TieSelfIfPossible(a_Item, properties, a_ItemGroup, ItemColor, Difficulty)
	{
		return this.TiePlayerIfPossible(Player, a_Item, properties, a_ItemGroup, ItemColor, Difficulty)
	}
	
	TiePlayerByMNrIfPossible(memberNumber, a_Item, properties, a_ItemGroup, ItemColor, Difficulty)
	{
		var bufPlayer = null
	
		bufPlayer = this.GetCharacterByMNr(memberNumber)
		return this.TiePlayerIfPossible(bufPlayer, a_Item, properties, a_ItemGroup, ItemColor, Difficulty)
	}

	TiePlayer(player, item, properties, itemGroup, itemColor, difficulty)
	{
		let itemAsset = null
	
		if(difficulty == null)
		{
			let bufSkill = Player.Skill.find(x => x.Type === "Bondage") // Use skill of Player(Tying) as default value, not skill of player(Tied)
			if(bufSkill != null && bufSkill.Level != null)
			{
				difficulty = bufSkill.Level
			}
			else
			{
				difficulty = 0
			}
		}
	
		itemAsset = this.gameAssets.GetAsset(item, itemGroup)
		if(itemAsset == null)
		{
			return false
		}
	
		if((itemColor == null) || (itemColor == "Default"))
		{
			itemColor = itemAsset.DefaultColor
		}
		this.ChangeAppearance(player, itemGroup, itemAsset, properties, itemColor, difficulty, true);
		InventoryExpressionTrigger(player, this.GetItem(player, itemGroup));
	
		//InventoryWear(player, item, a_ItemGroup, itemColor, difficulty)
		//CharacterRefresh(player, false)
		this.CharacterItemUpdate(player, itemGroup)
	
		return true
	}
	
	//ModTieSelf("LeatherAnkleCuffs",{Restrain:"Closed",SetPose:["LegsClosed"],Effect:["Prone","Freeze"],Difficulty:6},"ItemFeet")
	//Todo: Test: Mod.TieSelf("LeatherAnkleCuffs", {Restrain: "Closed", Effect: ["Prone","Freeze"], SetPose: ["LegsClosed"]}, "ItemFeet")
	TieSelf(a_Item, properties, a_ItemGroup, ItemColor, Difficulty)
	{
		this.TiePlayer(Player, a_Item, properties, a_ItemGroup, ItemColor, Difficulty)
	}
	
	TiePlayerByMNr(memberNumber, a_Item, properties, a_ItemGroup, ItemColor, Difficulty)
	{
		var bufPlayer = null
	
		bufPlayer = this.GetCharacterByMNr(memberNumber)
		this.TiePlayer(bufPlayer, a_Item, properties, a_ItemGroup, ItemColor, Difficulty)
	}
	
	ChangeDifficulty(player, itemGroup, difficulty)
	{
		var item = null
		//InventorySetDifficulty(player, itemGroup, difficulty)
		
		item = this.GetItem(player, itemGroup)
		if(item === null)
		{
			return
		}
		
		if (difficulty < 0)	{ difficulty = 0; }
		else if (difficulty > 100) { difficulty = 100; }
		console.log(item)
		item.Difficulty = item.Asset.Difficulty + difficulty;
		if (CurrentScreen == "ChatRoom")
		{
			this.CharacterItemUpdate(player, itemGroup)
		}
		
	}
	
	ChangeDifficultyByMNr(memberNumber, itemGroup, difficulty)
	{
		var bufPlayer = null
	
		bufPlayer = this.GetCharacterByMNr(memberNumber)
		this.ChangeDifficulty(bufPlayer, itemGroup, difficulty)
		
	}
	
	//Bondage Checks
	GetItem(player, itemGroup)
	{
		return InventoryGet(player, itemGroup)
	}
	
	GetItemSelf(itemGroup)
	{
		return InventoryGet(Character[0], itemGroup)
	}
	
	GetItemByMNr(memberNumber, itemGroup)
	{
		var bufPlayer = null
	
		bufPlayer = this.GetCharacterByMNr(memberNumber)
		return this.GetItem(bufPlayer, itemGroup)
	}
	
	GetLockByItem(item)
	{
		return InventoryGetLock(item)
	}
	
	GetLock(player, itemGroup)
	{
		return this.GetLockByItem(this.GetItem(player, itemGroup))
	}
	
	GetLockSelf(player, itemGroup)
	{
		return this.GetLockByItem(this.GetItemSelf(itemGroup))
	}
	
	GetLockByMNr(memberNumber, itemGroup)
	{
		return this.GetLockByItem(this.GetItemByMNr(memberNumber, itemGroup))
	}
	
	IsTied(player, itemGroup)
	{
		return (this.GetItem(player, itemGroup) !== null)
	}
	
	IsTiedSelf(itemGroup)
	{
		return (this.GetItem(Character[0], itemGroup) !== null)
	}
	
	IsTiedByMNr(memberNumber, itemGroup)
	{
		var bufPlayer = null
	
		bufPlayer = this.GetCharacterByMNr(memberNumber)
		
		return this.IsTied(bufPlayer, itemGroup)
	}
	
	IsLocked(player, itemGroup)
	{
		return (this.GetLock(player, itemGroup) !== null)
	}
	
	IsLockedSelf(itemGroup)
	{
		return this.IsLocked(Character[0], itemGroup)
	}
	
	IsLockedByMNr(memberNumber, itemGroup)
	{
		var bufPlayer = null
	
		bufPlayer = this.GetCharacterByMNr(memberNumber)
		
		return this.IsLockedByMNr(bufPlayer, itemGroup)
	}
	
	ItemIsBlocked(player, itemName, itemGroup)
	{
		if(player.BlockItems == null)
		{
			return false;
		}
		
		return (player.BlockItems.find(x => (x.Name == itemName && x.Group == itemGroup)) != null)
	}

	IsAssetPrequisiteSatisfied(player, asset)
	{
		let prequisite = null

		if(asset == null || asset.Prerequisite == null)
		{
			return true;
		}

		prequisite = asset.Prerequisite

		// Prerequisite can be a string, in that case there's only one check
		let msg = "";
		
		// Prerequisite can be an array of strings, in that case we check all items in the array and get the first error message
		if (typeof prequisite === "string")
		{
			msg = InventoryPrerequisiteMessage(player, prequisite);
		}
		else if (Array.isArray(prequisite) == true)
		{
			for (let i = 0; i < prequisite.length; i++)
			{
				msg = InventoryPrerequisiteMessage(player, prequisite[i]);
				if(msg != "")
				{
					i = prequisite.length
				}
			}
		}
	
		return (msg == "");
	
	}

	IsBlockedByOtherItem(player, itemGroup)
	{
		// Items can block each other (hoods blocks gags, belts blocks eggs, etc.)
		var i=0
		var bufAppearance = null
		for (i = 0; i < player.Appearance.length; i++)
		{
			bufAppearance = player.Appearance[i]
			if (bufAppearance.Asset.Group.Clothing != null && (bufAppearance.Asset.Block != null) && (bufAppearance.Asset.Block.includes(itemGroup) == true))
			{
				return true;
			}
			if (bufAppearance.Asset.Group.Clothing != null && (bufAppearance.Property != null) && (bufAppearance.Property.Block != null) && (bufAppearance.Property.Block.indexOf(itemGroup) >= 0))
			{
				return true;
			}
		}
	
		// If another character is enclosed, items other than the enclosing one cannot be used
		if ((player.ID != 0) && player.IsEnclose() == true)
		{
			if(player.Appearance.findIndex(x => (x.Asset.Group.Name == itemGroup && InventoryItemHasEffect(x, "Enclose"))) >= 0)
			{
				return false;
			}
			return true;
		}
	
		// Nothing is preventing the group from being used
		return false;
	
	}

	//Lock
	LockPlayer(player, itemGroup, lock, lockMemberNumber) // lockMemberNumber = null // Is Default when not used
	{
		if(lockMemberNumber === null)
		{
			lockMemberNumber = Character[0].MemberNumber
		}
		
		InventoryLock(player, itemGroup, lock, lockMemberNumber)
		if (CurrentScreen == "ChatRoom")
		{
			this.CharacterItemUpdate(player, itemGroup)
		}
	}
	
	LockSelf(itemGroup, lock, lockMemberNumber) // lockMemberNumber = null // Is Default when not used
	{
		this.LockPlayer(Character[0], itemGroup, lock, lockMemberNumber)
	}
	
	LockPlayerByMNr(memberNumber, itemGroup, lock, lockMemberNumber) // lockMemberNumber = null // Is Default when not used
	{
		var bufPlayer = null
	
		bufPlayer = this.GetCharacterByMNr(memberNumber)
		this.LockPlayer(bufPlayer, itemGroup, lock, lockMemberNumber)
	}
	
	//Combination Lock
	ChangeLockCombination(player, itemGroup, oldCombination, newCombination)
	{
		var lockedItem = null
	
		//Convert numbers to strings
		if(typeof oldCombination == "number") //If old combination is a number...
		{
			//Convert it to string
			oldCombination = oldCombination.toString(10)
		}
		if(typeof newCombination == "number") //If new combination is a number...
		{
			//Convert it to string
			newCombination = newCombination.toString(10)
		}
		
		//Function Guards
		lockedItem = player.Appearance.find(x => (x.Asset.Group.Name === itemGroup))
		if(lockedItem === null)
		{
			console.log("Failed: Lock not found")
			return
		}
		if(lockedItem.Property.LockedBy != "CombinationPadlock")
		{
			console.log("Failed: Lock not a combination lock")
			return
		}
		if (oldCombination !== null && oldCombination != lockedItem.Property.CombinationNumber)
		{
			console.log("Failed: Wrong combination")
			if (CurrentScreen == "ChatRoom")
			{
				dictionary = [];
				dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
				dictionary.push({Tag: "DestinationCharacter", Text: player.Name, MemberNumber: player.MemberNumber});
				dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: itemGroup});
				this.ChatRoomPublishCustomAction("CombinationChangeFail", dictionary, player);
			}
			return
		}
		E = /^[0-9]+$/;
		if ((typeof newCombination != "string") ||
			(typeof newCombination == "string" && newCombination.match(E) === null))
		{
			console.log("Failed: Code is not a number")
			return
		}
		if (newCombination.length != 4)
		{
			console.log("Failed: Code is not 4 digits long")
			return
		}
		
		//Operational Code
		lockedItem.Property.CombinationNumber = newCombination;
		if (CurrentScreen == "ChatRoom")
		{
			dictionary = [];
			dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
			dictionary.push({Tag: "DestinationCharacter", Text: player.Name, MemberNumber: player.MemberNumber});
			dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: itemGroup});
			this.ChatRoomPublishCustomAction("CombinationChangeSuccess", dictionary, player);
			ChatRoomCharacterUpdate(player);
		}
		else
		{
			CharacterRefresh(player);
		}
	}
	
	ChangeLockCombinationSelf(itemGroup, oldCombination, newCombination)
	{
		this.ChangeLockCombination(Character[0], itemGroup, oldCombination, newCombination)
	}
	
	ChangeLockCombinationByMNr(memberNumber, itemGroup, oldCombination, newCombination)
	{
		var bufPlayer = null
	
		bufPlayer = this.GetCharacterByMNr(memberNumber)
		
		this.ChangeLockCombination(bufPlayer, itemGroup, oldCombination, newCombination)
	}
	
	GetLockCombination(player, itemGroup)
	{
		let lockedItem = null
	
		lockedItem = player.Appearance.find(x => (x.Asset.Group.Name === itemGroup))
		if(lockedItem == null)
		{
			console.log("Failed: Lock not found")
			return ""
		}
		if(lockedItem.Property.LockedBy != "CombinationPadlock")
		{
			console.log("Failed: Lock not a combination lock")
			return ""
		}
		return lockedItem.Property.CombinationNumber
	}
	
	GetLockCombinationSelf(itemGroup)
	{
		return this.GetLockCombination(Character[0], itemGroup)
	}
	
	GetLockCombinationByMNr(memberNumber, itemGroup)
	{
		var bufPlayer = null
	
		bufPlayer = this.GetCharacterByMNr(memberNumber)
		
		return this.GetLockCombination(bufPlayer, itemGroup)
	}
	
	RandomizeLockCombination(a_Player, itemGroup, a_OldCombination, a_NoReturn)
	{
		var newCombination = null
	
		newCombindation = this.GetRandomNumber(0, 9999).zeroPadding(4)
		this.ChangeLockCombination(a_Player, itemGroup, a_OldCombination, newCombindation)
		
		if(a_NoReturn === true)
		{
			return ""
		}
		return newCombindation
	}
	
	RandomizeLockCombinationSelf(itemGroup, a_OldCombination, a_NoReturn)
	{
		return this.RandomizeLockCombination(Character[0], itemGroup, a_OldCombination, a_NoReturn)
	}
	
	RandomizeLockCombinationByMNr(memberNumber, itemGroup, a_OldCombination, a_NoReturn)
	{
		var bufPlayer = null
	
		bufPlayer = this.GetCharacterByMNr(memberNumber)
		
		return this.RandomizeLockCombination(bufPlayer, itemGroup, a_OldCombination, a_NoReturn)
	}
	
	//Release
	ReleasePlayer(player, itemGroup)
	{
		InventoryRemove(player, itemGroup)
		this.CharacterItemUpdate(player, itemGroup)
	
	}
	
	ReleaseSelf(itemGroup)
	{
		this.ReleasePlayer(Character[0], itemGroup)
	}
	
	ReleasePlayerByMNr(memberNumber, itemGroup)
	{
		var bufPlayer = null
	
		bufPlayer = this.GetCharacterByMNr(memberNumber)
		
		this.ReleasePlayer(bufPlayer, itemGroup)
	}
	
	ReleasePlayerFull(player, withNeck, withBreasts, withPelvis)
	{	
		if(withNeck == null) { withNeck = false; }
		if(withBreasts == null) { withBreasts = false; }
		if(withPelvis == null) { withPelvis = false; }
	
		this.ReleasePlayer(player, "ItemAddon")
		this.ReleasePlayer(player, "ItemHead")
		this.ReleasePlayer(player, "ItemEars")
		this.ReleasePlayer(player, "ItemMouth")
		this.ReleasePlayer(player, "ItemMouth2")
		this.ReleasePlayer(player, "ItemMouth3")
		this.ReleasePlayer(player, "ItemNeckAccessories")
		if(withNeck == true) { this.ReleasePlayer(player, "ItemNeck"); }
		this.ReleasePlayer(player, "ItemNeckRestraints")
		this.ReleasePlayer(player, "ItemNipplesPiercings")
		this.ReleasePlayer(player, "ItemNipples")
		if(withBreasts == true) { this.ReleasePlayer(player, "ItemBreast"); }
		this.ReleasePlayer(player, "ItemArms")
		this.ReleasePlayer(player, "ItemHands")
		this.ReleasePlayer(player, "ItemTorso")
		if(withPelvis == true) { this.ReleasePlayer(player, "ItemPelvis"); }
		this.ReleasePlayer(player, "ItemVulvaPiercings")
		this.ReleasePlayer(player, "ItemVulva")
		this.ReleasePlayer(player, "ItemButt")
		this.ReleasePlayer(player, "ItemLegs")
		this.ReleasePlayer(player, "ItemFeet")
		this.ReleasePlayer(player, "ItemBoots")
		this.ReleasePlayer(player, "ItemDevices")
		
	}
	
	ReleasePlayerFullByMNr(memberNumber, withNeck, withBreasts, withPelvis)
	{	
		var bufPlayer = null
	
		bufPlayer = this.GetCharacterByMNr(memberNumber)
		
		this.ReleasePlayerFull(bufPlayer, withNeck, withBreasts, withPelvis)
		
	}
	
	Safeword()
	{	
		this.ReleasePlayerFull(Player, false, false, false)
		
	}
	
	//Unlock
	UnlockPlayer(player, itemGroup)
	{
		InventoryUnlock(player, itemGroup)
		this.CharacterItemUpdate(player, itemGroup)
	}
	
	UnlockSelf(itemGroup)
	{
		this.UnlockPlayer(Character[0], itemGroup)
	}
	
	UnlockPlayerByMNr(memberNumber, itemGroup)
	{
		var bufPlayer = null
	
		bufPlayer = this.GetCharacterByMNr(memberNumber)
		
		this.UnlockPlayer(bufPlayer, itemGroup)
	}

	//Arousal
	ChangeArousal(player, difference)
	{
		var newArousal = 0
		
		newArousal = player.ArousalSettings.Progress + difference
		if(newArousal < 0) { newArousal = 0; }
		else if(newArousal > 100) { newArousal = 100; }
		
		ActivitySetArousal(player, newArousal)
		ActivityChatRoomArousalSync(player)
	}
	
	ChangeArousalSelf(difference)
	{
		this.ChangeArousal(Character[0])
	}
	
	ChangeArousalByMNr(memberNumber, difference)
	{
		var bufPlayer = null
	
		bufPlayer = this.GetCharacterByMNr(memberNumber)
		
		this.ChangeArousal(bufPlayer, difference)
	}

	//Skill Modifier
	ChangeSkillModifier(modifierLevel)
	{
		var newSkillModifier = 0
		
		newSkillModifier = LogValue("ModifierLevel", "SkillModifier");
		newSkillModifier = newSkillModifier + modifierLevel
		if (newSkillModifier >= SkillModifierMax)
		{
			newSkillModifier = SkillModifierMax
		}
		else if (newSkillModifier < SkillModifierMin)
		{
			newSkillModifier = SkillModifierMin
		}
		LogAdd("ModifierDuration", "SkillModifier", CurrentTime + 3600000); // affects lasts 1 hour
		LogAdd("ModifierLevel", "SkillModifier", newSkillModifier); // alters the skill modifier level
	}

	//Reputation
	ChangeReputation(reputationType, reputationChange)
	{
		var reputation = null
		var newReputation = 0
		
		reputation = Player.Reputation.find(x => (x.Type === reputationType))
		
		newReputation = reputation.Value + reputationChange
		if(newReputation < -100) { newReputation = -100; }
		else if(newReputation > 100) { newReputation = 100; }
		
		reputation.Value = newReputation
	}

	SetFacialExpression(player, assetGroup, expression, timer)
	{
		if(player == null)
		{
			return
		}
		CharacterSetFacialExpression(player, assetGroup, expression, timer);
	}
	
	SetFacialExpressionByMNr(memberNumber, assetGroup, expression, timer)
	{
		var player = this.GetCharacterByMNr(memberNumber)
		CharacterSetFacialExpression(player, assetGroup, expression, timer);
	}

	CharacterItemUpdate(player, itemGroup)
	{
		if ((CurrentScreen != "ChatRoom") || (itemGroup == null))
		{
			return
		}
		
		let updateData = {};
		let item = this.GetItem(player, itemGroup)
		if(item == null)
		{
			updateData.Target = player.MemberNumber
			updateData.Group = itemGroup
			updateData.Name = undefined
			updateData.Color = "Default"
			updateData.Difficulty = SkillGetWithRatio("Bondage")
			updateData.Property = undefined
		}
		else
		{
			updateData.Target = player.MemberNumber
			updateData.Group = itemGroup
			updateData.Name = item.Asset.Name
			updateData.Color = ((item.Color !== null) ? item.Color : "Default")
			updateData.Difficulty = item.Difficulty - item.Asset.Difficulty
			if(item.Property != null)
			{
				updateData.Property = item.Property
			}
		}
		ServerSend("ChatRoomCharacterItemUpdate", updateData)
	}

	SetDescription(newDescription)
	{
		if(Player.Description != null)
		{
			Player.Description = newDescription
		}
		if(InformationSheetSelection != null && InformationSheetSelection.Description != null)
		{
			InformationSheetSelection.Description = newDescription
		}
		ServerSend("AccountUpdate", { Description: newDescription });
        ChatRoomCharacterUpdate(Player);
	}

	//EventHandlers
	OnHookLoginResponseBefore(characterData)
	{
		if (typeof characterData != "object") // If the response does not contains valid character data...
		{
			//It's a negative response: Login failed
			return;
		}
		if (RelogData != null) //If relog data is not null
		{
			//We're just relogging: No login
			return;
		}

		this.loginAttributes.description = characterData.Description

	}
	
	OnHookLoginResponseAfter(characterData)
	{
		if (typeof characterData != "object") // If the response does not contains valid character data...
		{
			//It's a negative response: Login failed
			return;
		}
		if (RelogData != null) //If relog data is not null
		{
			//We're just relogging: No login
			return;
		}

		this.eventLogin.Raise(this.loginAttributes)

	}

}
