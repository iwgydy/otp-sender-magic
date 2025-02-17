
import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Wifi, Shield, Zap, Phone, Repeat, Info } from "lucide-react";

interface LogEntry {
  timestamp: string;
  phone: string;
  status: 'success' | 'error';
  message: string;
}

interface ConsoleOutputProps {
  logs: LogEntry[];
  lastDialed?: {
    phone: string;
    count: number;
    reason: string;
  };
}

const ConsoleOutput = ({ logs, lastDialed }: ConsoleOutputProps) => (
  <Card className="h-[600px] p-6 backdrop-blur-sm bg-black/40 border-gray-700 shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
    <div className="flex items-center gap-2 mb-4">
      <Terminal className="h-5 w-5 text-green-400 animate-pulse" />
      <h3 className="text-lg font-semibold text-green-400">คอนโซลแสดงผล</h3>
      <div className="ml-auto flex gap-2">
        <Wifi className="h-4 w-4 text-blue-400 animate-pulse" />
        <Shield className="h-4 w-4 text-purple-400 animate-pulse" />
        <Zap className="h-4 w-4 text-yellow-400 animate-pulse" />
      </div>
    </div>
    <div className="mb-4 p-2 bg-gray-800/50 rounded-md border border-gray-700">
      <div className="text-xs font-mono text-gray-400">
        <span className="text-green-400">system</span>@<span className="text-blue-400">sms-blaster</span>:~$ monitoring_logs
      </div>
    </div>
    <ScrollArea className="h-[450px] rounded-md border border-gray-700 bg-black/60 p-4">
      <div className="space-y-2">
        {logs.map((log, index) => (
          <div
            key={index}
            className={`p-2 rounded-md text-sm font-mono ${
              log.status === 'success' 
                ? 'bg-green-950/50 text-green-400 border border-green-800/30' 
                : 'bg-red-950/50 text-red-400 border border-red-800/30'
            } transition-all duration-200 hover:scale-[1.02] hover:shadow-lg animate-fadeIn`}
            style={{
              animationDelay: `${index * 50}ms`
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs">[{log.timestamp}]</span>
              <span className="text-blue-400">เบอร์ {log.phone}:</span>
              <span className={`flex-1 ${log.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {log.message}
              </span>
              {log.status === 'success' && (
                <Zap className="h-4 w-4 text-yellow-400 animate-pulse" />
              )}
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center py-8 space-y-6">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h4 className="text-lg font-semibold text-green-400 mb-4">วิธีใช้งาน SMS Blaster</h4>
              <ol className="text-left text-gray-300 space-y-3">
                <li className="flex items-start gap-2">
                  <span className="bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                  <span>กรอกเบอร์โทรศัพท์ที่ต้องการส่ง SMS (เริ่มด้วย 0 ตามด้วยเบอร์ 9 หลัก)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                  <span>กำหนดระยะเวลาในการส่ง SMS (1-60 นาที)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                  <span>ใส่ API Key ที่ได้รับจากผู้ดูแลระบบ</span>
                </li>
              </ol>
              {lastDialed && (
                <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <h5 className="text-blue-400 font-semibold mb-3">ข้อมูลการส่งล่าสุด</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">เบอร์ล่าสุด: {lastDialed.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Repeat className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">จำนวนครั้ง: {lastDialed.count}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">สาเหตุ: {lastDialed.reason}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="text-xs text-gray-600 font-mono">
              {">>> "}
              <span className="animate-pulse">_</span>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
    <div className="mt-4 text-xs font-mono text-gray-500 flex items-center justify-between">
      <span>Status: <span className="text-green-400">ACTIVE</span></span>
      <div className="flex items-center gap-2">
        <span className="text-blue-400">CPU: 12%</span>
        <span className="text-purple-400">MEM: 156MB</span>
        <span className="text-yellow-400">NET: 24Mbps</span>
      </div>
    </div>
  </Card>
);

export default ConsoleOutput;
