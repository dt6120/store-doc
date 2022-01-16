const { ethers } = require("hardhat");
const {
    contracts: {
        StoreDoc: {
            abi, address
        }
    }
} = require("../artifacts.json")

const main = async () => {
    console.log("Uploading document...")

    const [signer] = await ethers.getSigners()
    const contract = new ethers.Contract(address, abi, signer)

    const mediaHash = "0x1234567890"

    const tx = await contract.connect(signer).uploadDoc(mediaHash)
    const { events } = await tx.wait()

    const { topics } = events.find(event => event.event === "DocUploaded")

    console.log(`Document ID: ${Number(topics[1])}`)
    console.log(`Uploaded at: ${new Date(Number(topics[3]) * 1000)}`)
    
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
