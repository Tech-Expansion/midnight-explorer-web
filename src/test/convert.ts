// // Removed unused import
// // //curl -X 'POST' \
// //   'https://rpc.testnet-02.midnight.network/' \
// //   -H 'accept: application/json' \
// //   -H 'Content-Type: application/json' \
// //   -d '{"jsonrpc":"2.0","method":"sidechain_getAriadneParameters","params":[245203],"id":1}'
// async function main(){
//     const data = await fetch('http://65.109.146.233:9944/', {
//         method: 'POST',
//         headers: {
//             'accept': 'application/json',
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             jsonrpc: "2.0",
//             method: "sidechain_getAriadneParameters",
//             params: [245203],
//             id: 1   
//     })
// })
//     console.log(await data.json());
// }
// main();