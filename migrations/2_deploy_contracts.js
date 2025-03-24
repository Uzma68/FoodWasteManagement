const FoodWasteManagement = artifacts.require("FoodWasteManagement");

module.exports = function (deployer) {
    deployer.deploy(FoodWasteManagement);
};
