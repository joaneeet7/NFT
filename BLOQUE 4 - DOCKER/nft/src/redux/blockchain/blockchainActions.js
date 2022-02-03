import Web3 from "web3"
import LipToken from "../../contracts/LipToken.json"
import { fetchData } from "../data/dataActions"

const connectRequest = () => {
    return {
        type: "CONNECTION_REQUEST",
    };
};

const connectSuccess = (payload) => {
    return {
        type: "CONNECTION_SUCCESS",
        payload: payload,
    };
};

const connectFailed = (payload) => {
    return {
        type: "CONNECTION_FAILED",
        payload: payload,
    };
};

const updateAccountRequest = (payload) => {
    return {
        type: "UPDATE_ACCOUNT",
        payload: payload,
    };
};

export const connect = () => {
    return async (dispatch) => {
        dispatch(connectRequest());
        if(window.ethereum) {
            let web3 = new Web3(window.ethereum);
            try {
                const accounts = await window.ethereum.request({method: "eth_accounts",});
                console.log(accounts);
                const networkId = await window.ethereum.request({method: "net_version", });
                console.log(networkId);
                // ID de la Blockchain de despliegue
                // Ganache -> 5777
                // BSC Testnet -> 97
                // MATIC/Polygon -> 80001
                // Rinkeby -> 4
                if (networkId == 4) {
                    const networkData = LipToken.networks[networkId];
                    const abi = LipToken.abi;
                    const address = networkData.address;
                    const lipToken = new web3.eth.Contract(abi, address);
                    console.log(lipToken);
                    dispatch(
                        connectSuccess({
                            account: accounts[0],
                            lipToken: lipToken,
                            web3: web3,
                        })
                    );

                    window.ethereum.on("accountsChanged", (accounts) => {
                        dispatch(updateAccount(accounts[0]));
                    });

                    window.ethereum.on("chainChanged", () => {
                        window.location.reload();
                    });
                } else {
                    dispatch(connectFailed("¡El Smart Contract no se ha desplegado en la red!"));
                    } 
                } catch(err) {
                    dispatch(connectFailed("¡Algo ha salido mal!"))
                }
            } else {
                dispatch(connectFailed("¡Instala Metamask!"))
            }
        };
    };

    export const updateAccount = (account) => {
        return async (dispatch) => {
            dispatch(updateAccountRequest({account: account}));
            dispatch(fetchData(account));
        };
    };
