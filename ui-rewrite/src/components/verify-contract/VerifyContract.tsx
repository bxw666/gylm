import React, { useState, useReducer } from "react";
import { Alert, Spinner } from "../common";
import { REPOSITORY_URL, chainOptions, SERVER_URL } from '../../common/Constants';
import { useStateContext, useDispatchContext } from "../../state/Store";
import { AddressInput } from "../common/form/AddressInput"
import { Dropdown } from "../common/form/Dropdown"
import { VerificationResult } from "../../state/types";
import axios from 'axios';
import { useDropzone } from 'react-dropzone'

export type IVerifyState = {
    isLoading: boolean,
    error: any,
    chain: any,
    address: string,
    files: [],
    isListening: boolean
}

export type IVerifyActions = {
    type: 'set_loading' | 'set_error' | 'set_address' | 'set_chain' | 'set_files' | 'set_listening';
    payload?: any
}

export const reducer = (state: IVerifyState, action: IVerifyActions) => {
    switch(action.type) {
        case 'set_loading':
            return {
                ...state,
                isLoading: action.payload
            };
        case 'set_error':
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };
        case 'set_address':
            return {
                ...state,
                address: action.payload
            };
        case 'set_chain':
            return {
                ...state,
                chain: action.payload
            };
        case 'set_files':
            return {
                ...state,
                files: action.payload
            };
        case 'set_listening':
            return {
                ...state,
                isListening: action.payload
            }
        default:
            return state;
        }
}

export const VerifyContract: React.FC = () => {

    const initialState: IVerifyState = {
        isLoading: false,
        chain: chainOptions[0],
        address: '',
        error: null,
        files: [],
        isListening: true
    }
    
    const stateContext = useStateContext();
    const dispatchContext = useDispatchContext();
    
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone()

    const [state, dispatch] = useReducer(reducer, initialState);
        
    const onDrop = acceptedFiles.map(file => {
        const reader = new FileReader();
        reader.onload = () => {
            reader.readAsArrayBuffer(file);
        }

        return (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>)
    })

    const onSubmit = async (e: any) => {
        e.preventDefault();
        dispatch({ type: 'set_error', payload: null} );
        dispatchContext({ type: 'set_verification_result', payload: null} );
        dispatch({ type: 'set_loading', payload: true })

        const formData = new FormData();

        formData.append('address', state.address);
        formData.append('chain', state.chain.id.toString());

        if (state.files.length > 0) {
            state.files.forEach((file: any) => formData.append('files', file));
        }

        const verifyResult: VerificationResult = [{
            address: state.address,
            status: '',
            message: ''
        }]

        let response: any; 

        try{
            response = await axios.post(`${SERVER_URL}`, formData)
            verifyResult[0].status = response.data.result[0].status;
            verifyResult[0].message = 'Successfully verified!'
        } catch(e) {
            verifyResult[0].status = 'No match';
            verifyResult[0].message = JSON.stringify(e.response.data.error);
        }
    }

    return (
        <div>
                <p className="card-text my-2">
                    Upload metadata and source files of your contract to make it available.
                    Note that the metadata file has to be exactly the same as at deploy time. Browse repository <a href={`${REPOSITORY_URL}`}>here</a> or via <a href="https://gateway.ipfs.io/ipns/QmNmBr4tiXtwTrHKjyppUyAhW1FQZMJTdnUrksA9hapS4u">ipfs/ipns gateway.</a>
                </p>
                <p className="mb-3">Also if you have any question join us on <a
                    href='https://gitter.im/ethereum/source-verify'>Gitter.</a></p>
                        <form className="d-flex flex-column" onSubmit={onSubmit}>
                            <Dropdown 
                                chainOptions={chainOptions}
                                chain={state.chain}
                                 setChain={(chain: any) => dispatch({ type: 'set_chain', payload: chain })} />
                            <AddressInput 
                                setAddress={(address: string) => dispatch({ type: 'set_address', payload: address })} />
                            <div {...getRootProps({ className: 'app-dropzone'})}>
                                <input {...getInputProps({ className: 'app-dropzone' })} />
                                {acceptedFiles.length ? (
                                    <span>
                                        <b>Files to upload:</b>
                                        {onDrop}
                                    </span>
                                ): (
                                    <span>
                                        drag and dropzone
                                        <br />- or -<br />
                                        click to select files
                                    </span>

                                )}
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-primary my-2" 
                                disabled={!state.address}>Verify</button>

                            {state.files.length > 0 &&
                            <>
                            <h5>Files</h5>
                            <ul className="text-center list-unstyled border my-2 p-1">
                            {state.files.map(file => <li key={file.name}>{file.name}</li>)}
                            </ul>
                            </>
                }
        </form>
                {
                    state.isLoading && <Spinner />
                }
                {
                    state.error && <Alert type={'danger'} heading={state.error}>
                                   </Alert>
                }
                {
                    stateContext.verificationResult && !state.error && (
                        <Alert type={'success'} heading='Contract successfully verified!'>
                            <p className="m-0 mt-2">
                                View the assets in the <a target="_blank" rel="noopener noreferrer" href={`${REPOSITORY_URL}contract/${state.chain.id}/${stateContext.verificationResult[0].address}`}> file explorer.
                            </a>
                            </p>
                            {/* {
                                stateContext.verificationResult &&
                                <p>Found {stateContext.verificationResult.length} addresses of this contract: {stateContext.verificationResult[0].address}</p>
                            } */}
                        </Alert>
                    )
                }
                <p className="my-1">Source code: <a
                    href="https://github.com/ethereum/source-verify/">GitHub</a>
                </p>
                <p className="m-0">Feel free to open issues or contribute.</p>
        </div>
    )
};
