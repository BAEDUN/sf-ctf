import React, { useState, useMemo, useEffect, useCallback, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import "./Challenges.css";
import { ChallengeApi, GetAllChallengesResponseDtoChallengesInner, CreateChallengeRequestDtoCategoryEnum } from "../../../api"
import { AuthContext } from '../../../context/AuthProvider';
import Challenge from './Challenge';

type Categories = {
    [CreateChallengeRequestDtoCategoryEnum.Forensic]: boolean;
    [CreateChallengeRequestDtoCategoryEnum.Misc]: boolean;
    [CreateChallengeRequestDtoCategoryEnum.Pwnable]: boolean;
    [CreateChallengeRequestDtoCategoryEnum.Reversing]: boolean;
    [CreateChallengeRequestDtoCategoryEnum.Web]: boolean;
}
const defaultCategories: Categories = {
    [CreateChallengeRequestDtoCategoryEnum.Forensic]: false,
    [CreateChallengeRequestDtoCategoryEnum.Misc]: false,
    [CreateChallengeRequestDtoCategoryEnum.Pwnable]: false,
    [CreateChallengeRequestDtoCategoryEnum.Reversing]: false,
    [CreateChallengeRequestDtoCategoryEnum.Web]: false,
}

export default function Challenges() {
    const [challenges, setChallenges] = useState<GetAllChallengesResponseDtoChallengesInner[]>([]);
    const [categories, setCategories] = useState<Categories>(defaultCategories);
    const [showSolved, setShowSolved] = useState(false);
    const [solvedChallengeTitles, setSolvedChallengeTitles] = useState<string[]>([]);
    const { auth } = useContext(AuthContext);

    const setSolved = useCallback((title: string) => {
        setSolvedChallengeTitles(solvedChallengeTitles => {
            if (!solvedChallengeTitles.includes(title)) {
                return [...solvedChallengeTitles, title]
            }
            return solvedChallengeTitles
        })
    }, []);

    const handleShowSolvedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setShowSolved(e.target.checked)
    }, []);

    useEffect(() => {
        if (!auth) {
            return;
        }
        const action = async () => {
            const challengeApi = new ChallengeApi(undefined, location.origin)
            const response = await challengeApi.challengeControllerGetAll({
                accessToken: auth.token
            });

            const {
                challenges
            } = response.data;

            setChallenges(challenges);
        }
        action();
    }, [auth]);

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

    const challengesToDisplay = useMemo(() => {
        let filtered = challenges
        if (!showSolved) {
            filtered = filtered.filter(challenge => !challenge.solved)
        }
        const shouldFilter = Object.values(categories).some(checked => checked);
        if (shouldFilter) {
            filtered = filtered.filter(challenge => categories[challenge.category!])
        }
        filtered.sort((a, b) => {
            return a.score! - b.score!;
        })
        return filtered;
    }, [challenges, categories, showSolved, solvedChallengeTitles])

    const { categoryCounts, solvedCount } = useMemo(() => {
        const categoryCounts = new Map();
        let solvedCount = 0;
        if (challenges !== null) {
            for (const challenge of challenges) {
                if (!categoryCounts.has(challenge.category)) {
                    categoryCounts.set(challenge.category, {
                        total: 0,
                        solved: 0
                    });
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

    const CategoryCheck = useCallback((props: { category: CreateChallengeRequestDtoCategoryEnum }) => {
        const { category } = props;
        return <div className='categoryCheck'>
            <input id={`category-${category}`} className='formInput' type='checkbox' checked={categories[category]} onChange={(event) => setCategories(categories => {
                return { ...categories, [category]: event.target.checked };
            })} />
            <label htmlFor={`category-${category}`} className='formLabel'>{category} ({categoryCounts.get(category)?.solved || 0}/{categoryCounts.get(category)?.total || 0} solved)</label>
        </div>
    }, [categories, categoryCounts]);

    return (
        <div className='Challenges'>
            <div className="Row">
                <div className="Col-1">
                    <div className="ChallFrame">
                        <div className="frameBody">
                            <div className="frameTitle">Filter</div>
                            <div className="showSolved">
                                <div className="formCheck">
                                    <input type="checkbox" id="show_solved" className='formInput' checked={showSolved} onChange={handleShowSolvedChange} />
                                    <label htmlFor="show_solved" className='formLabel'>Show Solved ({solvedCount}/{challenges.length} solved)</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ChallFrame">
                        <div className="frameBody">
                            <div className="frameTitle">Categories</div>
                            <CategoryCheck category={CreateChallengeRequestDtoCategoryEnum.Forensic} />
                            <CategoryCheck category={CreateChallengeRequestDtoCategoryEnum.Misc} />
                            <CategoryCheck category={CreateChallengeRequestDtoCategoryEnum.Pwnable} />
                            <CategoryCheck category={CreateChallengeRequestDtoCategoryEnum.Reversing} />
                            <CategoryCheck category={CreateChallengeRequestDtoCategoryEnum.Web} />
                        </div>
                    </div>
                </div>
                <div className="Col-2">
                    {
                        challengesToDisplay.map(challenge => {
                            return (
                                <Challenge
                                    key={Math.random()}
                                    challenge={challenge}
                                    solved={challenge.solved!}
                                    setSolved={setSolved}
                                />
                            )
                        })
                    }
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
