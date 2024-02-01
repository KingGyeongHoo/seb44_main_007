import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import { styled } from 'styled-components';
import {setLoginMember} from "../../../Redux/loginMemberReducer";
import AWS from 'aws-sdk'
const TargetAmountModal = () => {
  const dispatch = useDispatch()
  const s3 = new AWS.S3();
  
  //모달 열기
  const [modalIsOpen, setModalIsOpen] = useState(false);
  
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleTarget();
    }
  };


  //목표 지출 금액 리듀서
  const [inputTarget, setInputTarget] = useState(0);

  const handleNumberChange = (e) => {
    const number = e.target.value;
    const numerValue = number.replace(/\D/g, '');
    setInputTarget(parseInt(numerValue));
  };

  const info = useSelector(state => state.loginMember.loginMember)
  const handleTarget = () => {
    const newInfo = {...info, goal: inputTarget}
    const jsonInfo = JSON.stringify(newInfo, null, 2)
    const params = {
      Bucket: 'buyrricade',
      Key: `members/${info.email}.json`, // 업로드할 때 사용한 파일 경로 및 이름
      Body: jsonInfo,
      ContentType: 'application/json',
    };
    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading file:', err);
      } else {
        dispatch(setLoginMember(newInfo));
        closeModal()
      }
    });
    
  };

  return (
    <>
      <ModalBtn onClick={openModal}>설정</ModalBtn>
      {modalIsOpen ? 
      <ModalBackdrop onClick={closeModal}>
        <ModalView onClick={handleModalClick}>
          <p>목표 지출 금액</p>
          <ModalInput>
            <input
              type="text"
              value={inputTarget}
              placeholder={inputTarget}
              onChange={handleNumberChange}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleTarget}>저장</button>
          </ModalInput>
        </ModalView>
      </ModalBackdrop> 
      : null}
    </>
  );
}

export default TargetAmountModal;

const ModalBtn = styled.button`
  background: rgba(246, 111, 60, 0.5);
  text-decoration: none;
  padding: 4px 7px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
      background-color: rgba(221, 93, 47, 0.5);
    }
`;

const ModalBackdrop = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-flow: row wrep;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
`;

const ModalView = styled.div.attrs(props => ({
  role: 'dialog'
}))`
  text-align: center;
  text-decoration: none;
  padding: 50px 70px;
  background-color: white;
  border-radius: 20px;
  color: rgb(34, 34, 31);
  z-index: 10000;

  >p{
    font-weight: 500;
    font-size: 18px;
    margin-bottom: 20px;
  }
`;

const ModalInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  >input{
    width: 130px;
    height: 40px;
    padding: 5px;
    margin-right: 15px;
    color: rgb(34, 34, 31);
    border: none;
    border-bottom: 1px solid rgb(246, 111, 60);
    font-size: 18px;
    text-align: right;
  }
  >button {
    height: 40px;
    padding: 0 15px;
    margin-right: 10px;
    text-align: right;
    border: none;
    border-radius: 5px;
    font-weight: 600;
    color: white;
    background-color: rgb(246, 111, 60);
    cursor: pointer;
    &:hover {
      background-color: rgb(221, 93, 47);
    }
  }  
`;