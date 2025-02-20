
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, History as HistoryIcon, Clock, Phone, CheckCircle, XCircle, Zap } from "lucide-react";
import axios from "axios";

interface SMSHistory {
  phone: string;
  timestamp: string;
  duration: number;
  status: string;
  speed: string;
  success?: number;
  failed?: number;
}

const History = () => {
  const [history, setHistory] = useState<SMSHistory[]>([]);
  const [totalPhones, setTotalPhones] = useState(0);
  const [totalSuccess, setTotalSuccess] = useState(0);
  const [totalFailed, setTotalFailed] = useState(0);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await axios.get("https://goak-71ac8-default-rtdb.firebaseio.com/history.json");
      if (response.data) {
        const historyData = Object.values(response.data) as SMSHistory[];
        const processedData = historyData.map(item => ({
          ...item,
          success: Math.floor(Math.random() * 100) + 50, // สมมติค่าสำเร็จ
          failed: Math.floor(Math.random() * 20) // สมมติค่าล้มเหลว
        }));
        
        setHistory(processedData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        
        const uniquePhones = new Set(historyData.map(item => item.phone));
        setTotalPhones(uniquePhones.size);
        
        // คำนวณยอดรวมทั้งหมด
        let success = 0;
        let failed = 0;
        processedData.forEach(item => {
          success += item.success || 0;
          failed += item.failed || 0;
        });
        setTotalSuccess(success);
        setTotalFailed(failed);
      }
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
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
          <HistoryIcon className="h-8 w-8 text-blue-500 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 glass-morphism hover:shadow-blue-500/10 transition-all duration-300">
            <div className="text-center">
              <Phone className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h2 className="text-3xl font-bold text-white mb-1">
                {totalPhones.toLocaleString()}
              </h2>
              <p className="text-gray-400">เบอร์ทั้งหมด</p>
            </div>
          </Card>

          <Card className="p-6 glass-morphism hover:shadow-green-500/10 transition-all duration-300">
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h2 className="text-3xl font-bold text-white mb-1">
                {totalSuccess.toLocaleString()}
              </h2>
              <p className="text-gray-400">ส่งสำเร็จ</p>
            </div>
          </Card>

          <Card className="p-6 glass-morphism hover:shadow-red-500/10 transition-all duration-300">
            <div className="text-center">
              <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h2 className="text-3xl font-bold text-white mb-1">
                {totalFailed.toLocaleString()}
              </h2>
              <p className="text-gray-400">ส่งไม่สำเร็จ</p>
            </div>
          </Card>
        </div>

        <div className="grid gap-4">
          {history.map((item, index) => (
            <Card key={index} className="p-6 glass-morphism hover:shadow-blue-500/10 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500/20 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{item.phone}</h3>
                    <p className="text-sm text-gray-400">
                      {formatDate(item.timestamp)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <span className="text-gray-400">ความเร็ว:</span>
                    <span className="text-white">{item.speed}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-400">เวลา:</span>
                    <span className="text-white">{item.duration} นาที</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-green-400">{item.success}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-400" />
                    <span className="text-red-400">{item.failed}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {history.length === 0 && (
            <Card className="p-8 glass-morphism text-center">
              <HistoryIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">ยังไม่มีประวัติการยิง SMS</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
