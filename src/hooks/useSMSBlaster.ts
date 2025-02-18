import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { api1, api2, api3, api4 } from "@/services/smsAPIs";

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
    // Load phone history on mount
    loadPhoneHistory();
    // Clean up old records every hour
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
      const historyEntry = {
        phone,
        timestamp,
        status
      };
      await axios.post('https://goak-71ac8-default-rtdb.firebaseio.com/history.json', historyEntry);
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const cleanupOldRecords = async () => {
    try {
      const oneDayAgo = Date.now() - 86400000; // 24 hours ago
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
      const newLog = {
        timestamp: new Date().toLocaleTimeString(),
        phone,
        status,
        message
      };
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
    
    await updateUsedMinutes();
    
    let timeLeft = totalSeconds;
    const smsInterval = setInterval(async () => {
      if (timeLeft <= 0) {
        clearInterval(smsInterval);
        setLoading(false);
        setRemainingTime(0);
        addLog(phoneNumber, 'success', `🏁 สิ้นสุดการส่ง SMS แล้ว`);
        toast({
          title: "สำเร็จ",
          description: `สิ้นสุดการส่ง SMS ไปยังหมายเลข ${phoneNumber}`,
        });
        return;
      }

      await sendSMS();
      timeLeft--;
      setRemainingTime(timeLeft);
    }, 1000);

    // เก็บ interval ไว้ใน ref เพื่อให้สามารถ clear ได้ถ้าจำเป็น
    timerRef.current = smsInterval;

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  };

  const sendSMS = async () => {
    const endpoints = [
      { api: api1, name: 'Lotus\'s', icon: '🏪' },
      { api: api2, name: 'TrueWallet', icon: '💳' },
      { api: api3, name: '1112', icon: '📱' },
      { api: api4, name: 'CH3+', icon: '📺' }
    ];

    for (const { api, name, icon } of endpoints) {
      try {
        await api(phoneNumber);
        addLog(phoneNumber, 'success', `${icon} ส่ง SMS สำเร็จผ่าน ${name}`);
      } catch (error) {
        addLog(phoneNumber, 'error', `⚠ ไม่สามารถส่ง SMS ผ่าน ${name}`);
        console.error(`Error with endpoint ${name}:`, error);
      }
    }
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
