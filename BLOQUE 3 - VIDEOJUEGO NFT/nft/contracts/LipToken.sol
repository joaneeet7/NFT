// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importación de los Smart Contract: ERC721.sol y Ownable.sol
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Creación del Smart Contract para el Videojuego NFT
contract LipToken is ERC721, Ownable {

    // Constructor de mi Smart Contract
    constructor (string memory _name, string memory _symbol)
    ERC721(_name, _symbol) {}

    // ============================================
    // Declaraciones iniciales

    // Contador de tokens NFT
    uint256 COUNTER;
    // Fijación en el precio de los Tokens NFT
    uint256 fee = 1 ether;
    // Estructura de datos con las propiedades del lip (labio)
    struct Lip {
        string name;
        uint256 id;
        uint256 dna;
        uint8 level;
        uint8 rarity;
    }
    // Estructura de almacenamiento
    Lip [] public lips;
    // Declaración de un evento 
    event NewLip(address indexed owner, uint256 id, uint256 dna);

    // ============================================
    // Funciones de ayuda 

    // Asignación de un número aleatorio
    function _createRandomNum(uint256 _mod) internal view returns (uint256) {
        uint256 randomNum = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender)));
        return randomNum % _mod; 
    }

    // Actualización del precio del Token NFT
    function updateFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    // Extracción de los ethers del Smart Contract hacia el Owner 
    function withdraw() external payable onlyOwner {
        address payable _owner = payable(owner());
        _owner.transfer(address(this).balance);
    }

    // Creación del Token NFT (lip/labio)
    function _createLip(string memory _name) internal {
        uint8 randRarity = uint8(_createRandomNum(100));
        uint randDna = _createRandomNum(10**16);
        Lip memory newLip = Lip(_name, COUNTER, randDna, 1, randRarity);
        lips.push(newLip);
        _safeMint(msg.sender, COUNTER);
        emit NewLip(msg.sender, COUNTER, randDna);
        COUNTER++;
    }

    // ============================================
    // Creación de un labio aleatorio
    function createRandomLip(string memory _name) public payable {
        require(msg.value >= fee);
        _createLip(_name);
    }

    // Obtención de todos los lips (labios)
    function getLips() public view returns (Lip [] memory) {
        return lips;
    }

    // Visualizar el balance del Smart Contract 
    function moneySmartContract() public view returns (uint256){
        return address(this).balance;
    }

    // Visualizar la dirección del Smart Contract
    function addressSmartContract() public view returns (address) {
        return address(this);
    }

    // Obtención de los tokens NFT usuario
    function getOwnerLips(address _owner) public view returns (Lip [] memory) {
        Lip [] memory result = new Lip [] (balanceOf(_owner));
        uint256 counter = 0;
        for (uint256 i = 0; i <lips.length; i++) {
            if (ownerOf(i) == _owner) {
                result[counter] = lips[i];
                counter++;
            }
        }
        return result;
    }

    // Subir de nivel los tokens NFT 
    function levelUp(uint256 _lipId) public {
        require(ownerOf(_lipId) == msg.sender);
        Lip storage lip = lips[_lipId];
        lip.level++;
    }


}