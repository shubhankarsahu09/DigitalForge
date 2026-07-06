import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Placeholder details
  const UPI_ID = "your-upi-id@bank";
  const WHATSAPP_NUMBER = "918448130657";
  const productName = id === "1" ? "Frame To Video Converter" : "Premium Tool";
  
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`I want to buy ${productName} from your website.`)}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center pt-32 px-6 pb-20">
      <div className="w-full max-w-2xl">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-3xl p-8 md:p-12 text-center"
        >
          <h1 className="text-3xl font-medium tracking-tight mb-2">Checkout</h1>
          <p className="text-muted-foreground mb-8">You are purchasing: <strong className="text-foreground">{productName}</strong></p>

          <div className="flex flex-col md:flex-row gap-8 items-center justify-center border-t border-border pt-8 mb-8">
            <div className="flex-1 space-y-4 text-left">
              <h3 className="text-xl font-medium">Payment Details</h3>
              <p className="text-sm text-muted-foreground">Scan the QR code or use the UPI ID below to make the payment.</p>
              
              <div className="bg-secondary p-4 rounded-xl flex items-center justify-between border border-border mt-4">
                <span className="font-mono text-sm tracking-wide">{UPI_ID}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(UPI_ID)}
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div className="w-48 h-48 bg-secondary rounded-2xl flex items-center justify-center border border-border relative overflow-hidden shrink-0 p-2">
               <img src="/payment-qr.png" alt="Payment QR Code" className="w-full h-full object-contain rounded-xl" />
            </div>
          </div>

          <div className="bg-foreground/[0.02] border border-border rounded-2xl p-6 text-left">
            <h4 className="font-medium flex items-center gap-2 mb-2"><CheckCircle size={16} className="text-[#32d74b]" /> Next Steps</h4>
            <p className="text-sm text-muted-foreground mb-6">After completing the payment, click the button below to send your payment screenshot via WhatsApp. We will verify and send you the tool's access file (.json) immediately.</p>
            
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-full py-4 text-sm font-bold tracking-wide uppercase hover:bg-[#22bf5b] transition-colors"
            >
              Confirm on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
