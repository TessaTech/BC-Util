"use strict";

if(Gui == undefined)
{
	var Gui = {}
}

Gui.DirectChat = class
{
	constructor(initGameCharacters, initGameUserInterface, initGameFriendList, initBeepMessenger)
	{
		this.gameCharacters = initGameCharacters
		this.gameUserInterface = initGameUserInterface
		this.gameFriendList = initGameFriendList
		this.beepMessenger = initBeepMessenger

		this.onlinePartnerEntries = [ ]
		this.offlinePartnerEntries = [ ]
		this.message = ""
		
		this.colorListElementUnknown = "#F0F0F0"
		this.colorListElementPending = "#C02020"
		this.colorListElementAvailable = "#408040"
		this.colorListElementUnreadMessage = "#F08040"
		this.colorListElementOffline = "#808080"

		this.colorButtonDefault = "White"
		this.colorButtonUnreadMessage = "#F08040"

		this.dropDownPartnerDisplayData = { }
		this.unreadMessageCount = 0

		let chatScreens = [
			"AsylumBedroom", "AsylumEntrance", "AsylumMeeting", "AsylumTherapy",
			"Cafe", "Cell", "ChatRoom", "ChatSearch", "CollegeCafeteria", "CollegeChess", "CollegeDetention", "CollegeEntrance", "CollegeTeacher", "CollegeTennis", "CollegeTheater",
			"DailyJob",
			"Empty",
			"Gambling",
			"Introduction",
			"KidnapLeague",
			"LARP",
			"Magic", "MaidQuarters", "MainHall", "Management", "MovieStudio", 
			"Nursery",
			"Photographic", "Prison", "Private",
			"Shibari", "Shop", "SlaveMarket", "Stable"
			]

		let fontSizePartner = 24
		let fontSizeMessages = 30
		let fontSizeSend = 28

		//Calculate GUI Element Coodinates
		let x = 400
		let y = 70
		let width = 1200
		let height = 725

		let widthPartner = width
		let widthSend = width - 5
		let widthMessages = width

		let heightPartner = 29
		let heightSend = 60
		let heightMessages = height - heightSend - heightPartner

		let xPartner = x
		let xMessages = x
		let xSend = x

		let yPartner = y
		let yMessages = yPartner + heightPartner
		let ySend = yMessages + heightMessages + 1

		//Create GUI Elements
		this.buttonShowHide = this.gameUserInterface.AddButton(15, 905, 60, 60, "", this.colorButtonDefault, "#808080", "Icons/Small/Chat.png", "Direct Chat", chatScreens, true, true)

		this.dropDownPartner = this.gameUserInterface.AddDropDown(xPartner, yPartner, widthPartner, heightPartner, fontSizePartner, [[0, "Blaa"], [1, "BlaBlaa"]], 0, chatScreens, false)
		this.textAreaMessages = this.gameUserInterface.AddHtmlTextArea(xMessages, yMessages, widthMessages, heightMessages, fontSizeMessages, -1, "", chatScreens, false, true)
		//this.textFieldSend = this.gameUserInterface.AddTextField(xSend, ySend, widthSend, heightSend, fontSizeSend, 1000, "", chatScreens, false)
		this.textFieldSend = this.gameUserInterface.AddTextArea(xSend, ySend, widthSend, heightSend, fontSizeSend, 1000, "", chatScreens, false)
		
		//Register Events
		let _this = this
		this.gameFriendList.RegisterEventOnlineFriendsChanged(function(onlineFriends){ _this.OnGameFriendListEventOnlineFriendsChanged(onlineFriends); })
		this.beepMessenger.RegisterEventConversationOpened(function(memberNumber){ _this.OnBeepMessengerConversationOpened(memberNumber); })
		this.beepMessenger.RegisterEventReceivedMessage(function(memberNumber, memberName, messageType, message, messageColor, date){ _this.OnBeepMessengerReceivedMessage(memberNumber, memberName, messageType, message, messageColor, date); })

		this.buttonShowHide.RegisterEventClicked(function(){ _this.OnButtonShowHideClick(); })
		this.dropDownPartner.RegisterEventSelectionChanged(function(newSelectedElement){ _this.OnDropDownPartnerSelectionChanged(newSelectedElement); })
		this.textFieldSend.RegisterEventAccepted(function(newText){ _this.OnTextFieldSendAccepted(newText); })
		
	}

	ClearHtmlTags(text)
	{
		return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

	GetDropDownPartnerDisplayData(memberNumber)
	{
		if(this.dropDownPartnerDisplayData[memberNumber] == null) // If no color has been defined...
		{
			this.dropDownPartnerDisplayData[memberNumber] = { unread: false, color: this.colorListElementUnknown }
		}
		return this.dropDownPartnerDisplayData[memberNumber]
	}

	GetPartnerDifference(partners1, partners2)
	{
		let diff = []
		let found = false

		for(let i=0; i<partners1.length; i++)
		{
			found = false
			for(let j=0; j<partners2.length; j++)
			{
				if(partners1[i].memberNumber == partners2[j].memberNumber)
				{
					found = true
				}
			}
			if(found == false)
			{
				diff.push(partners1[i])
			}
		}

		return diff;
	}

	UpdateDropDownPartner(currentPartnerEntries, force)
	{
		if(this.visible == false)
		{
			return;
		}

		let previouslySelectIndex = this.dropDownPartner.GetSelectedIndex()
		let selectedObject = { memberNumber: -1 }
		let selectIndex = 0

		//Determine previous selection
		selectedObject = this.GetSelectedPartner(previouslySelectIndex)
		if(selectedObject == null)
		{
			selectedObject = { memberNumber: -1 }
		}

		//Detect changes: offline -> online; online -> offline
		// let newOffline = this.onlinePartnerEntries.filter(x => (currentPartnerEntries.findIndex(y => y.memberNumber === x.memberNumber) < 0))
		// let newOnline = currentPartnerEntries.filter(x => (this.onlinePartnerEntries.findIndex(y => y.memberNumber === x.memberNumber) < 0))
		let newOffline = this.GetPartnerDifference(this.onlinePartnerEntries, currentPartnerEntries)
		let newOnline = this.GetPartnerDifference(currentPartnerEntries, this.onlinePartnerEntries)
		this.onlinePartnerEntries = currentPartnerEntries
		
		if(force == false && newOffline.length == 0 && newOnline.length == 0) // If no change happened and a change isn't forced...
		{
			// Do nothing
			return;
		}

		//Update offline partner list
		for(let i=0; i<newOffline.length; i++) // For each now offline partners...
		{
			if(this.beepMessenger.GetMessageHistoryLength(newOffline[i].memberNumber) > 0) // If a communication exists with them...
			{
				//Push them to the offline partner list
				this.offlinePartnerEntries.push(newOffline[i])
			}
		}
		for(let i=0; i<newOnline.length; i++) // For each now online partners...
		{
			//Check if some of them are in the offline partner list
			let index = this.offlinePartnerEntries.findIndex(x => x.memberNumber == newOnline[i].memberNumber)
			if(index >= 0) // If the now online partner is in the offline list...
			{
				//Remove them from the offline partner list
				this.offlinePartnerEntries.splice(index, 1)
			}
		}

		//Generate drop down entry list
		let dropDownEntries = ["<div>None</div>"]
		for(let i=0; i<this.onlinePartnerEntries.length; i++) // For each online partner...
		{
			//Generate entry
			dropDownEntries.push("<div style=background-color:"+this.GetDropDownPartnerDisplayData(this.onlinePartnerEntries[i].memberNumber).color+">" + this.onlinePartnerEntries[i].name+" - "+ this.onlinePartnerEntries[i].memberNumber +" [" + this.onlinePartnerEntries[i].room + "]</div>")
			if(this.onlinePartnerEntries[i].memberNumber == selectedObject.memberNumber) // If the entry was the previously selected one...
			{
				 //Remember the new index
				selectIndex = (dropDownEntries.length - 1)
				console.log("SelectedIndex:"+selectIndex)
			}
		}
		for(let i=0; i<this.offlinePartnerEntries.length; i++) // For each offline partner...
		{
			//Generate entry
			dropDownEntries.push("<div style=background-color:"+this.colorListElementOffline+">" + this.offlinePartnerEntries[i].name+" - "+ this.offlinePartnerEntries[i].memberNumber +" [-Offline-]</div>")
			if(this.offlinePartnerEntries[i].memberNumber == selectedObject.memberNumber) // If the entry was the previously selected one...
			{
				//Remember the new index
				selectIndex = (dropDownEntries.length - 1)
				console.log("SelectedIndex:"+selectIndex)
			}
		}
		
		//Update the drop down list
		this.dropDownPartner.SetObjects(dropDownEntries)
		this.dropDownPartner.SetSelection(selectIndex)
		
	}

	GetSelectedPartner(dropDownIndex)
	{
		if(dropDownIndex <= 0)
		{
			return null;
		}

		let partner = null

		if(dropDownIndex <= this.onlinePartnerEntries.length)
		{
			partner = this.onlinePartnerEntries[dropDownIndex - 1]
		}
		else if(dropDownIndex <= this.onlinePartnerEntries.length + this.offlinePartnerEntries.length)
		{
			partner = this.offlinePartnerEntries[dropDownIndex - this.onlinePartnerEntries.length - 1]
		}

		return partner;

	}

	IsPartnerKnown(memberNumber)
	{
		for(let i=0; i<this.onlinePartnerEntries.length; i++)
		{
			if(this.onlinePartnerEntries[i].memberNumber == memberNumber)
			{
				return true;
			}
		}
		for(let i=0; i<this.offlinePartnerEntries.length; i++)
		{
			if(this.offlinePartnerEntries[i].memberNumber == memberNumber)
			{
				return true;
			}
		}
		
		return false;

	}

	SelectChatPartner(memberNumber)
	{
		this.beepMessenger.Close(memberNumber)
		this.beepMessenger.Open(memberNumber)

		this.message = ""
		let messageHistory = this.beepMessenger.GetMessageHistory(memberNumber)
		for(let i=0; i<messageHistory.length; i++)
		{
			this.message += this.ConstructMessageEntry(messageHistory[i].receiveTime, messageHistory[i].senderMemberNumber, messageHistory[i].senderName, messageHistory[i].messageType, messageHistory[i].message, messageHistory[i].messageColor)
			this.textAreaMessages.SetText(this.message)

		}

		let displayData = this.GetDropDownPartnerDisplayData(memberNumber)
		if(displayData.unread == true)
		{
			displayData.unread = false
			this.unreadMessageCount -= 1
		}

		if(this.beepMessenger.IsPending(memberNumber) == true) // If no color has been defined...
		{
			displayData.color = this.colorListElementPending
		}
		else if(this.beepMessenger.IsOpen(memberNumber) == true) // If no color has been defined...
		{
			displayData.color = this.colorListElementAvailable
		}
		if(this.unreadMessageCount <= 0)
		{
			this.buttonShowHide.colorActive = this.colorButtonDefault
		}
		this.UpdateDropDownPartner(this.onlinePartnerEntries, true)
		this.textAreaMessages.SetText(this.message)
	}

	OnGameFriendListEventOnlineFriendsChanged(onlineFriends)
	{
		this.UpdateDropDownPartner(onlineFriends, false)
	}

	OnButtonShowHideClick()
	{
		this.visible = !this.visible
		if(this.visible == true)
		{
			//Block native game clicks and button press events while in direct chat
			this.gameUserInterface.BlockGameClick()
			this.gameUserInterface.BlockGameKeyDown()

			this.dropDownPartner.Show()
			this.textAreaMessages.Show()
			this.textFieldSend.Show()
			
			this.gameFriendList.QuerryFriendlist()

			let selectedIndex = this.dropDownPartner.GetSelectedIndex()
			let selectedPartner = this.GetSelectedPartner(selectedIndex)
			if(selectedPartner != null)
			{
				this.SelectChatPartner(selectedPartner.memberNumber)
			}

		}
		else
		{
			this.dropDownPartner.Hide()
			this.textAreaMessages.Hide()
			this.textFieldSend.Hide()

			//Allow native game clicks and button press events again
			this.gameUserInterface.AllowGameKeyDown()
			//Note: The next game click will be executed after returning from this event, so to prevent this very button clock from doing unintentional stuff, just the next execution has to be blocked
			this.gameUserInterface.BlockNextGameClick()
		}
	}

	OnDropDownPartnerSelectionChanged(newSelectedElement)
	{
		let selectedIndex = this.dropDownPartner.GetSelectedIndex()
		let selectedPartner = this.GetSelectedPartner(selectedIndex)
		if(selectedPartner == null)
		{
			this.textAreaMessages.SetText("")
			return;
		}
		this.SelectChatPartner(selectedPartner.memberNumber)
	}

	OnTextFieldSendAccepted(newText)
	{
		if(newText == "")
		{
			return;
		}

		let selectedIndex = this.dropDownPartner.GetSelectedIndex()
		let targetPartner = this.GetSelectedPartner(selectedIndex)
		if(targetPartner == null)
		{
			return;
		}

		if(newText.indexOf("**") == 0) // If it's an action...
		{
			newText = newText.substr(2)
			this.beepMessenger.SendAction(targetPartner.memberNumber, newText)
		}
		else if(newText.indexOf("/action ") == 0) // If it's an action...
		{
			newText = newText.substr(8)
			this.beepMessenger.SendAction(targetPartner.memberNumber, newText)
		}
		else if(newText.indexOf("*") == 0) // If it's an emote...
		{
			newText = newText.substr(1)
			if(newText.charAt(0) != "\'" && newText.charAt(0) != "," && newText.charAt(0) != " ")
			{
				newText = " " + newText
			}
			this.beepMessenger.SendEmote(targetPartner.memberNumber, newText)
		}
		else if(newText.indexOf("/me ") == 0) // If it's an emote...
		{
			newText = newText.substr(3)
			this.beepMessenger.SendEmote(targetPartner.memberNumber, newText)
		}
		else // If it's a regular message...
		{
			this.beepMessenger.SendMessage(targetPartner.memberNumber, newText)
		}

		this.textFieldSend.SetText("")
	}

	OnBeepMessengerConversationOpened(memberNumber)
	{
		this.GetDropDownPartnerDisplayData(memberNumber).color = this.colorListElementAvailable
		this.UpdateDropDownPartner(this.onlinePartnerEntries, true)
	}

	OnBeepMessengerReceivedMessage(memberNumber, memberName, messageType, message, messageColor, date)
	{
		let appendMessage = false
		let selectedIndex = this.dropDownPartner.GetSelectedIndex()
		let targetPartner = this.GetSelectedPartner(selectedIndex)

		//appendMessage is true if the chat is visible and we received a message from the currently selected chat partner or the player just sent it
		appendMessage = (this.visible == true &&
						targetPartner != null &&
						(targetPartner.memberNumber == memberNumber) ||
						(this.gameCharacters.GetPlayer().MemberNumber == memberNumber))
		if(appendMessage == true) // If the received message is of the currently selected partner or the player...
		{
			this.message += this.ConstructMessageEntry(date, memberNumber, memberName, messageType, message, messageColor)
			this.textAreaMessages.SetText(this.message)
		}
		else // If the received message is not appended to the current communication log...
		{
			let displayData = this.GetDropDownPartnerDisplayData(memberNumber)
			if(displayData.unread == false)
			{
				displayData.unread = true
				this.unreadMessageCount += 1
			}
			if(this.IsPartnerKnown(memberNumber) == false) // If the current member is unknown...
			{
				//Add to online list until detected as online.
				this.onlinePartnerEntries.push({ memberNumber : memberNumber, name : memberName, room : "-Unknown-" })
			}
			displayData.color = this.colorListElementUnreadMessage
			this.UpdateDropDownPartner(this.onlinePartnerEntries, true)
			this.buttonShowHide.colorActive = this.colorButtonUnreadMessage
		}

	}

	TransparentColor(color)
	{
		let red = color.substring(1, 3)
		let green = color.substring(3, 5)
		let blue = color.substring(5, 7);
		return "rgba(" + parseInt(red, 16) + "," + parseInt(green, 16) + "," + parseInt(blue, 16) + ",0.1)";
	}

	ConstructMessageEntry(date, senderNumber, senderName, messageType, message, messageColor)
	{
		let retVar = ""
		let tmpMessage = this.ClearHtmlTags(message)
		let tmpDate = (date.getMonth()+1).zeroPadding(2)+"."+
						date.getDate().zeroPadding(2)+"."+
						date.getFullYear().zeroPadding(4)+" "+
			date.getHours().zeroPadding(2)+":"+
			date.getMinutes().zeroPadding(2)+":"+
			date.getSeconds().zeroPadding(2)
		if(messageType == "Message")
		{
			retVar =	"<div class=\"ChatMessage ChatMessageChat\" data-time=\""+tmpDate+"\" data-sender=\""+senderNumber+"\">"+"\n"+
							"<span class=\"ChatMessageName\" style=\"color:"+messageColor+"\">"+senderName+":</span>"+"\n"+
							tmpMessage+"\n"+
						"</div>"
		}
		else if(messageType == "Emote")
		{
			retVar =	"<div class=\"ChatMessage ChatMessageEmote\" data-time=\""+tmpDate+"\" data-sender=\""+senderNumber+"\" style=\"background-color: "+this.TransparentColor(messageColor)+";\">"+"\n"+
							senderName + tmpMessage+"\n"+
						"</div>"
		}
		else if(messageType == "Action")
		{
			retVar =	"<div class=\"ChatMessage ChatMessageEmote\" data-time=\""+tmpDate+"\" data-sender=\""+senderNumber+"\" style=\"background-color: "+this.TransparentColor(messageColor)+";\">"+"\n"+
							tmpMessage+"\n"+
						"</div>"
		}

		return retVar

	}

}
