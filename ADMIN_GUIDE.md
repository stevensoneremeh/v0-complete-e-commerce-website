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

### Dashboard Overview (`/admin`)
**Features:**
- Real-time sales analytics and revenue tracking
- Recent orders overview with quick status updates
- Key performance indicators (KPIs) and metrics
- Quick access to all admin sections

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

### Product Management (`/admin/products`)
**Features:**
- Add new products with images, descriptions, and pricing
- Edit existing product information
- Manage product categories and inventory
- Set product visibility (active/inactive)
- Bulk product operations
- SEO optimization for product pages

### Property Management (`/admin/properties`)
**Features:**
- Complete CRUD operations for luxury apartment listings
- Property filtering by status (available, booked, sold, maintenance, draft)
- Search functionality across titles, types, locations, and tags
- Status management with visual badges and color coding
- Property form with comprehensive details:
  - Basic Info (title, type, description, bedrooms, bathrooms, price)
  - Location details and amenities
  - Media management (images, virtual tours)
  - Booking availability and pricing
  - SEO metadata and tags

### Hire Services Management (`/admin/bookings`)
**Features:**
- Manage car hire and boat cruise bookings
- View all service reservations in real-time
- Update booking status and confirmations
- Handle cancellations and refunds
- Track service utilization and revenue
- Customer communication and special requests

### User Management (`/admin/customers`)
**Features:**
- View all registered users with detailed profiles
- Manage user roles (user/admin)
- View user order history and booking records
- Handle customer support inquiries
- User activity tracking and analytics

### Categories Management (`/admin/categories`)
**Features:**
- Create and manage product categories
- Set category visibility and ordering
- Upload category images and descriptions
- Manage category hierarchies

### Coupons Management (`/admin/coupons`)
**Features:**
- Create discount codes and promotional offers
- Set expiration dates and usage limits
- Track coupon usage and effectiveness
- Manage percentage and fixed amount discounts

### Analytics & Reporting (`/admin/analytics`)
**Features:**
- Comprehensive sales analytics and revenue tracking
- Popular products and categories analysis
- Customer behavior insights and demographics
- Order fulfillment metrics and performance
- Property booking analytics
- Hire services utilization reports

### Notifications (`/admin/notifications`)
**Features:**
- System notifications and alerts
- Customer inquiry management
- Order status notifications
- Low inventory alerts

### Settings (`/admin/settings`)
**Features:**
- System configuration and preferences
- Payment gateway settings
- Email notification templates
- Site-wide settings and maintenance mode

## Real-Time Management Capabilities

### Live Order Tracking
- Real-time order status updates
- Automatic inventory adjustments
- Customer notification triggers
- Payment status monitoring

### Property Availability
- Real-time booking calendar updates
- Automatic availability blocking
- Pricing adjustments and seasonal rates
- Maintenance scheduling

### Hire Services Coordination
- Live booking confirmations
- Service provider coordination
- Customer communication automation
- Payment processing integration

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

### Property Management
1. **Regular Updates**: Keep property information current
2. **Photo Quality**: Maintain high-quality property images
3. **Availability**: Update booking calendars in real-time
4. **Pricing**: Adjust rates based on demand and seasonality

### Hire Services Management
1. **Service Coordination**: Confirm all bookings with service providers
2. **Customer Preparation**: Send detailed instructions before service date
3. **Quality Control**: Follow up with customers after service completion
4. **Maintenance**: Regular vehicle and boat maintenance scheduling

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

## Production Deployment

### Environment Setup
- Ensure all environment variables are properly configured
- Verify database connections and permissions
- Test payment gateway integrations
- Configure email services for notifications

### Monitoring
- Set up error tracking and logging
- Monitor application performance
- Track user activity and system health
- Regular database backups

### Maintenance
- Regular security updates
- Database optimization
- Performance monitoring
- Backup verification

## Troubleshooting

### Common Issues
1. **Can't access admin dashboard**: Verify user role is set to 'admin'
2. **Orders not loading**: Check database connection and permissions
3. **Status updates not saving**: Verify admin permissions and database connectivity
4. **Property images not displaying**: Check image URLs and storage permissions
5. **Payment processing errors**: Verify Paystack integration and API keys

### Support
For technical issues or questions about the admin system:
- Check the application logs for error messages
- Verify database connectivity
- Ensure all environment variables are set correctly
- Contact the development team for system-level issues

## System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection
- Admin user account with proper permissions
- Access to Supabase dashboard for database management

## Quick Reference

### Admin URLs
- Dashboard: `/admin`
- Orders: `/admin/orders`
- Products: `/admin/products`
- Properties: `/admin/properties`
- Bookings: `/admin/bookings`
- Customers: `/admin/customers`
- Categories: `/admin/categories`
- Coupons: `/admin/coupons`
- Analytics: `/admin/analytics`
- Settings: `/admin/settings`

### Key Shortcuts
- Search orders: Use the search bar in order management
- Quick status update: Click on status badges to change
- Bulk operations: Select multiple items for batch actions
- Export data: Use export buttons in analytics sections
