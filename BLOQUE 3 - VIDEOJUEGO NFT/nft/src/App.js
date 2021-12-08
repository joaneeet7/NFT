// Importaciones
import React, {useEffect, useState } from "react";
import './App.css';
import {useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import LipRenderer from "./components/LipRenderer";
import _color from "./assets/images/bg/_color.png";

function App() {

  // Primeros pasos en la carga de la información
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);
  const [loading, setLoading] = useState(false);
  const blockchain = useSelector((state) => state.blockchain);
  console.log(data);
  
  // Mint de un nuevo Token NFT
  const mintNFT = async (_account, _name) => {
    setLoading(true);
    blockchain.lipToken.methods.createRandomLip(_name).send({
      from: _account,
      value: blockchain.web3.utils.toWei("1", "ether"),
    }).once("error", (err) => {
      setLoading(false);
      console.log(err);
    }).then((receipt) => {
      setLoading(false);
      console.log(receipt);
      dispatch(fetchData(blockchain.account));
    });
  };

  // Subir nivel de un Token NFT
  const levelUpLip = async (_account, _id) => {
    setLoading(true);
    blockchain.lipToken.methods.levelUp(_id).send({
      from: _account,
    }).once("error", (err) => {
      setLoading(false);
      console.log(err);
    }).then((receipt) => {
      setLoading(false);
      console.log(receipt);
      dispatch(fetchData(blockchain.account));
    });
  };

  // Visualizar el balance del Smart Contract
  const balanceSmartContract = async () => {
    setLoading(true);
    const money = blockchain.lipToken.methods.moneySmartContract().call();
    money.then(value => {
      alert(parseFloat(value/1000000000000000000))})
      console.log(money)
  };

  // Obtención del dinero por el Owner del Smart Contract
  const ethersOwner = async (_account) => {
    setLoading(true);
    blockchain.lipToken.methods.withdraw().send({
      from: _account,
    }).once("error", (err) => {
      setLoading(false);
      console.log(err);
    }).then((receipt) => {
      setLoading(false);
      console.log(receipt);
      dispatch(fetchData(blockchain.account));
    });
  };

  // Recurso: https://es.reactjs.org/docs/hooks-effect.html
  // De forma similar a componentDidMount y componentDidUpdate
  useEffect (() => {
    if(blockchain.account != "" && blockchain.lipToken != null){
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.lipToken]);
  

  // Visualización del Videojuego NFT 
  return (
    <s.Screen image={_color}>
      {blockchain.account === "" || blockchain.lipToken === null ? (
        <s.Container flex = {1} ai = {"center"} jc = {"center"}>
          <s.TextTitle> ¡Bienvenido al videojuego de Tokens NFT de Joan Amengual!</s.TextTitle>
          <s.SpacerSmall/>
        <s.Button1 
          onClick = {(e) => {
          e.preventDefault();
          dispatch(connect());
        }}> 
        CONECTAR  
        </s.Button1>
        <s.SpacerSmall/>
        {blockchain.errorMsg != "" ? ( 
          <s.TextDescription>{blockchain.errorMsg}</s.TextDescription> ) : null}
        </s.Container> ) : (
          <s.Container ai = {"center"} style = {{padding: "24px"}}>
          <s.TextTitle> ¡Bienvenido al Videojuego NFT! </s.TextTitle>
          <s.SpacerSmall/>
          <s.Button2 
           onClick = {(e) => {
             e.preventDefault();
             const name = "JoanNFT"
             mintNFT(blockchain.account, name)
           }} > 
           CREAR NUEVO NFT
           </s.Button2>
          <s.SpacerMedium/>

          <s.Container jc = {"center"} fd = {"row"} style = {{flexWrap: "wrap"}} >
            {data.allLips.map((item, index) => {

              return ( 
                <s.Container key = {index} style = {{padding: "15px"}} >
                  <LipRenderer lip = {item} />
                  <s.SpacerXSmall/>
                  <s.Container>
                    <s.TextDescription>ID: {item.id}</s.TextDescription>
                    <s.TextDescription>DNA: {item.dna}</s.TextDescription>
                    <s.TextDescription>LEVEL: {item.level}</s.TextDescription>
                    <s.TextDescription>NAME: {item.name}</s.TextDescription>
                    <s.TextDescription>RARITY: {item.rarity}</s.TextDescription>
                    <s.SpacerXSmall/>

                    <s.Button3
                    disabled = {loading ? 1:0}
                    onClick = {(e) => {
                      e.preventDefault();
                      levelUpLip(blockchain.account, item.id);
                    }}>
                      SUBIR NIVEL
                    </s.Button3>
                  </s.Container>
                  </s.Container>
              );
            })}
          </s.Container>
          
          <s.Button4
            onClick = {(e) => {
              e.preventDefault();
              balanceSmartContract();
            }}>
              BALANCE DEL SMART CONTRACT
            </s.Button4>

          <s.Button4
            onClick = {(e) => {
              e.preventDefault();
              ethersOwner(blockchain.account);
            }}>
              RETIRAR DINERO
            </s.Button4>
            </s.Container>
        )}
    </s.Screen> 
  );
}


export default App;
