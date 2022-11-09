import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import { StatusResponseDtoSolvedChallengesInner, UserApi } from '../../../api';
import "./User.css";
import { useAuthContext } from '../../../context/AuthProvider';
import { toast, ToastContainer } from 'react-toastify';
import { MDBBtn, MDBInput } from 'mdb-react-ui-kit';

const PWD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function User() {
    const { auth } = useAuthContext();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [username, setUsername] = useState<string>("");
    const [nickname, setNickname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [belong, setBelong] = useState<string>("");
    const [score, setScore] = useState<number>(0);
    const [solvedChallenges, setSolvedChallenges] = useState<StatusResponseDtoSolvedChallengesInner[]>([]);


    useEffect(() => {
        if (!auth) {
            return;
        }
        new UserApi().usersControllerStatus({
            accessToken: auth.token
        }).then((response) => {
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
    }, [auth]);


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const validOldPassword = PWD_REGEX.test(oldPassword);
        const validNewPassword = PWD_REGEX.test(newPassword);
        if (!validOldPassword || !validNewPassword) {
            toast.error("Invalid Entry", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return;
        }
        if (!auth) {
            return;
        }
        new UserApi().usersControllerChangePassword({
            accessToken: auth.token,
            oldPassword: oldPassword,
            newPassword: newPassword
        }).then((response) => {
            if (response.status === 201) {
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
            if (error.status === 400 || error.status === 401) {
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
    };

    return (
        <div className='User'>
            <div className="CardWrap">
                <ToastContainer />
                <div className='UpdateCard'>
                    <div className="Card">
                        <div className="Content">
                            <form onSubmit={handleSubmit}>
                                <h5 className="title">{username}</h5>
                                <div className="UpdateForm form-outline mb-3" style={{ "width": "22rem" }}>
                                    <input
                                        className="UpdateCont form-control"
                                        id="formControlReadonly"
                                        value={nickname}
                                        type="text"
                                        disabled
                                    />
                                </div>
                                <div className="UpdateForm form-outline mb-3" style={{ "width": "22rem" }}>
                                    <input
                                        className="UpdateCont form-control"
                                        id="formControlReadonly"
                                        type="text"
                                        value={email}
                                        disabled
                                    />
                                </div>
                                <div className="UpdateForm form-outline mb-3" style={{ "width": "22rem" }}>
                                    <input
                                        className="UpdateCont form-control"
                                        id="formControlReadonly"
                                        type="text"
                                        value={belong}
                                        disabled
                                    />
                                </div>
                                <div className="oldPasswordWrap" style={{ "width": "22rem" }}>
                                    <MDBInput
                                        label="CURRENT PASSWORD"
                                        type="password"
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        value={oldPassword}
                                        required
                                        autoComplete="off"
                                        className="mt-3 oldPasswordData"
                                        contrast
                                    />
                                </div>
                                <div className="newPasswordWrap" style={{ "width": "22rem" }}>
                                    <MDBInput
                                        label="NEW PASSWORD"
                                        type="password"
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        value={newPassword}
                                        required
                                        autoComplete="off"
                                        className="mt-3 newPasswordData"
                                        contrast
                                    />
                                </div>
                                <div className="text-center">
                                    <button
                                        style={{ "width": "22rem" }}
                                        type="submit"
                                        className="btn btn-light mt-4"
                                        data-mdb-ripple-color="dark"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="InformCard">
                    <div className='Card'>
                        <h5 className="title">Solves</h5>
                        <div className="informLabel">Category</div>
                        <div className="informLabel">Challenge</div>
                        <div className="informLabel">Solve time</div>
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
                    </div>
                </div>
            </div >
        </div >
    );
}

