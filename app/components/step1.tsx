'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Images {
    totalImg: number;
    list: ImageItem[];
}

interface ImageItem {
    id: number;
    url: string;
}

const Step1: React.FC = () => {
    const [totalImages, setTotalImages] = useState<number>();
    const [percent, setPercent] = useState<number>(0);
    const [distributeImage, setDistributeImage] = useState<number>();

    useEffect(() => {
        axios
            .get('/api/images')
            .then((res) => setTotalImages(res.data.totalImg)) // 응답 데이터로 상태 업데이트
            .catch((err) => console.error('이미지 GET 에러 :', err)); // 오류 처리
    }, []);

    console.log(totalImages);

    const handleCalculate = () => {
        const numDistributeImage = Math.floor((percent / 100) * totalImages);
        setDistributeImage(numDistributeImage);
        console.log('이미지 비율 계산한 값 : ', numDistributeImage);
    };

    return (
        <div className="step">
            <div className="container">
                <div className="step_body">
                    <div className="title">step1</div>
                    <p className="total_image">총 이미지 갯수 : {totalImages} 개</p>
                    <div className="image_percent">
                        <b>작업에 분배할 이미지 비율을 설정해주세요</b>
                        <input
                            type="number"
                            onChange={(e) => {
                                return setPercent(parseFloat(e.currentTarget.value));
                            }}
                            defaultValue={percent}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                return handleCalculate();
                            }}
                        >
                            확인
                        </button>
                    </div>
                </div>
                <div className="btn_wrap">
                    <button type="button">이전</button>
                    <button type="button">다음</button>
                </div>
            </div>
        </div>
    );
};

export default Step1;
