# Admin Dashboard - Quick Start

## Access the Admin Dashboard
- **URL**: `http://localhost:3000/admin` (local development)
- **Production**: `https://yourdomain.com/admin`

## 4 Main Sections

### 1️⃣ General Settings
Manage core app configuration
- App name, domain, support email
- Maintenance mode on/off
- Backup settings
- Session limits

### 2️⃣ User Management
Add, edit, and remove users
- Email input field
- Role selector (User, Moderator, Admin)
- Users table with all registered accounts
- Delete button for removing users

### 3️⃣ Permissions & Moderation
Control what users and moderators can do
- 6 toggle switches for different permissions
- Blue = Enabled, Gray = Disabled
- Examples: can users export data? can moderators ban users?

### 4️⃣ System Settings
Configure technical parameters
- API rate limits
- Upload size limits
- Cache settings
- Log retention
- Analytics and notifications toggles

## Common Tasks

**Add a new user:**
1. Go to "User Management" tab
2. Type email in the "Add New User" field
3. Pick a role from dropdown
4. Click "Add User"
5. Click "Save Changes"

**Change a user's role:**
1. Find user in the table
2. Click the role dropdown
3. Select new role
4. Click "Save Changes"

**Remove a user:**
1. Find user in table
2. Click the X button in Actions column
3. Click "Save Changes"

**Change a permission:**
1. Go to "Permissions" tab
2. Click any toggle switch to enable/disable
3. Click "Save Changes"

**Update general settings:**
1. Go to "General Settings" tab
2. Type new values in any field
3. Toggle switches for on/off settings
4. Click "Save Changes"

## Status Messages

- ✓ Green checkmark = Success! Settings saved
- ✗ Red X = Error occurred, check connection
- "Saving..." = Settings being saved, please wait

## Tips

- All changes are temporary until you click "Save Changes"
- Only one tab can be edited at a time
- User emails must be valid format
- Role changes take effect immediately after save
- Numeric values can be edited directly

## Need Help?

- **User Guide**: See `ADMIN_DASHBOARD_GUIDE.md`
- **Technical Guide**: See `ADMIN_DASHBOARD_TECHNICAL.md`
- **Full Summary**: See `ADMIN_IMPLEMENTATION_SUMMARY.md`

## Keyboard Shortcuts

- `Tab` - Navigate between fields
- `Enter` - Submit forms (where applicable)
- `Escape` - Cancel dialogs (if implemented)

---

**That's it!** You now have a fully functional admin dashboard for managing LlamaTutor. 🎉
