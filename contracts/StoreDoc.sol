// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";

contract StoreDoc is Ownable {
    struct Doc {
        string mediaHash;
        uint256 uploadTime;
    }

    Doc[] public docs;

    address public authUploader;
    bool public isUploadingRestricted;

    event DocUploaded(
        uint256 indexed id,
        string indexed mediaHash,
        uint256 indexed uploadTime
    );
    event UpdateAuthUploader(
        address prevAuthUploader,
        address newAuthUploader
    );
    event UpdateRestrictedUploading(
        bool restrictedUploading
    );

    modifier onlyAuthUploader {
        if (isUploadingRestricted) {
            require(
                msg.sender == authUploader,
                "Only authorized address can upload document"
            );
        }
        _;
    }

    constructor(address _authUploader, bool _isUploadingRestricted) {
        require(
            _authUploader != address(0),
            "Authorized uploader address cannot be zero address"
        );

        authUploader = _authUploader;
        isUploadingRestricted = _isUploadingRestricted;

        emit UpdateAuthUploader(address(0), _authUploader);
        emit UpdateRestrictedUploading(_isUploadingRestricted);
    }

    function uploadDoc(string memory _hash) external onlyAuthUploader {
        require(bytes(_hash).length > 0, "Document hash cannot be empty");
        
        docs.push(Doc(_hash, block.timestamp));

        emit DocUploaded(docs.length - 1, _hash, block.timestamp);
    }

    function setAuthUploader(address _authUploader) external onlyOwner {
        require(
            _authUploader != authUploader,
            "New authorized uploader address should be different"
        );
        require(
            _authUploader != address(0),
            "Authorized uploader address cannot be zero address"
        );

        address prevAuthUploader = authUploader;
        authUploader = _authUploader;

        emit UpdateAuthUploader(prevAuthUploader, _authUploader);
    }

    function setRestrictedUploading(bool _isUploadingRestricted) external onlyOwner {
        require(
            isUploadingRestricted != _isUploadingRestricted,
            "Restricted uploading value should be different"
        );

        isUploadingRestricted = _isUploadingRestricted;

        emit UpdateRestrictedUploading(_isUploadingRestricted);
    }

    function getDoc(uint256 _id) external view returns (Doc memory) {
        require(_id < docs.length, "Enter valid ID");

        return docs[_id];
    }

    function getDocCount() external view returns (uint256) {
        return docs.length;
    }
}