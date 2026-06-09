# Admin Dashboard Guide

## Overview

The Admin Dashboard is a comprehensive management interface for LlamaTutor administrators. It provides centralized control over app settings, user management, permissions, and system configuration.

**Access:** Navigate to `/admin` route

## Features

### 1. General Settings
Manage core application configuration.

**Settings Available:**
- **Application Name** - The display name of the app
- **Site URL** - The primary domain/URL of the application
- **Support Email** - Contact email for user support requests
- **Maintenance Mode** - Toggle to take the site offline for updates
- **Automatic Backups** - Enable/disable automatic daily data backups
- **Max Concurrent Sessions** - Maximum number of active user sessions allowed
- **Session Timeout** - Time in seconds before inactive sessions expire (default: 3600 = 1 hour)

**How to Use:**
1. Navigate to the "General Settings" tab in the sidebar
2. Update the text fields with new values
3. Toggle switches for boolean settings
4. Click "Save Changes" at the bottom
5. A success message will confirm the settings were saved

### 2. User Management
Manage all users, roles, and account status.

**Features:**
- View all registered users in a searchable table
- Add new users with custom roles
- Change user roles (Admin, Moderator, User)
- Remove users from the system
- View user join dates and current status

**User Roles:**
- **Admin** - Full access to all features, including admin panel
- **Moderator** - Can moderate content and user behavior
- **User** - Standard user with basic access

**How to Add a User:**
1. Go to the "User Management" tab
2. Enter email address in the "Add New User" field
3. Select a role from the dropdown (default: User)
4. Click "Add User" button
5. The user will appear in the table below
6. Click "Save Changes" to persist changes

**How to Manage Roles:**
1. In the users table, find the user you want to modify
2. Click the Role dropdown for that user
3. Select the new role (Admin, Moderator, or User)
4. Click "Save Changes" to persist the change

**How to Remove a User:**
1. Locate the user in the table
2. Click the "X" button in the Actions column
3. Click "Save Changes" to confirm removal

### 3. Permissions & Moderation
Control what actions different user types can perform.

**Available Permissions:**

| Permission | Description |
|-----------|-------------|
| **Users Can Edit Profile** | Allow users to modify their profile information and settings |
| **Users Can Export Data** | Allow users to download/export their personal data |
| **Moderators Can Ban Users** | Allow moderators to suspend or ban users |
| **Moderators Can Edit Content** | Allow moderators to modify user-generated content |
| **Public Registration** | Allow new users to sign up without an invitation |
| **Require Email Verification** | Require users to verify their email before account activation |

**How to Modify Permissions:**
1. Go to the "Permissions" tab
2. Each permission has a toggle switch on the right
3. Click the toggle to enable/disable a permission
4. When disabled, the toggle appears gray; when enabled, it appears blue
5. Click "Save Changes" at the bottom to apply all permission changes

### 4. System Settings
Configure technical and operational parameters.

**Available Settings:**
- **API Rate Limit** - Number of API requests allowed per hour (default: 1000)
- **Max Upload Size** - Maximum file upload size in MB (default: 100)
- **Cache TTL** - Cache time-to-live in seconds (default: 3600)
- **Log Retention** - Number of days to retain system logs (default: 30)
- **Enable Notifications** - Toggle to enable/disable system notifications
- **Enable Analytics** - Toggle to enable/disable user behavior tracking

**How to Use:**
1. Go to the "System Settings" tab
2. Modify numeric values directly in the input fields
3. Toggle switches for boolean settings (notifications, analytics)
4. Click "Save Changes" to apply all system settings

## UI Components

### Navigation Sidebar
- Located on the left side
- Four main sections: General Settings, User Management, Permissions, System Settings
- Current section is highlighted in blue
- Click any section to switch tabs

### Content Area
- Right side displays the settings for the selected tab
- Input fields for text configuration
- Dropdowns for selection
- Toggle switches for boolean values
- Tables for user management

### Save Functionality
- "Save Changes" button at the bottom of each tab
- Button shows "Saving..." while processing
- Green success message appears on successful save: "✓ Settings saved successfully"
- Error message appears if save fails: "✗ Error saving settings"

## Data Persistence

All settings are stored in your application's data store. The frontend state is in-memory, so **you must click "Save Changes" to persist any modifications**.

## Integration with Backend

To connect the admin dashboard to your actual backend:

1. **API Endpoint:** Create a POST endpoint at `/api/admin/settings` to receive settings updates
2. **Payload Structure:**
   ```json
   {
     "settings": { /* general settings */ },
     "users": [ /* user array */ ],
     "permissions": { /* permissions object */ },
     "systemSettings": { /* system settings */ }
   }
   ```
3. **Response:** Return a success/error status to update the UI accordingly

## Security Considerations

- Only authenticated admin users should have access to the `/admin` route
- Implement proper authentication and authorization checks
- Validate all inputs on the backend before saving
- Consider implementing audit logging for admin actions
- Add rate limiting to prevent abuse

## Troubleshooting

**Settings aren't saving?**
- Ensure the "Save Changes" button was clicked
- Check browser console for network errors
- Verify backend API endpoint is responding

**Users not appearing in list?**
- Ensure the email field is not empty
- Try refreshing the page
- Check if user was added to the backend

**Toggles not responding?**
- Ensure JavaScript is enabled in browser
- Try refreshing the page
- Check browser console for errors

## Future Enhancements

Potential features for future versions:
- Bulk user import/export
- User activity logs and analytics dashboard
- Role-based permission templates
- Advanced search and filtering in user table
- Scheduled maintenance windows
- Database backup management UI
- System health monitoring dashboard
