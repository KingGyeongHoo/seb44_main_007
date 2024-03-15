import { useState } from "react";
import { styled } from 'styled-components'
import { CategoryCircle } from './Wishlists'
import { LimitInput } from './Wishlist'
import Palette from "../../Palette/Palette";
import { useSelector, useDispatch } from 'react-redux';
import {setLoginMember} from "../../Redux/loginMemberReducer";
import {setDataList} from "../../Redux/wishlist_reducer"
import AWS from 'aws-sdk'
export const ModalBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const ModalContainer = styled.div`
  width: 25%;
  height: 60%;
  border-radius: 20px;
  background-color: #22221F;
  padding: 80px 50px;
  z-index: 20;
`
export const ModalDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
const ModalMenuDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20%;
  padding: 1%;
  border-bottom: 1px solid white;
`
const ModalTitleDiv = styled.div`
  width: 60%;
  margin-bottom: 10px;
  text-align: left;
`
const ModalTitle = styled.span`
  width: 50%;
  color: white;
  font-size: 1rem;
`
const ModalContentDiv = styled.div`
  width: 50%;
  text-align: left;
`
const CategorySelect = styled.select`
  width: 100%;
  background-color: rgba(0,0,0,0);
  border: 0px;
  color: white;
  background-color: #22221F;
  padding: 5px;
  font-size: 1rem;
  outline: none;
`
const ModalButtonDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 15%;
`
const ModalButton = styled.button`
  border: none;
  border-radius: 10px;
  padding: 10px;
  width: 20%;
  background-color: ${props => props.save ? '#F9591D' : '#C0C0C0'};
  color: ${props => props.save ? 'white' : 'black'};
  margin: 0px 10%;
  cursor: pointer;
`

export default function Modal({setOpenModal, editMode, setEditMode, item}){
  const close = () => {
    setEditMode(false)
    setOpenModal(false)
  }

  const s3 = new AWS.S3()
  const dispatch = useDispatch()
  const info = useSelector(state => state.loginMember.loginMember)
  const category = ['식비_간식','주거_통신','교통_차량','생활_마트','의류_미용','의료_건강','교육_문화','보험_세금']
  const [addCategory, setAddCategory] = useState('식비_간식')
  const [addName, setAddName] = useState()
  const [addPrice, setAddPrice] = useState()

  const date = new Date()
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  const wishlist = useSelector(state => state.wishlist)

  const addWishlist = () =>{
    const newWishlist = {
      "createdAt": today,
      "modifiedAt": today,
      "wishlistName": addName,
      "price": Number(addPrice),
      "category": addCategory,
      "priority": wishlist.list.length
      }
      dispatch(setDataList([...info.wishList, newWishlist]))
      const newInfo = {...info, wishList:[...info.wishList, newWishlist]}
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
            close()
        }
        });
  }
  const editWishlist = () => {
    const editedWishlist = {
      'wishlistName': addName,
      'price': Number(addPrice),
      'category': addCategory,
    }
    const newInfo = {...info, wishList:[...info.wishList, editedWishlist]}
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
            setAddCategory()
            setAddName()
            setAddPrice()
            close()
        }
        });
    
  }
  return(
    <ModalBackground onClick={close}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalDiv>
          <ModalMenuDiv>
            <ModalTitleDiv>
              <ModalTitle>카테고리</ModalTitle>
            </ModalTitleDiv>
            <CategoryCircle bgcolor={addCategory === undefined ? Palette[item.category] : Palette[addCategory]} />
            <ModalContentDiv>
              <CategorySelect
                value={addCategory}
                onChange={(e)=> setAddCategory(e.target.value)}
              >
                {category.map(el => {
                  return(
                    <option value={el}>
                      {el}
                    </option>
                  )
                })}
              </CategorySelect>
            </ModalContentDiv>
          </ModalMenuDiv>
          <ModalMenuDiv>
            <ModalTitleDiv>
              <ModalTitle>항목</ModalTitle>
            </ModalTitleDiv>
            <ModalContentDiv>
              <LimitInput
                type='input'
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                fontsize='1rem'
                placeholder='항목을 입력하세요'
                ></LimitInput>
            </ModalContentDiv>
          </ModalMenuDiv>
          <ModalMenuDiv>
            <ModalTitleDiv>
              <ModalTitle>금액</ModalTitle>
            </ModalTitleDiv>
            <ModalContentDiv>
              <LimitInput
                type='input'
                value={addPrice}
                onChange={(e) => {
                  const input = e.target.value;
                  const regex = /^\d+$/; // 숫자로만 이루어진 문자열을 나타내는 정규 표현식
              
                  if (!regex.test(input)) {
                      alert('금액은 숫자만 입력할 수 있습니다');
                  } else {
                      setAddPrice(input);
                  }
              }}
                fontsize='1rem'
                placeholder='금액을 입력하세요'
                ></LimitInput>
            </ModalContentDiv>
          </ModalMenuDiv>
          <ModalButtonDiv>
            <ModalButton save={true} onClick={editMode ? editWishlist : addWishlist}>저장</ModalButton>
            <ModalButton save={false} onClick={close}>취소</ModalButton>
          </ModalButtonDiv>
        </ModalDiv>
      </ModalContainer>
    </ModalBackground>
  )
}