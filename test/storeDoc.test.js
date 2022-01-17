const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("StoreDoc", () => {
    let contract, owner, authUploader, user, isUploadingRestricted;

    before(async () => {
        [owner, authUploader, user] = await ethers.getSigners()
    })

    beforeEach(async () => {
        const Contract = await ethers.getContractFactory("StoreDoc")
        isUploadingRestricted = true;
        contract = await Contract.deploy(authUploader.address, isUploadingRestricted)
        await contract.deployed()
    })

    describe("deployment", () => {
        it("owner set successfully", async () => {
            expect(await contract.owner()).to.equal(owner.address)
        })

        it("auth uploader set successfully", async () => {
            expect(await contract.authUploader()).to.equal(authUploader.address)
        })

        it("uploading restriction set successfully", async () => {
            expect(await contract.isUploadingRestricted()).to.equal(isUploadingRestricted)
        })
    })

    describe("uploadDoc", () => {
        const mediaHash = "0x12345678901234567890"

        describe("with empty hash", () => {
            it("throws an error", async () => {
                await expect(
                    contract.connect(authUploader).uploadDoc("")
                ).to.be.revertedWith("Document hash cannot be empty")
            })
        })

        describe("with duplicate document", () => {
            beforeEach(async () => {
                const tx = await contract.connect(authUploader).uploadDoc(mediaHash)
                await tx.wait()
            })

            it("throws an error", async () => {
                await expect(
                    contract.connect(authUploader).uploadDoc(mediaHash)
                ).to.be.revertedWith("Document already uploaded")
            })
        })

        describe("with restricted uploading", () => {
            describe("user is not auth uploader", () => {
                it("throws an error", async () => {
                    await expect(
                        contract.connect(user).uploadDoc(mediaHash)
                    ).to.be.revertedWith("Only authorized address can upload document")
                })
            })

            describe("user is auth uploader", () => {
                it("uploads document successfully", async () => {
                    const tx = await contract.connect(authUploader).uploadDoc(mediaHash)
                    const { events } = await tx.wait()
                    const event = events.find(event => event.event === "DocUploaded")

                    expect(event).to.not.be.undefined
                })
            })
        })

        describe("with unrestricted uploading", () => {
            beforeEach(async () => {
                await contract.connect(owner).setRestrictedUploading(false)
            })

            describe("user is auth uploader", () => {
                it("uploads document successfully", async () => {
                    const tx = await contract.connect(authUploader).uploadDoc(mediaHash)
                    const { events } = await tx.wait()
                    const event = events.find(event => event.event === "DocUploaded")

                    expect(event).to.not.be.undefined
                })
            })

            describe("user is not auth uploader", () => {
                it("uploads document successfully", async () => {
                    const tx = await contract.connect(user).uploadDoc(mediaHash)
                    const { events } = await tx.wait()
                    const event = events.find(event => event.event === "DocUploaded")

                    expect(event).to.not.be.undefined
                })
            })
        })
    })
})