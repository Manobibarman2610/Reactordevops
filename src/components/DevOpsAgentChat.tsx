import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Send, Database, Sparkles, BrainCircuit, ShieldAlert, Check } from 'lucide-react';

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
      text: `Hello! I am REACTOR, your organizational memory DevOps agent. I have recalled and retained post-mortems, dependency changes, schema migrations, and infrastructure incidents across your microservices using Hindsight long-term memory. 

Ask me anything about past deployment failures, root causes, or verification checks before you deploy.`,
      timestamp: new Date().toLocaleTimeString()
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
      timestamp: new Date().toLocaleTimeString()
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
        timestamp: new Date().toLocaleTimeString(),
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
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-slate-800/80 bg-[#0d131f]/90 backdrop-blur-xl shadow-xl shadow-black/40 flex flex-col h-[650px] overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">
              DevOps Knowledge Agent
            </h3>
            <p className="text-xs text-slate-400">
              Answers grounded in Hindsight persistent organizational memory.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Hindsight Active</span>
        </span>
      </div>

      {/* Messages Viewport */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1 font-mono">
              <span>{msg.sender === 'user' ? 'You (DevOps)' : 'REACTOR Agent'}</span>
              <span>·</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`rounded-2xl p-4 max-w-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Consulted Hindsight Memories Accordion */}
              {msg.memoriesConsulted && msg.memoriesConsulted.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="text-[11px] font-mono text-amber-400 flex items-center gap-1.5">
                    <Database className="h-3 w-3" />
                    <span>Hindsight Memories Consulted ({msg.memoriesConsulted.length})</span>
                  </div>

                  <div className="space-y-1.5">
                    {msg.memoriesConsulted.map((item: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-slate-800/80 text-[11px]">
                        <div className="font-semibold text-slate-200 flex items-center justify-between">
                          <span className="truncate">{item.memory.title}</span>
                          <span className="font-mono text-amber-400 text-[10px]">
                            {Math.round(item.score * 100)}% match
                          </span>
                        </div>
                        {item.memory.metadata.rootCause && (
                          <div className="text-slate-400 text-[10px] mt-0.5">
                            Root Cause: {item.memory.metadata.rootCause}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs text-slate-400 font-mono p-2"
          >
            <BrainCircuit className="h-4 w-4 animate-spin text-amber-500" />
            <span>Recalling memories and synthesizing reasoning...</span>
          </motion.div>
        )}
      </div>

      {/* Suggested Prompts */}
      <div className="px-4 py-2.5 bg-slate-900/40 border-t border-slate-800/80 flex flex-wrap gap-1.5 text-xs">
        <span className="text-[11px] text-slate-500 self-center font-medium">Quick Query:</span>
        {[
          'Why did checkout-api fail in Deployment #1?',
          'What happened when we upgraded Redis timeouts?',
          'How do we prevent ACCESS EXCLUSIVE locks in Prisma?',
          'Why did recommendation-engine get OOMKilled in Node 20?'
        ].map((prompt, idx) => (
          <motion.button
            key={idx}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer disabled:opacity-50 border border-slate-800"
          >
            {prompt}
          </motion.button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3.5 border-t border-slate-800 bg-slate-900/90 flex gap-2.5"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask REACTOR about past deployment failures, root causes, or verification checklists..."
          disabled={isLoading}
          className="flex-1 rounded-xl bg-slate-950/80 border border-slate-700/80 px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-md shadow-amber-500/20"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Ask</span>
        </motion.button>
      </form>
    </motion.div>
  );
};
