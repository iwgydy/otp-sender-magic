
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, History as HistoryIcon, Clock, Phone } from "lucide-react";
import axios from "axios";

interface SMSHistory {
  phone: string;
  timestamp: string;
  duration: number;
  status: string;
  speed: string;
}

const History = () => {
  const [history, setHistory] = useState<SMSHistory[]>([]);
  const [totalPhones, setTotalPhones] = useState(0);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await axios.get("https://goak-71ac8-default-rtdb.firebaseio.com/history.json");
      if (response.data) {
        const historyData = Object.values(response.data) as SMSHistory[];
        setHistory(historyData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        
        // นับจำนวนเบอร์ที่ไม่ซ้ำกัน
        const uniquePhones = new Set(historyData.map(item => item.phone));
        setTotalPhones(uniquePhones.size);
      }
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] bg-grid relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0b0f]/50 to-[#0a0b0f] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                กลับหน้าหลัก
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gradient">ประวัติการยิง SMS</h1>
          </div>
          <HistoryIcon className="h-8 w-8 text-blue-500" />
        </div>

        <Card className="p-6 mb-8 glass-morphism">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              {totalPhones.toLocaleString()}
            </h2>
            <p className="text-gray-400">จำนวนเบอร์ที่ยิงทั้งหมด</p>
          </div>
        </Card>

        <div className="grid gap-4">
          {history.map((item, index) => (
            <Card key={index} className="p-4 glass-morphism">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-lg font-semibold text-white">{item.phone}</p>
                    <p className="text-sm text-gray-400">
                      ความเร็ว: {item.speed} • เวลา: {item.duration} นาที
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(item.timestamp).toLocaleString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
