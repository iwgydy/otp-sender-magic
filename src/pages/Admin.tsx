
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Key, UserPlus, Calendar, Trash2, ArrowLeft, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

interface APIKey {
  key: string;
  users: string[];
  expireDate: string;
  active: boolean;
  totalMinutes?: number;
  usedMinutes?: number;
}

const Admin = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [totalMinutes, setTotalMinutes] = useState("60"); // Default 60 minutes
  const [keys, setKeys] = useState<APIKey[]>([]);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "975699zx") {
      setIsAuthenticated(true);
      loadKeys();
    } else {
      toast({
        title: "รหัสผ่านไม่ถูกต้อง",
        variant: "destructive",
      });
    }
  };

  const loadKeys = async () => {
    try {
      const response = await axios.get("https://goak-71ac8-default-rtdb.firebaseio.com/keys.json");
      if (response.data) {
        const keysList = Object.entries(response.data).map(([key, value]: [string, any]) => ({
          key,
          ...value,
        }));
        setKeys(keysList);
      }
    } catch (error) {
      console.error("Error loading keys:", error);
    }
  };

  const generateKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewKey(result);
  };

  const createKey = async () => {
    if (!newKey || !expireDate || !totalMinutes) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบ",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.put(`https://goak-71ac8-default-rtdb.firebaseio.com/keys/${newKey}.json`, {
        users: [],
        expireDate,
        active: true,
        totalMinutes: parseInt(totalMinutes),
        usedMinutes: 0,
      });
      toast({
        title: "สร้าง API Key สำเร็จ",
        description: `Key: ${newKey}`,
      });
      loadKeys();
      setNewKey("");
      setExpireDate("");
      setTotalMinutes("60");
    } catch (error) {
      console.error("Error creating key:", error);
    }
  };

  const deleteKey = async (key: string) => {
    try {
      await axios.delete(`https://goak-71ac8-default-rtdb.firebaseio.com/keys/${key}.json`);
      toast({
        title: "ลบ API Key สำเร็จ",
      });
      loadKeys();
    } catch (error) {
      console.error("Error deleting key:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md p-6 backdrop-blur-sm bg-black/40 border-gray-700">
          <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-white mb-4">Admin Login</h2>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="รหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" className="w-full">เข้าสู่ระบบ</Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button variant="ghost" className="text-gray-400 hover:text-gray-200">
              <ArrowLeft className="h-5 w-5 mr-2" />
              กลับหน้าหลัก
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">จัดการ API Keys</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create New Key */}
          <Card className="p-6 backdrop-blur-sm bg-black/40 border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">สร้าง API Key ใหม่</h2>
            <div className="space-y-4">
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="API Key"
                  className="pl-10"
                />
              </div>
              <Button onClick={generateKey} className="w-full mb-2">
                <UserPlus className="h-4 w-4 mr-2" />
                สร้าง Key สุ่ม
              </Button>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  type="date"
                  value={expireDate}
                  onChange={(e) => setExpireDate(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  type="number"
                  value={totalMinutes}
                  onChange={(e) => setTotalMinutes(e.target.value)}
                  placeholder="จำนวนนาทีที่สามารถใช้งานได้"
                  className="pl-10"
                  min="1"
                  max="1440"
                />
              </div>
              <Button onClick={createKey} className="w-full bg-green-600 hover:bg-green-700">
                บันทึก API Key
              </Button>
            </div>
          </Card>

          {/* Existing Keys */}
          <Card className="p-6 backdrop-blur-sm bg-black/40 border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">API Keys ที่มีอยู่</h2>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {keys.map((key) => (
                  <div key={key.key} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-green-400 font-mono">{key.key}</p>
                        <p className="text-sm text-gray-400">
                          วันหมดอายุ: {new Date(key.expireDate).toLocaleDateString('th-TH')}
                        </p>
                        <p className="text-sm text-gray-400">
                          สถานะ: {key.active ? (
                            <span className="text-green-400">ใช้งานได้</span>
                          ) : (
                            <span className="text-red-400">ปิดใช้งาน</span>
                          )}
                        </p>
                        <p className="text-sm text-gray-400">
                          เวลาที่ใช้ได้: {key.usedMinutes || 0}/{key.totalMinutes || 0} นาที
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteKey(key.key)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
