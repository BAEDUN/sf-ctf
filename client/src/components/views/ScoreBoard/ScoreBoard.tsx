import React from 'react';
import './ScoreBoard.css';


export default function ScoreBoard() {
    return (
        <div className='row u-center'>
            <div className='col-3'>
                <div className={`frame`}>
                    <div className='frame__body'>
                        <div className='frame__subtitle'>Filter by division</div>
                        <div className='input-control'>
                            {/* <select required className='select' name='division' value={division} onChange={divisionChangeHandler}>
                                <option value='all' selected>All</option>
                                {
                                    Object.entries(config.divisions).map(([code, name]) => {
                                        return <option key={code} value={code}>{name}</option>
                                    })
                                }
                            </select> */}
                        </div>
                        <div className='frame__subtitle'>Teams per page</div>
                        <div className='input-control'>
                            {/* <select required className='select' name='pagesize' value={pageSize} onChange={pageSizeChangeHandler}>
                                {PAGESIZE_OPTIONS.map(sz => <option value={sz}>{sz}</option>)}
                            </select> */}
                        </div>
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
            <div className='col-6'>
                <div className={`frame`}>
                    <div className='frame__body'>
                        <table className='table small'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Users</th>
                                    <th>Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {scores.map(({ id, name, score, rank }) => {
                                    const isSelf = profile != null && profile.id === id

                                    return (
                                        <tr key={id}
                                            className={isSelf ? classes.selected : ''}
                                            ref={isSelf ? selfRow : null}
                                        >
                                            <td>{rank}</td>
                                            <td>
                                                <a href={`/profile/${id}`}>{name}</a>
                                            </td>
                                            <td>{score}</td>
                                        </tr>
                                    )
                                })} */}
                            </tbody>
                        </table>
                    </div>
                    {/* {totalItems > pageSize &&
                        <Pagination
                            {...{ totalItems, pageSize, page, setPage }}
                            numVisiblePages={9}
                        />
                    } */}
                </div>
            </div>
        </div>
    )
};