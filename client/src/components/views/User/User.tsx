import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import { StatusResponseDtoSolvedChallengesInner, UserApi } from '../../../api';
import "./User.css";
import { useAuthContext } from '../../../context/AuthProvider';
import { toast } from 'react-toastify';
import { MDBInput } from 'mdb-react-ui-kit';

function loadUserStatus() {
    useCallback(() => {
        const { auth } = useAuthContext();
        const [username, setUsername] = useState<string>("");
        const [nickname, setNickname] = useState<string>("");
        const [email, setEmail] = useState<string>("");
        const [belong, setBelong] = useState<string>("");
        const [score, setScore] = useState<number>(0);
        const [solvedChallenges, setSolvedChallenges] = useState<StatusResponseDtoSolvedChallengesInner[]>([]);

        if (!auth) {
            return;
        }
        new UserApi().usersControllerStatus({
            accessToken: auth.token
        }).then((response) => {
            console.log(response.data);
            const { nickname, score, solvedChallenges, username, email, section } = response.data;
            setNickname(nickname);
            setScore(score);
            setSolvedChallenges(solvedChallenges);
            setUsername(username);
            setEmail(email);
            setBelong(section);
        }).catch((error) => {
            if (error.status === 401) {
                return;
            }
        });
    }, []);

    function UpdateCard() {
        const { auth } = useAuthContext();
        const [oldPassword, setOldPassword] = useState("");
        const [newPassword, setNewPassword] = useState("");
        const [username, setUsername] = useState<string>("");
        const [nickname, setNickname] = useState<string>("");
        const [email, setEmail] = useState<string>("");
        const [belong, setBelong] = useState<string>("");
        const [score, setScore] = useState<number>(0);

        loadUserStatus();

        useEffect(() => {
            if (!auth) {
                return;
            }
            new UserApi().usersControllerChangePassword({
                accessToken: auth.token,
                oldPassword: oldPassword,
                newPassword: newPassword
            }).then((response) => {
                const { accessToken } = response.data;
                if (accessToken) {
                    toast.success('정상적으로 변경되었습니다!', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                }
            }).catch((error) => {
                if (error.status === 401) {
                    toast.error('비밀번호를 다시 입력해주세요!', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                }
            });

        }, [auth]);

        return (
            <div className='UpdateCard'>
                <div className="Card">
                    {!auth ? (
                        <div className="title">
                            <h5>회원이 아닙니다.</h5>
                        </div>
                    ) : (
                        <Fragment>
                            <h5 className="title">{username}</h5>
                            <div className="nickWrap">
                                <div className="nickTitle">닉네임</div>
                                <div className="nickData">{nickname}</div>
                            </div>
                            <div className="emailWrap">
                                <div className="emailTitle">이메일</div>
                                <div className="emailData">{email}</div>
                            </div>
                            <div className="oldPasswordWrap">
                                <div className="oldPasswordTitle">이전 비밀번호</div>
                                <MDBInput
                                    label="Old Password"
                                    type="password"
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    value={oldPassword}
                                    required
                                    className="mt-3 oldPasswordData"
                                    contrast
                                />
                            </div>
                            <div className="newPasswordWrap">
                                <div className="newPasswordTitle">새 비밀번호</div>
                                <MDBInput
                                    label="New Password"
                                    type="password"
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    value={newPassword}
                                    required
                                    className="mt-3 newPasswordData"
                                    contrast
                                />
                            </div>
                            <div className="belongWrap">
                                <div className="belongTitle">소속</div>
                                <div className="belongData">{belong}</div>
                            </div>
                        </Fragment>
                    )}
                </div>
            </div>
        );
    }

    function InformCard() {
        const [solvedChallenges, setSolvedChallenges] = useState<StatusResponseDtoSolvedChallengesInner[]>([]);
        loadUserStatus();



        return (
            <div className='InformCard'>
                <div className="Card">
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
                <UpdateCard />
                <InformCard />
            </div>
        );
    }

