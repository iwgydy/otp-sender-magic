
import axios from "axios";

export const api1 = async (phone: string) => {
  const url = "https://api-customer.lotuss.com/clubcard-bff/v1/customers/otp";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  };
  const data = { mobile_phone_no: phone };
  
  await axios.post(url, data, { headers });
};

export const api2 = async (phone: string) => {
  const url = "https://pygw.csne.co.th/api/gateway/truewalletRequestOtp";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; A37f) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36",
    "Cookie": "pygw_csne_coth=91207b7404b2c71edd9db8c43c6d18c23949f5ea"
  };
  const data = `transactionId=b05a66a7e9d0930cbda4d78b351ea6f7&phone=${phone}`;
  
  await axios.post(url, data, { headers });
};

export const api3 = async (phone: string) => {
  const url = "https://api2.1112.com/api/v1/otp/create";
  const headers = {
    "Content-Type": "application/json;charset=UTF-8",
    "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; A37f) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36"
  };
  const data = {
    phonenumber: phone,
    language: "th"
  };
  
  await axios.post(url, { headers, data });
};

export const api4 = async (phone: string) => {
  const url = "https://api-sso.ch3plus.com/user/request-otp";
  const headers = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; A37f) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36"
  };
  const data = {
    tel: phone,
    type: "login"
  };
  
  await axios.post(url, data, { headers });
};
