import { MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserApi, RankingRequestDtoSectionEnum, RankingResponseDtoUsersInner } from '../../../api';
import { useAuthContext } from '../../../context/AuthProvider';
import './ScoreBoard.css';


export default function ScoreBoard() {
    const [section, setSection] = useState<RankingRequestDtoSectionEnum | undefined>(undefined);
    const { auth } = useAuthContext();
    const navigate = useNavigate();
    const [users, setUsers] = useState<RankingResponseDtoUsersInner[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);

    const sectionChangeHandler = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        switch (event.target.value) {
            case RankingRequestDtoSectionEnum.Security:
                return setSection(event.target.value as RankingRequestDtoSectionEnum);
            case RankingRequestDtoSectionEnum.Software:
                return setSection(event.target.value as RankingRequestDtoSectionEnum);
            case RankingRequestDtoSectionEnum.SecurityFirst:
                return setSection(event.target.value as RankingRequestDtoSectionEnum);
            default:
                return setSection(undefined);
        }
    }, [setSection]);

    function checkedMovePage(newPage: number) {
        const outRange = newPage < 1 || newPage > totalPages;
        if (outRange) {
            return;
        }
        setPage(newPage);
    }

    useEffect(() => {
        if (!auth) {
            return;
        }
        new UserApi().usersControllerRanking({
            accessToken: auth.token,
            section,
            page: page - 1,
        }).then((response) => {
            const { users, pages } = response.data;
            console.log(response.data.users);
            setUsers(users);
            setTotalPages(pages);
        }).catch((error) => {
            if (error.status === 401) {
                navigate("/login");
            }
        });
    }, [auth, section, page]);

    return (
        <div className="ScoreBoard">
            <div className='Row'>
                <div className='Col-1'>
                    <div className='RankFrame'>
                        <div className='frameBody'>
                            <div className='frameSubTitle'>Filter by division</div>
                            <div className='input-control'>
                                <select required className='select' name='division' value={section} onChange={sectionChangeHandler}>
                                    <option value={undefined}>All</option>
                                    <option value={RankingRequestDtoSectionEnum.Security}>
                                        정보보호학과
                                    </option>
                                    <option value={RankingRequestDtoSectionEnum.Software}>
                                        컴퓨터소프트웨어학과
                                    </option>
                                    <option value={RankingRequestDtoSectionEnum.SecurityFirst}>
                                        SecurityFirst
                                    </option>
                                </select>
                            </div>
                            {/* <div className='frameSubTitle'>Users per page</div>
                            <div className='input-control'>
                                <select required className='select' name='pagesize' value={pageSize} onChange={pageSizeChangeHandler}>
                                    {PAGESIZE_OPTIONS.map(sz => <option value={sz}>{sz}</option>)}
                                </select>
                            </div> */}
                            {/* {loggedIn &&
                                <div className='btn-container u-center'>
                                    <button disabled={!isUserOnCurrentScoreboard} onClick={goToSelfPage}>
                                        Go to my team
                                    </button>
                                </div>
                            } */}
                        </div>
                    </div>
                </div>
                <div className='Col-2'>
                    <div className='RankFrame'>
                        <div className='frameBody'>
                            <table className='Table Small'>
                                <thead>
                                    <tr>
                                        <th style={{ width: "3.5em" }}>#</th>
                                        <th>Users</th>
                                        <th style={{ width: "5em" }}>Scores</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(({ rank, username, score }) => {
                                        return (
                                            <tr key={rank}>
                                                <td>{rank}</td>
                                                <td>{username}</td>
                                                <td>{score}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <nav className='Center'>
                            <MDBPagination className='mb-0 Pagination'>
                                <MDBPaginationItem>
                                    <MDBPaginationLink href='#' onClick={() => checkedMovePage(page - 1)} aria-label='Previous'>
                                        <span aria-hidden='true'>«</span>
                                    </MDBPaginationLink>
                                </MDBPaginationItem>
                                {Array(totalPages)
                                    .map((_, i) => (
                                        <MDBPaginationItem>
                                            <MDBPaginationLink key={i + 1} href='#' onClick={() => setPage(i + 1)}>{i + 1}</MDBPaginationLink>
                                        </MDBPaginationItem>
                                    ))}
                                <MDBPaginationItem>
                                    <MDBPaginationLink href='#' onClick={() => checkedMovePage(page + 1)} aria-label='Next'>
                                        <span aria-hidden='true'>»</span>
                                    </MDBPaginationLink>
                                </MDBPaginationItem>
                            </MDBPagination>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}