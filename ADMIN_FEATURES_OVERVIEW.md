# Admin Dashboard - Features Overview

## Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  LlamaTutor Logo                                            │
├─────────────────────────────────────────────────────────────┤
│  ⚙️  Admin Dashboard                                         │
│  Manage settings, users, and system configuration            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  ┌──────────────────────────────────┐ │
│  │ ⚙️ General       │  │ General Settings                 │ │
│  │ Settings        │  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ │
│  │                 │  │ Application Name: [    ]        │ │
│  │ 👥 User         │  │ Site URL: [    ]                │ │
│  │ Management      │  │ Support Email: [    ]           │ │
│  │                 │  │ Maintenance Mode: [Toggle]      │ │
│  │ 🛡️ Permissions │  │ Automatic Backups: [Toggle]     │ │
│  │                 │  │ Max Sessions: [    ]            │ │
│  │ 🗄️ System      │  │ Session Timeout: [    ]         │ │
│  │ Settings        │  │                                 │ │
│  │                 │  │ [Save Changes]  [Success ✓]    │ │
│  └──────────────────┘  └──────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Feature Breakdown

### 📋 General Settings
| Feature | Type | Purpose |
|---------|------|---------|
| App Name | Text Input | Customizable application display name |
| Site URL | Text Input | Organization's primary domain |
| Support Email | Text Input | User support contact email |
| Maintenance Mode | Toggle | Take site offline for updates |
| Auto Backups | Toggle | Enable/disable daily backups |
| Max Sessions | Number Input | Limit concurrent user sessions |
| Session Timeout | Number Input | Inactivity logout time (seconds) |

### 👥 User Management
| Feature | Type | Purpose |
|---------|------|---------|
| Add User | Form | Email + Role selector to add new users |
| User Table | Display | Shows all registered users |
| Email Column | Info | User's registered email address |
| Role Column | Dropdown | Change user role (Admin/Moderator/User) |
| Status Column | Badge | Current account status (Active/Suspended) |
| Joined Column | Info | Account creation date |
| Actions | Button | Delete user (X button) |

### 🛡️ Permissions & Moderation
| Permission | Toggle | Effect |
|-----------|--------|--------|
| Users Can Edit Profile | On/Off | Users can modify profile info |
| Users Can Export Data | On/Off | Users can download their data |
| Moderators Can Ban Users | On/Off | Moderators can suspend accounts |
| Moderators Can Edit Content | On/Off | Moderators can modify user content |
| Public Registration | On/Off | Allow new signups without invitation |
| Require Email Verification | On/Off | Require email confirmation |

### 🗄️ System Settings
| Setting | Type | Default | Purpose |
|---------|------|---------|---------|
| API Rate Limit | Number | 1000 | Requests per hour limit |
| Max Upload Size | Number | 100 | Maximum file size in MB |
| Cache TTL | Number | 3600 | Cache lifetime in seconds |
| Log Retention | Number | 30 | Days to keep system logs |
| Enable Notifications | Toggle | On | System-wide notifications |
| Enable Analytics | Toggle | On | User tracking and metrics |

## User Roles

```
┌─ ADMIN ────────────────────────────────────────────────┐
│ • Full access to admin dashboard                       │
│ • Can manage all settings                             │
│ • Can add/edit/delete users                           │
│ • Can modify permissions                              │
│ • Can access system settings                          │
└────────────────────────────────────────────────────────┘

┌─ MODERATOR ────────────────────────────────────────────┐
│ • Can moderate content                                 │
│ • Can ban users (if permission enabled)               │
│ • Can edit user content (if permission enabled)       │
│ • Cannot access admin dashboard                       │
│ • Cannot change system settings                       │
└────────────────────────────────────────────────────────┘

┌─ USER ──────────────────────────────────────────────────┐
│ • Basic platform access                                │
│ • Can edit profile (if permission enabled)            │
│ • Can export data (if permission enabled)             │
│ • Cannot access admin features                        │
└────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Admin Dashboard                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  User Input → React State → [Save Changes Button]          │
│                              ↓                              │
│                        Validate Input                        │
│                              ↓                              │
│                    API Call to Backend                       │
│                              ↓                              │
│                    Database Update                          │
│                              ↓                              │
│                    Return Success/Error                     │
│                              ↓                              │
│                   Show Feedback Message                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Responsive Design

### Desktop (4-column grid)
```
┌─────────────┬──────────────────────────────────────┐
│  Nav Menu   │  Settings Content                    │
│  (1 col)    │  (3 cols)                           │
└─────────────┴──────────────────────────────────────┘
```

### Mobile (Stacked)
```
┌──────────────────────────────────────┐
│  Nav Menu                            │
├──────────────────────────────────────┤
│  Settings Content                    │
└──────────────────────────────────────┘
```

## Color Scheme

| Color | Use | Hex |
|-------|-----|-----|
| Blue | Primary buttons, active tabs | #3B82F6 |
| Gray | Backgrounds, borders, neutral | #F3F4F6 |
| Green | Success messages, active status | #10B981 |
| Red | Error messages, delete actions | #EF4444 |
| White | Card backgrounds | #FFFFFF |

## Navigation Flow

```
Start
  ↓
[/admin] → Load Dashboard
  ↓
Select Tab (General/Users/Permissions/System)
  ↓
View Current Settings
  ↓
Make Changes (inputs/toggles/dropdowns)
  ↓
Click [Save Changes]
  ↓
Show Loading State
  ↓
API Call
  ↓
Success ✓ / Error ✗ Message
  ↓
Changes Persisted (or discarded on error)
```

## Input Types Used

- **Text Input** - For strings (app name, URLs, emails)
- **Number Input** - For integers (limits, timeouts, sizes)
- **Dropdown/Select** - For role selection
- **Toggle Switch** - For boolean settings (on/off)
- **Table** - For displaying and managing users

## Save/Cancel Pattern

```
Before Save:
┌────────────────────────────────┐
│ [Make changes...]              │
│ [Save Changes]  [or Cancel]    │
└────────────────────────────────┘
         ↓
During Save:
┌────────────────────────────────┐
│ [Saving...]                    │
└────────────────────────────────┘
         ↓
After Success:
┌────────────────────────────────┐
│ [Save Changes] ✓ Saved!        │
└────────────────────────────────┘
```

## Interactive Elements

| Element | Interaction | Feedback |
|---------|------------|----------|
| Text Input | Type value | Immediate state update |
| Number Input | Type number | Immediate state update |
| Dropdown | Click & Select | Immediate state update |
| Toggle | Click to switch | Blue (on) / Gray (off) |
| Tab Button | Click to switch | Highlight active tab |
| Add User Button | Click | User appears in table |
| Delete Button (X) | Click | User removed from table |
| Save Changes | Click | Shows loading then message |

## Accessibility Features

- Semantic HTML (buttons, inputs, tables)
- Clear labels for all inputs
- Keyboard navigation support
- High contrast colors
- Icon + text labels
- Descriptive button text

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Android)

---

**Ready to use!** The admin dashboard is fully integrated and accessible at `/admin` route.
