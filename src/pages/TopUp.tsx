
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, ArrowLeft, Copy, Check, AlertCircle, Info } from "lucide-react";
import { verifyAndTopupAngpao, generateApiKey } from "@/services/topupAPI";
import { useToast } from "@/hooks/use-toast";

const TopUp = () => {
  const [angpaoLink, setAngpaoLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState("");
  const [voucherInfo, setVoucherInfo] = useState<{ id: string; amount: string } | null>(null);
  const { toast } = useToast();

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setVoucherInfo(null);
    
    try {
      if (!angpaoLink.trim()) {
        throw new Error("กรุณาใส่ลิงก์อั้งเปา");
      }
      
      // ตรวจสอบอั้งเปา โดยใช้เบอร์โทรที่กำหนดไว้แล้ว
      const response = await verifyAndTopupAngpao(angpaoLink, "");
      
      console.log("API Response:", response);
      
      // แสดงข้อมูล voucher ที่ได้รับ
      if (response.data && response.data.voucher) {
        setVoucherInfo({
          id: response.data.voucher.voucher_id,
          amount: response.data.voucher.amount_baht
        });
      }
      
      // ตรวจสอบสถานะการเติมเงิน
      if (response.status.code !== "VOUCHER_OUT_OF_STOCK" && response.status.code !== "SUCCESS") {
        throw new Error(`ไม่สามารถเติมเงินได้: ${response.status.message}`);
      }
      
      // ตรวจสอบจำนวนเงิน
      const amount = parseFloat(response.data.voucher.amount_baht);
      if (amount < 10) {
        throw new Error("จำนวนเงินในอั้งเปาต้องมีอย่างน้อย 10 บาท");
      }
      
      // คำนวณจำนวนวันตามจำนวนเงิน (10 บาท/วัน)
      const days = Math.floor(amount / 10);
      
      // ดึงเบอร์โทรจาก response (ถ้ามี) หรือใช้เบอร์แรกในรายการ tickets
      const phoneNumber = response.data.tickets && response.data.tickets.length > 0 
        ? response.data.tickets[0].mobile.replace(/-/g, "") 
        : "0825658423"; // ใช้เบอร์สำรองถ้าไม่มีในข้อมูล
      
      // สร้าง API Key ใหม่
      const keyResult = await generateApiKey(phoneNumber, days);
      
      // แสดงผลลัพธ์
      setApiKey(keyResult.key);
      setExpireDate(new Date(keyResult.expireDate).toLocaleString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }));
      
      toast({
        title: "เติมเงินสำเร็จ",
        description: `คุณได้รับ API Key สำหรับใช้งาน ${days} วัน`,
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเติมเงิน");
      toast({
        title: "เกิดข้อผิดพลาด",
        description: err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเติมเงิน",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast({
      title: "คัดลอกแล้ว",
      description: "API Key ถูกคัดลอกไปยังคลิปบอร์ดแล้ว",
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] bg-grid relative">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0b0f]/50 to-[#0a0b0f] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับหน้าหลัก
        </Link>
        
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8">
          เติมเงินเพื่อใช้บริการ SMS Blaster
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 backdrop-blur-sm bg-black/40 border-gray-700 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
            <div className="flex items-center mb-6">
              <CreditCard className="h-6 w-6 text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">เติมเงินผ่านอั้งเปา TrueMoney</h2>
            </div>
            
            <form onSubmit={handleTopUp} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="angpao" className="block text-sm font-medium text-gray-300">
                  ลิงก์อั้งเปา TrueMoney
                </label>
                <Textarea
                  id="angpao"
                  placeholder="วางลิงก์อั้งเปาที่นี่"
                  value={angpaoLink}
                  onChange={(e) => setAngpaoLink(e.target.value)}
                  className="w-full bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500"
                />
                <div className="flex items-start text-xs text-gray-400">
                  <Info className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5 text-blue-400" />
                  <p>
                    ตัวอย่าง: https://gift.truemoney.com/campaign/?v=abcdefghijklmnopqrstuvwxyz123456at
                    <br />
                    หรือใส่เฉพาะรหัสอั้งเปา เช่น abcdefghijklmnopqrstuvwxyz123456at
                  </p>
                </div>
              </div>
              
              {voucherInfo && (
                <div className="p-3 bg-blue-900/30 border border-blue-800 rounded-md">
                  <p className="text-sm text-blue-300">
                    ข้อมูลอั้งเปา:<br />
                    ID: {voucherInfo.id}<br />
                    จำนวนเงิน: {voucherInfo.amount} บาท
                  </p>
                </div>
              )}
              
              {error && (
                <div className="p-3 bg-red-900/30 border border-red-800 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "กำลังตรวจสอบ..." : "เติมเงิน"}
              </Button>
            </form>
            
            <div className="mt-6 border-t border-gray-800 pt-6">
              <h3 className="text-md font-medium text-gray-300 mb-2">อัตราค่าบริการ:</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  10 บาท = API Key สำหรับ 1 วัน
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  50 บาท = API Key สำหรับ 5 วัน
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  100 บาท = API Key สำหรับ 10 วัน
                </li>
              </ul>
            </div>
          </Card>
          
          <div className="space-y-6">
            {apiKey && (
              <Card className="p-6 backdrop-blur-sm bg-black/40 border-gray-700 shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
                <h2 className="text-xl font-semibold text-green-400 mb-4">✅ การเติมเงินสำเร็จ</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">API Key ของคุณ:</p>
                    <div className="flex items-center">
                      <code className="bg-gray-900 px-3 py-2 rounded text-green-300 text-sm flex-1 overflow-x-auto">
                        {apiKey}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={copyToClipboard}
                        className="ml-2 text-gray-400 hover:text-white"
                      >
                        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-1">วันหมดอายุ:</p>
                    <p className="text-green-300">{expireDate}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-800">
                    <p className="text-sm text-gray-300">
                      คัดลอก API Key นี้ไปใช้ในการยิง SMS โดยใส่ในช่อง "API Key" เมื่อเริ่มการยิง
                    </p>
                  </div>
                </div>
              </Card>
            )}
            
            <Card className="p-6 backdrop-blur-sm bg-black/40 border-gray-700 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
              <h3 className="text-xl font-semibold text-gradient mb-4">วิธีการเติมเงิน</h3>
              <ol className="space-y-4 text-gray-300">
                <li className="flex items-start group">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mr-3 group-hover:bg-blue-500 group-hover:text-white transition-all">1</span>
                  <span className="group-hover:text-white transition-colors">เปิดแอป TrueMoney Wallet แล้วเลือก "ส่งซองของขวัญ"</span>
                </li>
                <li className="flex items-start group">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mr-3 group-hover:bg-blue-500 group-hover:text-white transition-all">2</span>
                  <span className="group-hover:text-white transition-colors">ใส่จำนวนเงินที่ต้องการเติม (10 บาท = 1 วัน, 50 บาท = 5 วัน, 100 บาท = 10 วัน)</span>
                </li>
                <li className="flex items-start group">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mr-3 group-hover:bg-blue-500 group-hover:text-white transition-all">3</span>
                  <span className="group-hover:text-white transition-colors">คัดลอกลิงก์ของขวัญและวางในช่องด้านบน</span>
                </li>
                <li className="flex items-start group">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mr-3 group-hover:bg-blue-500 group-hover:text-white transition-all">4</span>
                  <span className="group-hover:text-white transition-colors">กดปุ่ม "เติมเงิน" เพื่อดำเนินการ</span>
                </li>
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUp;
