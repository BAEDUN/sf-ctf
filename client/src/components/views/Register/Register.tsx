import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import "./Register.css";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserApi, RegisterRequestDtoSectionEnum } from "../../../api"

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const NICK_REGEX = /^[0-9]{2}_[ㄱ-ㅎㅏ-ㅣ가-힣]{2,5}$/;

export default function Register() {
    const navigate = useNavigate();

    const userRef = useRef<any>(null);
    const errRef = useRef<any>(null);

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [nick, setNick] = useState('');
    const [validNick, setValidNick] = useState(false);
    const [nickFocus, setNickFocus] = useState(false);

    const [belong, setBelong] = useState<RegisterRequestDtoSectionEnum | undefined>(undefined);
    const [validBelong, setValidBelong] = useState(false);
    const [belongFocus, setBelongFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current?.focus();
    }, [userRef.current])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidNick(NICK_REGEX.test(nick));
    }, [nick])

    useEffect(() => {
        setValidBelong(!!belong);
    }, [belong])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd, email, nick, belong])

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        const v3 = EMAIL_REGEX.test(email);
        const v4 = NICK_REGEX.test(nick);
        const v5 = !!belong;
        if (!v1 || !v2 || !v3 || !v4 || !v5) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const userApi = new UserApi();
            const response = await userApi.usersControllerRegister({
                username: user,
                email,
                password: pwd,
                nickname: nick,
                isAdmin: false,
                isBanned: false,
                section: belong
            })
            console.log(response?.data);
            console.log(JSON.stringify(response))
            setSuccess(true);
            setUser('');
            setPwd('');
            setMatchPwd('');
            setEmail('');
            setNick('');
            setBelong(undefined)

            navigate("/login", { replace: true })
        } catch (err: any) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Duplicated id or email');
            } else {
                console.log(err.response);
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="/login">LOGIN</a>
                    </p>
                </section>
            ) : (
                <form className='Register mt-5' onSubmit={handleSubmit}>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <div className="Title">
                        <h1>REGISTER</h1>
                    </div>
                    <div className="RegForm">
                        <div className="userForm">
                            <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                            <MDBInput
                                label='Username'
                                name='username'
                                type='text'
                                inputRef={userRef}
                                onChange={(e) => setUser(e.target.value)}
                                value={user}
                                autoComplete="off"
                                required
                                aria-invalid={validName ? "false" : "true"}
                                aria-describedby="uidnote"
                                onFocus={() => setUserFocus(true)}
                                onBlur={() => setUserFocus(false)}
                                contrast />
                        </div>
                        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 ~ 24자.<br />
                            문자로 시작해야 합니다.<br />
                            문자, 숫자, 밑줄, 하이픈을 사용할 수 있습니다.
                        </p>
                        <div className="pwdForm">
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                            <MDBInput
                                label='Password'
                                name='password'
                                type='password'
                                className='mt-3'
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                autoComplete="off"
                                required
                                aria-invalid={validPwd ? "false" : "true"}
                                aria-describedby="pwdnote"
                                onFocus={() => setPwdFocus(true)}
                                onBlur={() => setPwdFocus(false)}
                                contrast />
                        </div>
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 ~ 24자.<br />
                            대문자와 소문자, 숫자 및 특수 문자를 포함해야 합니다.<br />
                            허용되는 특수 문자: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>
                        <div className="confirmPwdForm">
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                            <MDBInput
                                label='Confirm Password'
                                name='confirmPassword'
                                type='password'
                                className='mt-3'
                                onChange={(e) => setMatchPwd(e.target.value)}
                                value={matchPwd}
                                autoComplete="off"
                                required
                                aria-invalid={validMatch ? "false" : "true"}
                                aria-describedby="confirmnote"
                                onFocus={() => setMatchFocus(true)}
                                onBlur={() => setMatchFocus(false)}
                                contrast />
                        </div>
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            첫 번째 비밀번호 입력 필드와 일치해야 합니다.
                        </p>
                        <div className="emailForm">
                            <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />

                            <MDBInput
                                label='E-Mail'
                                name='email'
                                type='email'
                                className='mt-3 d-flex align-items-center'
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                autoComplete="off"
                                required
                                aria-invalid={validEmail ? "false" : "true"}
                                aria-describedby="emailnote"
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => setEmailFocus(false)}
                                contrast />
                        </div>
                        <p id="emailnote" className={emailFocus && !validEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            이메일 형식에 맞게 입력해주세요.
                        </p>
                        <div className="nickForm">
                            <FontAwesomeIcon icon={faCheck} className={validNick ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validNick || !nick ? "hide" : "invalid"} />
                            <MDBInput
                                label='Nickname'
                                name='nickname'
                                type='text'
                                className='mt-3'
                                placeholder='18_홍길동'
                                onChange={(e) => setNick(e.target.value)}
                                value={nick}
                                autoComplete="off"
                                required
                                aria-invalid={validNick ? "false" : "true"}
                                aria-describedby="nicknote"
                                onFocus={() => setNickFocus(true)}
                                onBlur={() => setNickFocus(false)}
                                contrast />
                        </div>
                        <p id="nicknote" className={nickFocus && !validNick ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            학번_이름으로 입력해주세요.
                        </p>
                        <div className="belongForm mt-3">
                            <FontAwesomeIcon icon={faCheck} className={validBelong ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validBelong || !belong ? "hide" : "invalid"} />
                            <select
                                name='belong'
                                className="select-label"
                                required
                                aria-invalid={validBelong ? "false" : "true"}
                                aria-describedby="belongnote"
                                onChange={event => setBelong(event.target.value as RegisterRequestDtoSectionEnum)}
                                value={belong}
                                onFocus={() => setBelongFocus(true)}
                                onBlur={() => setBelongFocus(false)}
                            >
                                <option value={undefined}>소속 선택</option>
                                <option value="Security">정보보호학과</option>
                                <option value="Software">컴퓨터소프트웨어학과</option>
                                <option value="SecurityFirst">SecurityFirst</option>
                            </select>
                        </div>
                        <p id="belongnote" className={belongFocus && !validBelong ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            소속을 선택해주세요.
                        </p>
                        <MDBBtn type="submit" className='RegBtn text-dark mt-4' color='light' disabled={!validName || !validPwd || !validMatch || !validEmail || !validNick || !validBelong ? true : false}>
                            Register
                        </MDBBtn>
                    </div>
                </form>
            )
            }
        </>
    );
}