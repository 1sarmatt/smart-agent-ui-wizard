
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function SmartAgentUI() {
  const [clientMessage, setClientMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "client", text: "Здравствуйте, у меня проблема с оплатой." },
    { role: "operator", text: "Понял вас, сейчас уточню информацию." },
  ]);

  const [analysis, setAnalysis] = useState({
    intent: "billing_issue",
    emotion: "anger",
    resolution: "info_provided",
    suggestion: "Уточните, сталкивался ли клиент с этой проблемой ранее. При необходимости предложите компенсацию.",
    qa: ["Используйте более эмпатичный тон", "Предложите дополнительную помощь"]
  });

  const handleSend = async () => {
    if (clientMessage.trim()) {
      const updatedMessages = [...messages, { role: "client", text: clientMessage }];
      setMessages(updatedMessages);
      setClientMessage("");

      // Mock API response since we don't have a real backend yet
      setTimeout(() => {
        const mockResponse = {
          reply: "Спасибо за информацию. Могли бы вы уточнить, когда именно возникла проблема с оплатой?",
          intent: "payment_clarification",
          emotion: "neutral",
          resolution: "in_progress",
          suggestion: "Проверьте статус последней транзакции клиента",
          qa_feedback: ["Хорошее уточняющее сообщение", "Продолжайте вести диалог профессионально"]
        };

        setMessages([...updatedMessages, { role: "operator", text: mockResponse.reply }]);
        setAnalysis({
          intent: mockResponse.intent,
          emotion: mockResponse.emotion,
          resolution: mockResponse.resolution,
          suggestion: mockResponse.suggestion,
          qa: mockResponse.qa_feedback
        });
      }, 1000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
      {/* Main chat panel */}
      <Card className="col-span-2 flex flex-col h-[80vh]">
        <CardContent className="flex-1 overflow-auto space-y-4 p-4">
          {messages.map((msg, i) => (
            <div key={i} className={`text-left ${msg.role === "operator" ? "text-blue-700" : "text-black"}`}>
              <span className="font-bold">{msg.role === "operator" ? "Оператор" : "Клиент"}:</span> {msg.text}
            </div>
          ))}
        </CardContent>
        <div className="flex p-4 border-t gap-2">
          <Input
            placeholder="Введите сообщение клиента..."
            value={clientMessage}
            onChange={(e) => setClientMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>Отправить</Button>
        </div>
      </Card>

      {/* Analysis panel */}
      <Card className="col-span-1 h-[80vh] overflow-auto">
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-semibold">Анализ запроса</h2>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Интент</p>
              <Badge variant="outline">{analysis.intent}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Эмоция</p>
              <Badge variant="destructive">{analysis.emotion}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Решение</p>
              <Badge>{analysis.resolution}</Badge>
            </div>
          </div>

          <div>
            <h3 className="font-medium mt-4">Подсказка оператору</h3>
            <p className="text-sm bg-muted p-2 rounded-xl">
              {analysis.suggestion}
            </p>
          </div>

          <div>
            <h3 className="font-medium mt-4">Автозаполнение CRM</h3>
            <Textarea 
              readOnly 
              className="text-sm" 
              value={`{
  "issue_type": "${analysis.intent}",
  "client_sentiment": "${analysis.emotion}",
  "resolution": "${analysis.resolution}"
}`} 
            />
          </div>

          <div>
            <h3 className="font-medium mt-4">Замечания QA</h3>
            <ul className="text-sm list-disc pl-5">
              {analysis.qa.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
