# 🚀 AI Resume Builder - Deployment Guide

## Railway Deployment Steps

### Step 1: Create Railway Account
1. Go to https://railway.app/
2. Click "Login with GitHub"
3. Authorize Railway to access your GitHub account

### Step 2: Create New Project
1. Click "New Project" button
2. Select "Deploy from GitHub repo"
3. Choose: `prashanthnemadi18/Ai-resume-`
4. Railway will detect your project structure

### Step 3: Configure Services

#### A. Backend Service (Java Spring Boot)
1. Railway will auto-detect `backend-java` folder
2. Click on the backend service
3. Go to "Settings" → "Environment"
4. Add these variables:

```
SPRING_DATASOURCE_URL=postgresql://<will-be-auto-filled>
SPRING_DATASOURCE_USERNAME=<will-be-auto-filled>
SPRING_DATASOURCE_PASSWORD=<will-be-auto-filled>
GEMINI_API_KEY=AIzaSyCSfDnHMrqDY-Guy8DTXYuLh3Ah-aQMPd0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SPRING_JPA_HIBERNATE_DDL_AUTO=update
```

5. Go to "Settings" → "Networking"
6. Click "Generate Domain" to get your backend URL

#### B. Frontend Service (React)
1. Railway will auto-detect `frontend` folder
2. Click on the frontend service
3. Go to "Settings" → "Environment"
4. Add this variable:

```
REACT_APP_API_URL=<your-backend-url-from-step-A6>
```

5. Go to "Settings" → "Networking"
6. Click "Generate Domain" to get your frontend URL

### Step 4: Add PostgreSQL Database
1. Click "New" → "Database" → "PostgreSQL"
2. Railway will automatically:
   - Create the database
   - Link it to your backend service
   - Set environment variables

### Step 5: Deploy
1. Railway will automatically deploy on every git push
2. Monitor deployment in the "Deployments" tab
3. Check logs for any errors

### Step 6: Update Frontend API URL
1. After backend is deployed, copy the backend URL
2. Update `frontend/.env`:
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```
3. Commit and push:
```bash
git add frontend/.env
git commit -m "Update API URL for production"
git push origin main
```

### Step 7: Test Your Application
1. Open your frontend URL: `https://your-app.railway.app`
2. Test signup/login
3. Test resume creation
4. Test AI generation

---

## 🔧 Troubleshooting

### Backend Not Starting?
- Check logs in Railway dashboard
- Verify PostgreSQL is connected
- Ensure all environment variables are set

### Frontend Can't Connect to Backend?
- Verify `REACT_APP_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is running

### Database Connection Failed?
- Railway auto-configures database
- Check if PostgreSQL service is running
- Verify connection string in environment variables

---

## 📊 Monitoring

### Check Application Health
- Backend health: `https://your-backend-url.railway.app/health`
- View logs in Railway dashboard
- Monitor resource usage

### Scaling
- Railway auto-scales based on traffic
- Upgrade plan if needed for more resources

---

## 💰 Cost Estimation

### Free Tier (Hobby Plan)
- $5 free credits per month
- Enough for development/testing
- Sleeps after inactivity

### Paid Plans
- **Developer**: $5/month per service
- **Team**: $20/month per service
- **Enterprise**: Custom pricing

---

## 🔐 Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Never commit `.env` files with real API keys
- [ ] Use Railway's secret management
- [ ] Enable HTTPS (automatic on Railway)
- [ ] Set up proper CORS policies
- [ ] Use environment-specific configurations

---

## 🎉 Success!

Your AI Resume Builder is now live! Share your URL:
- Frontend: `https://your-app.railway.app`
- Backend API: `https://your-backend.railway.app`

---

## 📝 Next Steps

1. **Custom Domain**: Add your own domain in Railway settings
2. **Monitoring**: Set up error tracking (Sentry)
3. **Analytics**: Add Google Analytics
4. **SEO**: Optimize meta tags
5. **Performance**: Enable caching and CDN
