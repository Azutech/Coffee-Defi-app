const hre = require("hardhat")
const abi = require("../artifacts/contracts/buymecoffee.sol/BuyMeACoffee.json");

const getBalance = async(provider, address) => {
    const balanceBigInt = await provider.getBalance(address)
    return hre.ethers.utils.formatEther(balanceBigInt)
}

const main = async () =>{
    const contractAddress ="0x620403Ee98Cf39eFcb16A5D36c9c906828947612"
    const contractABI = abi.abi

    const provider = new hre.ethers.providers.AlchemyProvider("goerli", process.env.GOERLI_API_KEY)

      // Ensure that signer is the SAME address as the original contract deployer,
      // or else this script will fail with an error.

    const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);


    const buyMeACoffee = new hre.ethers.Contract(contractAddress, contractABI, signer);

    // Check starting balances.
    console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
    const contractBalance = await getBalance(provider, buyMeACoffee.address);
    console.log("current balance of contract: ", await getBalance(provider, buyMeACoffee.address),"ETH");

    if (contractBalance !== "0.0") {
        console.log("withdrawing funds..")
        const withdrawTxn = await buyMeACoffee.withdrawTips()
        await withdrawTxn.wait()
    } else {
        console.log("no funds to withdraw!");
    }

    // Check ending balance.
    console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });