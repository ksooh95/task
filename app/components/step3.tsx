'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Step3 {
    onNext: (distribution: { worker: string; tasks: number }[]) => void; // 작업 분배 결과를 전달하고 다음 단계로 이동하는 함수
    tasks: number; // 할당할 작업의 총 개수
    mode: 'object' | 'task'; // 모드 설정 ('object' 또는 'task')
    objectCount: number; // 각 작업에 포함될 object의 개수 (Object based 모드에서 사용)
}

const Step3: React.FC<Step3> = ({ onNext, tasks, mode, objectCount }) => {
    const [users, setUsers] = useState<string[]>([]);

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const res = await axios.get('/api/users'); // API 요청을 통해 작업자 목록을 가져옴
                setUsers(res.data); // 가져온 작업자 목록을 상태에 저장
            } catch (error) {
                console.error('Error fetching workers', error); // 에러 발생 시 로그 출력
            }
        };

        fetchWorkers(); // 함수 호출
    }, []); // 빈 배열을 두 번째 인수로 전달하여 컴포넌트가 마운트될 때만 실행되도록 설정

    const WorkerAssignment: React.FC<WorkerAssignmentProps> = ({ onNext, tasks, mode, objectCount }) => {
        const [workers, setWorkers] = useState<string[]>([]); // 작업자 목록 상태
        const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]); // 선택된 작업자 목록 상태

        useEffect(() => {
            const fetchWorkers = async () => {
                try {
                    const response = await axios.get('/api/users'); // API 요청을 통해 작업자 목록을 가져옴
                    setWorkers(response.data.users); // 가져온 작업자 목록을 상태에 저장
                } catch (error) {
                    console.error('Error fetching workers', error); // 에러 발생 시 로그 출력
                }
            };

            fetchWorkers(); // 함수 호출
        }, []); // 빈 배열을 두 번째 인수로 전달하여 컴포넌트가 마운트될 때만 실행되도록 설정

        const handleWorkerSelect = (worker: string) => {
            setSelectedWorkers((prev) =>
                prev.includes(worker) ? prev.filter((w) => w !== worker) : [...prev, worker]
            ); // 선택된 작업자 목록을 업데이트 (체크박스를 선택/해제할 때마다 상태 변경)
        };

        const distributeTasks = () => {
            const workerCount = selectedWorkers.length; // 선택된 작업자 수
            let taskDistribution;

            if (mode === 'object') {
                // Object based 모드: 각 작업에 포함될 object의 개수를 기준으로 작업을 생성합니다.
                const totalObjects = tasks * objectCount; // 총 object 개수
                const tasksPerWorker = Math.floor(totalObjects / workerCount); // 작업자당 할당될 작업 수
                const extraTasks = totalObjects % workerCount; // 남은 작업 수
                taskDistribution = selectedWorkers.map((worker, index) => ({
                    worker,
                    tasks: tasksPerWorker + (index < extraTasks ? 1 : 0), // 작업자에게 작업 할당
                }));
            } else {
                // Task based 모드: 생성할 작업의 개수를 기준으로 작업을 생성합니다.
                const tasksPerWorker = Math.floor(tasks / workerCount); // 작업자당 할당될 작업 수
                const extraTasks = tasks % workerCount; // 남은 작업 수
                taskDistribution = selectedWorkers.map((worker, index) => ({
                    worker,
                    tasks: tasksPerWorker + (index < extraTasks ? 1 : 0), // 작업자에게 작업 할당
                }));
            }

            onNext(taskDistribution); // 작업 분배 결과를 전달하고 다음 단계로 이동
        };

        console.log('user :', users);
        return (
            <div className="step">
                <div className="container">
                    <div className="step_body">
                        <div className="title">step3</div>
                        <b>작업자 분배</b>
                    </div>
                </div>
            </div>
        );
    };
};
export default Step3;
