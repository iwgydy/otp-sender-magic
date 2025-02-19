import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SmartphoneCharging, Clock, Key, Rocket, Zap, History as HistoryIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface PhoneReport {
  reason: string;
  count: number;
}

interface InputPanelProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  minutes: string;
  setMinutes: (value: string) => void;
  loading: boolean;
  showKeyInput: boolean;
  apiKey: string;
  setApiKey: (value: string) => void;
  remainingTime: number;
  phoneReport: PhoneReport | null;
  speed: string;
  setSpeed: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleApiKeySubmit: () => void;
}

const InputPanel = ({
  phoneNumber,
  setPhoneNumber,
  minutes,
  setMinutes,
  loading,
  showKeyInput,
  apiKey,
  setApiKey,
  remainingTime,
  phoneReport,
  speed,
  setSpeed,
  handleSubmit,
  handleApiKeySubmit,
}: InputPanelProps) => (
  <Card className="p-6 backdrop-blur-sm bg-black/40 border-gray-700 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          ตั้งค่าการส่ง
        </h2>
        <Link to="/history">
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            <HistoryIcon className="mr-2 h-4 w-4" />
            ประวัติการยิง
          </Button>
        </Link>
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

        <div className="relative group">
          <Zap className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
          <Select value={speed} onValueChange={setSpeed}>
            <SelectTrigger className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border-gray-700 text-gray-100">
              <SelectValue placeholder="เลือกความเร็วในการยิง" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="slow">ช้า (1000ms)</SelectItem>
              <SelectItem value="normal">ปกติ (500ms)</SelectItem>
              <SelectItem value="fast">เร็ว (200ms)</SelectItem>
              <SelectItem value="ultra">เร็วมาก (100ms)</SelectItem>
            </SelectContent>
          </Select>
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
);

export default InputPanel;
