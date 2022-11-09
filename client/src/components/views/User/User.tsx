import React, { Fragment, useEffect, useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import { StatusResponseDtoSolvedChallengesInner, UserApi } from '../../../api';
import "./User.css";
import { useAuthContext } from '../../../context/AuthProvider';

// function InformCard() {

//     return (
//         <div className='InformCard'>
//             <div className='card'>
//                 <div className='content'>
//                     <div className="wrapper">
//                         <h5 className="title">{nickname}</h5>
//                     </div>
//                     <div className='action-bar'>
//                         {solvedChallengeTitles}
//                     </div>
//                     <div className='action-bar'>
//                         {score}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

function InformCard() {
    const { auth } = useAuthContext();
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [nickname, setNickname] = useState<string>("");
    const [score, setScore] = useState<number>(0);
    const [solvedChallenges, setSolvedChallenges] = useState<StatusResponseDtoSolvedChallengesInner[]>([]);

    useEffect(() => {
        if (!auth) {
            return;
        }
        new UserApi().usersControllerStatus({
            accessToken: auth.token
        }).then((response) => {
            console.log(response.data);
            const { nickname, score, solvedChallenges, username } = response.data;
            setNickname(nickname);
            setScore(score);
            setSolvedChallenges(solvedChallenges);
            setUsername(username);
        }).catch((error) => {
            if (error.status === 401) {
                navigate("/login");
            }
        });

    }, [auth]);

    return (
        <div className='InformCard'>
            <div className="card">
                {solvedChallenges.length === 0 ? (
                    <div className="title">
                        <h5>아직 해결한 문제가 없습니다.</h5>
                    </div>
                ) : (
                    <Fragment>
                        <h5 className="title">Solves</h5>
                        <div className="label">Category</div>
                        <div className="label">Challenge</div>
                        <div className="label">Solve time</div>
                        {solvedChallenges.map((solvedChallenge) => (
                            <Fragment key={solvedChallenge.title}>
                                <div className="inlineLabel category">Category</div>
                                <div className="category">{solvedChallenge.category}</div>
                                <div className="inlineLabel">Title</div>
                                <div>{solvedChallenge.title}</div>
                                <div className="inlineLabel">Solve time</div>
                                <div>{new Date(solvedChallenge.solvedAt!).toLocaleString()}</div>
                            </Fragment>
                        ))}
                    </Fragment>
                )}
            </div>
        </div>
    );
}

export default function User() {
    return (
        <div className='User'>
            <InformCard />
            <div className="SummaryCard"></div>
        </div>
    );
}

