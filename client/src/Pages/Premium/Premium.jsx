import { styled } from "styled-components";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../Wishlist/Wishlist";
import { ModalBackground, ModalContainer, ModalDiv } from "../Wishlist/Modal"
import { useNavigate } from 'react-router-dom';
import {setLoginMember} from "../../Redux/loginMemberReducer";
import axios from "axios"

const PremiumContainer = styled.div`
  width: calc(100% - 300px);
  height: 100vh;
  padding: 10px;
  background-color: #22221f;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const PremiumDiv = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
`;
const PremiumTitleDiv = styled.div`
  width: 100%;
  border-bottom: 2px solid white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 2% 1%;
  margin-bottom: 5%;
`
const TitleDiv = styled.div`
  width: 40%;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const Title = styled.span`
  font-size: 2.5rem;
  color: white;
  font-weight: 600;
`
const TitleLogo = styled.img`
  width: 40px;
  height: 40px;
  filter: invert(98%) sepia(49%) saturate(1122%) hue-rotate(26deg) brightness(100%) contrast(100%);
  margin-right: 10px;
`
const PayButton = styled(Button)`
  background-color: #F9591D;
  color: white;
  font-size: 14px;
  font-weight: bold;
  border: none;
  padding: 5px 10px;
`
const PremiumBodyDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
const PremiumBody = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  border: 7px solid #C5FF78; 
`
const PremiumBodyLeft = styled.div`
  position: relative;
  width: 20%;
  background-color: transparent;
  border-bottom: 200px solid #C5FF78; 
  border-right: 50px solid transparent;
`
const PremiumBodyLeftOdd = styled(PremiumBodyLeft)`
  border-right: 0px;
  border-left: 50px solid transparent;
`
const BodyLeftDiv = styled.div`
  position: absolute;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  left:15%;
  padding-top: 10%;
`
const BodyLeftDivOdd = styled(BodyLeftDiv)`
  left:0%;
  right: 15%;
`
const BodyLeftImg = styled.img`
  width: 50%;
  filter: invert(31%) sepia(37%) saturate(429%) hue-rotate(87deg) brightness(88%) contrast(89%);
  margin-bottom: 7%;
`
const BodyLeftSpan = styled.span`
  color: #365A42;
  font-size: 1.2rem;
  font-weight: bold;
`
const PremiumBodyRight = styled.div`
  width: 80%;
  background-color: transparent;
  position: relative;
  display: flex;
  justify-content: center;
`
const BodyRightDiv = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const BodyRightDivOdd = styled(BodyRightDiv)`
  align-items: flex-end;
`
const BodyRightTitle = styled.span`
  color: white;
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 16px;
`
const BodyRightDescribe = styled.span`
  color: #ffffffc6;
`
const PaymentTitleDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const PaymentTitle = styled(Title)`
  font-size: 1.2rem;
  margin: 0px 1%;
`
const PaymentBodyDiv = styled.div`
  width: 100%;
`
const PaymentUl = styled.ul`
   color: white;
   padding: 1%;
   list-style-position : inside;
`
const PaymentLi = styled.li`
   margin: 15% 0px;
   font-size: 1.2rem;
`
const PayButtonDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5%;
`
const PayBtn = styled(PayButton)`
  width:100%;
  padding: 5%;
`
const PayContainer = styled(ModalContainer)`
  width: 40%;
  z-index: 20;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const PayTypeDiv = styled.div`
  width: 60%;
  display: flex;
`
const PayTypeContainer = styled.div`
  width: 20%;
  height: 20%;
  background-color: #D9D9D9;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px;
  margin: 10px;
`
const PayTypeImg = styled.img`
  width: 70%;
`
const PayTypeSpan = styled.span`
  width:100%;
  color: black;
  text-align: center;
  font-weight: bold;
  font-size: 0.8rem;
`
const PayInfoDiv = styled.div`
  width: 30%;
  height: 100%;
  background-color: #D9D9D9;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
`
const PaySpanDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10%;
  margin-bottom: 10%;
`
const PaySpan = styled.span`
  color: ${props => props.color};
  font-size: ${props => props.size};
  font-weight: bold;
