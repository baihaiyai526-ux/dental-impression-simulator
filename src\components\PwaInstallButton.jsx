import { useEffect, useState } from "react";
import { CheckCircle2, Download, X } from "lucide-react";

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function isIosDevice() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
    (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
}

export default function PwaInstallButton() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(() => typeof window !== "undefined" && isStandalone());
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const handlePrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      setNotice({ type: "success", message: "应用已安装，可从桌面直接打开。" });
    };

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setNotice({ type: "success", message: "安装请求已确认。" });
      }
      setInstallPrompt(null);
      return;
    }

    setNotice({
      type: "info",
      message: isIosDevice()
        ? "请点击 Safari 的分享按钮，再选择“添加到主屏幕”。"
        : "请打开浏览器菜单，选择“安装应用”或“添加到主屏幕”。"
    });
  };

  if (installed) return null;

  return (
    <>
      <button
        type="button"
        onClick={handleInstall}
        className="ml-auto flex shrink-0 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
        title="安装到设备"
        aria-label="安装口腔印模实训应用"
      >
        <Download className="h-4 w-4" />
        <span className="hidden lg:inline">安装应用</span>
      </button>
      {notice ? (
        <div
          className={`fixed right-4 top-20 z-50 flex max-w-sm items-start gap-3 rounded-lg border bg-white p-4 text-sm shadow-lg ${
            notice.type === "success" ? "border-emerald-200 text-emerald-800" : "border-blue-200 text-slate-700"
          }`}
          role="status"
        >
          {notice.type === "success" ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> : <Download className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />}
          <p>{notice.message}</p>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="ml-auto text-slate-400 hover:text-slate-700"
            title="关闭提示"
            aria-label="关闭安装提示"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </>
  );
}
