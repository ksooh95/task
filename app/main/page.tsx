
import React, { useState, useEffect } from 'react';
import axios from 'axios';

type User = {
  id: number;
  name: string;
};

type Task = {
  images: number;
  user?: User;
};

const TaskGeneration: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [totalImages, setTotalImages] = useState<number>(0);
  const [distributionRatio, setDistributionRatio] = useState<number>(0);
  const [imagesForTasks, setImagesForTasks] = useState<number>(0);
  const [mode, setMode] = useState<'object' | 'task'>('object');
  const [objectCount, setObjectCount] = useState<number>(0);
  const [taskCount, setTaskCount] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Fetch total images and users
    axios.get('/api/images').then(response => setTotalImages(response.data.length));
    axios.get('/api/users').then(response => setUsers(response.data));
  }, []);

  const handleNextStep = () => setStep(step + 1);
  const handlePrevStep = () => setStep(step - 1);

  const handleDistribution = () => {
    const images = Math.floor((totalImages * distributionRatio) / 100);
    setImagesForTasks(images);
    handleNextStep();
  };

  const handleTaskGeneration = () => {
    let newTasks: Task[] = [];
    if (mode === 'object') {
      // Generate tasks based on object count
      for (let i = 0; i < imagesForTasks; i += objectCount) {
        newTasks.push({ images: objectCount });
      }
    } else {
      // Generate tasks based on task count
      const imagesPerTask = Math.floor(imagesForTasks / taskCount);
      for (let i = 0; i < taskCount; i++) {
        newTasks.push({ images: imagesPerTask });
      }
    }
    setTasks(newTasks);
    handleNextStep();
  };

  const handleUserAssignment = () => {
    let assignedTasks = tasks.map((task, index) => ({
      ...task,
      user: users[index % users.length]
    }));
    setTasks(assignedTasks);
    handleNextStep();
  };

  const renderStep1 = () => (
    <div>
      <h2>Step 1: 이미지 분배 입력</h2>
      <p>총 이미지 개수: {totalImages}</p>
      <input
        type="number"
        value={distributionRatio}
        onChange={(e) => setDistributionRatio(parseInt(e.target.value))}
        placeholder="비율 입력 (%)"
      />
      <button onClick={handleDistribution}>다음 단계로</button>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h2>Step 2: 작업 생성 모드 선택</h2>
      <label>
        <input
          type="radio"
          value="object"
          checked={mode === 'object'}
          onChange={() => setMode('object')}
        />
        Object 기반 모드
      </label>
      <label>
        <input
          type="radio"
          value="task"
          checked={mode === 'task'}
          onChange={() => setMode('task')}
        />
        Task 기반 모드
      </label>
      {mode === 'object' && (
        <input
          type="number"
          value={objectCount}
          onChange={(e) => setObjectCount(parseInt(e.target.value))}
          placeholder="Object 개수"
        />
      )}
      {mode === 'task' && (
        <input
          type="number"
          value={taskCount}
          onChange={(e) => setTaskCount(parseInt(e.target.value))}
          placeholder="Task 개수"
        />
      )}
      <button onClick={handleTaskGeneration}>다음 단계로</button>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h2>Step 3: 작업자 할당</h2>
      <button onClick={handleUserAssignment}>작업자 할당</button>
    </div>
  );

  const renderStep4 = () => (
    <div>
      <h2>Step 4: 분배 결과 확인</h2>
      <table>
        <thead>
          <tr>
            <th>Task 번호</th>
            <th>이미지 개수</th>
            <th>작업자</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{task.images}</td>
              <td>{task.user?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step > 1 &&

 <button onClick={handlePrevStep}>이전 단계로</button>}
    </div>
  );
};

