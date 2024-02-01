import axios from "axios"
import { useEffect } from 'react';
import apiUrl from '../../API_URL';
import { useDispatch } from "react-redux";
import { setPayment } from "../../Redux/payment_reducer";

export default function Paying() {
  const url = window.location.href;
  const searchParams = new URLSearchParams(new URL(url).search);
  const pg_token = searchParams.get('pg_token');
  const tid = localStorage.getItem('tid');
  const memberId = localStorage.getItem('memberId');
  const dispatch = useDispatch()


  useEffect(() => {
    const params = {
      cid: "TC0ONETIME",
      partner_order_id: "partner_order_id",
      partner_user_id: "partner_user_id",
      tid: tid,
      pg_token: pg_token
    };
    axios.post('https://kapi.kakao.com/v1/payment/approve', params, {
      headers: {
        Authorization: "KakaoAK 24a6516395e63c6bafa73862364422ac",
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
    .then(res => {
      return axios.get(`${apiUrl.url}/members/${memberId}`, {
        headers: {
          'Authorization': localStorage.getItem('Authorization-Token'),
          'ngrok-skip-browser-warning': '69420',
          'withCredentials': true,
        },
      });
    })
    .then(res => {
      // Now, you can proceed with the patch request
      return axios.patch(`${apiUrl.url}/members/${memberId}`, { premium: true }, {
        headers: {
          'Authorization': localStorage.getItem('Authorization-Token'),
          'ngrok-skip-browser-warning': '69420',
          'withCredentials': true,
        },
      });
    })
    .then(res => {
      dispatch(setPayment(true))
      window.close();
      alert('결제되었습니다!')
    })
    .catch(err => console.log(err));
  }, []); // Empty dependency array ensures this useEffect runs only once on mount

  return <div />
}