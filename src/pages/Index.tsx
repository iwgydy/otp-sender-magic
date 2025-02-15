
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const Index = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [count, setCount] = useState("1");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validatePhoneNumber = (number: string) => {
    const regex = /^0\d{9}$/;
    return regex.test(number);
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
        // Add other endpoints as needed
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
          } catch (error) {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="animate-fadeIn">
        <Card className="w-full max-w-md p-6 backdrop-blur-sm bg-white/90 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-center text-gray-800">SMS Sender</h2>
              <p className="text-sm text-center text-gray-600">Enter phone number and count</p>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  type="tel"
                  placeholder="Phone Number (e.g., 0812345678)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2 transition-colors focus:ring-2 focus:ring-blue-500"
                  maxLength={10}
                />
              </div>

              <div>
                <Input
                  type="number"
                  placeholder="Number of SMS"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="w-full px-4 py-2 transition-colors focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="100"
                />
              </div>

              <Button
                type="submit"
                className="w-full py-2 font-medium transition-all duration-200 bg-gray-900 hover:bg-gray-800 text-white"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send SMS"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Index;
