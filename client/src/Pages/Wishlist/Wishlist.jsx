import { styled } from "styled-components";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { setDataList } from "../../Redux/wishlist_reducer";
import { setTargetExpend } from "../../Redux/account_reducer";
import { data } from "../../InitData/wishlist";
import Modal from "./Modal";
import WishListDragContainer from "./Wishlists";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import apiUrl from '../../API_URL';
import axios from "axios";

const WishlistContainer = styled.div`
  width: calc(100% - 300px);
  height: 100vh;
  padding: 10px;
  background-color: #22221f;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WishlistDiv = styled.div`
  width: 85%;
`;
const LimitDiv = styled.div`
  border: 1px solid white;
  border-radius: 20px;
  width: 50%;
  display: flex;
  flex-direction: column;
  margin: 5% 0;
`;
const LimitSpanContainer = styled.div`
  width: 100%;
  text-align: left;
  display: flex;
  flex-direction: row;
  margin: 5% 0%;
  padding-left: 20%;
`;
const LimitSpanDiv = styled.div`
  width: 30%;
  margin: 0px 5%;
`;
const LimitSpan = styled.span`
  width: 50%;
  color: white;
  font-size: 1.2rem;
`;
export const LimitInput = styled.input`
  width: 100%;
  background-color: rgba(0, 0, 0, 0);
  border: 0px;
  border-radius: 5px;
  color: white;
  font-size: ${(props) => props.fontsize};
  padding: 1%;
  &:focus {
    outline: none;
  }
  ::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;
