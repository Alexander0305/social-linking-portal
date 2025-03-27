
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import * as db from '@/services/database';

type PrivacyLevel = 'public' | 'friends' | 'private';

interface PrivacySettings {
  whoCanSeeProfile: PrivacyLevel;
  whoCanSendMessages: PrivacyLevel;
  whoCanSeeOnlineStatus: PrivacyLevel;
  whoCanSendFriendRequests: PrivacyLevel;
  whoCanSeeEmail: PrivacyLevel;
  whoCanSeePhone: PrivacyLevel;
  enableEmailNotifications: boolean;
  enablePushNotifications: boolean;
  showLastSeen: boolean;
  showReadReceipts: boolean;
}

const defaultSettings: PrivacySettings = {
  whoCanSeeProfile: 'public',
  whoCanSendMessages: 'public',
  whoCanSeeOnlineStatus: 'public',
  whoCanSendFriendRequests: 'public',
  whoCanSeeEmail: 'friends',
  whoCanSeePhone: 'friends',
  enableEmailNotifications: true,
  enablePushNotifications: true,
  showLastSeen: true,
  showReadReceipts: true,
};

const PrivacySettings: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings>(defaultSettings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadPrivacySettings();
    }
  }, [user]);

  const loadPrivacySettings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // In a real app, you would load these from your database
      const { data, error } = await db.getUserProfile(user.id);
      
      if (error) throw error;
      
      if (data && data.privacy_settings) {
        setSettings(JSON.parse(data.privacy_settings) as PrivacySettings);
      }
    } catch (error) {
      console.error("Failed to load privacy settings:", error);
      toast({
        title: "Failed to load settings",
        description: "We couldn't load your privacy settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePrivacySettings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await db.updateUserProfile(user.id, {
        privacy_settings: JSON.stringify(settings)
      });
      
      if (error) throw error;
      
      toast({
        title: "Settings saved",
        description: "Your privacy settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to save privacy settings:", error);
      toast({
        title: "Failed to save settings",
        description: "We couldn't save your privacy settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchChange = (key: keyof PrivacySettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof PrivacySettings]
    }));
  };

  const handleSelectChange = (value: PrivacyLevel, key: keyof PrivacySettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Privacy</CardTitle>
          <CardDescription>
            Control who can see your profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="profile-visibility">Who can see my profile</Label>
            <Select
              disabled={loading}
              value={settings.whoCanSeeProfile}
              onValueChange={(value) => 
                handleSelectChange(value as PrivacyLevel, 'whoCanSeeProfile')
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Everyone</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="private">Only Me</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between items-center">
            <Label htmlFor="email-visibility">Who can see my email</Label>
            <Select
              disabled={loading}
              value={settings.whoCanSeeEmail}
              onValueChange={(value) => 
                handleSelectChange(value as PrivacyLevel, 'whoCanSeeEmail')
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Everyone</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="private">Only Me</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between items-center">
            <Label htmlFor="phone-visibility">Who can see my phone number</Label>
            <Select
              disabled={loading}
              value={settings.whoCanSeePhone}
              onValueChange={(value) => 
                handleSelectChange(value as PrivacyLevel, 'whoCanSeePhone')
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Everyone</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="private">Only Me</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Communication</CardTitle>
          <CardDescription>
            Control who can contact you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="message-permissions">Who can send me messages</Label>
            <Select
              disabled={loading}
              value={settings.whoCanSendMessages}
              onValueChange={(value) => 
                handleSelectChange(value as PrivacyLevel, 'whoCanSendMessages')
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Everyone</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="private">Nobody</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between items-center">
            <Label htmlFor="friend-request-permissions">Who can send me friend requests</Label>
            <Select
              disabled={loading}
              value={settings.whoCanSendFriendRequests}
              onValueChange={(value) => 
                handleSelectChange(value as PrivacyLevel, 'whoCanSendFriendRequests')
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Everyone</SelectItem>
                <SelectItem value="friends">Friends of Friends</SelectItem>
                <SelectItem value="private">Nobody</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Status & Activity</CardTitle>
          <CardDescription>
            Control your online status and activity indicators
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="online-status-visibility">Who can see when I'm online</Label>
            <Select
              disabled={loading}
              value={settings.whoCanSeeOnlineStatus}
              onValueChange={(value) => 
                handleSelectChange(value as PrivacyLevel, 'whoCanSeeOnlineStatus')
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Everyone</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="private">Nobody</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <Label htmlFor="last-seen">Show my last seen time</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to see when you last used the app
              </p>
            </div>
            <Switch
              id="last-seen"
              checked={settings.showLastSeen}
              onCheckedChange={() => handleSwitchChange('showLastSeen')}
              disabled={loading}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <Label htmlFor="read-receipts">Show read receipts</Label>
              <p className="text-sm text-muted-foreground">
                Let people know when you've read their messages
              </p>
            </div>
            <Switch
              id="read-receipts"
              checked={settings.showReadReceipts}
              onCheckedChange={() => handleSwitchChange('showReadReceipts')}
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Control how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <Label htmlFor="email-notifications">Email notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive important updates via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.enableEmailNotifications}
              onCheckedChange={() => handleSwitchChange('enableEmailNotifications')}
              disabled={loading}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <Label htmlFor="push-notifications">Push notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications on your device
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.enablePushNotifications}
              onCheckedChange={() => handleSwitchChange('enablePushNotifications')}
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>
      
      <Button 
        onClick={savePrivacySettings} 
        disabled={loading}
        className="w-full"
      >
        {loading ? "Saving..." : "Save Privacy Settings"}
      </Button>
    </div>
  );
};

export default PrivacySettings;
