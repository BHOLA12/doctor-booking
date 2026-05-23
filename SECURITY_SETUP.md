# 🔐 Security & Setup Guide - Doctor Booking

## Quick Start (Secure Way)

### 1. First Time Setup
```bash
# Copy template
cp .env.example .env.local

# Edit with YOUR credentials (not committed to git)
nano .env.local  # or use your editor
```

### 2. Get Your Credentials

#### **Neon Database**
1. Go to https://console.neon.tech
2. Select your project
3. Click "Connection string"
4. Copy full URL (will include password)
5. Paste into `.env.local` → `DATABASE_URL`
6. Also paste into `.env.local` → `DIRECT_URL`

#### **OpenAI API Key**
1. Go to https://platform.openai.com/api-keys
2. Create or copy existing key
3. Paste into `.env.local` → `OPENAI_API_KEY`

#### **JWT Secret** (Generate strong one)
```bash
# Option 1 - PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Maximum 256) }))

# Option 2 - Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📋 File Reference

| File | Purpose | Committed? | Status |
|------|---------|-----------|--------|
| `.env.local` | Your personal credentials | ❌ NO (Git Ignored) | 🔐 Private |
| `.env.example` | Template for new devs | ✅ YES | 📚 Reference |
| `.env` | Old/dangerous file | ❌ REMOVE | ⚠️ Delete |
| `.gitignore` | Tells git what to ignore | ✅ YES | ✅ Configured |

---

## 🚨 Security Best Practices

### ✅ DO:
- ✅ Store secrets in `.env.local`
- ✅ Use strong, random JWT secrets
- ✅ Rotate credentials if compromised
- ✅ Check `.gitignore` before committing
- ✅ Use `.env.example` for templates

### ❌ DON'T:
- ❌ Commit `.env` or `.env.local`
- ❌ Hardcode passwords in code
- ❌ Share credentials over chat/email
- ❌ Commit API keys to git
- ❌ Use placeholder values in production

---

## 🔄 Credential Rotation Process

If credentials are compromised:

### 1. **Database Password Rotation** (Neon)
```
1. Go to https://console.neon.tech
2. Settings → Database → Reset Password
3. Copy new connection string
4. Update .env.local → DATABASE_URL & DIRECT_URL
```

### 2. **API Key Rotation** (OpenAI)
```
1. Go to https://platform.openai.com/api-keys
2. Delete old key
3. Create new key
4. Update .env.local → OPENAI_API_KEY
```

### 3. **JWT Secret Rotation** (App Restart)
```
1. Generate new JWT secret (see above)
2. Update .env.local → JWT_SECRET
3. Restart development server
```

---

## 🛡️ Protection Mechanisms

### Pre-Commit Hook
A git hook automatically blocks commits containing secrets:
- Checks for common secret patterns
- Prevents `.env` files from being committed
- Runs before every commit

### Environment Validation
At startup, the app validates:
- All required variables are present
- Placeholder values are replaced
- Warns about unsafe configurations

---

## 🐛 Troubleshooting

### Problem: "DATABASE_URL is not set"
**Solution:** Make sure `.env.local` exists with real credentials
```bash
# Check if file exists
ls -la .env.local

# Make sure DATABASE_URL is set (not placeholder)
grep DATABASE_URL .env.local
```

### Problem: Can't connect to database
**Solution:** Verify connection string format
```
✅ CORRECT:  postgresql://user:pass@host/db?sslmode=verify-full
❌ WRONG:    postgresql://user:password@host/db
```

### Problem: Getting "Unable to parse JWT"
**Solution:** JWT_SECRET might be too short or invalid
```bash
# Generate new one and update .env.local
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🔍 Verify Everything is Safe

```bash
# 1. Check what's staged for commit
git diff --cached

# 2. Verify .env.local is ignored
git check-ignore .env.local

# 3. Look for any hardcoded secrets
git grep -i "postgresql://" -- '*.ts' '*.js'
git grep -i "sk-proj" -- '*.ts' '*.js'

# 4. Check recent commits (make sure no secrets)
git log --all --oneline -10
```

---

## 📞 Emergency: Secrets Already Committed?

If secrets were pushed to GitHub:

```bash
# 1. IMMEDIATELY rotate credentials (can't be undone)
#    - Neon: Reset password
#    - OpenAI: Delete and recreate API key

# 2. Remove from git history (advanced)
# Use: git-filter-repo or BFG Repo-Cleaner
# https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository

# 3. Force push (only if private repo!)
git push --force-with-lease

# 4. Enable branch protection on GitHub
```

---

## ✨ Summary

1. **Never commit secrets** - use `.env.local`
2. **Validate on startup** - app checks for missing vars
3. **Rotate immediately** - if compromise suspected
4. **Use hooks** - pre-commit prevents accidents
5. **Document it** - help new developers avoid mistakes

You're now **SAFE!** 🎉
