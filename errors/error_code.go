package errors

type ErrorCode int

const (
	FailedToReadFromActiveChatsStore  ErrorCode = 101
	FailedToAddChatToActiveChats      ErrorCode = 102
	FailedToRemoveChatFromActiveChats ErrorCode = 103
	FailedToSetTimezoneInActiveChats  ErrorCode = 104
	FailedToReadFromCurrentLeetStore  ErrorCode = 201
	FailedToWriteToCurrentLeetStore   ErrorCode = 202
)
