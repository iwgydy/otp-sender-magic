
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => (
  <div className="text-center mb-8 animate-fadeIn relative">
    <Link to="/admin" className="absolute right-0 top-0">
      <Button variant="ghost" className="text-gray-400 hover:text-gray-200">
        <Settings className="h-5 w-5 mr-2" />
        แอดมิน
      </Button>
    </Link>
    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
      SMS BLASTER PRO
    </h1>
    <p className="text-gray-400">ระบบส่ง SMS อัตโนมัติประสิทธิภาพสูง</p>
  </div>
);

export default Header;
