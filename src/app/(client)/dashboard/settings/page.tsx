"use client";

import React, { useState, useEffect } from "react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Building, 
  Bell, 
  Shield, 
  CreditCard, 
  Download,
  Trash2,
  Save,
  Settings as SettingsIcon,
  Key,
  Palette
} from "lucide-react";
import { toast } from "sonner";

interface SettingsState {
  notifications: {
    email: boolean;
    browser: boolean;
    responses: boolean;
    insights: boolean;
  };
  privacy: {
    anonymousResponses: boolean;
    dataRetention: number;
    exportData: boolean;
  };
  organization: {
    name: string;
    plan: string;
    memberCount: number;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    compactMode: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
  };
}

export default function Settings() {
  const { organization } = useOrganization();
  const { user: currentUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      email: true,
      browser: true,
      responses: true,
      insights: true
    },
    privacy: {
      anonymousResponses: false,
      dataRetention: 30,
      exportData: true
    },
    organization: {
      name: "",
      plan: "",
      memberCount: 0
    },
    appearance: {
      theme: 'light',
      compactMode: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30
    }
  });

  useEffect(() => {
    if (organization) {
      setSettings(prev => ({
        ...prev,
        organization: {
          name: organization.name || "",
          plan: "Free",
          memberCount: organization.membersCount || 0
        }
      }));
    }
  }, [organization]);

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const handleAppearanceChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: value
      }
    }));
  };

  const handleSecurityChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully!", {
        position: "bottom-right",
        duration: 3000,
      });
    } catch (error) {
      toast.error("Failed to save settings", {
        position: "bottom-right",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Data export started! You'll receive an email when ready.", {
        position: "bottom-right",
        duration: 5000,
      });
    } catch (error) {
      toast.error("Failed to export data", {
        position: "bottom-right",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success("Account deletion request submitted", {
          position: "bottom-right",
          duration: 5000,
        });
      } catch (error) {
        toast.error("Failed to delete account", {
          position: "bottom-right",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <CardTitle className="text-lg text-gray-900 dark:text-white">Profile Settings</CardTitle>
            </div>
            
            <div className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</Label>
                <Input 
                  id="name" 
                  value={currentUser?.fullName || ""} 
                  disabled 
                  className="mt-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
                <Input 
                  id="email" 
                  value={currentUser?.primaryEmailAddress?.emailAddress || ""} 
                  disabled 
                  className="mt-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization Settings */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Building className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <CardTitle className="text-lg text-gray-900 dark:text-white">Organization</CardTitle>
            </div>
            
            <div className="space-y-5">
              <div>
                <Label htmlFor="orgName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Organization Name</Label>
                <Input 
                  id="orgName" 
                  value={settings.organization.name} 
                  disabled 
                  className="mt-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Plan</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{settings.organization.plan}</p>
                </div>
                <Button variant="outline" size="sm" className="border-indigo-200 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Upgrade
                </Button>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Team Members</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{settings.organization.memberCount} members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <CardTitle className="text-lg text-gray-900 dark:text-white">Notifications</CardTitle>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates via email</p>
                </div>
                <Switch 
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Browser Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Show notifications in browser</p>
                </div>
                <Switch 
                  checked={settings.notifications.browser}
                  onCheckedChange={(checked) => handleNotificationChange('browser', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Response Alerts</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Notify when new responses arrive</p>
                </div>
                <Switch 
                  checked={settings.notifications.responses}
                  onCheckedChange={(checked) => handleNotificationChange('responses', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Insight Reports</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Weekly analytics reports</p>
                </div>
                <Switch 
                  checked={settings.notifications.insights}
                  onCheckedChange={(checked) => handleNotificationChange('insights', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <CardTitle className="text-lg text-gray-900 dark:text-white">Privacy & Data</CardTitle>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Anonymous Responses</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Hide respondent names</p>
                </div>
                <Switch 
                  checked={settings.privacy.anonymousResponses}
                  onCheckedChange={(checked) => handlePrivacyChange('anonymousResponses', checked)}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Retention (days)</Label>
                <Input 
                  type="number" 
                  value={settings.privacy.dataRetention}
                  onChange={(e) => handlePrivacyChange('dataRetention', parseInt(e.target.value))}
                  className="mt-2 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                  min="1"
                  max="365"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Allow Data Export</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Enable data export functionality</p>
                </div>
                <Switch 
                  checked={settings.privacy.exportData}
                  onCheckedChange={(checked) => handlePrivacyChange('exportData', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <CardTitle className="text-lg text-gray-900 dark:text-white">Appearance</CardTitle>
            </div>
            
            <div className="space-y-5">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</Label>
                <select 
                  value={settings.appearance.theme}
                  onChange={(e) => handleAppearanceChange('theme', e.target.value)}
                  className="mt-2 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Compact Mode</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reduce spacing for more content</p>
                </div>
                <Switch 
                  checked={settings.appearance.compactMode}
                  onCheckedChange={(checked) => handleAppearanceChange('compactMode', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Key className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <CardTitle className="text-lg text-gray-900 dark:text-white">Security</CardTitle>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</p>
                </div>
                <Switch 
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Session Timeout (minutes)</Label>
                <Input 
                  type="number" 
                  value={settings.security.sessionTimeout}
                  onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                  className="mt-2 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                  min="5"
                  max="480"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8 border-gray-200 dark:border-gray-700" />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={handleSaveSettings} 
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleExportData}
          disabled={loading}
          className="border-indigo-200 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
        
        <Button 
          variant="destructive" 
          onClick={handleDeleteAccount}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Account
        </Button>
      </div>
    </div>
  );
} 
