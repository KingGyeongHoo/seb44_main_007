import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoginMember } from "../../Redux/loginMemberReducer";
import AWS from "aws-sdk";

export default function Paying() {
  const url = window.location.href;
  const searchParams = new URLSearchParams(new URL(url).search);
  const pg_token = searchParams.get("pg_token");
  const tid = localStorage.getItem("tid");
  const memberInfo = useSelector((state) => state.loginMember.loginMember);
  const dispatch = useDispatch()
  const s3 = new AWS.S3();
  const newInfo = {
    ...memberInfo,
    info: { ...memberInfo.info, premium: true },
  };
  const jsonInfo = JSON.stringify(newInfo, null, 2);
  const params = {
    cid: "TC0ONETIME",
    partner_order_id: "partner_order_id",
    partner_user_id: "partner_user_id",
    tid: tid,
    pg_token: pg_token,
  };
  useEffect(() => {
    axios
      .post("https://kapi.kakao.com/v1/payment/approve", params, {
        headers: {
          Authorization: `KakaoAK ${process.env.REACT_APP_KakaoAK}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      })
      .then((res) => {
        const params = {
          Bucket: "buyrricade",
          Key: `members/${memberInfo.email}.json`, // 업로드할 때 사용한 파일 경로 및 이름
          Body: jsonInfo,
          ContentType: "application/json",
        }
        return params
      })
      .then(params => {
        s3.upload(params, (err, data) => {
          if (err) {
            console.error("Error uploading file:", err);
          } else {
            dispatch(setLoginMember(newInfo))
            localStorage.removeItem("tid");
            window.close()
          }
        })
      })
      .catch((err) => console.log(err));
  }, []);

  return <div />;
}
