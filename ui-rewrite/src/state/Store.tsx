import React, { createContext, useContext, useReducer } from 'react';
import { IActions, reducer } from './reducer';
import { FetchResult, VerificationResult } from './types';

export interface IState {
    isLoaded: boolean,
    fetchResult: FetchResult,
    verificationResult: VerificationResult,
    chain: any,
    address: string
}

const initialState = {
    isLoaded: false,
    fetchResult: null,
    verificationResult: null
} as IState;

const StateContext = createContext<Partial<IState>>(initialState);
const DispatchContext = createContext((() => {}) as React.Dispatch<IActions>);

export const StateProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    );
}

export const useStateContext = () => useContext(StateContext);
export const useDispatchContext = () => useContext(DispatchContext);
