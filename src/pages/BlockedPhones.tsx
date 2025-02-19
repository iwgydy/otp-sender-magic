
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BlockedPhone } from "@/types/phone";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Shield, ArrowLeft, Plus, Ban } from "lucide-react";
import axios from "axios";

const BlockedPhones = () => {
  const [blockedPhones, setBlockedPhones] = useState<BlockedPhone[]>([]);
  const [newNumber, setNewNumber] = useState("");
  const [reason, setReason] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadBlockedPhones();
  }, []);

  const loadBlockedPhones = async () => {
    try {
      const response = await axios.get("https://goak-71ac8-default-rtdb.firebaseio.com/blocked.json");
      if (response.data) {
        const phones: BlockedPhone[] = Object.entries(response.data).map(([number, data]: [string, any]) => ({
          number,
          reason: data.reason,
          reportedBy: data.reportedBy || "Anonymous",
          timestamp: data.timestamp || new Date().toISOString()
        }));
        setBlockedPhones(phones);
      }
    } catch (error) {
      console.error("Error loading blocked phones:", error);
    }
  };

  const handleBlock = async () => {
    if (!newNumber || !reason) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบ",
        description: "ต้องระบุทั้งเบอร์โทรและเหตุผล",
        variant: "destructive"
      });
      return;
    }

    try {
      await axios.put(`https://goak-71ac8-default-rtdb.firebaseio.com/blocked/${newNumber}.json`, {
        reason,
        reportedBy: "User",
        timestamp: new Date().toISOString()
      });

      toast({
        title: "บล็อกเบอร์สำเร็จ",
        description: `เบอร์ ${newNumber} ถูกเพิ่มเข้าสู่รายการบล็อก`
      });

      setNewNumber("");
      setReason("");
      loadBlockedPhones();
    } catch (error) {
      console.error("Error blocking number:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบล็อกเบอร์ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                กลับหน้าหลัก
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">เบอร์ที่ถูกบล็อก</h1>
          </div>
          <Shield className="h-8 w-8 text-blue-500" />
        </div>

        <Card className="p-6 mb-8 backdrop-blur-sm bg-black/40 border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">เพิ่มเบอร์ที่ต้องการบล็อก</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="tel"
              placeholder="เบอร์โทรศัพท์"
              value={newNumber}
              onChange={(e) => setNewNumber(e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white"
              maxLength={10}
            />
            <Input
              type="text"
              placeholder="เหตุผลในการบล็อก"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white"
            />
          </div>
          <Button onClick={handleBlock} className="mt-4 w-full">
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มเบอร์ที่ต้องการบล็อก
          </Button>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blockedPhones.map((phone) => (
            <Card key={phone.number} className="p-4 backdrop-blur-sm bg-black/40 border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">{phone.number}</p>
                  <p className="text-sm text-gray-400">{phone.reason}</p>
                </div>
                <Ban className="h-5 w-5 text-red-500" />
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <p>รายงานโดย: {phone.reportedBy}</p>
                <p>เวลา: {new Date(phone.timestamp).toLocaleString()}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlockedPhones;
