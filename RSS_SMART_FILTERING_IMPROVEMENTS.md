# 🧠 Smart RSS Filtering Improvements

## 🎯 **Problem Solved**
The user reported that the duplicate detection and filtering was too aggressive, potentially missing important news updates. The system needed to be smarter about distinguishing between true duplicates and legitimate news from different sources.

---

## ⚡ **MAJOR IMPROVEMENTS IMPLEMENTED**

### 1. **🚨 Priority Keywords System**
**Breaking news gets through every time!**

- **Priority Keywords**: `breaking`, `alert`, `urgent`, `update`, `developing`, `live`
- **Bypass Logic**: Articles with these keywords skip ALL other filtering
- **Real Impact**: Breaking news stories will never be filtered out

```typescript
// Priority keywords bypass all other filtering (breaking news, etc.)
if (feed.priorityKeywords?.some(keyword => content.includes(keyword.toLowerCase()))) {
  console.log(`🚨 Priority content detected: ${item.title?.substring(0, 50)}`)
  return true
}
```

### 2. **🔄 Multi-Source Story Support**
**Same story from different news sources = different perspectives!**

- **Allow Duplicates**: Stories can be imported from multiple sources
- **Source Attribution**: Each source gets to tell their version
- **Local Coverage**: KRQE, KOAT, and KKOB can all cover the same event

```typescript
// For different sources, allow duplicates if configured
if (feed.allowDuplicatesFromDifferentSources) {
  return false // Different source = not duplicate
}
```

### 3. **⏰ Time-Based Re-Import**
**News updates and follow-ups get through!**

- **24-Hour Window**: Same story can be re-imported after 24 hours
- **Story Updates**: Breaking news often has follow-up coverage
- **Fresh Perspectives**: Allows updated information on ongoing stories

```typescript
const cutoffDate = new Date()
cutoffDate.setHours(cutoffDate.getHours() - feed.maxDuplicateAgeHours)

if (!recentPost) {
  console.log(`🔄 Allowing re-import: ${item.title} (older than ${feed.maxDuplicateAgeHours}h)`)
  return false // Allow re-import of old content
}
```

### 4. **🎯 Smart Content Similarity**
**Better duplicate detection using content analysis!**

- **80% Similarity Threshold**: Only blocks truly similar content
- **Word Analysis**: Compares meaningful words (4+ characters)
- **Title + Description**: Analyzes both title and content
- **Recent Comparison**: Only checks against last 7 days of content

```typescript
const titleSimilarity = this.calculateTextSimilarity(itemTitle, postTitle)
const descSimilarity = this.calculateTextSimilarity(itemDescription, postExcerpt)
const overallSimilarity = Math.max(titleSimilarity, descSimilarity)
return overallSimilarity >= threshold
```

### 5. **📈 Increased Content Limits**
**More news coverage from each source!**

- **KRQE News**: 15 → **20 items** per import
- **KOAT News**: 15 → **20 items** per import  
- **KKOB Radio**: 10 → **15 items** per import
- **Total Potential**: Up to 55 articles per import cycle

### 6. **🔍 Refined Keyword Filtering**
**Less aggressive filtering = more news gets through!**

- **Specific Matching**: More precise exclude word detection
- **Removed**: `contest`, `giveaway` (too broad)
- **Kept**: `advertisement`, `sponsored`, `classifieds`, `obituaries`
- **Context Aware**: Checks for word boundaries and punctuation

---

## 📊 **EXPECTED RESULTS**

### **Before Improvements:**
- ❌ Breaking news sometimes filtered out
- ❌ Same story from multiple sources blocked  
- ❌ Updates to ongoing stories rejected
- ❌ Conservative limits (40 total items)
- ❌ Aggressive keyword filtering

### **After Improvements:**
- ✅ **Breaking news ALWAYS gets through** (priority keywords)
- ✅ **Multiple sources allowed** for comprehensive coverage
- ✅ **Story updates imported** after 24 hours
- ✅ **Higher limits** (up to 55 items total)
- ✅ **Smart filtering** that understands news context

---

## 🎯 **NEWS-FOCUSED FEATURES**

### **Priority Content Recognition:**
- Breaking news alerts
- Urgent updates  
- Developing stories
- Live coverage
- Emergency alerts

### **Editorial Workflow:**
- All imports saved as **DRAFTS**
- Review before publishing
- Edit titles and content
- Add local context
- Ensure quality control

### **Smart Duplicate Logic:**
```
1. Is it breaking/urgent content? → IMPORT (bypass all filters)
2. Is it from a different source? → IMPORT (allow multiple perspectives)  
3. Is it older than 24 hours? → IMPORT (allow updates)
4. Is content <80% similar? → IMPORT (different enough)
5. Otherwise → SKIP (true duplicate)
```

---

## 🚀 **IMMEDIATE BENEFITS**

1. **📰 More News Coverage**: Up to 37% more articles per import
2. **🚨 Zero Missed Breaking News**: Priority keywords ensure coverage
3. **📺 Multi-Source Perspective**: KRQE, KOAT, KKOB all contribute
4. **⏰ Timely Updates**: Story developments get imported
5. **🎯 Smarter Filtering**: Less false positives, more real news

---

## 📈 **TESTING RECOMMENDATIONS**

### **Test Breaking News:**
1. Wait for breaking news story
2. Check if it gets imported from multiple sources
3. Verify priority keywords work

### **Test Updates:**
1. Import a story
2. Wait 24+ hours
3. Try importing same story again (should work)

### **Test Multi-Source:**
1. Find same story on KRQE and KOAT
2. Import both feeds
3. Both versions should be imported

---

## 🎉 **CONCLUSION**

The RSS system is now **news-optimized** with smart filtering that:
- Prioritizes breaking news and urgent updates
- Allows comprehensive multi-source coverage  
- Recognizes story updates and developments
- Filters out real spam while preserving news content
- Provides higher content limits for better coverage

Your Albuquerque Hot Spot blog will now capture significantly more local news while maintaining quality through the draft review process! 