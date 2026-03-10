


interface JsonRpcRequest {
  jsonrpc: string;
  id: number;
  method: string;
  params: string[];
}
async function main() {
    const RPC_URL = 'https://rpc.preview.midnight.network/';
    const requestBody: JsonRpcRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'sidechain_getStatus',
        params: []
    };
    try{
        const res = await fetch(RPC_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        await res.json();
        //console.log('Sidechain Status:', data.result.sidechain);
    } catch (error) {
        console.error('Error fetching sidechain status:', error);
    }
}
main();