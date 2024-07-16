'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Step1 {
    onNext: () => void;
    setDistributeImages: (images: number) => void;
}

const Step1: React.FC<Step1> = ({ onNext, setDistributeImages }) => {
    const [totalImages, setTotalImages] = useState<number>();
    const [percent, setPercent] = useState<number>(0);
    const [localDistributeImage, setLocalDistributeImage] = useState<number>();

    useEffect(() => {
        const fetchTotalImages = async () => {
            try {
                const res = await axios.get('/api/mock-images');
                setTotalImages(res.data);
            } catch (error) {
                console.error('error : ', error);
            }
        };

        fetchTotalImages();
    }, []);

    console.log(totalImages);

    useEffect(() => {
        const numDistributeImage = Math.floor(totalImages * (percent / 100));
        setLocalDistributeImage(numDistributeImage);
        setDistributeImages(numDistributeImage);
    }, [percent]);

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
                    </div>
                </div>
                <div className="btn_wrap">
                    <button type="button">이전</button>
                    <button onClick={onNext}>다음</button>
                </div>
            </div>
        </div>
    );
};

export default Step1;
