// Simple toast utility
export const toast = {
  success: (message: string) => {
    console.log('✅ Success:', message);
    // You can implement a custom toast notification here
    alert(`Success: ${message}`);
  },
  error: (message: string) => {
    console.log('❌ Error:', message);
    alert(`Error: ${message}`);
  },
  info: (message: string) => {
    console.log('ℹ️ Info:', message);
    alert(`Info: ${message}`);
  }
};