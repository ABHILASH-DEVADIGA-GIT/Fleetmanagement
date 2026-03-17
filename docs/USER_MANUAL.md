# FrameBook Pro - User Manual

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Super Admin Guide](#super-admin-guide)
4. [Client Admin Guide](#client-admin-guide)
5. [Public Website](#public-website)
6. [Troubleshooting](#troubleshooting)

---

## 1. Introduction

FrameBook Pro is a multi-tenant SaaS platform designed for service-based businesses like photographers, event managers, and creative professionals. It provides:

- **Public Website:** A customizable website for each client business
- **Admin Dashboard:** Tools to manage bookings, leads, invoices, and content
- **Super Admin Panel:** Platform-wide management for the platform owner

### User Roles

| Role | Access Level |
|------|--------------|
| Super Admin | Full platform access, client management |
| Admin | Client-specific dashboard and features |
| Public | View-only access to public website |

---

## 2. Getting Started

### Logging In

1. Navigate to your platform URL (e.g., `https://yourdomain.com/login`)
2. Enter your email and password
3. Click **"Sign In"**

### Default Credentials (Change Immediately!)

**Super Admin:**
- Email: `admin@yourdomain.com`
- Password: Set during installation

**Demo Client Admin:**
- Email: Created when client is created
- Password: Set during client creation

---

## 3. Super Admin Guide

### 3.1 Accessing Super Admin Dashboard

After logging in as Super Admin, you'll see the Super Admin Dashboard with:
- **Dashboard Overview:** Platform statistics
- **Client Management:** Manage all clients
- **User Management:** Manage platform users

### 3.2 Client Management

#### Creating a New Client

1. Navigate to **Client Management**
2. Click **"Add New Client"**
3. Fill in the form:

| Field | Description |
|-------|-------------|
| Business Name | Client's business name |
| Email | Client admin login email |
| Phone | Contact phone number |
| Domain Identifier | Unique URL slug (e.g., "abc-photo") |
| Subscription Plan | basic / premium / enterprise |
| Theme | light / dark |
| Primary Color | Brand color (hex code) |
| Logo | Upload client logo |
| Admin Password | Initial password for client admin |
| Max Gallery Images | Limit for gallery uploads |
| Max Products | Limit for product catalog |

4. **Select Enabled Modules:**
   - About
   - Services
   - Gallery
   - Booking
   - Products
   - Offers
   - Contact

5. Click **"Create Client"**

#### Editing a Client

1. Find the client in the list
2. Click the **Edit** icon
3. Modify fields as needed
4. Click **"Save Changes"**

#### Setting Resource Limits

Control how many resources each client can use:

1. Edit the client
2. Set **"Max Gallery Images"** (e.g., 50)
3. Set **"Max Products"** (e.g., 100)
4. Save changes

When clients reach their limits, they'll see an error message and cannot add more items.

#### Enabling/Disabling Modules

1. Edit the client
2. Toggle modules on/off
3. Save changes

Disabled modules will not appear on the client's public website or admin dashboard.

#### Deleting a Client

⚠️ **Warning:** This permanently deletes all client data!

1. Find the client in the list
2. Click the **Delete** icon
3. Confirm deletion

### 3.3 User Management

View and manage all platform users across all clients.

---

## 4. Client Admin Guide

### 4.1 Dashboard Overview

The Admin Dashboard shows:
- **Revenue This Month:** Total earnings
- **Events This Month:** Number of events
- **Pending Payments:** Outstanding balances
- **New Leads:** Unread lead inquiries
- **Upcoming Events:** Next 7 days schedule

### 4.2 Site Content Editor

Customize your public website content.

#### Editing Hero Section

1. Navigate to **Site Content**
2. Find the **Hero Section**
3. Update:
   - Background Image (upload)
   - Headline (multi-language)
   - Sub-headline
   - CTA Button text and link

#### Editing About Section

1. Navigate to **Site Content**
2. Find the **About Section**
3. Update:
   - Title and description
   - Image
   - Statistics (e.g., "10+ Years", "500+ Clients")

#### Adding Social Links

1. Scroll to **Footer** section
2. Add social media URLs:
   - Facebook
   - Instagram
   - YouTube
   - Twitter

### 4.3 Service Management

#### Adding a Service

1. Navigate to **Services**
2. Click **"Add Service"**
3. Fill in:
   - Service Name (multi-language)
   - Description
   - Price (optional)
   - Image (upload)
4. Toggle **Active** status
5. Click **"Save"**

#### Editing/Deleting Services

- Click **Edit** icon to modify
- Click **Delete** icon to remove
- Drag to reorder display

### 4.4 Gallery Management

#### Uploading Images

1. Navigate to **Gallery**
2. Click **"Upload Images"**
3. Drag & drop or select files
4. Add optional title and category
5. Click **"Upload"**

**Note:** You can see your usage limit (e.g., "25/50 images used")

#### Organizing Gallery

- Set images as **Featured** to highlight them
- Assign **Categories** for filtering
- **Reorder** by dragging

#### Deleting Images

Click the **Delete** icon on any image.

### 4.5 Product Catalog

#### Adding Products

1. Navigate to **Products**
2. Click **"Add Product"**
3. Fill in:
   - Product Name (multi-language)
   - Description
   - Images (upload multiple)
   - Base Price
   - Discount Percentage
   - Category
4. Click **"Save"**

**Note:** You can see your usage limit (e.g., "45/100 products used")

#### Managing Categories

1. Go to **Products** > **Categories**
2. Add/Edit/Delete categories
3. Assign products to categories

### 4.6 Lead Management

#### Viewing Leads

1. Navigate to **Leads**
2. View all leads with status indicators:
   - 🟢 New
   - 🟡 Contacted
   - 🔵 Follow-up
   - 🟣 Quotation Sent
   - ✅ Confirmed
   - 🔴 Lost

#### Adding Manual Lead

1. Click **"Add Lead"**
2. Enter customer details
3. Set source (Website, Instagram, Referral, etc.)
4. Click **"Save"**

#### Updating Lead Status

1. Click on a lead
2. Change status from dropdown
3. Add notes about the conversation
4. Set follow-up date

### 4.7 Package Management

Create service packages for easy quotation.

#### Creating a Package

1. Navigate to **Packages**
2. Click **"Add Package"**
3. Fill in:
   - Package Name
   - Base Price
   - Description
   - Included Services (list)
   - Default Discount
4. Click **"Save"**

### 4.8 Add-on Management

Create add-on services that can be added to packages.

### 4.9 Quotation Management

#### Creating a Quotation

1. Navigate to **Quotations**
2. Click **"Create Quotation"**
3. Select a Lead
4. Add items:
   - Select Package or Add-on
   - Or add Custom items
5. Set discount and tax
6. Add notes
7. Click **"Save"**

#### Quotation Status Flow

```
Draft → Sent → Accepted/Rejected
                ↓
            Convert to Invoice
```

#### Generating PDF

1. Open quotation
2. Click **"Download PDF"**
3. Share with customer via email/WhatsApp

### 4.10 Invoice Management

#### Creating Invoice from Quotation

1. Open accepted quotation
2. Click **"Convert to Invoice"**

#### Creating Direct Invoice

1. Navigate to **Invoices**
2. Click **"Create Invoice"**
3. Enter customer details
4. Add line items
5. Set payment terms
6. Click **"Save"**

#### Recording Payments

1. Open invoice
2. Click **"Add Payment"**
3. Enter:
   - Amount
   - Payment Date
   - Payment Method (Cash, UPI, Bank Transfer)
   - Notes
4. Click **"Save"**

Invoice status updates automatically:
- Unpaid → Partially Paid → Paid

### 4.11 Event Management

Track confirmed bookings as events.

#### Creating Event

Events are usually created when a lead is confirmed:

1. Update lead status to **Confirmed**
2. An event is automatically created

Or create manually:
1. Navigate to **Events**
2. Click **"Add Event"**
3. Fill in details
4. Link to lead/invoice if applicable

#### Event Status

- Inquiry
- Confirmed
- Completed
- Cancelled

### 4.12 Expense Management

Track expenses for each event.

#### Adding Expense

1. Navigate to **Expenses**
2. Click **"Add Expense"**
3. Select Event
4. Choose Category:
   - Travel
   - Equipment
   - Assistant
   - Other
5. Enter amount and description
6. Click **"Save"**

### 4.13 Calendar View

Visual calendar showing all events.

1. Navigate to **Calendar**
2. Click dates to view events
3. Color-coded by status

### 4.14 Reports

#### Revenue Report

View monthly revenue breakdown:
- Total Revenue
- Paid vs Pending
- By Event Type

#### Events Report

- Events per month
- By status
- Revenue per event

### 4.15 Booking Management

View and manage public website bookings.

1. Navigate to **Bookings**
2. View new booking requests
3. Update status (Pending, Confirmed, Completed, Cancelled)
4. Convert to Lead for follow-up

### 4.16 Blocked Dates

Block dates to prevent bookings.

1. Navigate to **Calendar** or **Blocked Dates**
2. Select dates to block
3. Click **"Block"**

Blocked dates show as unavailable on public booking form.

### 4.17 Notifications

In-app notifications appear in the header bell icon.

**Notification Types:**
- 🔔 New Booking
- 👤 New Lead
- 💰 Payment Received
- ℹ️ System Updates

**Actions:**
- Click notification to view details
- Click "Mark all as read"
- Delete individual notifications

### 4.18 Offer Management

Create promotional offers.

1. Navigate to **Offers**
2. Click **"Add Offer"**
3. Fill in:
   - Title
   - Description
   - Discount (percentage or flat)
   - Start and End dates
   - Banner image
4. Click **"Save"**

Active offers display on public website.

---

## 5. Public Website

### 5.1 Website Sections

Each client gets a public website with these sections (if enabled):

1. **Header:** Logo, navigation, language switcher
2. **Hero:** Banner with CTA
3. **About:** Business introduction
4. **Services:** Service offerings
5. **Gallery:** Photo portfolio
6. **Products:** Product catalog
7. **Offers:** Current promotions
8. **Booking:** Online booking form
9. **Contact:** Contact information
10. **Footer:** Social links, copyright

### 5.2 Booking Flow

1. Customer visits booking page
2. Selects event type and date
3. Enters contact information
4. Submits booking
5. Admin receives notification
6. Admin follows up

### 5.3 Product Viewing

1. Browse product catalog
2. Filter by category
3. Sort by price
4. Click product for details
5. View multiple images
6. Contact business for purchase

### 5.4 Language Support

Customers can switch between enabled languages:
- English (en)
- Hindi (hi)
- Kannada (kn)

---

## 6. Troubleshooting

### Common Issues

#### Can't Login

- Check email spelling
- Verify caps lock is off
- Try password reset
- Contact Super Admin

#### Images Not Uploading

- Check file size (max 10MB)
- Ensure file type is supported (JPG, PNG, GIF, WebP)
- Check internet connection

#### Limit Reached Error

- Gallery: "Gallery image limit reached"
- Products: "Product limit reached"
- Contact Super Admin to increase limits

#### Booking Form Not Working

- Check if Booking module is enabled
- Verify no date blocking issues
- Check form validation errors

#### PDF Not Generating

- Ensure all required fields are filled
- Try refreshing the page
- Check browser popup settings

### Getting Help

For technical support:
1. Check this documentation
2. Contact Super Admin
3. Email support team

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Esc` | Close modal |
| `Enter` | Submit form |
| `Tab` | Navigate fields |

---

## Best Practices

### For Super Admins
- Set appropriate resource limits
- Regularly review client activity
- Keep platform updated
- Monitor storage usage

### For Client Admins
- Respond to leads quickly
- Keep gallery and products updated
- Use consistent pricing in packages
- Record all payments promptly
- Back up important data regularly

### For Content
- Use high-quality images (min 1200px wide)
- Write concise, clear descriptions
- Update offers regularly
- Keep contact information current
