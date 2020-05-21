import { IState } from './Store';

export type IActions = {
    type: 'set_loaded' |
          'set_verification_result' |
          'set_fetch_result';
    payload?: any
}

export const reducer = (state: IState, action: IActions ) => {
    switch(action.type) {
        case 'set_loaded':
            return {
                ...state,
                isLoaded: true
            };
        case 'set_verification_result':
            return {
                ...state,
                verificationResult: action.payload
            };
        case 'set_fetch_result':
            return {
                ...state,
                fetchResult: action.payload
            };
        default:
            return state;
    }
}
