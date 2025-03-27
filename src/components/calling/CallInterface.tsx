
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Phone, MonitorSpeaker, Users, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CallInterfaceProps {
  caller: {
    id: string;
    name: string;
    avatar?: string;
  };
  isIncoming?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  onEnd?: () => void;
}

const CallInterface: React.FC<CallInterfaceProps> = ({
  caller,
  isIncoming = false,
  onAccept,
  onDecline,
  onEnd,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [callStatus, setCallStatus] = useState<'ringing' | 'ongoing' | 'ended'>(isIncoming ? 'ringing' : 'ongoing');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [participants, setParticipants] = useState(1);
  const timerRef = useRef<number | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Simulate connecting to a call
  useEffect(() => {
    if (callStatus === 'ongoing') {
      // Start call timer
      timerRef.current = window.setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      // Simulate getting local video stream
      if (localVideoRef.current) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then(stream => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          })
          .catch(err => {
            console.error('Error accessing media devices:', err);
            toast({
              title: "Camera Access Error",
              description: "Could not access your camera or microphone.",
              variant: "destructive",
            });
          });
      }
    }
    
    return () => {
      // Clean up
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Stop all media tracks
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [callStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAcceptCall = () => {
    setCallStatus('ongoing');
    if (onAccept) onAccept();
  };

  const handleDeclineCall = () => {
    setCallStatus('ended');
    if (onDecline) onDecline();
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    if (onEnd) onEnd();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    // In a real app, this would mute the actual audio track
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
        track.enabled = isMuted; // Toggle the current state
      });
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    
    // In a real app, this would toggle the video track
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOn; // Toggle the current state
      });
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // In a real implementation, this would switch audio output devices
  };

  // Render incoming call screen
  if (callStatus === 'ringing' && isIncoming) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Incoming Call</h2>
          <p className="text-muted-foreground">from {caller.name}</p>
        </div>
        
        <Avatar className="h-32 w-32 mb-8">
          <AvatarImage src={caller.avatar} alt={caller.name} />
          <AvatarFallback>{caller.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex gap-4">
          <Button 
            size="lg" 
            className="h-16 w-16 rounded-full bg-destructive hover:bg-destructive/90"
            onClick={handleDeclineCall}
          >
            <PhoneOff className="h-8 w-8" />
          </Button>
          
          <Button 
            size="lg" 
            className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600"
            onClick={handleAcceptCall}
          >
            <Phone className="h-8 w-8" />
          </Button>
        </div>
      </div>
    );
  }

  // Render ended call screen
  if (callStatus === 'ended') {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Call Ended</h2>
          <p className="text-muted-foreground">Duration: {formatTime(callDuration)}</p>
        </div>
        
        <Button onClick={() => window.history.back()}>
          Return to App
        </Button>
      </div>
    );
  }

  // Render ongoing call interface
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Main video area */}
      <div className="flex-1 relative">
        {isVideoOn ? (
          <video 
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted={isMuted}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Avatar className="h-40 w-40">
              <AvatarImage src={caller.avatar} alt={caller.name} />
              <AvatarFallback>{caller.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        )}
        
        {/* Call info overlay */}
        <div className="absolute top-4 left-0 right-0 flex justify-center text-white">
          <div className="bg-black/50 px-4 py-2 rounded-full text-sm flex items-center gap-2">
            <span>{formatTime(callDuration)}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          </div>
        </div>
        
        {/* Self view */}
        <div className="absolute bottom-24 right-4 w-32 h-48 rounded-lg overflow-hidden border border-border shadow-lg">
          <video 
            ref={localVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
          
          {!isVideoOn && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <Avatar>
                <AvatarImage src={user?.user_metadata?.avatar || ''} alt={user?.user_metadata?.full_name || 'Me'} />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>
      
      {/* Call controls */}
      <div className="bg-background h-20 flex items-center justify-between px-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-12 w-12 rounded-full"
          onClick={toggleSpeaker}
        >
          <MonitorSpeaker className={`h-6 w-6 ${isSpeakerOn ? 'text-primary' : 'text-muted-foreground'}`} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-12 w-12 rounded-full"
          onClick={toggleVideo}
        >
          {isVideoOn ? (
            <Video className="h-6 w-6 text-primary" />
          ) : (
            <VideoOff className="h-6 w-6 text-muted-foreground" />
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-12 w-12 rounded-full"
          onClick={toggleMute}
        >
          {isMuted ? (
            <MicOff className="h-6 w-6 text-muted-foreground" />
          ) : (
            <Mic className="h-6 w-6 text-primary" />
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-12 w-12 rounded-full"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full">
                <Users className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground h-5 w-5 rounded-full text-xs flex items-center justify-center">
                  {participants}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                Add Participant
              </DropdownMenuItem>
              <DropdownMenuItem>
                Show Participants
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-12 w-12 rounded-full"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                Share Screen
              </DropdownMenuItem>
              <DropdownMenuItem>
                Record Call
              </DropdownMenuItem>
              <DropdownMenuItem>
                Report Issue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Button>
        
        <Button 
          size="icon" 
          className="h-12 w-12 rounded-full bg-destructive hover:bg-destructive/90"
          onClick={handleEndCall}
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default CallInterface;
