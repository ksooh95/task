import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface WorkerAssignmentProps {
    onNext: (taskDistribution: { worker: string; tasks: number }[]) => void;
    tasks: number;
    mode: 'object' | 'task';
    objectCount: number;
}

const WorkerAssignment: React.FC<WorkerAssignmentProps> = ({ onNext, tasks, mode, objectCount }) => {
    const [workers, setWorkers] = useState<{ id: number; name: string }[]>([]);
    const [selectedWorkers, setSelectedWorkers] = useState<number[]>([]);

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const res = await axios.get('/api/users'); // API 요청을 통해 작업자 목록을 가져옴
                setWorkers(res.data); // 가져온 작업자 목록을 상태에 저장
            } catch (error) {
                console.error('Error fetching workers', error); // 에러 발생 시 로그 출력
            }
        };

        fetchWorkers(); // 함수 호출
    }, []);

    const handleWorkerSelect = (workerId: number) => {
        setSelectedWorkers(
            (prev) =>
                prev.includes(workerId)
                    ? prev.filter((id) => id !== workerId) // 선택된 작업자 해제
                    : [...prev, workerId] // 작업자 선택
        );
    };

    const distributeTasks = () => {
        if (selectedWorkers.length === 0) {
            alert('작업자를 선택해주세요.');
            return;
        }

        const workerCount = selectedWorkers.length;
        const tasksPerWorker = Math.floor(tasks / workerCount); // 작업자당 할당될 작업 수
        const extraTasks = tasks % workerCount; // 남은 작업 수

        const taskDistribution = selectedWorkers.map((workerId, index) => ({
            worker: workers.find((worker) => worker.id === workerId)?.name || 'Unknown',
            tasks: tasksPerWorker + (index < extraTasks ? 1 : 0), // 작업자에게 작업 할당
        }));

        onNext(taskDistribution); // 작업 분배 결과를 전달하고 다음 단계로 이동
    };

    return (
        <div>
            <h2>Step 3: 작업자 할당</h2>
            <p>작업자 목록:</p>
            {workers.map((worker) => (
                <div key={worker.id}>
                    <label>
                        <input
                            type="checkbox" // 체크박스 타입
                            checked={selectedWorkers.includes(worker.id)} // 작업자가 선택된 상태인지 확인
                            onChange={() => handleWorkerSelect(worker.id)} // 체크박스를 선택/해제할 때 상태 업데이트
                        />
                        {worker.name}
                    </label>
                </div>
            ))}
            <button onClick={distributeTasks}>작업 분배</button> {/* 작업을 분배하는 버튼 */}
        </div>
    );
};

export default WorkerAssignment; // 컴포넌트를 외부에서 사용할 수 있도록 export