const WishDiv = styled.div`
  width: 100%;
`;
const MenuDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;
const TitleDiv = styled.div`
  width: 12%;
  color: white;
`;
const TitleSpan = styled.span`
  color: white;
  font-size: 2rem;
  font-weight: bold;
  height: 100%;
`;
const ButtonDiv = styled.div`
  width: 78%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-top: 5px;
`;
export const Button = styled.button`
  border: 1px solid ${(props) => (props.selected ? 'rgb(246, 111, 60)' : 'rgb(210, 210, 210)')};
  border-radius: 10px;
  margin: 0px 1%;
  padding: 8px;
  width: 12%;
  background-color: ${(props) => (props.selected ? "#F9591D" : "rgb(34, 34, 31)")};
  color: white;
  cursor: pointer;
`;
const AddDiv = styled.div`
  width: 10%;
`;
const AddButton = styled(Button)`
  width: 100%;
  background-color: #c5ff78;
  color: #365a42;
  height: 100%;
  border: 1px solid #c5ff78;
  cursor: pointer;
`;
const ListDiv = styled.div`
  width: 100%;
  border: 1px solid white;
  border-radius: 20px;
  padding: 3%;
  margin: 2% 0%;
  overflow: scroll;
  background-color: rgb(25, 25, 25);
  &::-webkit-scrollbar {
    display: none;
  }
`;
// 우선순위로 보기 할때만 하는걸로
export default function Wishlist() {
  const dispatch = useDispatch();
  const memberId = localStorage.getItem('memberId')
  const [usablePrice, setUsablePrice] = useState(data.useable);
  const [index, setIdx] = useState(0);
  const targetExpend = useSelector(state => state.targetExpend)
  const wishlist = useSelector(state => state.loginMember.loginMember.wishList)
  console.log(wishlist)
  const useAble = useSelector(state => state.useAble)
  const navigate = useNavigate()
    if (!memberId) {
        navigate("/login");
    }
  // useEffect(() => {
  //   axios
  //     .get(
  //       `${apiUrl.url}/wishlists/${memberId}?tab=lowPrice`,
  //       {
  //         headers: {
  //           'Authorization': localStorage.getItem('Authorization-Token'),
  //           'ngrok-skip-browser-warning': '69420',
  //           'withCredentials': true,
  //         },
  //       }
  //     )
  //     .then((res) => {
  //       dispatch(setDataList(res.data))
  //     })
  //     // .then((res) =>setWishlist({...wishlist, list: res.data}))
  //     .catch((err) => console.log(err));
  // }, []);
  useEffect(() => {
    axios.get(`${apiUrl.url}/totals/${memberId}`,{
      headers: {
        'Authorization': localStorage.getItem('Authorization-Token'),
        'ngrok-skip-browser-warning': '69420',
        'withCredentials': true,
      },
    })
    .then(res => dispatch(setTargetExpend(res.data[0].goal)))
    .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    let sum = 0;
  
    setUsablePrice(
      targetExpend -
        wishlist
          .filter((el) => el.available)
          .reduce((acc, cur) => acc + cur.price, 0)
    );
  }, [targetExpend, wishlist]);

  const sortByPriority = () => {
    const sort = wishlist.slice().sort((a, b) => {
      return a.priority - b.priority;
    });
    dispatch(setDataList(sort))
    setIdx(0);
  };
  const sortByDate = () => {
    const sort = wishlist.slice().sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });
    dispatch(setDataList(sort))
    setIdx(1);
  };
  const sortByPrice = () => {
    const sort = wishlist.slice().sort((a, b) => {
      return a.price - b.price;
    });
    dispatch(setDataList(sort))
    console.log('금액순 정렬 한 위시리스트는')
    console.log(wishlist)
    setIdx(2);
  };
  const buttons = [
    {
      title: "우선순위순",
      func: sortByPriority,
    },
    {
      title: "등록순",
      func: sortByDate,
    },
    {
      title: "금액순",
      func: sortByPrice,
    },
  ];

  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [item, setItem] = useState(false);

  const openModalDiv = () => {
    setOpenModal(true);
  };

  const deleteWishlist = (targetWishlist) => {
    const updatedList = wishlist.filter((item) => item !== targetWishlist);
    // setWishlist({ ...wishlist, list: updatedList });
  };
  const editWishlist = (wishlist) => {
    setOpenModal(true);
    setEditMode(true);
    setItem(wishlist);
  };
  return (
    <>
      {openModal ? (
        <Modal
          setOpenModal={setOpenModal}
          wishlist={wishlist}
          editMode={editMode}
          setEditMode={setEditMode}
          item={item}
        ></Modal>
      ) : (
        ""
      )}
      <WishlistContainer>
        <WishlistDiv>
          <LimitDiv>
            <LimitSpanContainer>
              <LimitSpanDiv>
                <LimitSpan>\{targetExpend.toLocaleString()}</LimitSpan>
              </LimitSpanDiv>
              <LimitSpanDiv>
                <LimitSpan>상한액</LimitSpan>
              </LimitSpanDiv>
            </LimitSpanContainer>
            <LimitSpanContainer>
              <LimitSpanDiv>
                <LimitSpan>\{useAble.toLocaleString()}</LimitSpan>
              </LimitSpanDiv>
              <LimitSpanDiv>
                <LimitSpan>사용 가능 금액</LimitSpan>
              </LimitSpanDiv>
            </LimitSpanContainer>
          </LimitDiv>
          <WishDiv>
            <MenuDiv>
              <TitleDiv>
                <TitleSpan>Wish List</TitleSpan>
              </TitleDiv>
              <ButtonDiv>
                {buttons.map((el, idx) => (
                  <Button
                    key={idx}
                    onClick={el.func}
                    selected={index === idx ? true : false}
                  >
                    {el.title}
                  </Button>
                ))}
              </ButtonDiv>
              <AddDiv>
                <AddButton onClick={openModalDiv}>추가하기</AddButton>
              </AddDiv>
            </MenuDiv>
            <ListDiv>
              <DndProvider backend={HTML5Backend}>
                <WishListDragContainer
                  wishlist={wishlist}
                  editFunc={editWishlist}
                  deleteFunc={deleteWishlist}
                  // setWishlist={setWishlist}
                ></WishListDragContainer>
              </DndProvider>
            </ListDiv>
          </WishDiv>
        </WishlistDiv>
      </WishlistContainer>
    </>
  );
}
