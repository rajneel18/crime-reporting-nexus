
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { mockFIRs } from '@/utils/mockData';

const NewInterrogation = () => {
  const [firId, setFirId] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioFile) {
      toast({
        title: "Missing audio file",
        description: "Please select an audio file to upload",
        variant: "destructive",
      });
      return;
    }
    
    if (!firId) {
      toast({
        title: "Missing FIR",
        description: "Please select an FIR to associate with this interrogation",
        variant: "destructive",
      });
      return;
    }
    
    // Start upload simulation
    setUploading(true);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }
    
    setUploading(false);
    setProcessing(true);
    
    toast({
      title: "Upload complete",
      description: "Audio file uploaded successfully. Processing started.",
    });
    
    // Simulate processing progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setProcessingProgress(i);
      
      if (i === 30) {
        toast({
          title: "Processing audio",
          description: "Speech to text conversion in progress...",
        });
      }
      
      if (i === 60) {
        toast({
          title: "Speaker diarization",
          description: "Identifying different speakers in the audio...",
        });
      }
      
      if (i === 85) {
        toast({
          title: "Emotion analysis",
          description: "Analyzing speech patterns and emotions...",
        });
      }
    }
    
    setProcessing(false);
    
    toast({
      title: "Processing complete",
      description: "Interrogation analysis is ready to view.",
    });
    
    // Navigate to a mock session details page
    navigate('/police/interrogation/int-001');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Interrogation Session</h1>
        <p className="text-gray-500">Upload audio for speaker diarization and emotion analysis</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Interrogation Recording</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fir">Associated FIR</Label>
              <Select value={firId} onValueChange={setFirId}>
                <SelectTrigger id="fir">
                  <SelectValue placeholder="Select an FIR" />
                </SelectTrigger>
                <SelectContent>
                  {mockFIRs.map(fir => (
                    <SelectItem key={fir.id} value={fir.id}>
                      {fir.id} - {fir.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="audio">Audio Recording</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                {audioFile ? (
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mx-auto text-fir-600 mb-2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" x2="12" y1="18" y2="18"/><line x1="8" x2="16" y1="18" y2="18"/><rect x="8" y="6" width="8" height="5"/></svg>
                    <p className="font-medium text-gray-900">{audioFile.name}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setAudioFile(null)}
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 mx-auto text-gray-400 mb-4"><path d="M12 8a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0v-5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                    <p className="font-medium text-gray-900 mb-1">Upload Audio File</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Click to select or drag and drop your audio file (.mp3, .wav, .m4a)
                    </p>
                    <Input 
                      id="audio" 
                      type="file" 
                      accept="audio/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Label htmlFor="audio">
                      <Button type="button" variant="outline">
                        Select File
                      </Button>
                    </Label>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Maximum file size: 100MB. Supported formats: MP3, WAV, M4A
              </p>
            </div>
            
            {(uploading || processing) && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{uploading ? 'Uploading...' : 'Processing...'}</span>
                  <span>{uploading ? uploadProgress : processingProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${uploading ? 'bg-fir-600' : 'bg-green-600'}`}
                    style={{ width: `${uploading ? uploadProgress : processingProgress}%` }}
                  ></div>
                </div>
                {processing && (
                  <p className="text-xs text-gray-500">
                    {processingProgress < 40 ? 'Converting speech to text...' : 
                     processingProgress < 70 ? 'Identifying different speakers...' : 
                     'Analyzing speech patterns and emotions...'}
                  </p>
                )}
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/police/interrogation')}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={!audioFile || uploading || processing}
                className="bg-fir-700 hover:bg-fir-800"
              >
                {uploading ? 'Uploading...' : 
                 processing ? 'Processing...' : 
                 'Upload & Process'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>About Analysis Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-2">Speaker Diarization</h3>
              <p className="text-gray-600 text-sm">
                The system automatically identifies different speakers in the audio recording and 
                separates their speech segments. This helps in creating accurate transcripts with 
                speaker attribution.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">Emotion Analysis</h3>
              <p className="text-gray-600 text-sm">
                Advanced AI algorithms analyze speech patterns, tone, and linguistic markers to 
                detect emotional states such as nervousness, deception, anger, or fear. This 
                provides valuable insights for investigators.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">Transcript Generation</h3>
              <p className="text-gray-600 text-sm">
                The system produces a complete text transcript of the interrogation, timestamped 
                and attributed to each speaker. The transcript can be exported for reports or 
                court documentation.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">Interactive Playback</h3>
              <p className="text-gray-600 text-sm">
                Navigate through the audio recording with an interactive timeline that shows 
                speaker segments and emotional indicators. Jump to specific points in the 
                conversation for detailed analysis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewInterrogation;
