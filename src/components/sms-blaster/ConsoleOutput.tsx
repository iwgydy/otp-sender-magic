
import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal } from "lucide-react";

interface LogEntry {
  timestamp: string;
  phone: string;
  status: 'success' | 'error';
  message: string;
}

interface ConsoleOutputProps {
  logs: LogEntry[];
}

const ConsoleOutput = ({ logs }: ConsoleOutputProps) => (
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
);

export default ConsoleOutput;
