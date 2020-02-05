const { sample } = require("../random");

describe("sample", () => {
  it("returns null for an empty array", () => {
    expect(sample([])).toBeNull();
  });

  it("returns a random element from the array", () => {
    const options = [1, 2, 3, 4, 5];
    expect(sample(options)).toBeOneOf(options);
  });
});
