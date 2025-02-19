
import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/sms-blaster/Header";
import FeatureCards from "@/components/sms-blaster/FeatureCards";
import InputPanel from "@/components/sms-blaster/InputPanel";
import ConsoleOutput from "@/components/sms-blaster/ConsoleOutput";
import { useSMSBlaster } from "@/hooks/useSMSBlaster";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, AlertTriangle, Phone } from "lucide-react";

const Index = () => {
  const {
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
  } = useSMSBlaster();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <nav className="border-b border-gray-800 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-white">SMS Blaster</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/blocked">
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  <Shield className="mr-2 h-4 w-4" />
                  เบอร์ที่ถูกบล็อก
                </Button>
              </Link>
              <Link to="/scam">
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  เบอร์โกง
                </Button>
              </Link>
              <Link to="/admin">
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  แอดมิน
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header />
        <div className="mt-8">
          <FeatureCards />
        </div>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8 animate-fadeIn">
            <InputPanel
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              minutes={minutes}
              setMinutes={setMinutes}
              loading={loading}
              showKeyInput={showKeyInput}
              apiKey={apiKey}
              setApiKey={setApiKey}
              remainingTime={remainingTime}
              phoneReport={phoneReport}
              handleSubmit={handlePhoneSubmit}
              handleApiKeySubmit={handleApiKeySubmit}
              speed="normal"
              setSpeed={() => {}}
            />
            
            <Card className="p-6 backdrop-blur-sm bg-black/40 border-gray-700 hover:shadow-blue-500/10 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4">วิธีใช้งาน</h3>
              <ol className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">1</span>
                  <span>กรอกเบอร์โทรศัพท์ที่ต้องการส่ง SMS</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">2</span>
                  <span>ระบุระยะเวลาในการส่ง (1-60 นาที)</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">3</span>
                  <span>กดปุ่ม "ตรวจสอบเบอร์" เพื่อเริ่มการส่ง</span>
                </li>
              </ol>
            </Card>
          </div>
          <div className="w-full animate-fadeIn">
            <ConsoleOutput 
              logs={logs}
              phoneHistory={phoneHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
