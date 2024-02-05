import axios from "axios"
import { useEffect } from 'react';
import apiUrl from '../../API_URL';
import { useDispatch, useSelector } from "react-redux";
import { setPayment } from "../../Redux/payment_reducer";
import {setLoginMember} from "../../Redux/loginMemberReducer";
import AWS from 'aws-sdk'

export default function Paying() {
  const url = window.location.href;
  const searchParams = new URLSearchParams(new URL(url).search);
  const pg_token = searchParams.get('pg_token');
  const tid = localStorage.getItem('tid');
  const dispatch = useDispatch()
  const memberInfo = useSelector(state => state.loginMember.loginMember)
  const s3 = new AWS.S3()
  const newInfo = {...memberInfo, info:{...memberInfo.info, premium: true}}
  useEffect(() => {
    dispatch(setLoginMember(newInfo));
    const params = {
      cid: "TC0ONETIME",
      partner_order_id: "partner_order_id",
      partner_user_id: "partner_user_id",
      tid: tid,
      pg_token: pg_token
    };
    axios.post('https://kapi.kakao.com/v1/payment/approve', params, {
      headers: {
        Authorization: "KakaoAK 6ebdcc5b32202a296e8859a0f0e99f5f",
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
    .then(res => {
      const jsonInfo = JSON.stringify(newInfo, null, 2)
      const params = {
        Bucket: 'buyrricade',
        Key: `members/${memberInfo.email}.json`, // 업로드할 때 사용한 파일 경로 및 이름
        Body: jsonInfo,
        ContentType: 'application/json',
        };
        s3.upload(params, (err, data) => {
        if (err) {
            console.error('Error uploading file:', err);
        } else {
            localStorage.removeItem('tid')
            window.close()
        }
        });
    })
    .catch(err => console.log(err));
  }, []); // Empty dependency array ensures this useEffect runs only once on mount

  return <div />
}