import React, { useState, useMemo, useEffect, useCallback, useContext } from 'react';
import { MDBInput } from 'mdb-react-ui-kit';
import { ToastContainer, toast } from 'react-toastify';
import "./Challenges.css";
import { ChallengeApi, GetAllChallengesResponseDtoChallengesInner } from "../../../api"
import { AuthContext } from '../../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import Challenge from './Challenge';

const loadStates = {
    pending: 0,
    notStarted: 1,
    loaded: 2
}

export default function Challenges() {
    const navigate = useNavigate();
    const challengePageState = useMemo<{
        categories: { [key: string]: boolean }
        showSolved: boolean,
    }>(() => JSON.parse(localStorage.getItem('challengePageState') || '{}'), []);
    const [challenges, setChallenges] = useState<GetAllChallengesResponseDtoChallengesInner[]>([]);
    const [categories, setCategories] = useState(challengePageState.categories || {});
    const [showSolved, setShowSolved] = useState(challengePageState.showSolved || false);
    const [solvedChallengeTitles, setSolvedChallengeTitles] = useState<string[]>([]);
    const [loadState, setLoadState] = useState(loadStates.pending);
    const { auth, setAuth } = useContext(AuthContext);

    const setSolved = useCallback((title: string) => {
        setSolvedChallengeTitles(solvedChallengeTitles => {
            if (!solvedChallengeTitles.includes(title)) {
                return [...solvedChallengeTitles, title]
            }
            return solvedChallengeTitles
        })
    }, []);

    const handleShowSolvedChange = useCallback((e: any) => {
        setShowSolved(e.target.checked)
    }, []);
    const handleCategoryCheckedChange = useCallback((e: any) => {
        setCategories((categories: any) => ({
            ...categories,
            [e.target.dataset.category]: e.target.checked
        }));
    }, []);

    if (!auth) {
        navigate("/", { replace: true });
        return null;
    }

    useEffect(() => {
        const action = async () => {
            const challengeApi = new ChallengeApi()
            const response = await challengeApi.challengeControllerGetAll({
                accessToken: auth.token
            });

            const {
                challenges
            } = response.data;

            setChallenges(challenges);
        }
        action();
    }, []);

    // useEffect(() => {
    //     const action = async () => {
    //         const { data, error } = await getPrivateSolves();
    //         if (error) {
    //             toast({ body: error, type: 'error' });
    //             return
    //         }

    //         setSolvedChallengeTitles(data.map(solve => solve.id));
    //     }
    //     action()
    // }, [toast])

    useEffect(() => {
        localStorage.challPageState = JSON.stringify({ categories, showSolved });
    }, [categories, showSolved]);

    const challengesToDisplay = useMemo(() => {
        let filtered = challenges
        if (!showSolved) {
            filtered = filtered.filter(challenge => !solvedChallengeTitles.includes(challenge.title!))
        }
        let filterCategories = false
        Object.values(categories).forEach(displayCategory => {
            if (displayCategory) filterCategories = true
        })
        if (filterCategories) {
            Object.keys(categories).forEach(category => {
                if (categories[category] === false) {
                    // Do not display this category
                    filtered = filtered.filter(challenge => challenge.category !== category)
                }
            })
        }

        filtered.sort((a, b) => {
            return a.score! - b.score!;
        })

        return filtered;
    }, [challenges, categories, showSolved, solvedChallengeTitles])

    const { categoryCounts, solvedCount } = useMemo(() => {
        const categoryCounts = new Map()
        let solvedCount = 0
        if (challenges !== null) {
            for (const challenge of challenges) {
                if (!categoryCounts.has(challenge.category)) {
                    categoryCounts.set(challenge.category, {
                        total: 0,
                        solved: 0
                    })
                }

                const solved = solvedChallengeTitles.includes(challenge.title!)
                categoryCounts.get(challenge.category).total += 1
                if (solved) {
                    categoryCounts.get(challenge.category).solved += 1
                }

                if (solved) {
                    solvedCount += 1
                }
            }
        }
        return { categoryCounts, solvedCount }
    }, [challenges, solvedChallengeTitles])

    return (
        <div className='Challenges'>
            <div className="ChallWrap">
                <div className="ChallFrame">
                    <div className="frameBody">
                        <div className="frameTitle">Filter</div>
                        <div className="showSolved">
                            <div className="formCheck">
                                <input type="checkbox" id="show_solved" className='formInput' />
                                <label htmlFor="show_solved" className='formLabel'>Show Solved (1/1 solved)</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ChallFrame">
                    <div className="frameBody">
                        <div className="frameTitle">Categories</div>
                        {
                            Array.from(categoryCounts.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([category, { solved, total }]) => {
                                return (
                                    <div key={category} className='categoryCheck'>
                                        <input id={`category-${category}`} data-category={category} className='formInput' type='checkbox' checked={categories[category]} onChange={handleCategoryCheckedChange} />
                                        <label htmlFor={`category-${category}`} className='formLabel'>{category} ({solved}/{total} solved)</label>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="ChallFrame">
                {
                    challengesToDisplay.map(challenge => {
                        return (
                            <Challenge
                                key={Math.random()}
                                challenge={challenge}
                                solved={solvedChallengeTitles.includes(challenge.title!)}
                                setSolved={setSolved}
                            />
                        )
                    })
                }
            </div>
        </div>
    );
}