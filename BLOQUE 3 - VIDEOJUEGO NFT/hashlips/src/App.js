import React, { useEffect, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import LipRenderer from "./components/lipRenderer";
import _color from "./assets/images/bg/_color.png";


function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [loading, setLoading] = useState(false);

  console.log(data);

  const mintNFT = (_account, _name) => {
    setLoading(true);
    blockchain.lipToken.methods
      .createRandomLip(_name)
      .send({
        from: _account,
        value: blockchain.web3.utils.toWei("0.01", "ether"),
      })
      .once("error", (err) => {
        setLoading(false);
        console.log(err);
      })
      .then((receipt) => {
        setLoading(false);
        console.log(receipt);
        dispatch(fetchData(blockchain.account));
      });
  };

  const levelUpLip = (_account, _id) => {
    setLoading(true);
    blockchain.lipToken.methods
      .levelUp(_id)
      .send({
        from: _account,
      })
      .once("error", (err) => {
        setLoading(false);
        console.log(err);
      })
      .then((receipt) => {
        setLoading(false);
        console.log(receipt);
        dispatch(fetchData(blockchain.account));
      });
  };

  useEffect(() => {
    if (blockchain.account != "" && blockchain.lipToken != null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.lipToken]);

  return (
    <s.Screen image={_color}>
      {blockchain.account === "" || blockchain.lipToken === null ? (
        <s.Container flex={1} ai={"center"} jc={"center"}>
          <s.TextTitle>Bienvenido al videojuego de Tokens NFTs de Joan Amengual</s.TextTitle>
          <s.SpacerSmall />
          <s.Button1
            onClick={(e) => {
              e.preventDefault();
              dispatch(connect());
            }}
          >
            CONECTAR
          </s.Button1>

          <s.SpacerXSmall />
          {blockchain.errorMsg != "" ? (
            <s.TextDescription>{blockchain.errorMsg}</s.TextDescription>
          ) : null}
        </s.Container>
      ) : (
        <s.Container ai={"center"} style={{ padding: "24px" }}>
          <s.TextTitle>¡Bienvenido al videojuego de Tokens NFTs!</s.TextTitle>
          <s.SpacerSmall />
          <s.Button2
            onClick={(e) => {
              e.preventDefault();
              const name = blockchain.account.substr(0,10)
              mintNFT(blockchain.account, name);
            }}
          >
            CREAR NUEVO NFT
          </s.Button2>

          <s.SpacerMedium />
          <s.Container jc={"center"} fd={"row"} style={{ flexWrap: "wrap" }}>
            {data.allLips.map((item, index) => {
              return (
                <s.Container key={index} style={{ padding: "15px" }}>
                  <LipRenderer lip={item} />
                  <s.SpacerXSmall />
                  <s.Container>
                    <s.TextDescription>ID: {item.id}</s.TextDescription>
                    <s.TextDescription>DNA: {item.dna}</s.TextDescription>
                    <s.TextDescription>LEVEL: {item.level}</s.TextDescription>
                    <s.TextDescription>NAME: {item.name}</s.TextDescription>
                    <s.TextDescription>RARITY: {item.rarity}</s.TextDescription>
                    <s.SpacerXSmall />
                    <s.Button3
                      disabled={loading ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        levelUpLip(blockchain.account, item.id);
                      }}
                    >
                      SUBIR NIVEL
                    </s.Button3>
                  </s.Container>
                </s.Container>
              );
            })}
          </s.Container>
        </s.Container>
      )}
    </s.Screen>
  );
}

export default App;
