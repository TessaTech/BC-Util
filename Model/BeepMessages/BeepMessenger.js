"use strict";

if(BeepMessages == undefined)
{
	var BeepMessages = {}
}

BeepMessages.BeepMessenger = class
{
	constructor(initGameCharacters, initGameFriendList, initBeepCommunicator)
	{
		this.gameCharacters = initGameCharacters
		this.gameFriendList = initGameFriendList
		this.beepCommunicator = initBeepCommunicator

		this.conversations = []

		this.eventConversationOpened = new Utility.Event()
		this.eventReceivedMessage = new Utility.Event()

		let _this = this
		this.beepCommunicator.RegisterEventReceivedMessage(function(memberNumber, memberName, version, message){ _this.OnBeepCommunicatorReceivedMessage(memberNumber, memberName, version, message); })
		this.beepCommunicator.RegisterEventReceivedVersion(function(memberNumber, memberName, version){ _this.OnBeepCommunicatorReceivedVersion(memberNumber, memberName, version); })
		
	}


	RegisterEventConversationOpened(eventHandler)
	{
		return this.eventConversationOpened.Register(eventHandler)
	}

	UnregisterEventConversationOpened(eventId)
	{
		return this.eventConversationOpened.Unregister(eventId)
	}

	RegisterEventReceivedMessage(eventHandler)
	{
		return this.eventReceivedMessage.Register(eventHandler)
	}

	UnregisterEventReceivedMessage(eventId)
	{
		return this.eventReceivedMessage.Unregister(eventId)
	}

	GetConversation(memberNumber)
	{
		let conversation = this.conversations.find(x => x.memberNumber == memberNumber)
		if(conversation == null)
		{
			conversation = new BeepMessages.BeepConversation(memberNumber)
			this.conversations.push(conversation)
		}
		return conversation
	}

	GetConversations()
	{
		return this.conversations
	}

	GetMessageHistory(memberNumber)
	{
		let conversation = this.GetConversation(memberNumber)
		return conversation.messageHistory
	}

	GetLastMessageHistoryEntry(memberNumber)
	{
		let conversation = this.GetConversation(memberNumber)
		if(conversation.messageHistory.length <= 0)
		{
			return null
		}
		return conversation.messageHistory[conversation.messageHistory.length -1]
	}
	
	IsPending(memberNumber)
	{
		let conversation = this.GetConversation(memberNumber)
		return (conversation.version == -1)
	}

	Open(memberNumber)
	{
		let conversation = this.GetConversation(memberNumber)

		if(conversation.version == -2)
		{
			this.beepCommunicator.SendVersionRequest(conversation.memberNumber)
			this.version = -1
		}
	}

	Close(memberNumber)
	{
		let conversation = this.GetConversation(memberNumber)

		if(conversation.connected == true)
		{
			conversation.version = -2
		}
	}

	IsOpen(memberNumber)
	{
		let conversation = this.GetConversation(memberNumber)

		return (conversation.version >= 0);
	}

	Send(memberNumber, message)
	{
		let conversation = this.GetConversation(memberNumber)

		if(conversation.version < 0)
		{
			return false
		}
		this.beepCommunicator.SendMessage(conversation.memberNumber, conversation.version, message)
		let memberName = this.gameCharacters.GetPlayer().Name
		let dateNow = new Date(Date.now())
		conversation.messageHistory.push(new BeepMessages.BeepConversation.Message(memberName, message, dateNow))
		this.eventReceivedMessage.Raise(memberNumber, memberName, message, dateNow)

		return true

	}

	OnBeepCommunicatorReceivedMessage(memberNumber, memberName, version, message)
	{
		let conversation = this.GetConversation(memberNumber)

		conversation.version = version
		let dateNow = new Date(Date.now())
		conversation.messageHistory.push(new BeepMessages.BeepConversation.Message(memberName, message, dateNow))
		this.eventReceivedMessage.Raise(memberNumber, memberName, message, dateNow)
	}

	OnBeepCommunicatorReceivedVersion(memberNumber, memberName, version)
	{
		let conversation = this.GetConversation(memberNumber)

		conversation.version = version
		this.eventConversationOpened.Raise(memberNumber)
	}

}
