"use strict";

if(Gui == undefined)
{
	var Gui = class {}
}

Gui.DirectChat = class
{
	constructor(initGameUserInterface, initGameFriendList, initBeepMessenger)
	{
		this.gameUserInterface = initGameUserInterface
		this.gameFriendList = initGameFriendList
		this.beepMessenger = initBeepMessenger

		this.lastPartnerEntries = [ ]
		this.message = ""
		
		this.colorListElementUnknown = "#808080"
		this.colorListElementPending = "#800000"
		this.colorListElementAvailable = "#408040"
		this.colorListElementUnreadMessage = "#408040"

		this.colorButtonDefault = "White"
		this.colorButtonUnreadMessage = "#F08040"

		this.dropDownPartnerColors = { }

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

		//Calculate GUI Element Coodinates
		let x = 400
		let y = 100
		let width = 1200
		let height = 800

		let widthPartner = width
		let widthSend = width
		let widthMessages = width

		let heightPartner = 50
		let heightSend = 40
		let heightMessages = height - heightSend - heightPartner

		let xPartner = x
		let xMessages = x
		let xSend = x

		let yPartner = y
		let yMessages = yPartner + heightPartner
		let ySend = yMessages + heightMessages

		//Create GUI Elements
		this.buttonShowHide = this.gameUserInterface.AddButton(15, 895, 90, 90, "", this.colorButtonDefault, "#808080", "Icons/Chat.png", "Direct Chat", chatScreens, true, true)

		this.dropDownPartner = this.gameUserInterface.AddDropDown(xPartner, yPartner, widthPartner, heightPartner, 24, [[0, "Blaa"], [1, "BlaBlaa"]], 0, chatScreens, false)
		this.textAreaMessages = this.gameUserInterface.AddTextArea(xMessages, yMessages, widthMessages, heightMessages, 24, -1, "", chatScreens, false)
		this.textFieldSend = this.gameUserInterface.AddTextField(xSend, ySend, widthSend, heightSend, 24, 250, "", chatScreens, false)
		
		//Register Events
		let _this = this
		this.gameFriendList.RegisterEventOnlineFriendsChanged(function(onlineFriends){ _this.OnGameFriendListEventOnlineFriendsChanged(onlineFriends); })
		this.beepMessenger.RegisterEventConversationOpened(function(memberNumber){ _this.OnBeepMessengerConversationOpened(memberNumber); })
		this.beepMessenger.RegisterEventReceivedMessage(function(memberNumber, memberName, message, date){ _this.OnBeepMessengerReceivedMessage(memberNumber, memberName, message, date); })

		this.buttonShowHide.RegisterEventClicked(function(){ _this.OnButtonShowHideClick(); })
		this.dropDownPartner.RegisterEventSelectionChanged(function(newSelectedElement){ _this.OnDropDownPartnerSelectionChanged(newSelectedElement); })
		this.textFieldSend.RegisterEventAccepted(function(newText){ _this.OnTextFieldSendAccepted(newText); })
		
	}

	ClearHtmlTags(text)
	{
		return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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
			if(this.dropDownPartnerColors[partnerEntries[i].memberNumber] == null) // If no color has been defined...
			{
				this.dropDownPartnerColors[partnerEntries[i].memberNumber] = this.colorListElementUnknown
			}

			dropDownEntries.push("<div style=background-color:"+this.dropDownPartnerColors[partnerEntries[i].memberNumber]+">" + partnerEntries[i].name+" - "+ partnerEntries[i].memberNumber +" [" + partnerEntries[i].room + "]</div>")
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

			this.buttonShowHide.colorActive = this.colorButtonDefault

			this.dropDownPartner.Show()
			this.textAreaMessages.Show()
			this.textFieldSend.Show()
			
			this.gameFriendList.QuerryFriendlist()

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
		this.beepMessenger.Open(selectedPartnerMemberNumber)
		this.message = ""
		let tmpSender = ""
		let tmpMessage = ""
		let tmpDate = ""
		let messageHistory = this.beepMessenger.GetMessageHistory(selectedPartnerMemberNumber)
		for(let i=0; i<messageHistory.length; i++)
		{
			tmpSender = messageHistory[i].sender
			tmpMessage = messageHistory[i].message
			//tmpMessage = this.ClearHtmlTags(tmpMessage)
			tmpDate = messageHistory[i].receiveTime.getMonth()+"."+
				messageHistory[i].receiveTime.getDate()+"."+
				messageHistory[i].receiveTime.getFullYear()+" "+
				messageHistory[i].receiveTime.getHours()+" "+
				messageHistory[i].receiveTime.getMinutes()+":"+
				messageHistory[i].receiveTime.getSeconds()
				this.message += "["+tmpDate+"]" + tmpSender + ": " + tmpMessage + "\n"

		}
		if(this.beepMessenger.IsPending(selectedPartnerMemberNumber) == true) // If no color has been defined...
		{
			this.dropDownPartnerColors[selectedPartnerMemberNumber] = this.colorListElementPending
		}
		else if(this.beepMessenger.IsOpen(selectedPartnerMemberNumber) == true) // If no color has been defined...
		{
			this.dropDownPartnerColors[selectedPartnerMemberNumber] = this.colorListElementAvailable
		}
		this.UpdateDropDownPartner(this.lastPartnerEntries, true)
		this.textAreaMessages.SetText(this.message)
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
		this.beepMessenger.Send(targetMemberNumber, newText)

		this.textFieldSend.SetText("")
	}

	OnBeepMessengerConversationOpened(memberNumber)
	{
		this.dropDownPartnerColors[memberNumber] = this.colorListElementAvailable
		this.UpdateDropDownPartner(this.lastPartnerEntries, true)
	}

	OnBeepMessengerReceivedMessage(memberNumber, memberName, message, date)
	{
		let isSelectedConversation = false
		let selectedIndex = this.dropDownPartner.GetSelectedIndex()

		if(selectedIndex > 0 && selectedIndex <= this.lastPartnerEntries.length) // If no valid partner is selected...
		{
			isSelectedConversation = (this.lastPartnerEntries[selectedIndex-1].memberNumber == memberNumber)
		}
		if(isSelectedConversation == true) // If the received message is of the currently selected partner...
		{
			let tmpMessage = message
			//tmpMessage = this.ClearHtmlTags(message)
			let tmpDate = date.getMonth()+"."+date.getDate()+"."+date.getFullYear()+" "+
				date.getHours()+" "+date.getMinutes()+":"+date.getSeconds()
			this.message += "["+tmpDate+"]" + memberName + ": " + tmpMessage + "\n"

			this.textAreaMessages.SetText(this.message)

		}
		else // If the received message is of a not currently selected partner...
		{
			this.dropDownPartnerColors[memberNumber] = this.colorListElementUnreadMessage
			this.UpdateDropDownPartner(this.lastPartnerEntries, true)
		}

		if(this.visible == false)
		{
			this.buttonShowHide.colorActive = this.colorButtonUnreadMessage
		}

	}

}
