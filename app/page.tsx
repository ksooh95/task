'use client';

import Step1 from '@/app/components/step1';
import Step2 from '@/app/components/step2';
import Step3 from '@/app/components/step3';
import React, { useState } from 'react';

export default function Home() {
    const [step, setStep] = useState<number>(1);
    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);
    const [distributeImages, setDistributeImages] = useState<number>(0);
    const [mode, setMode] = useState<'object' | 'task'>('object');
    const [objectCount, setObjectCount] = useState<number>(0);
    const [taskCount, setTaskCount] = useState<number>(0);
    const [taskDistribution, setTaskDistribution] = useState<{ worker: string; tasks: number }[]>([]);

    console.log('비율계산 이미지 분개 값 :', distributeImages);
    console.log('모드 :', mode);
    console.log('task 갯수 :', taskCount);
    return (
        <div className="home">
            <div className="container">
                {step === 1 && <Step1 onNext={nextStep} setDistributeImages={setDistributeImages} />}
                {step === 2 && (
                    <Step2
                        onNext={nextStep}
                        onPrev={prevStep}
                        setMode={setMode}
                        setObjectCount={setObjectCount}
                        setTaskCount={setTaskCount}
                    />
                )}
                {step === 3 && (
                    <Step3
                        onNext={(distribution) => {
                            setTaskDistribution(distribution);
                            nextStep();
                        }}
                        tasks={mode === 'object' ? distributeImages / objectCount : taskCount}
                        mode={mode}
                        objectCount={objectCount}
                    />
                )}
                {step === 4 && <TaskDistributionResult taskDistribution={taskDistribution} />}
            </div>
        </div>
    );
}
