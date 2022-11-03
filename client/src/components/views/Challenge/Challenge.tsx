import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MDBInput } from 'mdb-react-ui-kit';
import { ToastContainer, toast } from 'react-toastify';
import "./Challenge.css";

const loadStates = {
    pending: 0,
    notStarted: 1,
    loaded: 2
}

export default function Challenge() {
    const challengePageState = useMemo(() => JSON.parse(localStorage.getItem('challengePageState') || '{}'), [])
    const [problems, setProblems] = useState(null)
    const [categories, setCategories] = useState(challengePageState.categories || {})
    const [showSolved, setShowSolved] = useState(challengePageState.showSolved || false)
    const [solveIDs, setSolveIDs] = useState([])
    const [loadState, setLoadState] = useState(loadStates.pending)

    const setSolved = useCallback((id: any) => {
        setSolveIDs(solveIDs => {
            if (!solveIDs.includes(id)) {
                return [...solveIDs, id]
            }
            return solveIDs
        })
    }, [])

    const handleShowSolvedChange = useCallback(e => {
        setShowSolved(e.target.checked)
    }, [])
    const handleCategoryCheckedChange = useCallback(e => {
        setCategories((categories: any) => ({
            ...categories,
            [e.target.dataset.category]: e.target.checked
        }))
    }, [])

    useEffect(() => {
        const action = async () => {
            if (problems !== null) {
                return
            }
            const { data, error, notStarted } = await getChallenges()
            if (error) {
                toast({ body: error, type: 'error' })
                return
            }

            setLoadState(notStarted ? loadStates.notStarted : loadStates.loaded)
            if (notStarted) {
                return
            }

            const newCategories = { ...categories }
            data.forEach(problem => {
                if (newCategories[problem.category] === undefined) {
                    newCategories[problem.category] = false
                }
            })

            setProblems(data)
            setCategories(newCategories)
        }
        action()
    }, [toast, categories, problems])

    useEffect(() => {
        const action = async () => {
            const { data, error } = await getPrivateSolves()
            if (error) {
                toast({ body: error, type: 'error' })
                return
            }

            setSolveIDs(data.map(solve => solve.id))
        }
        action()
    }, [toast])

    useEffect(() => {
        localStorage.challPageState = JSON.stringify({ categories, showSolved })
    }, [categories, showSolved])

    const problemsToDisplay = useMemo(() => {
        if (problems === null) {
            return []
        }
        let filtered = problems
        if (!showSolved) {
            filtered = filtered.filter(problem => !solveIDs.includes(problem.id))
        }
        let filterCategories = false
        Object.values(categories).forEach(displayCategory => {
            if (displayCategory) filterCategories = true
        })
        if (filterCategories) {
            Object.keys(categories).forEach(category => {
                if (categories[category] === false) {
                    // Do not display this category
                    filtered = filtered.filter(problem => problem.category !== category)
                }
            })
        }

        filtered.sort((a, b) => {
            if (a.points === b.points) {
                if (a.solves === b.solves) {
                    const aWeight = a.sortWeight || 0
                    const bWeight = b.sortWeight || 0

                    return bWeight - aWeight
                }
                return b.solves - a.solves
            }
            return a.points - b.points
        })

        return filtered
    }, [problems, categories, showSolved, solveIDs])

    const { categoryCounts, solvedCount } = useMemo(() => {
        const categoryCounts = new Map()
        let solvedCount = 0
        if (problems !== null) {
            for (const problem of problems) {
                if (!categoryCounts.has(problem.category)) {
                    categoryCounts.set(problem.category, {
                        total: 0,
                        solved: 0
                    })
                }

                const solved = solveIDs.includes(problem.id)
                categoryCounts.get(problem.category).total += 1
                if (solved) {
                    categoryCounts.get(problem.category).solved += 1
                }

                if (solved) {
                    solvedCount += 1
                }
            }
        }
        return { categoryCounts, solvedCount }
    }, [problems, solveIDs])

    if (loadState === loadStates.pending) {
        return null
    }

    if (loadState === loadStates.notStarted) {
        return <NotStarted />
    }

    return (
        <div className='Challenge'>
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
                        <div className="categoryCheck">
                            <div className="webCheck">
                                <input type="checkbox" id="category_web" data-category="web" className='formInput' />
                                <label htmlFor="category_web" className='formLabel'>web (1/1 solved)</label>
                            </div>
                            <div className="revCheck">
                                <input type="checkbox" id="category_rev" data-category="rev" className='formInput' />
                                <label htmlFor="category_rev" className='formLabel'>rev (1/1 solved)</label>
                            </div>
                            <div className="pwnCheck">
                                <input type="checkbox" id="category_pwn" data-category="pwn" className='formInput' />
                                <label htmlFor="category_pwn" className='formLabel'>pwn (1/1 solved)</label>
                            </div>
                            <div className="forCheck">
                                <input type="checkbox" id="category_for" data-category="for" className='formInput' />
                                <label htmlFor="category_for" className='formLabel'>for (1/1 solved)</label>
                            </div>
                            <div className="miscCheck">
                                <input type="checkbox" id="category_misc" data-category="misc" className='formInput' />
                                <label htmlFor="category_misc" className='formLabel'>misc (1/1 solved)</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ChallFrame">
                    <div className="frameBody">

                    </div>
                </div>
            </div>
        </div >
    );
}