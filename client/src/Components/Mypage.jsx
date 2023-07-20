import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components'
import axios from 'axios'
import userImage from '../Images/user.JPG'

const PremiumImg = "https://www.svgrepo.com/show/485696/diamond.svg" //다이아몬드 아이콘

const MypageComponent = () => {
    //데이터 받아오기
    const [member, setMember] = useState(''); //useState(null)

    useEffect(() => {
        const fetchMember = async () => {
        try {
            const response = await axios.get('https://9b2a-58-234-27-220.ngrok-free.app/members/2',{
                headers: {
                  'ngrok-skip-browser-warning': '69420',
                  'withCredentials': true,
                  'Authorization': localStorage.getItem('Authorization-Token'),
                },
              });
            setMember(response.data.data);
        } catch (error) {
            console.error(error);
        }
        };

        fetchMember();
    }, []);

    console.log(member);
    
    //이미지 수정
    const imgRef = useRef(null);
    const [profileImage,setProfileImage] = useState(userImage);

    const handleProfileImageChange = () => {
       imgRef.current.click()
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        // const reader = new FileReader(); // 서버x
        // const formData = new FormData();
        const imageURL = URL.createObjectURL(file);
        // formData.append('image', file);
        
        setProfileImage(imageURL);
        axios.patch('https://9b2a-58-234-27-220.ngrok-free.app//members/1', {
            imageURL: imageURL,
            }, {
                headers: {
                'Authorization': localStorage.getItem('Authorization-Token'),
            }
        })
    };

    // //배포 후 이미지 변경
    // const handleProfileImageChange = async () => {
    //     // 이미지 변경 로직을 구현해야 함
    //     try {
    //       // 이미지를 업로드하고 서버에서 이미지 URL을 받아옴
    //       const formData = new FormData();
    //       formData.append('profileImage', event.target.files[0]);
    
    //       const response = await axios.post('https://example.com/upload-image', formData, {
    //         headers: {
    //           'Content-Type': 'multipart/form-data',
    //           'Authorization': localStorage.getItem('Authorization-Token'),
    //         },
    //       });
    
    //       // 서버에서 받아온 이미지 URL을 member 객체에 설정
    //       setMember((prevMember) => ({
    //         ...prevMember,
    //         profileImage: response.data.imageUrl,
    //       }));
    
    //       // 서버로 업데이트된 member 정보를 보내는 로직 작성 (예: axios.patch 요청 등)
    //       await axios.patch('https://1a35-58-234-27-220.ngrok-free.app/members/2', {
    //         profileImage: response.data.imageUrl,
    //       }, {
    //         headers: {
    //           'Authorization': localStorage.getItem('Authorization-Token'),
    //         },
    //       });
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   };


    //데이터 수정
    const [isEdit, setIsEdit] = useState(false);
    const [updatedMember, setUpdatedMember] = useState(null);

    const enterEdit = () => {
        setUpdatedMember(member);
        setIsEdit(!isEdit);
      };

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedMember((prevState) => ({
          ...prevState,
          [name]: value
        }));
      };

    const handleEditInfo = async () => {
        try {
          await axios.patch('https://9b2a-58-234-27-220.ngrok-free.app//members/2', updatedMember,{
            headers: {
                'Authorization': localStorage.getItem('Authorization-Token'),
              },
          });
          setMember(updatedMember);
          setIsEdit(!isEdit);
        } catch (error) {
          console.error(error);
        }
      };

    //탈퇴
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const confirmWithdrawal = () => {
        setModalIsOpen(false);
        alert('탈퇴되었습니다.');
        window.location.href = '/';
    };

    return (
        <MyPage>
            <MyPageWapper>
                <Header>
                    <LeftContents>
                        <ProfileImage src={member.imageURL? member.imageURL : profileImage} />
                        <input 
                            type="file" 
                            ref={imgRef} 
                            style={{ display: "none" }} 
                            onChange={handleImageUpload} />
                        <ProfileImageChange onClick={handleProfileImageChange}>
                            프로필 사진 변경
                        </ProfileImageChange>
                    {/* 배포 후 이미지 변경 */}
                    {/* <ProfileImage src={member.profileImage || userImage} />
                        <ProfileImageChange>
                        <label htmlFor="profileImageInput">
                            프로필 사진 변경
                            <input
                            type="file"
                            id="profileImageInput"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            /> 
                        </label>
                        </ProfileImageChange> */}
                    </LeftContents>
                    <RightContents>
                        <p>{member.name}님 환영합니다!</p>
                        <PremiumBtn>
                            <img src={PremiumImg} alt='diamond'/>
                            <p>프리미엄 구독하기</p>
                        </PremiumBtn>
                    </RightContents>
                </Header>
                <Body>
                    <BodyTitle>
                        <p>회원정보</p>
                        {isEdit ? (
                            <button onClick={handleEditInfo}>저장</button>
                            ) : (
                            <button onClick={enterEdit}>회원정보 수정</button>
                            )}
                        <button onClick={openModal}>회원 탈퇴</button>
                        {modalIsOpen ? 
                        <ModalBackdrop onClick={closeModal}>
                            <ModalContent>
                                <p>탈퇴하시겠습니까?</p>
                                <p>저장된 내역이 모두 삭제됩니다😢</p>
                                <ModalBtn>
                                    <button onClick={confirmWithdrawal}>예</button>
                                    <button onClick={closeModal}>아니요</button>
                                </ModalBtn>
                            </ModalContent>
                        </ModalBackdrop>
                        : null}
                    </BodyTitle>
                    <UserContents>
                        <Category>
                            <p>닉네임</p>
                            <p>이메일</p>
                            <p>전화번호</p>
                            <p>가입일</p>
                            <p>주소</p>
                        </Category>
                        {isEdit ? (
                            <CategoryInfo>
                                <input
                                type="text"
                                name="name"
                                value={updatedMember.name}
                                onChange={handleInputChange}
                                />
                                <input
                                type="text"
                                name="email"
                                value={updatedMember.email}
                                onChange={handleInputChange}
                                />
                                <input
                                type="text"
                                name="phone"
                                value={updatedMember.phone}
                                onChange={handleInputChange}
                                />
                                <p>{member.createdAt}</p>
                                <input 
                                type="text"
                                name="address"
                                value={updatedMember.addess}
                                onChange={handleInputChange}/>
                            </CategoryInfo>
                            ) : (
                            <CategoryInfo>
                                <p>{member.name}</p>
                                <p>{member.email}</p>
                                <p>{member.phone}</p>
                                <p>{member.createdAt}</p>
                                <p className={member.address ? 'address' : 'none'}>
                                    {member.address? member.address : '주소를 입력해 주세요.'} 
                                </p>
                            </CategoryInfo>
                            )}
                    </UserContents>
                </Body>
            </MyPageWapper>
        </MyPage>
    )
}

