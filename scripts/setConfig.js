const { ethers } = require("hardhat");
const {
    contracts: {
        StoreDoc: {
            abi, address
        }
    }
} = require("../artifacts.json")

const main = async () => {
    console.log("Setting config...")

    const [signer, auth] = await ethers.getSigners()
    const contract = new ethers.Contract(address, abi, signer)

    const authUploader = auth.address 
    const isUploadingRestricted = true

    const auth_tx = await contract.connect(signer).setAuthUploader(authUploader)
    await auth_tx.wait()
    
    const rest_tx = await contract.connect(signer).setRestrictedUploading(isUploadingRestricted)
    await rest_tx.wait()

    console.log("Config set successfully")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