`
const PaymentModal = ({closeModal}) => {
  const [onPayment, setOnPayment] = useState(false)
  const dispatch = useDispatch()

  const memberInfo = useSelector((state) => state.loginMember.loginMember);

  const kakaoPayment = () => {
    const newInfo = {
      ...memberInfo,
      info: { ...memberInfo.info, premium: true },
    };

    const params = {
        cid: "TC0ONETIME",
        partner_order_id: "partner_order_id",
        partner_user_id: "partner_user_id",
        item_name: "정기결제",
        quantity: 1,
        total_amount: 2000,
        vat_amount: 0,
        tax_free_amount: 0,
        approval_url: "https://buyrricade.netlify.app/paying",
        fail_url: "https://buyrricade.netlify.app/paying",
        cancel_url: "https://buyrricade.netlify.app/paying",
      }
    axios.post('https://kapi.kakao.com/v1/payment/ready', params, {
      headers: {
        Authorization: `KakaoAK ${process.env.REACT_APP_KakaoAK}`,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
    .then(res => {
      localStorage.setItem("tid", res.data.tid)
      window.open(res.data.next_redirect_pc_url, "정기결제", '_blank')
      dispatch(setLoginMember(newInfo))
      closeModal()
    })
    .catch(err => console.log(err))
  }

  return (
    <ModalBackground onClick={closeModal}>
      {!onPayment ? (
        <PayContainer onClick={(e) => e.stopPropagation()}>
          <PayTypeDiv>
            <PayTypeContainer>
              <PayTypeImg src='https://www.svgrepo.com/show/442692/pay.svg'></PayTypeImg>
              <PayTypeSpan>일반결제</PayTypeSpan>
            </PayTypeContainer>
            <PayTypeContainer>
              <PayTypeImg src='https://www.svgrepo.com/show/368253/kakao-square.svg' onClick={kakaoPayment}></PayTypeImg>
              <PayTypeSpan>카카오결제</PayTypeSpan>
            </PayTypeContainer>
          </PayTypeDiv>
          <PayInfoDiv>
            <PaySpanDiv>
              <PaySpan color='rgba(0,0,0,0.5)'>결제 금액</PaySpan>
              <PaySpan color='black' size='1.5rem'>2,000원</PaySpan>
            </PaySpanDiv>
            <PaySpanDiv>
              <PaySpan color='rgba(0,0,0,0.5)'>상품명</PaySpan>
              <PaySpan color='black' size='1.2rem'>프리미엄 구독</PaySpan>
            </PaySpanDiv>
          </PayInfoDiv>
        </PayContainer>
      ) : (
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalDiv>
          <PaymentTitleDiv>
            <TitleLogo src='https://www.svgrepo.com/show/485696/diamond.svg'></TitleLogo>
            <PaymentTitle>프리미엄 혜택</PaymentTitle>
          </PaymentTitleDiv>
          <PaymentBodyDiv>
            <PaymentUl>
              <PaymentLi>
                소비 습관에 대한 분석 보고서
              </PaymentLi>
              <PaymentLi>
                자산 관리 전문가의 효율적인 소비 조언
              </PaymentLi>
              <PaymentLi>
                AI가 알려주는 다음달 소비 계획
              </PaymentLi>
            </PaymentUl>
          </PaymentBodyDiv>
          <PayButtonDiv>
            <PayBtn onClick={() => setOnPayment(true)}>결제창으로 이동</PayBtn>
          </PayButtonDiv>
        </ModalDiv>
      </ModalContainer>
      )
      }
    </ModalBackground>
  )
}
export default function Premium(){
  const memberId = localStorage.getItem('memberId');
  const navigate = useNavigate()
    if (memberId === null) {
      navigate("/login");
    }
  const premiumInfo = [
    {
      img: 'https://www.svgrepo.com/show/454970/money-website.svg',
      name: '소비 습관 보고서',
      title: '나쁜 소비 습관 한번에 해결!',
      describe: '쉽게 알아볼 수 있는 소비 데이터를 매달 보내 드립니다!'
    },
    {
      img: 'https://www.svgrepo.com/show/484019/person.svg',
      name: '자산 관리자 조언',
      title: '전문가의 명쾌한 조언!',
      describe: '자산 관리자의 조언을 통해 회원님의 재산을 안전하게 지키세요!'
    },
    {
      img: 'https://www.svgrepo.com/show/455332/android.svg',
      name: 'AI 추천 소비계획',
      title: '똑똑한 AI의 똑소리나는 관리!',
      describe: '최첨단 AI가 당신의 소비 계획을 알차고 든든하게 세워줍니다!'
    }
  ]

  const isPremium = useSelector((state) => state.loginMember.loginMember.info.premium);
  const[modal, setModal] = useState(false)
  const openModal = () =>{
    if(isPremium){
      alert("이미 가입한 회원입니다!")
    } else{
      setModal(true)
    }
  }
  const closeModal = () =>{
    setModal(false)
  }
  return(
    <>
      {modal ? <PaymentModal closeModal={closeModal}></PaymentModal>: ''}
      <PremiumContainer>
        <PremiumDiv>
          <PremiumTitleDiv>
            <TitleDiv>
              <TitleLogo src='https://www.svgrepo.com/show/485696/diamond.svg'></TitleLogo>
              <Title>프리미엄 혜택</Title>
            </TitleDiv>
            <PayButton onClick={openModal}>프리미엄 혜택 받기</PayButton>
          </PremiumTitleDiv>
          <PremiumBodyDiv>
            {premiumInfo.map((el, idx) =>{
              return(
                idx % 2 === 0 ? (
                  <PremiumBody>
                    <PremiumBodyLeft>
                      <BodyLeftDiv>
                        <BodyLeftImg src={el.img}></BodyLeftImg>
                        <BodyLeftSpan>{el.name}</BodyLeftSpan>
                      </BodyLeftDiv>
                    </PremiumBodyLeft>
                    <PremiumBodyRight>
                      <BodyRightDiv>
                        <BodyRightTitle>{el.title}</BodyRightTitle>
                        <BodyRightDescribe>{el.describe}</BodyRightDescribe>
                      </BodyRightDiv>
                    </PremiumBodyRight>
                  </PremiumBody>
                ) : (
                  <PremiumBody>
                    <PremiumBodyRight>
                      <BodyRightDivOdd>
                        <BodyRightTitle>{el.title}</BodyRightTitle>
                        <BodyRightDescribe>{el.describe}</BodyRightDescribe>
                      </BodyRightDivOdd>
                    </PremiumBodyRight>
                    <PremiumBodyLeftOdd>
                      <BodyLeftDivOdd>
                        <BodyLeftImg src={el.img}></BodyLeftImg>
                        <BodyLeftSpan>{el.name}</BodyLeftSpan>
                      </BodyLeftDivOdd>
                    </PremiumBodyLeftOdd>
                  </PremiumBody>
                )
              )
            })}
          </PremiumBodyDiv>
        </PremiumDiv>
      </PremiumContainer>
    </>
  )
}