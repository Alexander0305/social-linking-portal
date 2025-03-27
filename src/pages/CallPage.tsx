
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import CallInterface from '@/components/calling/CallInterface';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import * as db from '@/services/database';

const CallPage: React.FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isIncoming = searchParams.get('incoming') === 'true';
  const mode = searchParams.get('mode') || 'video'; // video or audio
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [callerInfo, setCallerInfo] = useState<{
    id: string;
    name: string;
    avatar?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error("Missing user ID");
        }
        
        // Get the user info for the caller/callee
        const { data, error } = await db.getUserProfile(id);
        
        if (error) throw error;
        if (!data) throw new Error("User not found");
        
        setCallerInfo({
          id: data.id,
          name: data.full_name || data.username,
          avatar: data.avatar,
        });
      } catch (err: any) {
        console.error('Failed to fetch user info:', err);
        setError(err.message || "Could not initiate call");
        toast({
          title: "Call Error",
          description: err.message || "Could not initiate call",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [id, user, navigate]);

  const handleAcceptCall = () => {
    // In a real app, this would connect to the WebRTC or other calling infrastructure
    console.log("Call accepted");
    toast({
      title: "Call Connected",
      description: "You are now connected to the call",
    });
  };

  const handleDeclineCall = () => {
    console.log("Call declined");
    toast({
      description: "Call declined",
    });
    navigate(-1);
  };

  const handleEndCall = () => {
    console.log("Call ended");
    toast({
      description: "Call ended",
    });
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Connecting call...</p>
        </div>
      </div>
    );
  }

  if (error || !callerInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Call Error</h2>
          <p className="mb-4">{error || "Could not connect the call"}</p>
          <button 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <CallInterface 
      caller={callerInfo}
      isIncoming={isIncoming}
      onAccept={handleAcceptCall}
      onDecline={handleDeclineCall}
      onEnd={handleEndCall}
    />
  );
};

export default CallPage;
