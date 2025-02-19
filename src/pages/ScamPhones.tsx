
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ScamPhone } from "@/types/phone";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, ArrowLeft, Plus } from "lucide-react";
import axios from "axios";

const ScamPhones = () => {
  const [scamPhones, setScamPhones] = useState<ScamPhone[]>([]);
  const [newNumber, setNewNumber] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadScamPhones();
  }, []);

  const loadScamPhones = async () => {
    try {
      const response = await axios.get("https://goak-71ac8-default-rtdb.firebaseio.com/scam.json");
      if (response.data) {
        const phones: ScamPhone[] = Object.entries(response.data).map(([number, data]: [string, any]) => ({
          number,
          description: data.description,
          reportCount: data.reportCount || 1,
          lastReported: data.lastReported || new Date().toISOString()
        }));
        setScamPhones(phones.sort((a, b) => b.reportCount - a.reportCount));
      }
    } catch (error) {
      console.error("Error loading scam phones:", error);
    }
  };

  const handleReport = async () => {
    if (!newNumber || !description) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบ",
        description: "ต้องระบุทั้งเบอร์โทรและรายละเอียด",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await axios.get(`https://goak-71ac8-default-rtdb.firebaseio.com/scam/${newNumber}.json`);
      const currentData = response.data;
      
      await axios.put(`https://goak-71ac8-default-rtdb.firebaseio.com/scam/${newNumber}.json`, {
        description: description,
        reportCount: (currentData?.reportCount || 0) + 1,
        lastReported: new Date().toISOString()
      });

      toast({
        title: "รายงานเบอร์โกงสำเร็จ",
        description: `เบอร์ ${newNumber} ถูกเพิ่มเข้าสู่รายการเบอร์โกง`
      });

      setNewNumber("");
      setDescription("");
      loadScamPhones();
    } catch (error) {
      console.error("Error reporting scam number:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถรายงานเบอร์ได้ กรุณาลองใหม่อีกครั้ง",
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
            <h1 className="text-2xl font-bold text-white">เบอร์โกง</h1>
          </div>
          <AlertTriangle className="h-8 w-8 text-yellow-500" />
        </div>

        <Card className="p-6 mb-8 backdrop-blur-sm bg-black/40 border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">รายงานเบอร์โกง</h2>
          <div className="space-y-4">
            <Input
              type="tel"
              placeholder="เบอร์โทรศัพท์"
              value={newNumber}
              onChange={(e) => setNewNumber(e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white"
              maxLength={10}
            />
            <Textarea
              placeholder="รายละเอียดการโกง"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white"
            />
          </div>
          <Button onClick={handleReport} className="mt-4 w-full">
            <Plus className="mr-2 h-4 w-4" />
            รายงานเบอร์โกง
          </Button>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scamPhones.map((phone) => (
            <Card key={phone.number} className="p-4 backdrop-blur-sm bg-black/40 border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">{phone.number}</p>
                  <p className="text-sm text-gray-400">{phone.description}</p>
                </div>
                <div className="flex items-center space-x-1 bg-red-500/20 px-2 py-1 rounded">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-red-400 text-sm">{phone.reportCount}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <p>อัพเดทล่าสุด: {new Date(phone.lastReported).toLocaleString()}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScamPhones;
