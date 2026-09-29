import React, { useState } from 'react';
import { Send, Database, Terminal, ArrowUp } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  memoriesConsulted?: any[];
}

export const DevOpsAgentChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'agent',
      text: `Hello, I'm the Reactor DevOps intelligence agent. I have indexed historical deployment logs, failure root causes, and verified remediations across your services using Hindsight memory.\n\nAsk me about past incidents, dependency breaks, or configuration checks before deploying.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!messageText) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      const data = await res.json();

      const agentMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: data.answer || 'Consulted Hindsight memory.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        memoriesConsulted: data.memoriesConsulted
      };

      setMessages(prev => [...prev, agentMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          text: `Error querying DevOps agent: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="studio-card bg-white border border-[rgba(13,12,11,0.12)] flex flex-col h-[640px] overflow-hidden">
      {/* Messages Viewport */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 text-[11px] text-[rgba(13,12,11,0.45)] mb-1.5 font-mono">
              <span>{msg.sender === 'user' ? 'You' : 'Reactor Agent'}</span>
              <span>&middot;</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`rounded-2xl p-4 max-w-xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#0a0908] text-white shadow-sm'
                  : 'bg-[#fafaf8] border border-[rgba(13,12,11,0.1)] text-[#0d0c0b]'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Consulted Hindsight Memories */}
              {msg.memoriesConsulted && msg.memoriesConsulted.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-[rgba(13,12,11,0.08)] space-y-2">
                  <div className="text-[11px] font-mono text-[#0d0c0b] font-medium flex items-center gap-1.5">
                    <Database className="h-3 w-3 text-[rgba(13,12,11,0.6)]" />
                    <span>Hindsight Memories Consulted ({msg.memoriesConsulted.length})</span>
                  </div>

                  <div className="space-y-1.5">
                    {msg.memoriesConsulted.map((mem: any, idx: number) => (
                      <div
                        key={idx}
                        className="text-[11px] font-mono text-[rgba(13,12,11,0.7)] bg-[#f4f2ee] p-2 rounded-lg border border-[rgba(13,12,11,0.06)]"
                      >
                        <div className="font-semibold text-[#0d0c0b]">{mem.title}</div>
                        <div className="text-[10px] text-[rgba(13,12,11,0.5)] truncate mt-0.5">
                          Bank: {mem.bankId} &middot; Score: {Math.round(mem.score * 100)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1.5 text-[11px] text-[rgba(13,12,11,0.45)] mb-1 font-mono">
              <span>Reactor Agent</span>
              <span>&middot;</span>
              <span>Recalling from memory...</span>
            </div>
            <div className="rounded-2xl p-4 bg-[#fafaf8] border border-[rgba(13,12,11,0.1)] text-xs text-[rgba(13,12,11,0.6)] flex items-center gap-2">
              <span className="h-3 w-3 border-2 border-[rgba(13,12,11,0.3)] border-t-[#0d0c0b] rounded-full animate-spin" />
              <span>Querying semantic memory bank for relevant incidents...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-6 py-2.5 bg-[#fafaf8] border-t border-[rgba(13,12,11,0.06)] flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-mono text-[rgba(13,12,11,0.45)] shrink-0">Prompts:</span>
        {[
          'Why is Deployment #27 flagged as critical risk?',
          'Explain the historical incident from Deployment #1',
          'What AWS RDS CA bundle should we use with pg 8.11.3?',
          'What is the blast radius of checkout-api?'
        ].map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(prompt)}
            className="text-[11px] font-sans px-3 py-1 rounded-full bg-white hover:bg-[#f4f2ee] text-[#0d0c0b] border border-[rgba(13,12,11,0.12)] whitespace-nowrap cursor-pointer transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-[rgba(13,12,11,0.08)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about historical incidents, AWS RDS TLS incompatibility, or blast radius..."
            className="flex-1 rounded-xl bg-[#fafaf8] border border-[rgba(13,12,11,0.14)] px-4 py-2.5 text-xs text-[#0d0c0b] placeholder-[rgba(13,12,11,0.4)] focus:outline-none focus:border-[#0d0c0b]"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="pill !h-10 !px-4 text-xs gap-1.5 shrink-0 disabled:opacity-40"
          >
            <span>Send</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
