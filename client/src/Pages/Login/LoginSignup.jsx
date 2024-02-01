import { styled } from 'styled-components'
import { SignupButton } from '../Home/Home'
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {setLoginMember} from "../../Redux/loginMemberReducer";
import AWS from 'aws-sdk';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  position: relative;
`
const ImgContainer = styled.div`
  background-image: url('https://images.squarespace-cdn.com/content/v1/61f5c6070d329d402cfb46f5/eb63c7cb-3497-400a-a75c-31a16c8f824e/unsplash-image-JhevWHCbVyw.jpg?format=1000w');
  background-size: cover;
  width: 60%;
`
const ContentContainer = styled.div`
  width: 40%;
  background-color: #22221F;
  display: flex;
  justify-content: center;
  align-items: center;
`
const ContentDiv = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  animation: appearText 1s;
  animation-fill-mode: forwards;
`
const ContentTitle = styled.p`
  font-size: 48px;
  color: white;
`
const InfoDiv = styled.div`
  width: 100%;
  height: 400px;
`
const InfoInputDiv = styled.div`
  width: 100%;
  height: 40px;
  border: 0px;
  margin: 50px 0px;
  border-bottom: 1px solid white;
`
const InfoInput = styled.input`
  width: 90%;
  height: 100%;
  border: 0px;
  background: rgba(0,0,0,0);
  outline: none;
  padding: 0px 5px;
  color: white;
  &::placeholder{
    color: white;
  }
`
const InfoValidTest = styled.p`
  width: 100%;
  height: 20px;
  margin: 5px;
  color: red;
  font-size: 12px;
  display:flex;
`
const LoginButton = styled(SignupButton)`
  width: 100%;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0px;
  padding: 20px 15px;
  font-weight: normal;
  animation: '';
`
const GooglLoginButton = styled(LoginButton)`
  background-color: rgba(0,0,0,0);
  border: 1px solid white;
`
const GoogleLogo = styled.img`
  width: 20px;
`
const DirectLinkDiv = styled.div`
  width: 100%; 
  height: 30px;
  margin: 10px 0px -20px 0px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  & > .linkText{
    text-decoration: none;
  }
`
const DirectLinkSpan = styled.span`
  color: ${props => props.color};
  font-size: 0.8rem;
  margin: 0px 20px;
`

