
import React from "react";
import Header from "@/components/sms-blaster/Header";
import FeatureCards from "@/components/sms-blaster/FeatureCards";
import InputPanel from "@/components/sms-blaster/InputPanel";
import ConsoleOutput from "@/components/sms-blaster/ConsoleOutput";
import { useSMSBlaster } from "@/hooks/useSMSBlaster";

const Index = () => {
  const {
    phoneNumber,
    setPhoneNumber,
    minutes,
    setMinutes,
    loading,
    logs,
    remainingTime,
    apiKey,
    setApiKey,
    showKeyInput,
    phoneReport,
    handlePhoneSubmit,
    handleApiKeySubmit,
  } = useSMSBlaster();

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto">
        <Header />
        <FeatureCards />
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 animate-fadeIn">
            <InputPanel
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              minutes={minutes}
              setMinutes={setMinutes}
              loading={loading}
              showKeyInput={showKeyInput}
              apiKey={apiKey}
              setApiKey={setApiKey}
              remainingTime={remainingTime}
              phoneReport={phoneReport}
              handleSubmit={handlePhoneSubmit}
              handleApiKeySubmit={handleApiKeySubmit}
            />
          </div>
          <div className="w-full md:w-1/2 animate-fadeIn">
            <ConsoleOutput logs={logs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
