import React, { useState } from 'react';
import areas from './areas.json'; // areas.json 파일 import
import './bike.module.css';

const BikeSearch = () => {
    const [district, setDistrict] = useState('성북구'); // 자치구 초기값 설정
    const [selectedArea, setSelectedArea] = useState(''); // 세부 대여소 초기값 설정
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null); // 에러 상태 추가

    const handleSearch = async () => {
        console.log('검색 버튼 클릭됨');
        if (!selectedArea) {
            alert('대여소를 선택하세요.');
            return;
        }

        const apiKey = process.env.REACT_APP_API_KEY;
        const url = `http://openapi.seoul.go.kr:8088/${apiKey}/json/bikeList/1/1000/`; // URL 수정
        const startTime = Date.now(); // 시작 시간 측정
        try {
            const response = await fetch(url);
            const data = await response.json();

            const endTime = Date.now(); // 종료 시간 측정
            console.log(`API 응답 시간: ${endTime - startTime}ms`);

            console.log('API response:', data); // 응답 데이터 확인

            if (data && data.rentBikeStatus && data.rentBikeStatus.row) {
                const stationData = data.rentBikeStatus.row.find((station) =>
                    station.stationName.includes(selectedArea)
                );
                console.log('Station Data:', stationData); // 스테이션 데이터 확인
                if (stationData) {
                    setStatus(stationData);
                    setError(null); // 에러 상태 초기화
                } else {
                    setError('해당 대여소 정보를 찾을 수 없습니다.');
                    setStatus(null); // 상태 초기화
                }
            } else {
                setError('데이터를 불러올 수 없습니다.');
                setStatus(null); // 상태 초기화
            }
        } catch (error) {
            setError('데이터를 불러오는 중 오류가 발생했습니다.');
            setStatus(null); // 상태 초기화
        }
    };

    return (
        <div className="bike-container">
            <h1>실시간 대여 정보</h1>
            <div className="category-buttons">
                {Object.keys(areas).map((key) => (
                    <button key={key} onClick={() => setDistrict(key)}>
                        {key}
                    </button>
                ))}
            </div>
            <div className="search-box">
                <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
                    <option value="">대여소 선택</option>
                    {areas[district].map((area, index) => (
                        <option key={index} value={area.name}>
                            {area.name}
                        </option>
                    ))}
                </select>
                <button onClick={handleSearch}>검색</button>
            </div>
            {error && <div className="error">{error}</div>}
            {status && (
                <div className="bike-info">
                    <p>대여소 명: {status.stationName}</p>
                    <p>거치대 수: {status.rackTotCnt}</p>
                    <p>현재 자전거 수: {status.parkingBikeTotCnt}</p>
                </div>
            )}
        </div>
    );
};

export default BikeSearch;
