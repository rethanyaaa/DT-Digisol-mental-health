# CORS Setup and Consultation Link Configuration

## Overview

This document explains the CORS configuration for supporting both patient and admin/doctor frontend applications, and how consultation links work.

## CORS Configuration

### Backend CORS Setup

The backend server is configured to accept connections from both frontend origins:

- **Patient Frontend**: `http://localhost:5173`
- **Admin/Doctor Frontend**: `http://localhost:5174`

### Environment Variables

Add these to your `.env` file:

```env
# Frontend URLs for CORS
PATIENT_FRONTEND_URL=http://localhost:5173
ADMIN_FRONTEND_URL=http://localhost:5174
```

### Socket.IO CORS Configuration

Socket.IO is configured to accept connections from both frontend origins with proper authentication.

## Consultation Link System

### How Consultation Links Work

1. **Link Generation**: When a video consultation appointment is paid, a unique consultation link is generated
2. **Email Delivery**: The link is sent to the patient's email
3. **Link Validation**: When clicked, the link validates the consultation token
4. **Access Control**: Patients can access the consultation without being logged in

### Consultation Link Format

```
http://localhost:5173/consultation/{roomId}?token={consultationToken}
```

### Frontend Routes

- `/consultation/:roomId` - Consultation validation page
- `/waiting-room/:roomId` - Patient waiting room
- `/device-test` - Device testing page

### Backend API Endpoints

- `GET /api/consultation/details/:roomId` - Validate consultation token
- `POST /api/consultation/generate-link` - Generate consultation link
- `PUT /api/consultation/status/:roomId` - Update consultation status

## Authentication Flow

### For Logged-in Users

1. Uses JWT token from AppContext
2. Regular authentication flow
3. Access to waiting room via `/my-appointments`

### For Consultation Link Users

1. Uses consultation token from URL
2. Validates consultation token with backend
3. Access to waiting room via email link
4. No login required

## Socket.IO Authentication

### Patient Authentication

- **Logged-in patients**: Use JWT token
- **Consultation link patients**: Use consultation token
- Both are validated by the Socket.IO middleware

### Doctor Authentication

- Always uses JWT token
- Must be logged in to access doctor dashboard

## Testing the Setup

### 1. Start Both Frontends

```bash
# Patient frontend (port 5173)
cd frontend
npm run dev

# Admin frontend (port 5174)
cd admin
npm run dev -- --port 5174
```

### 2. Start Backend

```bash
cd backend
npm start
```

### 3. Test CORS

- Both frontends should be able to connect to the backend
- Socket.IO connections should work from both origins
- Check browser console for CORS errors

### 4. Test Consultation Links

1. Book a video consultation appointment
2. Complete payment
3. Check email for consultation link
4. Click the link to access the consultation

## Troubleshooting

### CORS Errors

- Ensure both frontend URLs are in the CORS configuration
- Check that environment variables are set correctly
- Verify that both frontends are running on the correct ports

### Consultation Link Issues

- Check that the consultation token is valid
- Verify that the consultation hasn't expired
- Ensure the email service is configured properly

### Socket.IO Connection Issues

- Check that the backend URL is correct in both frontends
- Verify that authentication tokens are being sent properly
- Check browser console for connection errors

## Security Considerations

1. **Consultation Tokens**: Are time-limited and single-use
2. **CORS**: Only allows specific origins
3. **Authentication**: Both JWT and consultation tokens are validated
4. **Rate Limiting**: Consider implementing rate limiting for consultation endpoints

## Future Enhancements

1. **HTTPS**: Use HTTPS in production for secure connections
2. **Domain Configuration**: Update CORS for production domains
3. **Token Refresh**: Implement token refresh for long consultations
4. **Audit Logging**: Log all consultation access attempts
