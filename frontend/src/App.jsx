import { useState } from 'react';
import {
  StellarWalletsKit,
  Networks as KitNetworks,
} from '@creit.tech/stellar-wallets-kit';
import { FreighterModule, FREIGHTER_ID } from '@creit.tech/stellar-wallets-kit/modules/freighter';
import {
  Contract,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  rpc,
  nativeToScVal,
  scValToNative,
} from '@stellar/stellar-sdk';

// ---- CONFIG ----
const CONTRACT_ID = 'CAMDVVJTCXTSQ3N2HXKUITVGUD6XB4CXWJ5V2ZQARF4H3MPD4ZQYTQSF';
const RPC_URL = 'https://soroban-testnet.stellar.org';
const NETWORK_PASSPHRASE = Networks.TESTNET;

StellarWalletsKit.init({
  network: KitNetworks.TESTNET,
  selectedWalletId: FREIGHTER_ID,
  modules: [new FreighterModule()],
});

function App() {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('10');
  const [total, setTotal] = useState(null);
  const [txStatus, setTxStatus] = useState('');
  const [txHash, setTxHash] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const explorerUrl = 'https://stellar.expert/explorer/testnet/tx/' + txHash;

  const connectWallet = async () => {
    setErrorMsg('');
    try {
      const result = await StellarWalletsKit.authModal();
      setAddress(result.address);
    } catch (err) {
      handleWalletError(err);
    }
  };

  const handleWalletError = (err) => {
    const msg = err && err.message ? err.message : String(err);
    const lower = msg.toLowerCase();
    if (lower.indexOf('not found') !== -1 || lower.indexOf('not installed') !== -1 || lower.indexOf('not connected') !== -1) {
      setErrorMsg('Wallet not found. Please install Freighter extension.');
    } else if (lower.indexOf('reject') !== -1 || lower.indexOf('denied') !== -1 || lower.indexOf('declined') !== -1 || lower.indexOf('not allowed') !== -1 || lower.indexOf('closed the modal') !== -1) {
      setErrorMsg('Transaction was rejected by the user.');
    } else if (lower.indexOf('insufficient') !== -1 || lower.indexOf('balance') !== -1) {
      setErrorMsg('Insufficient balance to complete this transaction.');
    } else {
      setErrorMsg('Error: ' + msg);
    }
  };

  const fetchTotal = async () => {
    try {
      const server = new rpc.Server(RPC_URL);
      const contract = new Contract(CONTRACT_ID);
      const sourceAddress = address || 'GALWNDY3ILSQPDIMXSNSK4XJLBQQE6HQW6H5SZ4N6CCRI7BUAGT2RGJJ';
      const account = await server.getAccount(sourceAddress);

      const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call('get_total'))
        .setTimeout(30)
        .build();

      const sim = await server.simulateTransaction(tx);
      if (sim.result) {
        const value = scValToNative(sim.result.retval);
        setTotal(value.toString());
      }
    } catch (err) {
      handleWalletError(err);
    }
  };

  const addTip = async () => {
    if (!address) {
      setErrorMsg('Please connect your wallet first.');
      return;
    }
    setErrorMsg('');
    setTxStatus('pending');
    setTxHash('');

    try {
      const server = new rpc.Server(RPC_URL);
      const contract = new Contract(CONTRACT_ID);
      const account = await server.getAccount(address);

      let tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          contract.call('add_tip', nativeToScVal(parseInt(amount), { type: 'i128' }))
        )
        .setTimeout(30)
        .build();

      tx = await server.prepareTransaction(tx);

      const signResult = await StellarWalletsKit.signTransaction(tx.toXDR(), {
        address: address,
        networkPassphrase: NETWORK_PASSPHRASE,
      });

      const signedTx = TransactionBuilder.fromXDR(signResult.signedTxXdr, NETWORK_PASSPHRASE);

      const sendResponse = await server.sendTransaction(signedTx);
      setTxHash(sendResponse.hash);

      if (sendResponse.status === 'ERROR') {
        setTxStatus('fail');
        setErrorMsg('Transaction failed to submit.');
        return;
      }

      let getResponse = await server.getTransaction(sendResponse.hash);
      while (getResponse.status === 'NOT_FOUND') {
        await new Promise(function (resolve) {
          setTimeout(resolve, 1500);
        });
        getResponse = await server.getTransaction(sendResponse.hash);
      }

      if (getResponse.status === 'SUCCESS') {
        setTxStatus('success');
        fetchTotal();
      } else {
        setTxStatus('fail');
        setErrorMsg('Transaction failed on-chain.');
      }
    } catch (err) {
      setTxStatus('fail');
      handleWalletError(err);
    }
  };

  let statusText = '';
  if (txStatus === 'pending') statusText = 'Pending...';
  if (txStatus === 'success') statusText = 'Success';
  if (txStatus === 'fail') statusText = 'Failed';

  return (
    <div style={{ maxWidth: 500, margin: '60px auto', fontFamily: 'sans-serif', color: '#eee' }}>
      <h1>Tip Jar</h1>

      {!address ? (
        <button onClick={connectWallet} style={btnStyle}>
          Connect Wallet
        </button>
      ) : (
        <p>Connected: {address.slice(0, 6)}...{address.slice(-6)}</p>
      )}

      <div style={{ marginTop: 20 }}>
        <input
          type="number"
          value={amount}
          onChange={function (e) { setAmount(e.target.value); }}
          style={{ padding: 8, marginRight: 10 }}
        />
        <button onClick={addTip} style={btnStyle}>
          Send Tip
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={fetchTotal} style={btnStyle}>
          Refresh Total
        </button>
        {total !== null ? (
          <p>Total Tips Collected: <strong>{total}</strong></p>
        ) : null}
      </div>

      {txStatus ? (
        <div style={{ marginTop: 20 }}>
          <p>Transaction Status: {statusText}</p>
          {txHash ? (
            <a href={explorerUrl} target="_blank" rel="noreferrer" style={{ color: '#8ab4f8' }}>
              View on Explorer
            </a>
          ) : null}
        </div>
      ) : null}

      {errorMsg ? (
        <p style={{ color: '#ff6b6b', marginTop: 20 }}>{errorMsg}</p>
      ) : null}
    </div>
  );
}

const btnStyle = {
  padding: '10px 16px',
  background: '#6c47ff',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
};

export default App;