
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/services/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

const SettingsPage = () => {
  const { user, updateProfile, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Account settings
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [coverPhoto, setCoverPhoto] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  
  // Privacy settings
  const [profilePrivacy, setProfilePrivacy] = useState('public');
  const [messagePrivacy, setMessagePrivacy] = useState('everyone');
  const [postPrivacy, setPostPrivacy] = useState('public');
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showLastSeen, setShowLastSeen] = useState(true);
  const [allowTagging, setAllowTagging] = useState(true);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [likesNotify, setLikesNotify] = useState(true);
  const [commentsNotify, setCommentsNotify] = useState(true);
  const [friendRequestsNotify, setFriendRequestsNotify] = useState(true);
  const [messagesNotify, setMessagesNotify] = useState(true);
  const [tagsNotify, setTagsNotify] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data } = await getUserProfile(user.id);
        setProfile(data);
        
        // Initialize form with user data
        setUsername(user.user_metadata.username || '');
        setFullName(user.user_metadata.full_name || '');
        setEmail(user.email || '');
        setAvatar(user.user_metadata.avatar || '');
        
        // Initialize with profile data if available
        if (data) {
          setBio(data.bio || '');
          setCoverPhoto(data.cover_photo || '');
          setLocation(data.location || '');
          setWebsite(data.website || '');
          setProfilePrivacy(data.profile_privacy || 'public');
          setMessagePrivacy(data.message_privacy || 'everyone');
          setPostPrivacy(data.post_privacy || 'public');
          setShowOnlineStatus(data.show_online_status !== false);
          setShowLastSeen(data.show_last_seen !== false);
          setAllowTagging(data.allow_tagging !== false);
          setEmailNotifications(data.email_notifications !== false);
          setPushNotifications(data.push_notifications !== false);
          setLikesNotify(data.notification_settings?.likes !== false);
          setCommentsNotify(data.notification_settings?.comments !== false);
          setFriendRequestsNotify(data.notification_settings?.friend_requests !== false);
          setMessagesNotify(data.notification_settings?.messages !== false);
          setTagsNotify(data.notification_settings?.tags !== false);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: "Error loading profile",
          description: "Could not load your profile information.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [user, toast]);

  const handleSaveAccount = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const updates = {
        username,
        full_name: fullName,
        avatar,
        bio,
        cover_photo: coverPhoto,
        location,
        website,
      };
      
      const { error } = await updateProfile(updates);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const updates = {
        profile_privacy: profilePrivacy,
        message_privacy: messagePrivacy,
        post_privacy: postPrivacy,
        show_online_status: showOnlineStatus,
        show_last_seen: showLastSeen,
        allow_tagging: allowTagging,
      };
      
      const { error } = await updateProfile(updates);
      
      if (error) throw error;
      
      toast({
        title: "Privacy settings updated",
        description: "Your privacy settings have been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating privacy settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const updates = {
        email_notifications: emailNotifications,
        push_notifications: pushNotifications,
        notification_settings: {
          likes: likesNotify,
          comments: commentsNotify,
          friend_requests: friendRequestsNotify,
          messages: messagesNotify,
          tags: tagsNotify,
        },
      };
      
      const { error } = await updateProfile(updates);
      
      if (error) throw error;
      
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating notification settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="account" className="mb-6">
        <TabsList className="mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and how others see you on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={email} 
                      disabled={true} 
                      readOnly
                    />
                    <p className="text-xs text-muted-foreground">
                      Your email cannot be changed directly. Please contact support if you need to update it.
                    </p>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="avatar">Profile Picture URL</Label>
                    <Input 
                      id="avatar" 
                      value={avatar} 
                      onChange={(e) => setAvatar(e.target.value)} 
                      disabled={loading}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="coverPhoto">Cover Photo URL</Label>
                    <Input 
                      id="coverPhoto" 
                      value={coverPhoto} 
                      onChange={(e) => setCoverPhoto(e.target.value)} 
                      disabled={loading}
                      placeholder="https://example.com/cover.jpg"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)} 
                      disabled={loading}
                      placeholder="Tell us a bit about yourself"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    disabled={loading}
                    placeholder="City, Country"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    value={website} 
                    onChange={(e) => setWebsite(e.target.value)} 
                    disabled={loading}
                    placeholder="https://your-website.com"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  // Reset form to original values
                  setUsername(user?.user_metadata.username || '');
                  setFullName(user?.user_metadata.full_name || '');
                  setAvatar(user?.user_metadata.avatar || '');
                  setBio(profile?.bio || '');
                  setCoverPhoto(profile?.cover_photo || '');
                  setLocation(profile?.location || '');
                  setWebsite(profile?.website || '');
                }}
                disabled={loading || saving}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveAccount}
                disabled={loading || saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>
                Sign out or manage your account data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Sign Out</h4>
                  <p className="text-sm text-muted-foreground">Sign out from your account on this device.</p>
                </div>
                <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Download Your Data</h4>
                  <p className="text-sm text-muted-foreground">Get a copy of all your personal data.</p>
                </div>
                <Button variant="outline">Download</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-destructive">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all your data.</p>
                </div>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Privacy</CardTitle>
              <CardDescription>
                Control who can see your profile and content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Who can see my profile</h4>
                  <div className="flex items-center space-x-2">
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={profilePrivacy}
                      onChange={(e) => setProfilePrivacy(e.target.value)}
                      disabled={loading}
                    >
                      <option value="public">Everyone</option>
                      <option value="friends">Friends only</option>
                      <option value="private">Only me</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Who can message me</h4>
                  <div className="flex items-center space-x-2">
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={messagePrivacy}
                      onChange={(e) => setMessagePrivacy(e.target.value)}
                      disabled={loading}
                    >
                      <option value="everyone">Everyone</option>
                      <option value="friends">Friends only</option>
                      <option value="none">No one</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Default post privacy</h4>
                  <div className="flex items-center space-x-2">
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={postPrivacy}
                      onChange={(e) => setPostPrivacy(e.target.value)}
                      disabled={loading}
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends only</option>
                      <option value="private">Only me</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Visibility Settings</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-online">Show when I'm online</Label>
                    <p className="text-sm text-muted-foreground">
                      Let others see when you're currently active on the platform.
                    </p>
                  </div>
                  <Switch 
                    id="show-online" 
                    checked={showOnlineStatus}
                    onCheckedChange={setShowOnlineStatus}
                    disabled={loading}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-lastseen">Show last seen</Label>
                    <p className="text-sm text-muted-foreground">
                      Let others know when you were last active.
                    </p>
                  </div>
                  <Switch 
                    id="show-lastseen" 
                    checked={showLastSeen}
                    onCheckedChange={setShowLastSeen}
                    disabled={loading}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allow-tags">Allow tagging</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow others to tag you in their posts and photos.
                    </p>
                  </div>
                  <Switch 
                    id="allow-tags" 
                    checked={allowTagging}
                    onCheckedChange={setAllowTagging}
                    disabled={loading}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="ml-auto" 
                onClick={handleSavePrivacy}
                disabled={loading || saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Notification Methods</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email.
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    disabled={loading}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in your browser or mobile device.
                    </p>
                  </div>
                  <Switch 
                    id="push-notifications" 
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="likes-notify">Likes</Label>
                    <p className="text-sm text-muted-foreground">
                      When someone likes your content.
                    </p>
                  </div>
                  <Switch 
                    id="likes-notify" 
                    checked={likesNotify}
                    onCheckedChange={setLikesNotify}
                    disabled={loading}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="comments-notify">Comments</Label>
                    <p className="text-sm text-muted-foreground">
                      When someone comments on your content.
                    </p>
                  </div>
                  <Switch 
                    id="comments-notify" 
                    checked={commentsNotify}
                    onCheckedChange={setCommentsNotify}
                    disabled={loading}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="friend-requests-notify">Friend Requests</Label>
                    <p className="text-sm text-muted-foreground">
                      When someone sends you a friend request.
                    </p>
                  </div>
                  <Switch 
                    id="friend-requests-notify" 
                    checked={friendRequestsNotify}
                    onCheckedChange={setFriendRequestsNotify}
                    disabled={loading}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="messages-notify">Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      When someone sends you a message.
                    </p>
                  </div>
                  <Switch 
                    id="messages-notify" 
                    checked={messagesNotify}
                    onCheckedChange={setMessagesNotify}
                    disabled={loading}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="tags-notify">Tags</Label>
                    <p className="text-sm text-muted-foreground">
                      When someone tags you in a post or photo.
                    </p>
                  </div>
                  <Switch 
                    id="tags-notify" 
                    checked={tagsNotify}
                    onCheckedChange={setTagsNotify}
                    disabled={loading}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="ml-auto" 
                onClick={handleSaveNotifications}
                disabled={loading || saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Change Password</h4>
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                
                <Button className="w-full sm:w-auto">Update Password</Button>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Two-Factor Authentication</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable 2FA</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account with two-factor authentication.
                    </p>
                  </div>
                  <Button variant="outline">Set Up 2FA</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Login Sessions</h4>
                
                <div className="rounded-md border">
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h5 className="font-medium">Current session</h5>
                      <p className="text-sm text-muted-foreground">
                        This device • {navigator.userAgent.includes('Windows') ? 'Windows' : navigator.userAgent.includes('Mac') ? 'Mac' : 'Unknown OS'}
                      </p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded dark:bg-green-900 dark:text-green-100">
                      Active
                    </span>
                  </div>
                </div>
                
                <Button variant="outline">Log out of all other devices</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
