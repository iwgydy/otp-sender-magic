
import React from "react";
import { Card } from "@/components/ui/card";
import { Rocket, Shield, Award } from "lucide-react";

const FeatureCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <Card className="p-4 bg-black/40 border-gray-700 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Rocket className="h-5 w-5 text-blue-400" />
        <h3 className="text-blue-400">ความเร็วสูง</h3>
      </div>
      <p className="text-gray-400 text-sm mt-2">ส่ง SMS ได้รวดเร็วและมีประสิทธิภาพ</p>
    </Card>
    <Card className="p-4 bg-black/40 border-gray-700 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-green-400" />
        <h3 className="text-green-400">ปลอดภัย 100%</h3>
      </div>
      <p className="text-gray-400 text-sm mt-2">ระบบความปลอดภัยมาตรฐานสูงสุด</p>
    </Card>
    <Card className="p-4 bg-black/40 border-gray-700 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Award className="h-5 w-5 text-purple-400" />
        <h3 className="text-purple-400">มืออาชีพ</h3>
      </div>
      <p className="text-gray-400 text-sm mt-2">บริการระดับพรีเมียม</p>
    </Card>
  </div>
);

export default FeatureCards;
