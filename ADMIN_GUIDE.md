# Admin Guide - ABL Natasha Enterprises E-commerce Platform

## Making a User Admin

### Method 1: Direct Database Update (Recommended)
1. Access your Supabase dashboard
2. Go to the Table Editor
3. Find the `users` table
4. Locate the user you want to make admin
5. Edit the `role` column and change it from `user` to `admin`
6. Save the changes

### Method 2: SQL Query
Run this SQL query in your Supabase SQL Editor:
\`\`\`sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'user@example.com';
\`\`\`
Replace `user@example.com` with the actual email address.

## Admin Dashboard Features

### Accessing the Admin Dashboard
- Admin users will see an "Admin Dashboard" option in their user menu
- Direct URL: `/admin`
- Only users with `role = 'admin'` can access this area

### Order Management (`/admin/orders`)
**Features:**
- View all customer orders in real-time
- Filter orders by status (pending, processing, shipped, delivered, cancelled)
- Search orders by order number, customer name, or email
- Update order status and add tracking numbers
- View detailed order information including items and shipping details
- Export order data for reporting

**Order Status Management:**
- **Pending**: New orders awaiting processing
- **Processing**: Orders being prepared for shipment
- **Shipped**: Orders dispatched with tracking information
- **Delivered**: Orders successfully delivered to customers
- **Cancelled**: Orders cancelled by customer or admin

### Product Management
**Features:**
- Add new products with images, descriptions, and pricing
- Edit existing product information
- Manage product categories and inventory
- Set product visibility (active/inactive)
- Bulk product operations

### User Management
**Features:**
- View all registered users
- Manage user roles (user/admin)
- View user order history
- Handle customer support inquiries

### Analytics & Reporting
**Features:**
- Sales analytics and revenue tracking
- Popular products and categories
- Customer behavior insights
- Order fulfillment metrics

### Hire Services Management (`/admin/hire`)
**Features:**
- Manage car hire and boat cruise bookings
- Update service availability and pricing
- Handle booking confirmations and cancellations
- Track service utilization and revenue

## Best Practices

### Security
- Regularly review admin user list
- Use strong passwords and enable 2FA when available
- Monitor admin activity logs
- Limit admin access to necessary personnel only

### Order Processing
1. **Daily Order Review**: Check new orders every morning
2. **Status Updates**: Keep customers informed with timely status updates
3. **Tracking Information**: Always provide tracking numbers for shipped orders
4. **Customer Communication**: Respond to customer inquiries promptly

### Inventory Management
- Monitor stock levels regularly
- Update product availability in real-time
- Set up low-stock alerts
- Plan for seasonal demand fluctuations

### Customer Service
- Respond to customer inquiries within 24 hours
- Handle returns and refunds professionally
- Maintain detailed records of customer interactions
- Use the admin notes feature for internal communication

## Troubleshooting

### Common Issues
1. **Can't access admin dashboard**: Verify user role is set to 'admin'
2. **Orders not loading**: Check database connection and permissions
3. **Status updates not saving**: Verify admin permissions and database connectivity

### Support
For technical issues or questions about the admin system:
- Check the application logs for error messages
- Verify database connectivity
- Contact the development team for system-level issues

## System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection
- Admin user account with proper permissions