export default function LoginSignup({page}){
  const [members, setMemebrs] = useState([])
  const dispatch = useDispatch();
  const s3 = new AWS.S3();
  useEffect(() => {

    // S3에서 파일 읽기
    const params = { Bucket: 'buyrricade/members', Key: `${email}.json` };

    s3.getObject(params, (err, result) => {
      if (err) {
        console.error('Error fetching data from S3:', err);
      } else {
        const fileContent = result.Body.toString('utf-8');
        const parsedData = JSON.parse(fileContent);
        setMemebrs(parsedData);
      }
    });
  }, []);
  const [email, setEmail] = useState("");
  const [emailValidMessage, setEmailValidMessage] = useState("");

  const [password, setPassword] = useState("");
  const [pwValidMessage, setPwValidMessage] = useState("");

  const [nickname, setNickname] = useState("");
  const [nicknameValidMessage, setNicknameValidMessage] = useState("");

  const [phonenum, setPhonenum] = useState("");
  const [phonenumValidMessage, setPhonenumValidMessage] = useState("");

  const inputHandler = (e) => {
    switch (e.target.id){
      case 'Email' : 
        setEmail(e.target.value);
        break;
      case 'Password' : 
        setPassword(e.target.value);
        break;
      case 'Nickname' : 
        setNickname(e.target.value);
        break;
      case 'Phone' : 
      setPhonenum(e.target.value.replace(/-/g, ''));
        break;
      default : 
        break;
    }
  };
 
  const validCheck = (email, password, nickname, phonenum) => {

    const emailPreferance = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isCorrectEmail = emailPreferance.test(email);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLengthValid = password.length >= 10;
    const phonenumLen = phonenum.length === 11
    const onlynumLen = phonenum.replace(/-/g, '').length === 11
    if(page === 'login'){
      if (email === "") {
        setEmailValidMessage("이메일을 입력하세요");
        return false
      } else if (!isCorrectEmail) {
        setEmailValidMessage("올바르지 않은 이메일 형식입니다");
        return false
      }
      else {
        setEmailValidMessage("");
      }

      if (password === "") {
        setPwValidMessage("비밀번호를 입력하세요");
        return false
      } else if (!(hasSpecialChar && hasLetter && hasNumber && isLengthValid)) {
        setPwValidMessage("비밀번호는 특수문자와 문자, 숫자를 포함해 10자 이상이어야 합니다");
        return false
      } 
      else {
        setPwValidMessage("");
      }
    } else if(page === 'signup'){
      if (nickname === "") {
        setNicknameValidMessage("닉네임을 입력하세요");
        return false
      }
      else {
        setNicknameValidMessage("");
      }

      if (email === "") {
        setEmailValidMessage("이메일을 입력하세요");
        return false
      } else if (!isCorrectEmail) {
        setEmailValidMessage("올바르지 않은 이메일 형식입니다");
        return false
      }
      else {
        setEmailValidMessage("");
      }
      
      if (password === "") {
        setPwValidMessage("비밀번호를 입력하세요");
        return false
      } else if (!(hasSpecialChar && hasLetter && hasNumber && isLengthValid)) {
        setPwValidMessage("비밀번호는 특수문자와 문자, 숫자를 포함해 10자 이상이어야 합니다");
        return false
      } 
      else {
        setPwValidMessage("");
      }

      if (phonenum === "") {
        setPhonenumValidMessage("전화번호를 입력하세요");
        return false
      } else if(!phonenumLen && !onlynumLen){
        setPhonenumValidMessage('전화번호는 -를 제외하고 11자 이상이어야 합니다')
        return false
      }else {
        setPhonenumValidMessage("");
      }
    }

    return true
  }
  // ✅이하 서버 통신 구현 되면 사용할 코드
  const login = () => {
    //서버 다운으로 인한 임시 조치
    const params = { Bucket: 'buyrricade/members', Key: `${email}.json` };
    s3.getObject(params, (err, result) => {
      if (err) {
        console.error('Error fetching data from S3:', err);
      } else {
        const fileContent = result.Body.toString('utf-8');
        const parsedData = JSON.parse(fileContent);
        dispatch(setLoginMember(parsedData));
        localStorage.setItem('memberId', email);
        navigate('/accountbook')
      }
    });
  }

  // 회원가입 그중에서도 닉네임, 아이디 중복에 관한 메서드는 백엔드쪽에서 만들어 주시기로 하셨음
  const signup = () => {
    const memberInfo = {
      email: email,
      password: password,
      name: nickname,
      phone: phonenum,
      imageURL: 'https://www.svgrepo.com/show/362137/profile.svg',
      premium: null,
      address: ''
    }
    const jsonInfo = JSON.stringify([...members, memberInfo], null, 2)
    const params = {
      Bucket: 'buyrricade',
      Key: `members/${email}.json`, // 업로드할 때 사용한 파일 경로 및 이름
      Body: jsonInfo,
      ContentType: 'application/json',
    };
    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading file:', err);
      } else {
        alert("회원가입에 성공하였습니다.")
        navigate('/login')
      }
    });
  }

  const navigate = useNavigate()
  const clickLoginButton = () => {
    if(page === 'login' && validCheck(email, password, '', '')){
      login();
    } else if(page === 'signup' && validCheck(email, password, nickname, phonenum)){
      signup();
    }
  };

  let info = {}
  if(page === 'login'){
    info = {
      title: "로그인",
      input: [
        {
          type: "Email",
          validMessage: emailValidMessage,
          input: 'text'
        },
        {
          type: "Password",
          validMessage: pwValidMessage,
          input: 'password'
        },
      ],
      buttonText: "login",
      Linktext: ["아직 회원이 아니신가요?", "회원가입 하러 가기"],
      path: '/signup'
    };
  } else {
    info = {
      title: "회원가입",
      input: [
        {
          type: "Nickname",
          validMessage: nicknameValidMessage,
          input: 'text'
        },
        {
          type: "Email",
          validMessage: emailValidMessage,
          input: 'text'
        },
        {
          type: "Password",
          validMessage: pwValidMessage,
          input: 'password'
        },
        {
          type: "Phone",
          validMessage: phonenumValidMessage,
          input: 'text'
        },
      ],
      buttonText: "sign up",
      Linktext: ["이미 계정이 있으신가요?", "로그인 하러 가기"],
      path: '/login'
    };
  }
  

  return (
    <Container>
      <ImgContainer />
      <ContentContainer>
        <ContentDiv>
          <ContentTitle>
            {info.title}
          </ContentTitle>
          <InfoDiv>
            {info.input.map(el => {
              return(
                <InfoInputDiv>
                  <InfoInput
                    key={el.type}
                    id={el.type}
                    type={el.input}
                    placeholder={el.type}
                    onChange={inputHandler}
                  ></InfoInput>
                  <InfoValidTest>{el.validMessage}</InfoValidTest>
                </InfoInputDiv>
              )
            })}
          </InfoDiv>
          <LoginButton onClick={clickLoginButton}>{info.buttonText}</LoginButton>
          <GooglLoginButton>
            <GoogleLogo src='https://www.svgrepo.com/show/452216/google.svg'></GoogleLogo>
            Login with Google
          </GooglLoginButton>
          <DirectLinkDiv>
            <DirectLinkSpan color='white'>{info.Linktext[0]}</DirectLinkSpan>
            <Link to={info.path} className='linkText'>
              <DirectLinkSpan color='#3A5AFF'>
                {info.Linktext[1]}
              </DirectLinkSpan>
            </Link>
          </DirectLinkDiv>
        </ContentDiv>
      </ContentContainer>
    </Container>
  )
}