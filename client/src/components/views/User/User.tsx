import React, { useEffect, useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import { UserApi } from '../../../api';
import "./User.css";
import { useAuthContext } from '../../../context/AuthProvider';

function InformCard() {
    const { auth } = useAuthContext();
    const navigate = useNavigate();
    const [nickname, setNickname] = useState<string>("");
    const [score, setScore] = useState<number>(0);
    const [solvedChallengeTitles, setSolvedChallengeTitles] = useState<string[]>([]);
    useEffect(() => {
        if (!auth) {
            return;
        }
        new UserApi().usersControllerStatus({
            accessToken: auth.token
        }).then((response) => {
            const { nickname, score, solvedChallengeTitles } = response.data;
            setNickname(nickname);
            setScore(score);
            setSolvedChallengeTitles(solvedChallengeTitles);
        }).catch((error) => {
            if (error.status === 401) {
                navigate("/login");
            }
        });

    }, [auth]);
    return (
        <div className='InformCard'>
            <div className='card'>
                <div className='content'>
                    <div className="wrapper">
                        <h5 className="title">{nickname}</h5>
                    </div>
                    <div className='action-bar'>
                        {solvedChallengeTitles}
                    </div>
                    <div className='action-bar'>
                        {score}
                    </div>
                </div>
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

