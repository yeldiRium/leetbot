const { groupAdminMiddleware, onlyAdmin } = require("../acl");

describe("groupAdminMiddleware", () => {
  it("sets fromIsGroupAdmin to true if user is group admin.", async () => {
    const mockBot = {
      telegram: {
        getChatAdministrators: () =>
          Promise.resolve([
            { user: { id: 1 } },
            { user: { id: 2 } },
            { user: { id: 3 } },
          ]),
      },
    };
    const mockCtx = {
      chat: { id: -1 },
      from: { id: 2 },
    };
    const mockNext = jest.fn();

    await groupAdminMiddleware({ bot: mockBot })(mockCtx, mockNext);
    expect(mockCtx.fromIsGroupAdmin).toBeTrue();
    expect(mockNext).toHaveBeenCalled();
  });

  it("sets fromIsGroupAdmin to false if user is not group admin.", async () => {
    const mockBot = {
      telegram: {
        getChatAdministrators: () =>
          Promise.resolve([
            { user: { id: 1 } },
            { user: { id: 2 } },
            { user: { id: 3 } },
          ]),
      },
    };
    const mockCtx = {
      chat: { id: -1 },
      from: { id: 4 },
    };
    const mockNext = jest.fn();

    await groupAdminMiddleware({ bot: mockBot })(mockCtx, mockNext);
    expect(mockCtx.fromIsGroupAdmin).toBeFalse();
    expect(mockNext).toHaveBeenCalled();
  });

  it("sets fromIsGroupAdmin to true if the chat is a private chat", async () => {
    const mockBot = {
      telegram: {
        getChatAdministrators: () => Promise.resolve([]),
      },
    };
    const mockCtx = {
      chat: { id: 1 },
      from: { id: 2 },
    };
    const mockNext = jest.fn();

    await groupAdminMiddleware({ bot: mockBot })(mockCtx, mockNext);
    expect(mockCtx.fromIsGroupAdmin).toBeTrue();
    expect(mockNext).toHaveBeenCalled();
  });
});

describe("onlyAdmin", () => {
  it("calls command if the message is from an admin", () => {
    const mockCtx = { fromIsGroupAdmin: true };
    const mockCmd = jest.fn();
    const mockNext = jest.fn();
    onlyAdmin(mockCmd)(mockCtx, mockNext);
    expect(mockCmd).toHaveBeenCalledWith(mockCtx, mockNext);
  });

  it("not calls command if the message is not from an admin", () => {
    const mockCtx = { fromIsGroupAdmin: false };
    const mockCmd = jest.fn();
    const mockNext = jest.fn();
    onlyAdmin(mockCmd)(mockCtx, mockNext);
    expect(mockCmd).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });

  it("not calls command if there is no information about the admin status of the sender ", () => {
    const mockCtx = {};
    const mockCmd = jest.fn();
    const mockNext = jest.fn();
    onlyAdmin(mockCmd)(mockCtx, mockNext);
    expect(mockCmd).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });
});
