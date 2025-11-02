// import { ApiPromise, WsProvider } from '@polkadot/api';

// async function main() {
//   // Official WebSocket endpoint for Midnight testnet (verified and exists)
//   const provider = new WsProvider('wss://rpc.testnet-02.midnight.network');
//   const api = await ApiPromise.create({ provider });

//   // Fetch sidechain status to get current epoch
//   const status = await api.rpc.chain.getStatus();
//   const currentEpoch = status.sidechain.epoch.toNumber();

//   if (currentEpoch !== undefined) {
//     // Query committee for the current epoch
//     const committee = await api.rpc.sidechain.getEpochCommittee(currentEpoch);
//     console.log(`Epoch Hiện Tại: ${currentEpoch}`);
//     console.log('Ủy Ban Xác Thực:');
//     committee.committee.forEach((member: any) => {
//       console.log(`- Khóa Công Khai: ${member.sidechainPubKey}`);
//     });
//   } else {
//     console.log('Không thể lấy epoch hiện tại.');
//   }

//   await api.disconnect();
// }

// main().catch(console.error);