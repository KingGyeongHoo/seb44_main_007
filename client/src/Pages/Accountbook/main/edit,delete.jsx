import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import dot from "../../../Images/dot.png";
import DropdownExpend from "../side/category_dropdown_expend";
import DropdownProfit from "../side/category_dropdown_profit";
import { useSelector, useDispatch } from "react-redux";
import { setLoginMember } from "../../../Redux/loginMemberReducer";
import AWS from "aws-sdk";

const EditDelete = (props) => {
  const tradeId = props.tradeName;

  //수정, 삭제 모달 열기
  const [EditDeleteModalIsOpen, setEditDeleteModalIsOpen] = useState(false);

  const openEditDeleteModal = () => {
    setEditDeleteModalIsOpen(true);
  };

  const closeEditDeleteModal = () => {
    setEditDeleteModalIsOpen(false);
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  //** 수정 **
  //카테고리
  const [selectedOption, setSelectedOption] = useState();

  const handleChange = (option) => {
    setSelectedOption(option);
  };

  //입력창
  const [amountInput, setAmountInput] = useState();
  const [tradeName, setTradeName] = useState();
  const [noteInput, setNoteInput] = useState();

  const editAmountInput = (e) => {
    const inputValue = e.target.value;
    const numericValue = Number(inputValue.replace(/\D/g, ""));
    setAmountInput(numericValue);
  };

  const editTradeName = (e) => {
    setTradeName(e.target.value);
  };

  const editNoteInput = (e) => {
    setNoteInput(e.target.value);
  };

  //수정 모달열기
  const [EditModalIsOpen, setEditModalIsOpen] = useState(false);

  const info = useSelector((state) => state.loginMember.loginMember);
  const openEditModal = () => {
    setSelectedOption({
      label: info.trade.category,
      value: info.trade.category,
    });
    setAmountInput(info.trade.amount);
    setTradeName(info.trade.tradeName);
    setNoteInput(info.trade.note);
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => {
    setEditDeleteModalIsOpen(false);
    setEditModalIsOpen(false);
  };

  // 제출
  const dispatch = useDispatch();
  const s3 = new AWS.S3();
  const onEdit = (e) => {
    e.preventDefault();

    const editData = {
      tradeName: tradeName,
      amount: Number(amountInput),
      note: noteInput,
      category: selectedOption ? selectedOption.label : "",
    };
    const newInfo = { ...info, trade: [...info.trade, editData] };
    const jsonInfo = JSON.stringify(newInfo, null, 2);
    const params = {
      Bucket: "buyrricade",
      Key: `members/${info.email}.json`, // 업로드할 때 사용한 파일 경로 및 이름
      Body: jsonInfo,
      ContentType: "application/json",
    };
    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading file:", err);
      } else {
        dispatch(setLoginMember(newInfo));
        setAmountInput("");
        setTradeName("");
        setNoteInput("");
        closeEditModal()
      }
    });
  };

  //삭제
  const deleteData = async (e) => {
    const newInfo = { ...info, trade: info.trade.filter(el => el.tradeName !== tradeId)};
    const jsonInfo = JSON.stringify(newInfo, null, 2);
    const params = {
      Bucket: "buyrricade",
      Key: `members/${info.email}.json`, // 업로드할 때 사용한 파일 경로 및 이름
      Body: jsonInfo,
      ContentType: "application/json",
    };
    alert("삭제하시겠습니까?")
    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading file:", err);
      } else {
        dispatch(setLoginMember(newInfo));
        setAmountInput("");
        setTradeName("");
        setNoteInput("");
        closeEditModal()
      }
    });
  };

  return (
    <EditDeleteContainer>
      <img src={dot} alt="수정/삭제" onClick={openEditDeleteModal} />
      {EditDeleteModalIsOpen ? (
        <ModalBackdrop onClick={closeEditDeleteModal}>
          <ModalView onClick={handleModalClick}>
            <p>목표 지출 금액</p>
            <ModalInput>
              <button onClick={openEditModal}>수정</button>
              <button onClick={deleteData}>삭제</button>
            </ModalInput>
          </ModalView>
        </ModalBackdrop>
      ) : null}
      {EditModalIsOpen ? (
        <EditModalBackdrop onClick={closeEditModal}>
          <EditModalView onClick={handleModalClick}>
            <div>
              <Header>
                <p>{info.trade.date}</p>
                {info.trade.type === "수입" ? <p>수입</p> : <p>지출</p>}
              </Header>
              <SubmitInputWapper onSubmit={onEdit}>
                <SubmitInputContents>
                  <Title>카테고리</Title>
                  <Category>
                    {info.trade.type === "수입" ? (
                      <DropdownProfit
                        selectedOption={selectedOption}
                        handleChange={handleChange}
                      />
                    ) : (
                      <DropdownExpend
                        selectedOption={selectedOption}
                        handleChange={handleChange}
                      />
                    )}
                  </Category>
                </SubmitInputContents>
                <SubmitInputContents>
                  <Title>금액</Title>
                  <Input
                    name="expense"
                    type="text"
                    value={amountInput}
                    onChange={editAmountInput}
                  />
                </SubmitInputContents>
                <SubmitInputContents>
                  <Title>내역</Title>
                  <Input
                    name="tradeName"
                    type="text"
                    value={tradeName}
                    onChange={editTradeName}
                  />
                </SubmitInputContents>
                <SubmitInputContents>
                  <Title>노트</Title>
                  <NoteInput
                    name="note"
                    type="text"
                    value={noteInput}
                    onChange={editNoteInput}
                  />
                </SubmitInputContents>
                <Buttons>
                  <button type="submit">수정</button>
                  <button onClick={closeEditModal}>취소</button>
                </Buttons>
              </SubmitInputWapper>
            </div>
          </EditModalView>
        </EditModalBackdrop>
      ) : null}
    </EditDeleteContainer>
  );
};
export default EditDelete;

