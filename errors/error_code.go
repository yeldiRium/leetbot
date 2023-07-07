package errors

type ErrorCode int

const (
	FailedToReadFromActiveChatsStore  ErrorCode = 101
	FailedToAddChatToActiveChats                = 102
	FailedToRemoveChatFromActiveChats           = 103
	FailedToSetTimezoneInActiveChats            = 104
)