export default TaskGeneration;
```

### 사고력과 문제 해결 과정 기술

#### 캘린더 컴포넌트

**문제 분석:**
캘린더 컴포넌트를 구현해야 하며, 사용자가 시작일과 종료일을 선택할 수 있어야 하고, 전달과 다음 달로만 이동할 수 있어야 합니다.

**고려 사항:**
1. **상태 관리:** 선택한 날짜와 현재 월을 관리해야 합니다.
2. **UI/UX:** 사용자가 직관적으로 날짜를 선택하고 월을 이동할 수 있어야 합니다.
3. **유효성 검사:** 날짜 선택이 유효한 범위 내에서 이루어져야 합니다.
4. **재사용성:** 코드가 재사용 가능하고 유지보수하기 쉽게 작성되어야 합니다.

**해결 과정:**
1. **상태 관리:** `useState`를 사용하여 `selectedDates`, `currentMonth`, `currentYear`를 관리했습니다.
2. **날짜 선택 로직:** 사용자가 클릭한 날짜를 `selectedDates`에 저장하는 `handleDateClick` 함수를 구현했습니다.
3. **캘린더 렌더링:** 현재 월의 모든 날짜를 렌더링하고, 선택된 날짜를 하이라이트하는 `renderCalendar` 함수를 작성했습니다.
4. **월 이동 기능:** 이전 달과 다음 달로 이동할 수 있는 `previousMonth`와 `nextMonth` 함수를 구현했습니다.
5. **스타일링:** CSS를 사용하여 선택된 날짜와 현재 월을 시각적으로 구분했습니다.

**결정 이유:**
- `useState`를 사용하여 상태를 관리한 이유는 React의 기본 상태 관리 방법을 따르는 것이며, 코드의 간결성과 가독성을 높이기 위해서입니다.
- `handleDateClick` 함수에서 날짜 선택 로직을 구현한 이유는 사용자 경험을 향상시키기 위해서입니다.
- CSS를 통해 시각적으로 구분한 이유는 사용자가 선택한 날짜와 현재 월을 쉽게 식별할 수 있도록 하여 UX를 개선하기 위함입니다.

#### Task Generation 페이지

**문제 분석:**
Task Generation 페이지는 사용자에게 데이터를 입력받아 총 3단계에 걸쳐 작업을 생성하는 기능을 구현해야 합니다.

**고려 사항:**
1. **데이터 흐름:** 단계별로 데이터를 입력받고, 이를 다음 단계로 전달해야 합니다.
2. **API 통신:** 총 이미지 개수와 작업자 목록을 API를 통해 받아와야 합니다.
3. **사용자 입력 검증:** 사용자가 입력한 데이터의 유효성을 검증해야 합니다.
4. **유연성:** 다양한 작업 생성 모드를 지원해야 합니다.

**해결 과정:**
1. **단계별 상태 관리:** 각 단계를 `useState`로 관리하여 사용자가 단계별로 데이터를 입력하고 이동할 수 있도록 했습니다.
2. **API 호출:** `useEffect`를 사용하여 초기 데이터를 가져왔습니다.
3. **입력 검증 및 계산:** 사용자가 입력한 비율에 따라 작업에 할당할 이미지 개수를 계산하고, 선택된 모드에 따라 작업을 생성하는 로직을 구현했습니다.
4. **작업자 할당:** 생성된 작업을 작업자에게 순차적으로 할당하는 로직을 구현했습니다.
5. **결과 표시:** 생성된 작업과 할당된 작업자를 표 형태로 시각적으로 표시했습니다.

**결정 이유:**
- `useEffect`를 사용하여 초기 데이터를 가져온 것은 컴포넌트가 마운트될 때 한 번만 데이터를 가져오기 위해서입니다.
- 단계별로 상태를 관리한 이유는 각 단계의 데이터가 독립적으로 관리될 수 있도록 하여 코드의 명확성과 유지보수성을 높이기 위해서입니다.
- 작업 생성 모드를 유연하게 선택할 수 있도록 한 것은 다양한 요구사항을 충족하기 위해서입니다.
- 작업자 할당 로직을 구현한 것은 공정하게 작업을 분배하고, 사용자에게 분배 결과를 명확하게 보여주기 위해서입니다.

---

위와 같이 사고 과정과 문제 해결 과정을 기술하면, 코드 작성의 모든 단계에서 어떤 고려 사항이 있었고, 왜 특정한 결정을 내렸는지를 명확하게 설명할 수 있습니다. 이는 문제 해결 능력과 사고력을 잘 드러낼 수 있는 방법입니다.

자세한 정보는 [여기](https://chatgptonline.tech/ko/)에서 확인할 수 있습니다.

컬러링 페이지를 무료로 생성해 보세요! [컬러링 페이지 - 무료 컬러링 페이지 생성기](https://chatgpt.com/g/g-ruZSEkBsB-coloring-pages-free-coloring-page-generator)를 방문해보세요!