# Email Fix — Tutoria Salon Backend

## Files Changed

| File | What Changed |
|------|-------------|
| `backend/utils/sendEmail.js` | Added `sendEditEmail`, always-send cancel email, `verifyEmailConfig` helper |
| `backend/controllers/adminController.js` | Uses registered user email, sends email on edit, sends cancel email always |
| `backend/server.js` | Calls `verifyEmailConfig()` at startup to catch config problems early |

---

## Root Causes Fixed

### 1. Cancel email only sent if admin typed a message
**Before:** `if (message) { sendCancellationEmail(...) }` — no message = no email.  
**After:** Email always sent. The message is included if provided; a default message is used if not.

### 2. Edit booking — no email sent at all
**Before:** `adminEditBooking` saved changes silently with zero email.  
**After:** Detects what actually changed (date / time / status / stylist / note) and sends a professional "Appointment Updated" email showing the before/after diff.

### 3. Wrong email address used
**Before:** `booking.email` (the email entered at booking time) was used — could be wrong or outdated.  
**After:** `booking.user.email` (the user's registered account email) is used everywhere. Falls back to `booking.email` only if the user record is missing.

### 4. Notify endpoint used wrong email
**Before:** `booking.email` — same problem as above.  
**After:** Populates the `user` relation and uses `booking.user.email`.

### 5. No email for status-only changes
**Before:** If admin changed status from `upcoming` → `completed`, user never found out.  
**After:** Any change (date, time, status, stylist, or admin note) triggers the update email.

---

## How to Drop These Files In

```
your-project/
  backend/
    utils/
      sendEmail.js          ← replace
    controllers/
      adminController.js    ← replace
    server.js               ← replace
```

---

## Gmail App Password Setup (Required)

Gmail blocks plain passwords for apps. You must use an **App Password**:

1. Go to your Google Account → **Security**
2. Enable **2-Step Verification** (if not already on)
3. Go to **Security → App Passwords**
4. Select app: **Mail** · Device: **Other** → type "Tutoria Salon" → **Generate**
5. Copy the 16-character password shown

Then update your `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=divyagurav7370@gmail.com
EMAIL_PASS=hbvvelmarxoksjrt  ← the 16-char app password (spaces are fine)
```

> ⚠️ Never commit your `.env` file to git. It's already in `.gitignore`.

---

## Testing

Start the server — you'll see one of these lines:
```
✅ Email transporter ready          ← credentials are correct
⚠️  Email config issue: ...         ← something is wrong, fix before going live
```

Then test each admin action:
- **Cancel booking** → user gets "Booking Cancelled" email  
- **Edit booking** (change date/time/stylist/status) → user gets "Booking Updated" email  
- **Notify** (email channel) → user gets custom message email
