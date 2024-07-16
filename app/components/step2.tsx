'use client';
import React, { useState } from 'react';

interface Step2 {
    onNext: () => void;
    onPrev: () => void;
    setMode: (mode: 'object' | 'task') => void;
    setObjectCount: (count: number) => void;
    setTaskCount: (count: number) => void;
}

const Step2: React.FC<Step2> = ({ onNext, onPrev, setObjectCount, setTaskCount, setMode }) => {
    const [localMode, setLocalMode] = useState<'object' | 'task'>('object'); // 모드를 로컬 상태로 관리
    const [localObjectCount, setLocalObjectCount] = useState<number>(0); // Object의 개수를 로컬 상태로 관리
    const [localTaskCount, setLocalTaskCount] = useState<number>(0); // Task의 개수를 로컬 상태로 관리

    console.log(localMode);
    console.log(localTaskCount);
    console.log(localObjectCount);
    return (
        <div className="step">
            <div className="container">
                <div className="step_body">
                    <div className="title">Step 2</div>
                    <b className="check_mode_title">Mode를 선택해주세요 !</b>
                    <div className="check_mode">
                        <input
                            type="radio"
                            id="object_mode"
                            name="mode_select"
                            onChange={() => {
                                setLocalMode('object');
                                setMode('object'); // 부모 컴포넌트에 모드 보내줌
                            }}
                            checked={localMode === 'object'}
                        />
                        <label htmlFor="object_mode">Object Mode</label>
                        <input
                            type="radio"
                            id="task_mode"
                            name="mode_select"
                            onChange={() => {
                                setLocalMode('task');
                                setMode('task'); // 부모 컴포넌트에 모드 보내줌
                            }}
                            checked={localMode === 'task'}
                        />
                        <label htmlFor="task_mode">Task Mode</label>
                    </div>
                    {localMode === 'task' ? (
                        <div className="task_mode_content">
                            <b className="tmc_title">Task Mode</b>
                            <div className="tmc">
                                <p>생성할 작업의 갯수를 입력해주세요</p>
                                <input
                                    type="text"
                                    onChange={(e) => {
                                        const value = Number(e.currentTarget.value); // 입력 값을 숫자로 변환
                                        setLocalTaskCount(value); // 로컬 상태 업데이트
                                        setTaskCount(value); // 부모 컴포넌트에 값 전달
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="task_mode_content">
                            <b className="tmc_title">Object Mode</b>
                            <div className="tmc">
                                <p>한 작업에 포함될 object의 개수를 입력해주세요</p>
                                <input
                                    type="text"
                                    onChange={(e) => {
                                        const value = Number(e.currentTarget.value); // 입력 값을 숫자로 변환
                                        setLocalObjectCount(value); // 로컬 상태 업데이트
                                        setObjectCount(value); // 부모 컴포넌트에 값 전달
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className="btn_wrap">
                    <button type="button" onClick={onPrev}>
                        이전
                    </button>
                    <button onClick={onNext}>다음 단계</button>
                </div>
            </div>
        </div>
    );
};

export default Step2;
