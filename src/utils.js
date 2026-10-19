export const rupee = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
export const fmtDate = (d) =>
  new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
export const fmtTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
export const startingPrice = (a) => Math.min(a.chatPrice10Min, a.callPrice10Min);

export function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error('Could not load the payment gateway. Check your connection.'));
    document.body.appendChild(s);
  });
}
