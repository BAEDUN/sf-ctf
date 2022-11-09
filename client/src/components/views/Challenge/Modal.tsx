import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { GetSolversResponseDtoSolversInner, LogApi } from '../../../api';
import { useAuthContext } from '../../../context/AuthProvider';

const solvesPageSize = 10;

const Modal = ({ challengeTitle, isOpen, setIsOpen, modalBodyRef }: { challengeTitle: string, isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>, modalBodyRef: any }) => {
    const wrappedOnClose = useCallback((event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setIsOpen(false);
    }, [setIsOpen])
    const [solvers, setSolvers] = useState<GetSolversResponseDtoSolversInner[]>([]);
    const [pages, setPages] = useState<number>(0);
    const { auth } = useAuthContext();
    useEffect(() => {
        if (!auth || !challengeTitle) {
            return;
        }
        new LogApi().logControllerGetSolvers({
            accessToken: auth.token,
            challengeTitle: challengeTitle,
            page: pages! - 1
        }).then((response) => {
            const { solvers, pages } = response.data;
            setSolvers(solvers);
            setPages(pages);
            console.log(solvers, pages);
        })
    }, [auth]);
    let i = 1;
    return (
        <ReactModal isOpen={isOpen} aria-label="Close">
            <div className='modal-header'>
                <div className='modal-title'>Solves for {challengeTitle}</div>
            </div>
            <div className="modal-body" ref={modalBodyRef}>
                <div className="modal-form">
                    {/* <div className="modal-row-wrap">
                        <div className="modal-row">#</div>
                        <div className="modal-row">User</div>
                        <div className="modal-row">Solve time</div>
                    </div>
                    <div className="modal-col-wrap">
                        {
                            solvers.map(({ solvedAt, username }) => (
                                <div key={username} className="solverList">
                                    <div className="modal-col">{(pages - 1) * solvesPageSize + 1}</div>
                                    <div className="modal-col">{username}</div >
                                    <div className='modal-col'>{solvedAt}</div>
                                </div>
                            ))
                        }
                    </div> */}
                    <table className='Table Small'>
                        <thead>
                            <tr>
                                <th style={{ width: "5em" }}>#</th>
                                <th>Users</th>
                                <th>Scores</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solvers.map(({ solvedAt, username }) => {
                                return (
                                    <tr key={username}>
                                        <td>{i++}</td>
                                        <td>{username}</td>
                                        <td>{new Date(solvedAt!).toLocaleString()}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
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