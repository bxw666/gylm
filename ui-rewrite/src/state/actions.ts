import { IActions } from './reducer';
import { FetchResult, VerificationResult } from './types';

export const onLoaded = (): IActions => {
    return {
        type: 'set_loaded',
    }
}

export const onVerified = (result: VerificationResult): IActions => {
    return {
        type: 'set_verification_result',
        payload: result
    }
}

export const onFetched = (result: FetchResult): IActions => {
    return {
        type: 'set_fetch_result',
        payload: result
    }
}
