const { expect } = require("chai");

describe("NotAGreeter", function () {
  it("Should return a miss count for bad answer", async function () {
    const NotAGreeter = await ethers.getContractFactory("NotAGreeter");

    const notAGreeter = await NotAGreeter.deploy(42);
    await notAGreeter.deployed();

    expect(await notAGreeter.answer()).to.equal(42);

    const tx = await notAGreeter.ask(41);

    // wait until the transaction is mined
    await tx.wait();

    expect(await notAGreeter.miss()).to.equal(1);
  });
});
