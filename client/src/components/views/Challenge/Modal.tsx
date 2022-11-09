import { MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';
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
    const [page, setPage] = useState<number>(1);
    const { auth } = useAuthContext();
    const [totalPages, setTotalPages] = useState<number>(0);
    useEffect(() => {
        if (!auth || !challengeTitle) {
            return;
        }
        new LogApi().logControllerGetSolvers({
            accessToken: auth.token,
            challengeTitle: challengeTitle,
            page: page! - 1
        }).then((response) => {
            const { solvers, pages } = response.data;
            setSolvers(solvers);
            setTotalPages(pages);
        }).catch((error) => {
            console.log(error);
        })
    }, [auth]);

    let i = 1;

    function checkedMovePage(newPage: number) {
        const outRange = newPage < 1 || newPage > totalPages;
        if (outRange) {
            return;
        }
        setPage(newPage);
    }
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
            <nav className='Center'>
                <MDBPagination className='mb-0 Pagination'>
                    <MDBPaginationItem>
                        <MDBPaginationLink href='#' onClick={() => checkedMovePage(page - 1)} aria-label='Previous'>
                            <span aria-hidden='true'>«</span>
                        </MDBPaginationLink>
                    </MDBPaginationItem>
                    {/* {Array(totalPages)
                                    .map((_, i) => (
                                        <MDBPaginationItem>
                                            <MDBPaginationLink key={i + 1} href='#' onClick={() => setPage(i + 1)}>{i + 1}</MDBPaginationLink>
                                        </MDBPaginationItem>
                                    ))} */}
                    <MDBPaginationItem>
                        <MDBPaginationLink href='#' onClick={() => checkedMovePage(page + 1)} aria-label='Next'>
                            <span aria-hidden='true'>»</span>
                        </MDBPaginationLink>
                    </MDBPaginationItem>
                </MDBPagination>
            </nav>
            <div className='modal-footer'>
                <div className='btn-container u-inline-block'>
                    <button className="btn-small outline" onClick={wrappedOnClose}>Close</button>
                </div>
            </div>
        </ReactModal >
    );
}

export default Modal;