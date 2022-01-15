module.exports = async ({ getNamedAccounts, deployments }) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts()

    const contract = await deploy("StoreDoc", {
      from: deployer,
      gasLimit: 4000000,
      args: [deployer, true],
      logs: true,
    });

    console.log("Contract deployed at", contract.address);
};

module.exports.tags = ["StoreDoc", "doc"];
