export type FetchResult = {
    metadata: string,
    contract: string
}

export type FetchData = {
    address: string, 
    network: string | number,
} 


export type VerificationResult = [{
    address: string,
    status: string,
    message: string
}]

export type VerifyData = {
    address: string,
    chain: string | number,
    files: Record<string, any>
}
