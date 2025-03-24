const FoodWasteManagement = artifacts.require("FoodWasteManagement");

contract("FoodWasteManagement", accounts => {
    let contractInstance;

    before(async () => {
        contractInstance = await FoodWasteManagement.deployed();
    });

    it("should set admin correctly", async () => {
        const admin = await contractInstance.admin();
        assert.equal(admin, accounts[0], "Admin is not set correctly");
    });

    it("should allow donations to be created", async () => {
        await contractInstance.createDonation("Vegetables", 5, { from: accounts[1] });
        const donation = await contractInstance.donations(1);
        assert.equal(donation.foodType, "Vegetables", "Food type mismatch");
        assert.equal(donation.quantity, 5, "Quantity mismatch");
    });

    it("should allow donation to be claimed", async () => {
        await contractInstance.claimDonation(1, { from: accounts[2] });
        const donation = await contractInstance.donations(1);
        assert.equal(donation.recipient, accounts[2], "Recipient mismatch");
    });
});