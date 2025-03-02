
import axios from "axios";

export interface TopupResponse {
  status: {
    message: string;
    code: string;
  };
  data: {
    voucher: {
      voucher_id: string;
      amount_baht: string;
      redeemed_amount_baht: string;
      member: number;
      status: string;
      link: string;
      detail: string;
      expire_date: number;
      type: string;
      redeemed: number;
      available: number;
    };
    owner_profile: {
      full_name: string;
    };
    redeemer_profile: null;
    my_ticket: null;
    tickets: Array<{
      mobile: string;
      update_date: number;
      amount_baht: string;
      full_name: string;
      profile_pic: string;
    }>;
  };
}

// ตรวจสอบลิงก์อั้งเปาและเติมเงิน
export const verifyAndTopupAngpao = async (angpaoLink: string, phoneNumber: string): Promise<TopupResponse> => {
  try {
    // ตัดเอาแค่ ID ของอั้งเปาหากผู้ใช้ใส่ลิงก์เต็ม
    const linkPattern = /([a-zA-Z0-9]{32}at)/;
    const matches = angpaoLink.match(linkPattern);
    const linkId = matches ? matches[0] : angpaoLink;
    
    const response = await axios.get<TopupResponse>(
      `https://store.cyber-safe.pro/api/topup/truemoney/angpaofree/${linkId}/ผู้รับ${phoneNumber.replace(/-/g, "")}`
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as TopupResponse;
    }
    throw new Error("เกิดข้อผิดพลาดในการตรวจสอบอั้งเปา");
  }
};

// บันทึกคีย์ใหม่ลงใน Firebase
export const generateApiKey = async (phoneNumber: string, days: number = 1): Promise<{key: string, expireDate: string}> => {
  try {
    // สร้าง API Key แบบสุ่มด้วย timestamp + ตัวอักษรสุ่ม
    const randomKey = `SMS-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    // คำนวณวันหมดอายุ
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + days);
    
    // บันทึกลงใน Firebase
    await axios.put(`https://goak-71ac8-default-rtdb.firebaseio.com/keys/${randomKey}.json`, {
      key: randomKey,
      phoneNumber,
      createdAt: new Date().toISOString(),
      expireDate: expireDate.toISOString(),
      active: true,
      days
    });
    
    return {
      key: randomKey,
      expireDate: expireDate.toISOString()
    };
  } catch (error) {
    console.error("Error generating API key:", error);
    throw new Error("ไม่สามารถสร้าง API Key ได้");
  }
};
