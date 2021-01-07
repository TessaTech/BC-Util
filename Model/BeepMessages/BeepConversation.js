"use strict";

if(BeepMessages == undefined)
{
	var BeepMessages = {}
}

BeepMessages.BeepConversation = class
{
	constructor(initMemberNumber)
	{
		this.memberNumber = initMemberNumber
		this.version = -2
		this.messageHistory = [ ]

	}

}

BeepMessages.BeepConversation.Message = class
{
	constructor(initSenderMemberNumber, initSenderName, initMessage, initMessageColor, initReceiveTime)
	{
		this.senderMemberNumber = initSenderMemberNumber
		this.senderName = initSenderName
		this.message = initMessage
		this.messageColor = initMessageColor
		this.receiveTime = initReceiveTime
	}
}
