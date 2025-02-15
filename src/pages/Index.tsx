
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Clock, SmartphoneCharging } from "lucide-react";
import axios from "axios";

interface LogEntry {
  timestamp: string;
  phone: string;
  status: 'success' | 'error';
  message: string;
}

const Index = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [count, setCount] = useState("1");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const { toast } = useToast();

  const validatePhoneNumber = (number: string) => {
    const regex = /^0\d{9}$/;
    return regex.test(number);
  };

  const addLog = (phone: string, status: 'success' | 'error', message: string) => {
    setLogs(prev => [{
      timestamp: new Date().toLocaleTimeString(),
      phone,
      status,
      message
    }, ...prev]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number starting with 0",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const endpoints = [
        'https://openapi.bigc.co.th/customer/v1/otp',
        'https://api-sso.ch3plus.com/user/request-otp',
      ];

      const headers = {
        'accept': 'application/json, text/plain, */*',
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
      };

      for (let i = 0; i < parseInt(count); i++) {
        for (const endpoint of endpoints) {
          try {
            await axios.post(endpoint, {
              phone_no: phoneNumber,
              tel: phoneNumber,
              type: "register"
            }, { headers });
            addLog(phoneNumber, 'success', `SMS sent successfully via ${endpoint.split('/')[2]}`);
          } catch (error) {
            addLog(phoneNumber, 'error', `Failed to send SMS via ${endpoint.split('/')[2]}`);
            console.error(`Error with endpoint ${endpoint}:`, error);
          }
        }
      }

      toast({
        title: "Success",
        description: `Sent ${count} SMS requests successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while sending SMS",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-6 p-6 bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Input Panel */}
      <div className="w-full md:w-1/2 animate-fadeIn">
        <Card className="p-6 backdrop-blur-sm bg-black/40 border-gray-700 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                SMS Sender Pro
              </h2>
              <p className="text-sm text-center text-gray-400">Advanced SMS Management Console</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <SmartphoneCharging className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  type="tel"
                  placeholder="Phone Number (e.g., 0812345678)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500"
                  maxLength={10}
                />
              </div>

              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  type="number"
                  placeholder="Number of SMS"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500"
                  min="1"
                  max="100"
                />
              </div>

              <Button
                type="submit"
                className="w-full py-2 font-medium transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                disabled={loading}
              >
                {loading ? "Sending..." : "Launch SMS Campaign"}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Console Panel */}
      <div className="w-full md:w-1/2 animate-fadeIn">
        <Card className="h-[600px] p-6 backdrop-blur-sm bg-black/40 border-gray-700 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-semibold text-green-400">Live Console</h3>
          </div>
          <ScrollArea className="h-[500px] rounded-md border border-gray-700 bg-black/60 p-4">
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-md text-sm font-mono ${
                    log.status === 'success' ? 'bg-green-950/50 text-green-400' : 'bg-red-950/50 text-red-400'
                  }`}
                >
                  <span className="text-gray-500">[{log.timestamp}]</span>{' '}
                  <span className="text-blue-400">{log.phone}:</span>{' '}
                  {log.message}
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-gray-500 text-center py-4">
                  Waiting for SMS campaign to start...
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default Index;
