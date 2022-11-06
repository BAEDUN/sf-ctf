import React, { useState, useCallback, useRef, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { ChallengeApi, FileApi, GetAllChallengesResponseDtoChallengesInner } from "../../../api";
import { AuthContext } from '../../../context/AuthProvider';

export default function Challenge(props: { challenge: GetAllChallengesResponseDtoChallengesInner, solved: boolean, setSolved: (title: string) => void }) {
    const { challenge, solved, setSolved } = props;
    const hasDownloads = challenge.fileList!.length !== 0;

    const [error, setError] = useState(undefined);
    const hasError = error !== undefined;

    const [value, setValue] = useState('');
    const handleInputChange = useCallback((e: any) => setValue(e.target.value), []);
    const { auth } = useContext(AuthContext);

    const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!auth) {
            console.log("no auth")
            return;
        }
        const challengeApi = new ChallengeApi();
        await challengeApi.challengeControllerSubmitFlag({
            accessToken: auth.token,
            title: challenge.title!,
            flag: value.trim()
        })
            .then((response) => {
                const {
                    success,
                } = response.data;
                if (success === true) {
                    toast.success('플래그가 제출되었습니다!', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });

                    setSolved(challenge.title!)
                } else {
                    toast.error('플래그가 제출되지 않았습니다!', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    setError(error);
                }
            })
    }, [auth, toast, setSolved, challenge, value]);

    const [solves, setSolves] = useState(null)
    const [solvesPending, setSolvesPending] = useState(false)
    const [solvesPage, setSolvesPage] = useState(1)
    const modalBodyRef = useRef(null)

    // const handleSetSolvesPage = useCallback(async (newPage: any) => {
    //     const { kind, message, data } = await getSolves({
    //         challId: problem.id,
    //         limit: solvesPageSize,
    //         offset: (newPage - 1) * solvesPageSize
    //     })
    //     if (kind !== 'goodChallengeSolves') {
    //         toast({ body: message, type: 'error' })
    //         return
    //     }
    //     setSolves(data.solves)
    //     setSolvesPage(newPage)
    //     modalBodyRef.current.scrollTop = 0
    // }, [problem.id, toast])

    // // const onSolvesClick = useCallback(async (e) => {
    // //     e.preventDefault()
    // //     if (solvesPending) {
    // //         return
    // //     }
    // //     setSolvesPending(true)
    // //     const { kind, message, data } = await getSolves({
    // //         challId: problem.id,
    // //         limit: solvesPageSize,
    // //         offset: 0
    // //     })
    // //     setSolvesPending(false)
    // //     if (kind !== 'goodChallengeSolves') {
    // //         toast({ body: message, type: 'error' })
    // //         return
    // //     }
    // //     setSolves(data.solves)
    // //     setSolvesPage(1)
    // // }, [challenge.title, toast, solvesPending]);
    // const onSolvesClose = useCallback(() => setSolves(null), []);



    const download = useCallback(async (filename: string) => {
        if (!auth) {
            console.log('no auth');
            return null;
        }

        const response = await new FileApi(undefined, location.origin).fileControllerGet({
            accessToken: auth.token,
            filename,
        });
        const a = document.createElement("a");
        a.href = response.data.presignedUrl;
        a.download = filename;
        a.click();
    }, [auth]);

    return (
        <div className="ChallFrame">
            <div className='frameBody'>
                <div className='row u-no-padding'>
                    <div className='col-6 u-no-padding'>
                        <div className='frameTitle'>{challenge.category}/{challenge.title}</div>
                        {/* <div className='frameSubTitle u-no-margin'>{challenge.author}</div> */}
                    </div>
                    <div className='col-6 u-no-padding u-text-right'>
                        {/* <a
                            className={`points`}
                        >
                            {challenge.solves}
                            {challenge.solves === 1 ? ' solve / ' : ' solves / '}
                            {challenge.points}
                            {challenge.points === 1 ? ' point' : ' points'}
                        </a> */}
                    </div>
                </div>

                <div className='content-no-padding u-center'><div className="divider" /></div>

                <div className="description frameSubTitle">
                    {/* <Markdown content={challenge.description} components={markdownComponents} /> */}
                </div>
                <form className='form-section' onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <input
                            autoComplete='off'
                            autoCorrect='off'
                            className={`form-group-input input-small input ${hasError ? 'input-error' : ''} ${solved ? 'input-success' : ''}`}
                            placeholder={`Flag${solved ? ' (solved)' : ''}`}
                            value={value}
                            onChange={handleInputChange}
                        />
                        <button className='form-group-btn btn-small submit'>Submit</button>
                    </div>
                </form>
                {
                    hasDownloads &&
                    <div>
                        <p className='frame__subtitle u-no-margin'>Downloads</p>
                        <div className='tag-container'>
                            {
                                challenge.fileList!.map((filename) => {
                                    return (
                                        <a href="#" onClick={() => { download(filename) }}></a>
                                    )
                                })
                            }

                        </div>
                    </div>
                }
            </div>
        </div>
    );
}


