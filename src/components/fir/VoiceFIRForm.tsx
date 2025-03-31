
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useVoiceRecorder } from '@/utils/voiceUtils';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/utils/auth';

const VoiceFIRForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState<string>('medium');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const {
    isRecording,
    transcript,
    audioUrl,
    error,
    startRecording,
    stopRecording,
  } = useVoiceRecorder({
    onTranscriptionComplete: (text) => {
      setDescription(text);
      
      // Try to automatically extract title from transcript
      const firstLine = text.split('.')[0];
      if (firstLine && firstLine.length < 50) {
        setTitle(firstLine);
      } else {
        setTitle(text.substring(0, 40) + '...');
      }
    },
  });

  useEffect(() => {
    // Set current date as default
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setDate(formattedDate);
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        title: "Microphone Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !location || !date) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "FIR filed successfully",
      description: "Your FIR has been submitted and is pending review",
    });
    
    setSubmitting(false);
    
    // Redirect based on user role
    if (user?.role === 'police') {
      navigate('/police/all-firs');
    } else {
      navigate('/my-firs');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Voice Recording</h3>
            <p className="text-sm text-gray-500 mb-4">
              Speak clearly and provide complete details about the incident
            </p>
            
            <div className="flex flex-col items-center justify-center space-y-4 p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
              {isRecording ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-red-500 animate-pulse"></div>
                  </div>
                  <p className="text-red-500 font-medium">Recording...</p>
                  <p className="text-sm text-gray-500 mt-1">Speak clearly into your microphone</p>
                  
                  <div className="flex justify-center mt-4">
                    <Button 
                      variant="destructive"
                      onClick={stopRecording}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Stop Recording
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {audioUrl ? (
                    <div className="w-full space-y-4">
                      <div className="flex justify-center">
                        <audio src={audioUrl} controls className="w-full max-w-md" />
                      </div>
                      <div className="flex justify-center space-x-2">
                        <Button onClick={startRecording}>
                          Record Again
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-400"><path d="M12 8a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0v-5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                      </div>
                      <p className="font-medium">Tap to Start Recording</p>
                      <p className="text-sm text-gray-500 text-center max-w-md">
                        Press the button below and start speaking. Describe the incident in detail, including what happened, when and where it took place.
                      </p>
                      <Button 
                        onClick={startRecording}
                        className="mt-2 bg-fir-700 hover:bg-fir-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M12 8a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0v-5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                        Start Recording
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">FIR Title</Label>
                  <Input 
                    id="title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief title describing the incident"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date of Incident</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where did the incident take place?"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a detailed account of the incident"
                  className="min-h-[150px]"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => {
                    if (user?.role === 'police') {
                      navigate('/police/dashboard');
                    } else {
                      navigate('/dashboard');
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-fir-700 hover:bg-fir-800"
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    'Submit FIR'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceFIRForm;
