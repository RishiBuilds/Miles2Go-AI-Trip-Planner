# 🤖 AI Chat Assistant Access Guide

## 🎯 **Multiple Ways to Access AI Chat Assistant**

### **Method 1: Direct Component Import (✅ Now Active on Homepage)**

```tsx
// app/page.tsx (Already implemented)
import AIChatAssistant from "./_components/AIChatAssistant";

export default function Home() {
  const handleChatAction = (action: string, data?: any) => {
    switch (action) {
      case "browse_destinations":
        window.location.href = "/destinations";
        break;
      case "plan_trip":
        window.location.href = "/create-new-trip";
        break;
      default:
        console.log("Action:", action);
    }
  };

  return (
    <div>
      {/* Your page content */}
      
      {/* AI Chat Assistant - Fixed bottom right */}
      <AIChatAssistant 
        mode="travel_planning"
        onActionTrigger={handleChatAction}
      />
    </div>
  );
}
```

### **Method 2: Using DashboardLayout (Recommended for Dashboard Pages)**

```tsx
// Any dashboard page
import DashboardLayout from "@/app/_components/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout showChat={true} chatMode="general_support">
      <div>Your dashboard content here</div>
    </DashboardLayout>
  );
}
```

### **Method 3: Conditional Access Based on Route**

```tsx
// app/layout.tsx - Global access
"use client";
import { usePathname } from "next/navigation";
import AIChatAssistant from "./_components/AIChatAssistant";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Show chat on specific pages
  const showChat = ["/", "/destinations", "/dashboard", "/create-new-trip"].includes(pathname);
  
  const getChatMode = () => {
    if (pathname.includes("/dashboard")) return "general_support";
    if (pathname.includes("/destinations")) return "travel_planning";
    if (pathname.includes("/create-new-trip")) return "travel_planning";
    return "general_support";
  };

  return (
    <html>
      <body>
        {children}
        {showChat && (
          <AIChatAssistant 
            mode={getChatMode()}
            onActionTrigger={(action, data) => {
              console.log("Global chat action:", action, data);
            }}
          />
        )}
      </body>
    </html>
  );
}
```

### **Method 4: Modal/Popup Access**

```tsx
// Create a chat modal component
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AIChatAssistant from "@/app/_components/AIChatAssistant";

export default function ChatModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        💬 Ask AI Assistant
      </Button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <AIChatAssistant 
              mode="travel_planning"
              className="relative"
            />
            <Button 
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
```

## 🎨 **Chat Modes Available**

### **1. Travel Planning Mode**
```tsx
<AIChatAssistant mode="travel_planning" />
```
- **Best for**: Homepage, destinations page, trip planning
- **Features**: Destination suggestions, itinerary creation, budget planning
- **Welcome Message**: "🌍 Hi! I'm your AI Travel Assistant..."

### **2. Price Inquiry Mode**
```tsx
<AIChatAssistant mode="price_inquiry" />
```
- **Best for**: Vendor pages, booking pages, deals sections
- **Features**: Price checking, deal alerts, cost comparisons
- **Welcome Message**: "💰 I'm here to help you find the best prices..."

### **3. Booking Help Mode**
```tsx
<AIChatAssistant mode="booking_help" />
```
- **Best for**: Dashboard, booking management, support pages
- **Features**: Booking modifications, cancellations, support
- **Welcome Message**: "📅 I can assist you with bookings..."

### **4. General Support Mode**
```tsx
<AIChatAssistant mode="general_support" />
```
- **Best for**: Any page, fallback mode
- **Features**: General assistance, navigation help, FAQs
- **Welcome Message**: "👋 Hello! I'm your AI assistant..."

## 🚀 **Quick Access Examples**

### **Add to Destinations Page**
```tsx
// app/destinations/page.tsx
import AIChatAssistant from "@/app/_components/AIChatAssistant";

// Add at the end of your component return
return (
  <div>
    {/* Existing destinations content */}
    
    <AIChatAssistant 
      mode="travel_planning"
      initialMessage="Help me find the perfect destination"
    />
  </div>
);
```

### **Add to Vendor Dashboard**
```tsx
// app/dashboard/vendor/page.tsx
import AIChatAssistant from "@/app/_components/AIChatAssistant";

// Add at the end of your component return
return (
  <div>
    {/* Existing vendor dashboard content */}
    
    <AIChatAssistant 
      mode="price_inquiry"
      onActionTrigger={(action) => {
        if (action === "optimize_pricing") {
          // Handle pricing optimization
        }
      }}
    />
  </div>
);
```

### **Add to Create Trip Page**
```tsx
// app/create-new-trip/page.tsx
import AIChatAssistant from "@/app/_components/AIChatAssistant";

// Add alongside existing ChatBox
return (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-5 p-4">
    <div className="col-span-2">
      <ChatBox /> {/* Existing chat */}
    </div>
    <div className="col-span-3">
      {/* Map/Itinerary content */}
    </div>
    
    {/* Additional AI Assistant for advanced help */}
    <AIChatAssistant 
      mode="travel_planning"
      className="fixed bottom-20 right-6" // Position above existing chat
    />
  </div>
);
```

## 🎛️ **Advanced Configuration**

### **Custom Actions Handler**
```tsx
const handleAdvancedActions = (action: string, data?: any) => {
  switch (action) {
    case "book_hotel":
      // Navigate to hotel booking
      router.push(`/book/hotel/${data.hotelId}`);
      break;
    case "set_price_alert":
      // Open price alert modal
      setPriceAlertModal(true);
      break;
    case "optimize_trip":
      // Open AI trip optimizer
      setTripOptimizerModal(true);
      break;
    case "contact_vendor":
      // Open vendor chat
      setVendorChatModal(true);
      break;
    default:
      console.log("Custom action:", action, data);
  }
};
```

### **Conditional Rendering**
```tsx
const { userDetail } = useUserDetail();
const userRole = userDetail?.role;

// Show different chat modes based on user role
const getChatMode = () => {
  if (userRole === "vendor") return "price_inquiry";
  if (userRole === "admin") return "general_support";
  return "travel_planning";
};

return (
  <AIChatAssistant 
    mode={getChatMode()}
    onActionTrigger={handleAdvancedActions}
  />
);
```

## 📱 **Current Access Points**

✅ **Homepage** (`/`) - Travel planning mode  
✅ **Dashboard Layout** - Role-based mode  
🔄 **Destinations** - Add travel planning mode  
🔄 **Vendor Dashboard** - Add price inquiry mode  
🔄 **Create Trip** - Add alongside existing chat  
🔄 **Admin Dashboard** - Add general support mode  

## 🎯 **Next Steps**

1. **Test the homepage** - The AI chat is now live on your main page
2. **Add to other pages** - Use the examples above
3. **Customize actions** - Implement specific business logic
4. **Monitor usage** - Track which features users engage with most

The AI Chat Assistant is now accessible on your homepage with travel planning mode. Click the chat bubble in the bottom right corner to start using it!