export default MypageComponent

const MyPage = styled.body`
    width: calc(100% - 285px);
    height: 100%;
    color: white;
    display: flex;
    flex-direction: row;
`

const MyPageWapper = styled.div`
    width: 200vh;
    min-height: 100vh;
    background-color: rgb(34, 34, 31);
    padding: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
`

const Header = styled.div`
    width: 90%;
    height: 43%;
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
`

const LeftContents = styled.div`
    width: 200px;
    display: flex;
    flex-direction: column;
`

const ProfileImage = styled.img`
    height: 200px;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px black;
`
const ProfileImageChange = styled.button`
    padding: 5px;
    border-radius: 20px;
    border: none;
    cursor: pointer;
`
const RightContents = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 20px 30px;
    > p {
        font-size: 42px;
        margin-bottom: 10px;
    }
`
const PremiumBtn = styled.button`
    background-color: rgba(246, 111, 60, 1);
    border-radius: 20px;
    border: none;
    color: white;
    padding: 6px;
    width: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    > img {
        margin-right: 5px;
        height: 17px;
        filter: brightness(0) invert(1);
    }
    > p {
        font-size: 14px;
    }
`
const Body = styled(Header)`
    display: flex;
    flex-direction: column;
    flex: 1;
`
const BodyTitle = styled.div`
display: flex;
flex-direction: row;
justify-content: flex-end;
    > p {
        display: flex;
        align-items: center;
        height: 30px;
        border-left: 5px solid rgba(246, 111, 60, 1);
        padding-left: 16px;
        margin-right: auto;
        margin-bottom: 10px;
    }
    > button {
        background: none;
        border: none;
        color: rgb(210, 210, 210);
        margin-left: 20px;
        cursor: pointer;
    }
`
const UserContents = styled.div`
    border: 0.5px solid rgb(210, 210, 210);
    padding: 30px 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
`
const Category = styled.div`
    width: 30%;
    display: flex;
    flex-direction: column;
    > p {
        display: flex;
        align-items: center;
        justify-content: end;
        height: 30px;
        margin: 10px 50px;
        font-weight: 500;
    }
`
const CategoryInfo = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    > p {
        display: flex;
        align-items: center;
        height: 30px;
        margin: 10px;
        &.none {
            color: rgb(210, 210, 210);
            font-weight: 300;
        }
        &.address {
            color: white;
            font-weight: 400;
        }
    }
    > input {
        color: white;
        background: none;
        border: none;
        border-bottom: 1px solid rgba(246, 111, 60, 1);
        display: flex;
        align-items: center;
        width: 60%;
        height: 30px;
        margin: 10px;
    }
`

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

const ModalContent = styled.div`
    font-weight: 500;
    text-decoration: none;
    padding: 50px 70px;
    background-color: white;
    border-radius: 20px;
    color: rgb(34, 34, 31);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    > p {
        &:nth-child(2){
            font-size: 12px;
            font-weight: 400;
            color: rgb(160, 160, 160);
        }
    }
`;

const ModalBtn = styled.div`
    margin-top: 20px;
        >button {
            padding: 10px 15px;
            margin-right: 10px;
            font-size: 12px;
            border: none;
            border-radius: 5px;
            color: white;
            background-color: rgb(246, 111, 60);
            cursor: pointer;
            &:first-child{
                background-color: rgb(160, 160, 160);
            }
        }  
`