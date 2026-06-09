"use client";

import { useState } from "react";
import { Settings, Users, Shield, Database, Bell, ToggleLeft, Save, X } from "lucide-react";

type AdminTab = "general" | "users" | "permissions" | "system";

interface AdminSettings {
  appName: string;
  siteUrl: string;
  supportEmail: string;
  maintenanceMode: boolean;
  autoBackup: boolean;
  maxSessions: number;
  sessionTimeout: number;
}

interface User {
  id: string;
  email: string;
  role: "admin" | "moderator" | "user";
  status: "active" | "suspended";
  joinedDate: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("general");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  // General Settings State
  const [settings, setSettings] = useState<AdminSettings>({
    appName: "LlamaTutor",
    siteUrl: "https://llamatutor.example.com",
    supportEmail: "support@llamatutor.com",
    maintenanceMode: false,
    autoBackup: true,
    maxSessions: 100,
    sessionTimeout: 3600,
  });

  // Users State
  const [users, setUsers] = useState<User[]>([
    { id: "1", email: "admin@example.com", role: "admin", status: "active", joinedDate: "2024-01-15" },
    { id: "2", email: "moderator@example.com", role: "moderator", status: "active", joinedDate: "2024-02-20" },
    { id: "3", email: "user@example.com", role: "user", status: "active", joinedDate: "2024-03-10" },
  ]);

  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "moderator" | "user">("user");

  // Permissions State
  const [permissions, setPermissions] = useState({
    usersCanEditProfile: true,
    usersCanExport: false,
    moderatorsCanBanUsers: true,
    moderatorsCanEditContent: true,
    publicRegistration: true,
    requireEmailVerification: true,
  });

  // System State
  const [systemSettings, setSystemSettings] = useState({
    apiRateLimit: 1000,
    maxUploadSize: 100,
    cacheTTL: 3600,
    logRetention: 30,
    enableNotifications: true,
    enableAnalytics: true,
  });

