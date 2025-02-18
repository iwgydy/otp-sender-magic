
import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Wifi, Shield, Zap, History, Database } from "lucide-react";

interface LogEntry {
  timestamp: string;
  phone: string;
  status: 'success' | 'error';
  message: string;
}

interface ConsoleOutputProps {
  logs: LogEntry[];
  phoneHistory: Set<string>;
}

const ConsoleOutput = ({ logs, phoneHistory }: ConsoleOutputProps) => {
  const lastPhone = logs.length > 0 ? logs[0].phone : null;

  return (
    <Card className="h-[600px] p-6 backdrop-blur-sm bg-black/40 border-gray-700 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Terminal className="h-5 w-5 text-blue-400 animate-pulse" />
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          SMS Blaster Console
        </h3>
        <div className="ml-auto flex gap-2">
          <Wifi className="h-4 w-4 text-green-400 animate-pulse" />
          <Shield className="h-4 w-4 text-purple-400 animate-pulse" />
          <Database className="h-4 w-4 text-yellow-400 animate-pulse" />
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="p-2 bg-gray-800/50 rounded-md border border-gray-700 backdrop-blur-md">
          <div className="text-xs font-mono text-gray-400">
            <span className="text-green-400">system</span>@<span className="text-blue-400">sms-blaster</span>:~$ monitoring_logs
          </div>
        </div>
        
        {lastPhone && (
          <div className="p-3 bg-gray-800/50 rounded-md border border-gray-700 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-blue-400 animate-spin-slow" />
              <span className="text-sm text-gray-400">Active Number:</span>
              <span className="text-sm text-green-400 font-mono bg-green-900/30 px-2 py-0.5 rounded-md">
                {lastPhone}
              </span>
              <div className="ml-auto flex items-center gap-2">
                <Database className="h-4 w-4 text-yellow-400" />
                <span className="text-xs text-gray-500">
                  History: <span className="text-yellow-400">{phoneHistory.size}</span> numbers
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="h-[420px] rounded-md border border-gray-700 bg-black/60 p-4">
        <div className="space-y-2">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`p-2 rounded-md text-sm font-mono ${
                log.status === 'success' 
                  ? 'bg-green-950/50 text-green-400 border border-green-800/30' 
                  : 'bg-red-950/50 text-red-400 border border-red-800/30'
              } transition-all duration-200 hover:scale-[1.02] hover:shadow-lg animate-fadeIn backdrop-blur-sm`}
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs font-light">[{log.timestamp}]</span>
                <span className="text-blue-400 bg-blue-900/30 px-1.5 py-0.5 rounded-md text-xs">
                  {log.phone}
                </span>
                <span className={`flex-1 ${
                  log.status === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {log.message}
                </span>
                {log.status === 'success' && (
                  <Zap className="h-4 w-4 text-yellow-400 animate-pulse" />
                )}
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-center py-8">
              <Terminal className="h-8 w-8 text-gray-600 mx-auto animate-pulse" />
              <div className="text-gray-500 mt-4 animate-pulse">
                Waiting for SMS blast...
              </div>
              <div className="text-xs text-gray-600 font-mono mt-2">
                {">>> "}
                <span className="animate-pulse">_</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="mt-4 p-3 bg-gray-800/50 rounded-md border border-gray-700 backdrop-blur-md">
        <div className="text-xs font-mono flex items-center justify-between">
          <span>
            Status: <span className="text-green-400 animate-pulse">ACTIVE</span>
          </span>
          <div className="flex items-center gap-4">
            <span className="text-blue-400">
              <span className="text-gray-500">CPU:</span> 12%
            </span>
            <span className="text-purple-400">
              <span className="text-gray-500">MEM:</span> 156MB
            </span>
            <span className="text-yellow-400">
              <span className="text-gray-500">NET:</span> 24Mbps
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ConsoleOutput;
