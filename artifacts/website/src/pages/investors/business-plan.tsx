import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useState, useRef } from "react";
import { Printer } from "lucide-react";

export default function BusinessPlan() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user && iframeRef.current) {
      // Fetch the HTML content and inject it into iframe
      fetch("/business-plan-content.html")
        .then((res) => res.text())
        .then((html) => {
          console.log("HTML loaded, length:", html.length);
          // Set the iframe's entire HTML content
          const iframe = iframeRef.current;
          if (iframe) {
            iframe.srcdoc = html;
            // After the iframe loads, adjust its height based on content
            iframe.onload = () => {
              try {
                const height = iframe.contentDocument?.documentElement.scrollHeight || 800;
                iframe.style.height = (height + 50) + "px";
              } catch (e) {
                console.warn("Could not adjust iframe height:", e);
                iframe.style.height = "1200px";
              }
            };
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load business plan:", err);
          if (iframeRef.current) {
            iframeRef.current.srcdoc = "<html><body style='padding: 20px; color: red; font-family: sans-serif;'><h2>Error loading business plan</h2><p>" + err.message + "</p></body></html>";
          }
          setLoading(false);
        });
    }
  }, [user]);

  if (isLoading || loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>Loading business plan...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handlePrint = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.print();
    }
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
      }}
    >
      {/* Print Button */}
      <div
        style={{
          position: "sticky",
          top: 0,
          right: 0,
          padding: "10px 20px",
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "flex-end",
          zIndex: 100,
        }}
      >
        <button
          onClick={handlePrint}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            fontSize: "14px",
            background: "#003d82",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          <Printer size={16} />
          Print / PDF
        </button>
      </div>

      {/* Embedded HTML Content via iframe */}
      <iframe
        ref={iframeRef}
        title="Business Plan"
        style={{
          width: "100%",
          border: "none",
          minHeight: "800px",
          display: "block",
        }}
        sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />

      {/* Print Styles */}
      <style>{`
        @media print {
          div[style*="position: sticky"] {
            display: none !important;
          }
          body {
            background: white;
          }
        }
      `}</style>
    </div>
  );
}
