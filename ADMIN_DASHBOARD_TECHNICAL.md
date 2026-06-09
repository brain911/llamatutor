# Admin Dashboard - Technical Implementation Guide

## File Structure

```
app/
├── admin/
│   └── page.tsx           # Admin dashboard page route
components/
├── AdminDashboard.tsx     # Main admin dashboard component
```

## Components

### AdminDashboard.tsx

The main dashboard component containing all admin functionality.

**Key Features:**
- Tab-based navigation (general, users, permissions, system)
- State management for all settings
- Real-time form validation
- Save/cancel functionality with success feedback

**State Management:**

```typescript
// General Settings
const [settings, setSettings] = useState<AdminSettings>({
  appName: string;
  siteUrl: string;
  supportEmail: string;
  maintenanceMode: boolean;
  autoBackup: boolean;
  maxSessions: number;
  sessionTimeout: number;
});

// Users
const [users, setUsers] = useState<User[]>([
  { id, email, role, status, joinedDate }
]);

// Permissions
const [permissions, setPermissions] = useState({
  usersCanEditProfile: boolean;
  usersCanExport: boolean;
  moderatorsCanBanUsers: boolean;
  moderatorsCanEditContent: boolean;
  publicRegistration: boolean;
  requireEmailVerification: boolean;
});

// System Settings
const [systemSettings, setSystemSettings] = useState({
  apiRateLimit: number;
  maxUploadSize: number;
  cacheTTL: number;
  logRetention: number;
  enableNotifications: boolean;
  enableAnalytics: boolean;
});
```

## Core Functions

### handleSettingChange(key, value)
Updates a general setting in real-time.

```typescript
const handleSettingChange = (key: keyof AdminSettings, value: any) => {
  setSettings(prev => ({ ...prev, [key]: value }));
};
```

### handlePermissionChange(key)
Toggles a boolean permission setting.

```typescript
const handlePermissionChange = (key: keyof typeof permissions) => {
  setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
};
```

### handleAddUser()
Adds a new user to the users array.

```typescript
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
```

### handleSaveSettings()
Persists all changes. Currently simulates API call with 1.5s delay.

```typescript
const handleSaveSettings = async () => {
  setIsSaving(true);
  setSaveStatus("idle");
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // TODO: Send to your backend API
    console.log("[v0] Saving settings:", {
      settings: activeTab === "general" ? settings : null,
      permissions: activeTab === "permissions" ? permissions : null,
      systemSettings: activeTab === "system" ? systemSettings : null,
    });
    
    setSaveStatus("success");
    setTimeout(() => setSaveStatus("idle"), 3000);
  } catch (error) {
    setSaveStatus("error");
  } finally {
    setIsSaving(false);
  }
};
```

## Backend Integration

### Recommended API Endpoint

Create a POST endpoint at `/api/admin/settings`:

```typescript
// app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate admin authentication
    // const session = await auth();
    // if (session?.user?.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    // Validate inputs
    if (!body.settings && !body.permissions && !body.systemSettings) {
      return NextResponse.json(
        { error: 'No settings provided' },
        { status: 400 }
      );
    }
    
    // Save to database
    // await db.adminSettings.update(body);
    
    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully'
    });
  } catch (error) {
    console.error('Admin settings error:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
```

### Updating Frontend to Call Backend

Modify the `handleSaveSettings()` function:

```typescript
const handleSaveSettings = async () => {
  setIsSaving(true);
  setSaveStatus("idle");
  
  try {
    const response = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        settings: activeTab === "general" ? settings : null,
        users: activeTab === "users" ? users : null,
        permissions: activeTab === "permissions" ? permissions : null,
        systemSettings: activeTab === "system" ? systemSettings : null,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save settings');
    }
    
    setSaveStatus("success");
    setTimeout(() => setSaveStatus("idle"), 3000);
  } catch (error) {
    console.error('Save error:', error);
    setSaveStatus("error");
    setTimeout(() => setSaveStatus("idle"), 3000);
  } finally {
    setIsSaving(false);
  }
};
```

## Adding Authentication

Protect the admin route with middleware:

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check if user is authenticated and has admin role
    const userRole = request.headers.get('x-user-role');
    
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

## Styling

The component uses Tailwind CSS classes. Key design elements:

- **Colors:** Blue (#3B82F6) for primary actions, gray for secondary
- **Layout:** Responsive grid (1 col mobile, 4 col desktop)
- **Icons:** Lucide React icons (`lucide-react`)
- **Spacing:** Consistent Tailwind scale (p-4, py-3, etc.)
- **States:** Hover, focus, disabled states with smooth transitions

## Dependencies

- React 18+ (for hooks)
- Next.js 16+ (for app router)
- Tailwind CSS 3+ (for styling)
- lucide-react (for icons)

## Testing

### Test Cases

1. **Tab Navigation**
   - Click each tab and verify content changes
   - Verify active tab is highlighted

2. **General Settings**
   - Update text fields and verify state changes
   - Toggle maintenance mode and backup switches
   - Enter numeric values and verify validation

3. **User Management**
   - Add new user with email and role
   - Verify user appears in table
   - Change user role via dropdown
   - Remove user and verify removal

4. **Permissions**
   - Toggle each permission switch
   - Verify toggles turn on/off correctly

5. **System Settings**
   - Update numeric values
   - Toggle notification and analytics switches

6. **Save Functionality**
   - Click Save Changes
   - Verify loading state
   - Verify success message appears
   - Check console logs for data

## Performance Considerations

- Component uses React hooks with proper dependency arrays
- State updates are batched where possible
- Form inputs use uncontrolled where possible
- Consider pagination for large user lists (future enhancement)

## Security Checklist

- [ ] Add authentication guard to `/admin` route
- [ ] Validate all inputs on backend
- [ ] Use HTTPS for API communication
- [ ] Implement proper error messages (don't expose sensitive info)
- [ ] Log all admin actions for audit trail
- [ ] Rate limit admin API endpoints
- [ ] Implement CSRF protection
- [ ] Add role-based access control (RBAC)

## Future Enhancement Ideas

1. **Bulk Operations**
   - Bulk import users via CSV
   - Bulk export users
   - Batch permission changes

2. **Advanced Filtering**
   - Search users by email/role/status
   - Filter settings by category
   - Activity log filtering

3. **Monitoring**
   - System health dashboard
   - API usage statistics
   - Active sessions view

4. **Automation**
   - Scheduled backups UI
   - Email notification configuration
   - Role templates

5. **Audit Trail**
   - Log all admin changes
   - Revert capability
   - Change history view
