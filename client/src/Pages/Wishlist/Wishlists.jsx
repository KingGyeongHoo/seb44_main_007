import { styled } from "styled-components";
import Palette from "../../Palette/Palette";
import { useDrop, useDrag } from "react-dnd";
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setId } from "../../Redux/id_reducer";
import { setDataList, setUseAble } from "../../Redux/wishlist_reducer";
import { setLoginMember } from "../../Redux/loginMemberReducer";

const WishUl = styled.ul`
  width: 100%;
  height: 420px;
  overflow-x: hidden;
  overflow-y: scroll;
  list-style-type: none;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #7a7a7a;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0);
  }
`;

const WishLi = styled.li`
  width: 100%;
  display: flex;
  flex-direction: center;
  align-items: center;
  justify-content: space-around;
  padding: 1% 0;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 5px;
  opacity: ${(props) => (props.available ? "1" : "0.2")};
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;
const DragImg = styled.img`
  width: 3%;
  filter: invert(100%) sepia(9%) saturate(7417%) hue-rotate(292deg)
    brightness(114%) contrast(106%);
`;
const ProductImg = styled.img`
  width: 80px;
  height: 80px;
`;
const ListSpanContainer = styled.div`
  width: 70%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;
const ListSpanDiv = styled.div`
  width: 25%;
  display: flex;
  align-items: center;
`;
const ListSpan = styled.span`
  color: white;
  font-size: 1.2rem;
`;
export const CategoryCircle = styled.div`
  border-radius: 100%;
  background-color: ${(props) => props.bgcolor};
  width: 12px;
  height: 10px;
  margin: 0px 10px;
`;
const EditImg = styled.img`
  width: 3%;
  filter: invert(36%) sepia(10%) saturate(0%) hue-rotate(275deg) brightness(96%)
    contrast(90%);
`;
const DeleteImg = styled.img`
  width: 3%;
  filter: invert(37%) sepia(90%) saturate(2999%) hue-rotate(340deg)
    brightness(100%) contrast(103%);
`;

const WishLists = ({ list, index, moveList, editFunc, avail }) => {
  console.log(list)
  const dispatch = useDispatch();
  const memberId = localStorage.getItem('memberId')
  const wishlist = useSelector(state => state.wishlist.list)
  const ref = useRef(null);
  const handleDelete = () => {
    dispatch(setDataList(wishlist.filter(el => el.wishlistName !== list.wishlistName)))
  };
  const handleEdit = () => {
    editFunc(list);
    dispatch(setId(list.wishlistId))
  };

  const [, drag] = useDrag({
    type: 'wishList',
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: 'wishList',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveList(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  drag(drop(ref));
  const categoryImg = {
    식비_간식: "https://www.svgrepo.com/show/427322/dinner-food.svg",
    주거_통신: "https://www.svgrepo.com/show/287689/house.svg",
    교통_차량: "https://www.svgrepo.com/show/513278/bus.svg",
    생활_마트: "https://www.svgrepo.com/show/279438/shopping-bags-shopping-bag.svg",
    의류_미용: "https://www.svgrepo.com/show/317632/costume.svg",
    의료_건강: "https://www.svgrepo.com/show/268276/health-care-medicine.svg",
    교육_문화: "https://www.svgrepo.com/show/298470/book.svg",
    보험_세금: "https://www.svgrepo.com/show/259173/bank.svg",
    기타지출: "https://www.svgrepo.com/show/499839/money.svg",
  }
  return (
    <WishLi
      available={list.available}
      ref={ref}
    >
      <DragImg src="https://www.svgrepo.com/show/506246/menu-hamburger.svg"></DragImg>
      <ProductImg src={categoryImg[list.category]}></ProductImg>
      <ListSpanContainer>
        <ListSpanDiv>
          <ListSpan>{list.wishlistName}</ListSpan>
        </ListSpanDiv>
        <ListSpanDiv>
          <ListSpan>\{list.price.toLocaleString()}</ListSpan>
        </ListSpanDiv>
        <ListSpanDiv>
          <CategoryCircle bgcolor={Palette[list.category]}></CategoryCircle>
          <ListSpan>{list.category !== null ? list.category.replace("/", "_") : ''}</ListSpan>
        </ListSpanDiv>
        <ListSpanDiv>
          <ListSpan>{list.date}</ListSpan>
        </ListSpanDiv>
      </ListSpanContainer>
      <EditImg
        src="https://www.svgrepo.com/show/488318/pencil-ui.svg"
        onClick={handleEdit}
      ></EditImg>
      <DeleteImg
        src="https://www.svgrepo.com/show/485930/trashcan.svg"
        onClick={handleDelete}
      ></DeleteImg>
    </WishLi>
  );
};

const WishListDragContainer = ({
  wishlist,
  editFunc,
}) => {
  const dispatch = useDispatch();
  const memberId = localStorage.getItem('memberId')
  const loginMember = useSelector(state => state.loginMember.loginMember)
  const list = useSelector(state => state.wishlist.list)
  const targetExpend = loginMember.goal
  const moveList = (dragIndex, hoverIndex) => {
    const draggedList = wishlist[dragIndex];
    const updatedLists = wishlist.slice();
    updatedLists.splice(dragIndex, 1);
    updatedLists.splice(hoverIndex, 0, draggedList);
    const updatedListsWithNewPriority = updatedLists.map((list, index) => ({
      ...list,
      priority: index
    }));
    dispatch(setDataList(updatedListsWithNewPriority));
  };

  let sum = 0
  const [availableWishlist, setAvailableWishlist] = useState(loginMember.wishList)
  // const availableWishlist = wishlist.map(list => {
  //   if (list.price + sum < targetExpend) {
  //     sum += list.price
  //     return {
  //       ...list,
  //       available: true
  //     }
  //   } else {
  //     return {
  //       ...list,
  //       available: false
  //     }
  //   }
  // })
  console.log(typeof(list))
  const newList = list.map(list => {
    if (list.price + sum < targetExpend) {
      sum += list.price
      return {
        ...list,
        available: true
      }
    } else {
      return {
        ...list,
        available: false
      }
    }
  })
  useEffect(() => {
    setAvailableWishlist(newList)
  dispatch(setLoginMember({ ...loginMember, wishList: availableWishlist }));
}, [list])
console.log(availableWishlist)

  useEffect(() => {
    dispatch(setUseAble(targetExpend - sum))

  }, [targetExpend, availableWishlist])
  return (
    <WishUl>
      {wishlist !== undefined &&
        availableWishlist.map((el, idx) => {
          return (
            <WishLists
              list={el}
              index={idx}
              moveList={moveList}
              editFunc={editFunc}
              key={el.priority}
            ></WishLists>
          );
        })}
    </WishUl>
  );
}
export default WishListDragContainer;