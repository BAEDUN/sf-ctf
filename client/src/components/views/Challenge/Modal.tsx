import React, { Dispatch, Fragment, SetStateAction, useCallback } from 'react';
import ReactModal from 'react-modal';
import { GetSolversResponseDtoSolversInner } from '../../../api';

const solvesPageSize = 10;

const Modal = ({ challengeTitle, isOpen, setIsOpen, modalBodyRef, solvers, pages }: { challengeTitle: string, isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>, modalBodyRef: any, solvers: GetSolversResponseDtoSolversInner[], pages: number }) => {
    const wrappedOnClose = useCallback((event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setIsOpen(false);
    }, [setIsOpen])
    return (
        <ReactModal isOpen={isOpen} aria-label="Close">
            <div className='modal-header'>
                <div className='modal-title'>Solves for {challengeTitle}</div>
            </div>
            <div className="modal-body" ref={modalBodyRef}>
                <div className="modal-form">
                    <div className="modal-row">#</div>
                    <div className="modal-row">User</div>
                    <div className="modal-row">Solve time</div>
                    {
                        solvers.map(({ solvedAt, username }) => (
                            <Fragment key={username}>
                                <div className="modal-col">{(pages - 1) * solvesPageSize + 1}</div>
                                <div className="modal-col">{username}</div >
                                <div className='modal-col'>{solvedAt}</div>
                            </Fragment >
                        ))
                    }
                </div >
            </div >
            <div className='modal-footer'>
                <div className='btn-container u-inline-block'>
                    <button className="btn-small outline" onClick={wrappedOnClose}>Close</button>
                </div>
            </div>
        </ReactModal >
    );
}

export default Modal;