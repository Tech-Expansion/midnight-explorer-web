import { NextResponse } from 'next/server'

interface SideChainStatus{
    epoch: number,
    slot: number,
    nextEpochTimestamp: number
}
interface StatusResponse{
    sidechain: SideChainStatus,
    mainchain: MainchainStatus;
}
interface MainchainStatus {
  epoch: number;
  slot: number;
  nextEpochTimestamp: number;
}
interface JsonRpcResponse {
  id: number;
  jsonrpc: string;
  result: StatusResponse;
}

interface JsonRpcRequest {
  jsonrpc: string;
  id: number;
  method: string;
  params: string[];
}

export async function GET() {
    const RPC_URL = 'https://rpc.ankr.com/midnight_testnet/';
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
        const data: JsonRpcResponse = await res.json();
        return NextResponse.json(data.result);
    } catch (error) {
        console.error('Error fetching sidechain status:', error);
        return NextResponse.json(
            { error: 'Failed to fetch sidechain status' },
            { status: 500 }
        );
    }
}