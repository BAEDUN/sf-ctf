import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MDBInput } from 'mdb-react-ui-kit';
import { ToastContainer, toast } from 'react-toastify';
import "./Challenge.css";

export default function Challenge() {


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