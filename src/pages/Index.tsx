
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
    phoneHistory,
    handlePhoneSubmit,
    handleApiKeySubmit,
  } = useSMSBlaster();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header />
        <div className="mt-8">
          <FeatureCards />
        </div>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="w-full animate-fadeIn">
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
              speed="normal"
              setSpeed={() => {}}
            />
          </div>
          <div className="w-full animate-fadeIn">
            <ConsoleOutput 
              logs={logs}
              phoneHistory={phoneHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
