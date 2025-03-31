
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockInterrogationSessions } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';
import { InterrogationSession } from '@/types';

const EmotionBadge = ({ emotion }: { emotion: string }) => {
  const getEmotionColor = () => {
    switch(emotion.toLowerCase()) {
      case 'nervous': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'uncertain': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'neutral': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'curious': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-md border ${getEmotionColor()}`}>
      {emotion}
    </span>
  );
};

const InterrogationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<InterrogationSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadSession = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundSession = mockInterrogationSessions.find(s => s.id === id);
      if (foundSession) {
        setSession(foundSession);
      }
      
      setLoading(false);
    };
    
    loadSession();
  }, [id]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handlePlay = (segmentIndex: number) => {
    setCurrentSegment(segmentIndex);
    setIsPlaying(true);
    
    // Simulate audio playing for a few seconds, then stop
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };
  
  const handlePlayAll = () => {
    toast({
      title: "Playback",
      description: "This would play the entire interrogation audio",
    });
  };
  
  const handleExport = () => {
    toast({
      title: "Export",
      description: "This would export the transcript and analysis as a document",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <svg className="animate-spin h-10 w-10 text-fir-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-500">Loading interrogation details...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 mx-auto text-gray-400 mb-4"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Session Not Found</h2>
          <p className="text-gray-500 mb-4">
            The requested interrogation session could not be found.
          </p>
          <Button onClick={() => navigate('/police/interrogation')}>
            Back to Sessions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interrogation Analysis</h1>
          <p className="text-gray-500">
            Session #{session.id} • FIR #{session.firId} • Date: {new Date(session.date).toLocaleDateString()}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePlayAll}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Play Full Recording
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Conversation Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {session.speakers?.map((speaker, speakerIndex) => (
                <div key={speaker.id} className="space-y-4">
                  <h3 className="font-medium text-lg flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${speaker.name.includes('Officer') ? 'bg-blue-500' : 'bg-red-500'}`}></span>
                    {speaker.name}
                  </h3>
                  
                  {speaker.segments.map((segment, segmentIndex) => (
                    <div 
                      key={`${speaker.id}-${segmentIndex}`}
                      className={`p-4 rounded-lg border flex flex-col ${
                        speaker.name.includes('Officer') ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-100'
                      } ${currentSegment === segmentIndex + (speakerIndex * speaker.segments.length) ? 'ring-2 ring-offset-2 ring-fir-400' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-gray-500">
                          {formatTime(segment.start)} - {formatTime(segment.end)}
                        </span>
                        {segment.emotion && <EmotionBadge emotion={segment.emotion} />}
                      </div>
                      <p className="text-gray-700">{segment.text}</p>
                      <div className="flex justify-end mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handlePlay(segmentIndex + (speakerIndex * speaker.segments.length))}
                          disabled={isPlaying}
                        >
                          {isPlaying && currentSegment === segmentIndex + (speakerIndex * speaker.segments.length) ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          )}
                          {isPlaying && currentSegment === segmentIndex + (speakerIndex * speaker.segments.length) ? 'Playing...' : 'Play'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Emotion Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Suspect Emotional States</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="px-3 py-2 rounded-md bg-yellow-100 text-yellow-800 text-sm flex items-center">
                      <span className="font-medium mr-2">Nervous:</span>
                      <span>30%</span>
                    </div>
                    <div className="px-3 py-2 rounded-md bg-blue-100 text-blue-800 text-sm flex items-center">
                      <span className="font-medium mr-2">Uncertain:</span>
                      <span>45%</span>
                    </div>
                    <div className="px-3 py-2 rounded-md bg-gray-100 text-gray-800 text-sm flex items-center">
                      <span className="font-medium mr-2">Neutral:</span>
                      <span>25%</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Officer Emotional States</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="px-3 py-2 rounded-md bg-purple-100 text-purple-800 text-sm flex items-center">
                      <span className="font-medium mr-2">Curious:</span>
                      <span>60%</span>
                    </div>
                    <div className="px-3 py-2 rounded-md bg-gray-100 text-gray-800 text-sm flex items-center">
                      <span className="font-medium mr-2">Neutral:</span>
                      <span>40%</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Key Insights</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-2">!</span>
                      <span>Suspect shows increased nervousness when discussing vehicle location</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mr-2">?</span>
                      <span>Hesitation detected during timeline questions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">✓</span>
                      <span>Consistent voice patterns when describing personal details</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Audio Waveform</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md">
                <div className="h-24 flex items-center justify-between">
                  {/* Simulated waveform bars */}
                  {[...Array(40)].map((_, i) => {
                    const height = 20 + Math.random() * 70;
                    return (
                      <div 
                        key={i} 
                        className="w-1.5 bg-fir-600"
                        style={{ height: `${height}%` }}
                      ></div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>00:00</span>
                  <span>05:36</span>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePlayAll}
                  className="w-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Play Full Recording
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Analysis Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justfy-start text-left" onClick={handleExport}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Export Full Report
              </Button>
              <Button variant="outline" className="w-full justfy-start text-left">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
                View Related FIR
              </Button>
              <Button variant="outline" className="w-full justfy-start text-left" onClick={() => navigate('/police/interrogation')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                Back to All Sessions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InterrogationDetails;