const EditDeleteContainer = styled.div`
  display: flex;
  align-items: center;
  > img {
    filter: invert(69%) sepia(0%) saturate(201%) hue-rotate(210deg)
      brightness(93%) contrast(90%);
    width: 20px;
    cursor: pointer;
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
  z-index: 9999;
`;

const ModalView = styled.div.attrs((props) => ({
  role: "dialog",
}))`
  text-align: center;
  text-decoration: none;
  padding: 50px 70px;
  background-color: white;
  border-radius: 20px;
  color: rgb(34, 34, 31);
  z-index: 10000;
  > p {
    font-weight: 500;
    font-size: 18px;
    margin-bottom: 20px;
  }
`;

const ModalInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  > button {
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

const EditModalBackdrop = styled.div`
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

//모달
const EditModalView = styled.div.attrs((props) => ({
  role: "dialog",
}))`
  text-align: center;
  text-decoration: none;
  padding: 50px 70px;
  background-color: white;
  border-radius: 20px;
  color: rgb(34, 34, 31);
  z-index: 10000;

  > p {
    font-weight: 500;
    font-size: 18px;
    margin-bottom: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  > p {
    font-size: 18px;
    font-weight: 500;
  }
`;

const SubmitInputWapper = styled.form`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const SubmitInputContents = styled.div`
  width: 250px;
  margin-bottom: 10px;
  padding: 10px 0;
  border-bottom: 2px solid rgb(210, 210, 210);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  &:nth-last-child(2) {
    display: flex;
    flex-direction: column;
    align-items: start;
    border-bottom: none;
    margin-bottom: 15px;
  }
`;
const Title = styled.div`
  padding-left: 10px;
`;

const Category = styled.div``;
const Input = styled.input`
  padding: 10px;
  border: none;
  text-align: right;
`;

const NoteInput = styled.input`
  width: 100%;
  height: 80px;
  margin-top: 10px;
  padding: 10px;
  border: 2px solid rgb(210, 210, 210);
  border-radius: 10px;
`;
const Buttons = styled.div`
  > button {
    height: 40px;
    padding: 0 15px;
    border: none;
    border-radius: 5px;
    font-weight: 600;
    color: white;
    background-color: rgb(246, 111, 60);
    cursor: pointer;
    &:hover {
      background-color: rgb(221, 93, 47);
    }
    &:last-child {
      margin-left: 10px;
    }
  }
`;
