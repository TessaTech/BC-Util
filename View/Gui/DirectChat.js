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

		this.lastPartnerEntries = [ ]
		this.message = ""
		
		this.colorListElementUnknown = "#808080"
		this.colorListElementPending = "#C02020"
		this.colorListElementAvailable = "#408040"
		this.colorListElementUnreadMessage = "#F08040"

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
		let y = 100
		let width = 1200
		let height = 800

		let widthPartner = width
		let widthSend = width - 10
		let widthMessages = width

		let heightPartner = 29
		let heightSend = 40
		let heightMessages = height - heightSend - heightPartner

		let xPartner = x
		let xMessages = x
		let xSend = x + 2

		let yPartner = y
		let yMessages = yPartner + heightPartner
		let ySend = yMessages + heightMessages + 3

		//Create GUI Elements
		this.buttonShowHide = this.gameUserInterface.AddButton(15, 925, 60, 60, "", this.colorButtonDefault, "#808080", "Icons/Small/Chat.png", "Direct Chat", chatScreens, true, true)

		this.dropDownPartner = this.gameUserInterface.AddDropDown(xPartner, yPartner, widthPartner, heightPartner, fontSizePartner, [[0, "Blaa"], [1, "BlaBlaa"]], 0, chatScreens, false)
		this.textAreaMessages = this.gameUserInterface.AddHtmlTextArea(xMessages, yMessages, widthMessages, heightMessages, fontSizeMessages, -1, "", chatScreens, false)
		this.textFieldSend = this.gameUserInterface.AddTextField(xSend, ySend, widthSend, heightSend, fontSizeSend, 250, "", chatScreens, false)
		
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

	UpdateDropDownPartner(partnerEntries, force)
	{
		if(this.visible == false)
		{
			return;
		}

		let previouslySelectIndex = this.dropDownPartner.GetSelectedIndex()
		let selectedObject = { memberNumber: -1 }
		let selectIndex = 0
		let changed = false
		if(previouslySelectIndex > 0 && previouslySelectIndex <= this.lastPartnerEntries.length)
		{
			selectedObject = this.lastPartnerEntries[previouslySelectIndex-1]
		}

		changed = (force == false && (this.lastPartnerEntries.length != partnerEntries.length))

		let dropDownEntries = ["<div>None</div>"]
		for(let i=0; i<partnerEntries.length; i++)
		{
			dropDownEntries.push("<div style=background-color:"+this.GetDropDownPartnerDisplayData(partnerEntries[i].memberNumber).color+">" + partnerEntries[i].name+" - "+ partnerEntries[i].memberNumber +" [" + partnerEntries[i].room + "]</div>")
			if(changed == false
				&& (partnerEntries[i].memberNumber != this.lastPartnerEntries[i].memberNumber
					|| partnerEntries[i].name != this.lastPartnerEntries[i].name
					|| partnerEntries[i].room != this.lastPartnerEntries[i].room
			))
			{
				changed = true
			}
			if(partnerEntries[i].memberNumber == selectedObject.memberNumber)
			{
				selectIndex = (i + 1)
			}
		}
		
		if(changed == true || force == true)
		{
			this.lastPartnerEntries = partnerEntries
			this.dropDownPartner.SetObjects(dropDownEntries)
			this.dropDownPartner.SetSelection(selectIndex)
		}
		
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
		this.UpdateDropDownPartner(this.lastPartnerEntries, true)
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
			if(selectedIndex > 0)
			{
				let selectedPartnerMemberNumber = this.lastPartnerEntries[selectedIndex-1].memberNumber
				this.SelectChatPartner(selectedPartnerMemberNumber)
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
		if(selectedIndex < 1 || selectedIndex > this.lastPartnerEntries.length)
		{
			this.textAreaMessages.SetText("")
			return;
		}
		let selectedPartnerMemberNumber = this.lastPartnerEntries[selectedIndex-1].memberNumber
		this.SelectChatPartner(selectedPartnerMemberNumber)
	}

	OnTextFieldSendAccepted(newText)
	{
		if(newText == "")
		{
			return;
		}

		let selectedIndex = this.dropDownPartner.GetSelectedIndex()
		if(selectedIndex < 1 || selectedIndex > this.lastPartnerEntries.length)
		{
			return;
		}
		let targetMemberNumber = this.lastPartnerEntries[selectedIndex-1].memberNumber

		if(newText.indexOf("**") == 0) // If it's an action...
		{
			newText = newText.substr(2)
			this.beepMessenger.SendAction(targetMemberNumber, newText)
		}
		else if(newText.indexOf("/action ") == 0) // If it's an action...
		{
			newText = newText.substr(8)
			this.beepMessenger.SendAction(targetMemberNumber, newText)
		}
		else if(newText.indexOf("*") == 0) // If it's an emote...
		{
			newText = newText.substr(1)
			if(newText.charAt(0) != "\'" && newText.charAt(0) != "," && newText.charAt(0) != " ")
			{
				newText = " " + newText
			}
			this.beepMessenger.SendEmote(targetMemberNumber, newText)
		}
		else if(newText.indexOf("/me ") == 0) // If it's an emote...
		{
			newText = newText.substr(3)
			this.beepMessenger.SendEmote(targetMemberNumber, newText)
		}
		else // If it's a regular message...
		{
			this.beepMessenger.SendMessage(targetMemberNumber, newText)
		}

		this.textFieldSend.SetText("")
	}

	OnBeepMessengerConversationOpened(memberNumber)
	{
		this.GetDropDownPartnerDisplayData(memberNumber).color = this.colorListElementAvailable
		this.UpdateDropDownPartner(this.lastPartnerEntries, true)
	}

	OnBeepMessengerReceivedMessage(memberNumber, memberName, messageType, message, messageColor, date)
	{
		let appendMessage = false
		let selectedIndex = this.dropDownPartner.GetSelectedIndex()

		if(this.visible == true && selectedIndex > 0 && selectedIndex <= this.lastPartnerEntries.length) // If the chat is visible and a valid partner is selected...
		{
			//appendMessage is true if we received a message from the currently selected chat partner or the player just sent it
			appendMessage = (this.lastPartnerEntries[selectedIndex-1].memberNumber == memberNumber) ||
							(this.gameCharacters.GetPlayer().MemberNumber == memberNumber)
		}
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
			displayData.color = this.colorListElementUnreadMessage
			this.UpdateDropDownPartner(this.lastPartnerEntries, true)
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
		let tmpDate = date.getMonth()+"."+date.getDate()+"."+date.getFullYear()+" "+
			date.getHours()+" "+date.getMinutes()+":"+date.getSeconds()
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
