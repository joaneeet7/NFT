// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importación del ERC721
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Creación del Smart Contract con herencia directa del ERC721
contract LipToken is ERC721, Ownable {
    // Constructor que recibe: nombre y simbolo del token
    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol){}
    // Contador 
    uint256 COUNTER;
    // Pago para la creación de un token NFT
    uint256 fee = 1 ether;
    // Estructura de datos con las propiedades del labio
    struct Lip {
        string name;
        uint256 id;
        uint256 dna;
        uint8 level;
        uint8 rarity;
    }
    // Lista de objetos "labio" 
    Lip[] public lips;
    // Declaración de un nuevo labio como token NFT
    event NewLip(address indexed owner, uint256 id, uint256 dna);

    // ========================================================
    // Asignación de un número aleatorio
    function _createRandomNum(uint256 _mod) internal view returns (uint256) {
        uint256 randomNum = uint256(
        keccak256(abi.encodePacked(block.timestamp, msg.sender)));
        return randomNum % _mod;
    }
    // Actualización de las tasas de precios de los NFT
    function updateFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }
    // Extracción de los Ethers hacia el Owner del Smart Contract
    function withdraw() external payable onlyOwner {
        address payable _owner = payable(owner());
        // El owner recibe el balance que esta en el Smart Contract
        _owner.transfer(address(this).balance);
    }
    // Creación del token NFT
    function _createLip(string memory _name) internal {
        uint8 randRarity = uint8(_createRandomNum(100));
        uint256 randDna = _createRandomNum(10**16);
        Lip memory newLip = Lip(_name, COUNTER, randDna, 1, randRarity);
        lips.push(newLip);
        _safeMint(msg.sender, COUNTER);
        emit NewLip(msg.sender, COUNTER, randDna);
        COUNTER++;
    }
    // ========================================================
    // MAIN
    // Creación de un labio aleatorio
    function createRandomLip(string memory _name) public payable {
        require(msg.value >= fee);
        _createLip(_name);
    }
    // ========================================================
    // Getters
    function getLips() public view returns (Lip[] memory) {
        return lips;
    }
    // Dirección del Smart contract 
    function addressSmartContract() public view returns (address){
        return address(this);
    }
    // Visualizar balance del Smart contract
    function moneySmartContract() public view returns (uint256){
        return address(this).balance;
    }
    // Obtención de los tokens de un usuario
    function getOwnerLips(address _owner) public view returns (Lip[] memory) {
        Lip[] memory result = new Lip[](balanceOf(_owner));
        uint256 counter = 0;
        for (uint256 i = 0; i < lips.length; i++) {
            if (ownerOf(i) == _owner) {
                result[counter] = lips[i];
                counter++;
            }
        }
        return result;
    }
    // Subir un nivel nuestro Token NFT
    function levelUp(uint256 _lipId) public {
        require(ownerOf(_lipId) == msg.sender);
        Lip storage lip = lips[_lipId];
        lip.level++;
    }
}
