import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import authService from '../services/auth';
import { Sparkles } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    setLoading(true);
    try {
      const response = await authService.generate({ prompt });
      setResult(response.result);
      toast.success('Content generated successfully!');
    } catch (error) {
      let message = 'Failed to generate content';
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user?.name || 'User'}!</h1>
        <p className="text-white/70 mb-6">
          Generate content using our advanced AI model
        </p>
      </motion.div>

      <Card className="mb-6">
        <form onSubmit={handleGenerateContent}>
          <div className="mb-4">
            <label htmlFor="prompt" className="block text-white text-sm font-medium mb-2">
              Enter your prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What would you like to generate today?"
              className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg
                text-white placeholder-white/50 min-h-[120px]
                focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                transition-all duration-200"
            />
          </div>
          
          <Button
            type="submit"
            loading={loading}
            className="flex items-center"
          >
            <Sparkles size={16} className="mr-2" />
            Generate Content
          </Button>
        </form>
      </Card>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <h2 className="text-xl font-semibold text-white mb-3">Generated Result</h2>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white">
              {result.split('\n').map((paragraph, index) => (
                <p key={index} className={index > 0 ? 'mt-2' : ''}>
                  {paragraph}
                </p>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;