  const handleSettingChange = (key: keyof AdminSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePermissionChange = (key: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSystemChange = (key: keyof typeof systemSettings, value: any) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleAddUser = () => {
    if (!newUserEmail.trim()) return;
    
    const newUser: User = {
      id: String(users.length + 1),
      email: newUserEmail,
      role: newUserRole,
      status: "active",
      joinedDate: new Date().toISOString().split('T')[0],
    };
    
    setUsers([...users, newUser]);
    setNewUserEmail("");
    setNewUserRole("user");
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleChangeUserRole = (userId: string, newRole: "admin" | "moderator" | "user") => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would send these settings to your backend
      console.log("[v0] Saving settings:", {
        settings: activeTab === "general" ? settings : null,
        permissions: activeTab === "permissions" ? permissions : null,
        systemSettings: activeTab === "system" ? systemSettings : null,
      });
      
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Manage settings, users, and system configuration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <button
                onClick={() => setActiveTab("general")}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                  activeTab === "general"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">General Settings</span>
              </button>

              <button
                onClick={() => setActiveTab("users")}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                  activeTab === "users"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Users className="h-5 w-5" />
                <span className="font-medium">User Management</span>
              </button>

              <button
                onClick={() => setActiveTab("permissions")}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                  activeTab === "permissions"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Shield className="h-5 w-5" />
                <span className="font-medium">Permissions</span>
              </button>

              <button
                onClick={() => setActiveTab("system")}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                  activeTab === "system"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Database className="h-5 w-5" />
                <span className="font-medium">System Settings</span>
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="p-6">
                  <h2 className="mb-6 text-xl font-bold text-gray-900">General Settings</h2>
                  
                  <div className="space-y-6">
                    {/* App Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Application Name
                      </label>
                      <input
                        type="text"
                        value={settings.appName}
                        onChange={(e) => handleSettingChange("appName", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    {/* Site URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site URL
                      </label>
                      <input
                        type="url"
                        value={settings.siteUrl}
                        onChange={(e) => handleSettingChange("siteUrl", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    {/* Support Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Support Email
                      </label>
                      <input
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) => handleSettingChange("supportEmail", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    {/* Maintenance Mode Toggle */}
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                      <div>
                        <p className="font-medium text-gray-900">Maintenance Mode</p>
                        <p className="text-sm text-gray-500">Take the site offline for maintenance</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange("maintenanceMode", !settings.maintenanceMode)}
                        className={`relative inline-flex h-8 w-14 rounded-full transition-colors ${
                          settings.maintenanceMode ? "bg-red-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-7 w-7 transform rounded-full bg-white transition-transform ${
                            settings.maintenanceMode ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Auto Backup Toggle */}
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                      <div>
                        <p className="font-medium text-gray-900">Automatic Backups</p>
                        <p className="text-sm text-gray-500">Automatically backup data daily</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange("autoBackup", !settings.autoBackup)}
                        className={`relative inline-flex h-8 w-14 rounded-full transition-colors ${
                          settings.autoBackup ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-7 w-7 transform rounded-full bg-white transition-transform ${
                            settings.autoBackup ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Max Sessions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Concurrent Sessions
                      </label>
                      <input
                        type="number"
                        value={settings.maxSessions}
                        onChange={(e) => handleSettingChange("maxSessions", parseInt(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    {/* Session Timeout */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (seconds)
                      </label>
                      <input
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* User Management */}
              {activeTab === "users" && (
                <div className="p-6">
                  <h2 className="mb-6 text-xl font-bold text-gray-900">User Management</h2>

                  {/* Add New User */}
                  <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h3 className="mb-4 font-semibold text-gray-900">Add New User</h3>
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <input
                        type="email"
                        placeholder="user@example.com"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value as any)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={handleAddUser}
                        className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
                      >
                        Add User
                      </button>
                    </div>
                  </div>

                  {/* Users List */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-gray-200 bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">Email</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">Role</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">Joined</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-900">{user.email}</td>
                            <td className="px-4 py-3">
                              <select
                                value={user.role}
                                onChange={(e) => handleChangeUserRole(user.id, e.target.value as any)}
                                className="rounded-lg border border-gray-300 px-3 py-1 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              >
                                <option value="user">User</option>
                                <option value="moderator">Moderator</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                {user.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-500">{user.joinedDate}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleRemoveUser(user.id)}
                                className="text-red-600 hover:text-red-700 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Permissions */}
              {activeTab === "permissions" && (
                <div className="p-6">
                  <h2 className="mb-6 text-xl font-bold text-gray-900">Permissions & Moderation</h2>

                  <div className="space-y-4">
                    {[
                      { key: "usersCanEditProfile", label: "Users Can Edit Profile", description: "Allow users to modify their profile information" },
                      { key: "usersCanExport", label: "Users Can Export Data", description: "Allow users to export their data" },
                      { key: "moderatorsCanBanUsers", label: "Moderators Can Ban Users", description: "Allow moderators to ban users from the platform" },
                      { key: "moderatorsCanEditContent", label: "Moderators Can Edit Content", description: "Allow moderators to edit user-generated content" },
                      { key: "publicRegistration", label: "Public Registration", description: "Allow new users to register without invitation" },
                      { key: "requireEmailVerification", label: "Require Email Verification", description: "Require email confirmation before account activation" },
                    ].map(({ key, label, description }) => (
                      <div key={key} className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">{label}</p>
                          <p className="text-sm text-gray-500">{description}</p>
                        </div>
                        <button
                          onClick={() => handlePermissionChange(key as any)}
                          className={`relative inline-flex h-8 w-14 rounded-full transition-colors ${
                            permissions[key as keyof typeof permissions] ? "bg-blue-600" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-7 w-7 transform rounded-full bg-white transition-transform ${
                              permissions[key as keyof typeof permissions] ? "translate-x-6" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* System Settings */}
              {activeTab === "system" && (
                <div className="p-6">
                  <h2 className="mb-6 text-xl font-bold text-gray-900">System Settings</h2>

                  <div className="space-y-6">
                    {/* API Rate Limit */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Rate Limit (requests/hour)
                      </label>
                      <input
                        type="number"
                        value={systemSettings.apiRateLimit}
                        onChange={(e) => handleSystemChange("apiRateLimit", parseInt(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    {/* Max Upload Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Upload Size (MB)
                      </label>
                      <input
                        type="number"
                        value={systemSettings.maxUploadSize}
                        onChange={(e) => handleSystemChange("maxUploadSize", parseInt(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    {/* Cache TTL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cache TTL (seconds)
                      </label>
                      <input
                        type="number"
                        value={systemSettings.cacheTTL}
                        onChange={(e) => handleSystemChange("cacheTTL", parseInt(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    {/* Log Retention */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Log Retention (days)
                      </label>
                      <input
                        type="number"
                        value={systemSettings.logRetention}
                        onChange={(e) => handleSystemChange("logRetention", parseInt(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    {/* Enable Notifications */}
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                      <div>
                        <p className="font-medium text-gray-900">Enable Notifications</p>
                        <p className="text-sm text-gray-500">Send system notifications to users</p>
                      </div>
                      <button
                        onClick={() => handleSystemChange("enableNotifications", !systemSettings.enableNotifications)}
                        className={`relative inline-flex h-8 w-14 rounded-full transition-colors ${
                          systemSettings.enableNotifications ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-7 w-7 transform rounded-full bg-white transition-transform ${
                            systemSettings.enableNotifications ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Enable Analytics */}
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                      <div>
                        <p className="font-medium text-gray-900">Enable Analytics</p>
                        <p className="text-sm text-gray-500">Track user behavior and system metrics</p>
                      </div>
                      <button
                        onClick={() => handleSystemChange("enableAnalytics", !systemSettings.enableAnalytics)}
                        className={`relative inline-flex h-8 w-14 rounded-full transition-colors ${
                          systemSettings.enableAnalytics ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-7 w-7 transform rounded-full bg-white transition-transform ${
                            systemSettings.enableAnalytics ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save/Cancel Buttons */}
              <div className="flex gap-4 border-t border-gray-200 px-6 py-4">
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>

                {saveStatus === "success" && (
                  <div className="flex items-center gap-2 text-green-600">
                    <span className="text-sm font-medium">✓ Settings saved successfully</span>
                  </div>
                )}

                {saveStatus === "error" && (
                  <div className="flex items-center gap-2 text-red-600">
                    <span className="text-sm font-medium">✗ Error saving settings</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
